/**
 * ISO 表單紀錄儲存後端（Google Apps Script + Google Sheets）v1.1
 *
 * 部署步驟（詳細圖文見 docs/部署_Google試算表後端.md）
 * 1. 建立 Google 試算表，命名「ISO 表單紀錄」。
 * 2. 擴充功能 → Apps Script，刪除預設內容，貼上本檔全文，存檔。
 * 3. 部署 → 新增部署作業 → 網頁應用程式；執行身分「我」、存取權「知道連結的任何人」。
 * 4. 複製 /exec 網址，貼進 site/assets/config.js 的 remoteUrl。
 *
 * 每張表單自動寫入獨立工作表（FRM-QA-001、FRM-QA-002…）。
 * 照片以 dataURL 收到後存進 Drive，儲存格只放連結（單格上限 5 萬字元）。
 */

var HEADERS = ['rid', '單號', '申請日期', '申請人', '申請部門', '產品名稱', '版次', '建立時間', '更新時間', '欄位內容', '照片'];
var PHOTO_FOLDER = 'ISO表單照片';

// 獨立（非容器綁定）專案請填入試算表 ID；留空＝使用綁定的試算表
var SPREADSHEET_ID = '';

function ss_() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}
var VERSION = '1.3';

function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = p.action || '';
  if (action === 'ping') return json(pingPayload());
  if (action === 'list') return json({ ok: true, records: listRecords(p.form || '') });
  if (action === 'get') return json({ ok: true, record: findRecord(p.rid || '') });
  return json({ ok: true, service: 'iso-form-store', version: VERSION, time: nowIso(),
                actions: ['ping', 'list?form=FRM-QA-001', 'get?rid=…'] });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'invalid json' });
  }
  try {
    switch (body.action) {
      case 'ping':   return json(pingPayload());
      case 'save':   return json({ ok: true, record: withLock(function () { return saveRecord(body.record); }) });
      case 'list':   return json({ ok: true, records: listRecords(body.form) });
      case 'get':    return json({ ok: true, record: findRecord(body.rid) });
      case 'delete': return json({ ok: true, deleted: withLock(function () { return deleteRecord(body.rid, body.form); }) });
      default:       return json({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function nowIso() { return new Date().toISOString(); }

/** 並發寫入時排隊，避免同時 appendRow 產生重複列 */
function withLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function pingPayload() {
  return {
    ok: true,
    service: 'iso-form-store',
    version: VERSION,
    time: nowIso(),
    forms: allSheets().map(function (sh) {
      return { name: sh.getName(), records: Math.max(sh.getLastRow() - 1, 0) };
    })
  };
}

function sheetFor(form) {
  var ss = ss_();
  var sh = ss.getSheetByName(form);
  if (!sh) {
    sh = ss.insertSheet(form);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function findSheet(form) {
  return ss_().getSheetByName(form);
}

function allSheets() {
  return ss_().getSheets().filter(function (sh) {
    return sh.getName().indexOf('FRM-') === 0;
  });
}

function saveRecord(rec) {
  if (!rec || !rec.form || !rec.rid) throw new Error('missing form/rid');
  var sh = sheetFor(rec.form);
  var urls = archivePhotos(rec);
  var row = [
    rec.rid, rec.no || '', rec.applyDate || '', rec.applicant || '', rec.dept || '',
    rec.product || '', rec.version || '', rec.createdAt || nowIso(),
    nowIso(), JSON.stringify(rec.values || {}), JSON.stringify(urls || {})
  ];
  var hit = rowOf(sh, rec.rid);
  if (hit > 0) sh.getRange(hit, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);

  // 版次必須存成文字，否則 2.0 會被 Sheets 轉成數字 2，前端會誤判為舊版次
  var rowIdx = hit > 0 ? hit : sh.getLastRow();
  sh.getRange(rowIdx, 7).setNumberFormat('@').setValue(String(rec.version || ''));

  rec.files = urls;
  rec.updatedAt = row[8];
  return rec;
}

/** 回傳 rid 所在的列號，找不到回 -1 */
function rowOf(sh, rid) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === rid) return i + 2;
  }
  return -1;
}

/** 把 dataURL 照片存進 Drive，回傳 key -> 連結 */
function archivePhotos(rec) {
  var files = rec.files || {};
  var out = {};
  var folder = null;
  for (var key in files) {
    var val = files[key];
    if (!val) continue;
    if (val.indexOf('data:') !== 0) { out[key] = val; continue; }
    var m = val.match(/^data:(image\/[a-z0-9.+-]+);base64,(.*)$/);
    if (!m) continue;
    if (!folder) folder = folderFor(rec.form);
    var ext = m[1].split('/')[1].replace('jpeg', 'jpg');
    var name = rec.rid + '_' + key.replace(/[^a-z0-9]/gi, '-') + '.' + ext;
    var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], name);
    var file = folder.createFile(blob);
    // 用 thumbnail 端點才能在 <img> 直接顯示；Drive 的 /file/d/ 連結不行
    out[key] = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1200';
    out[key + '__open'] = file.getUrl();
  }
  return out;
}

function folderFor(form) {
  var it = DriveApp.getFoldersByName(PHOTO_FOLDER);
  var root = it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER);
  it = root.getFoldersByName(form);
  var folder = it.hasNext() ? it.next() : root.createFolder(form);
  // 縮圖要能被其他同事的瀏覽器載入，資料夾需「知道連結者可檢視」
  try { folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  return folder;
}

function rowsToRecords(sh) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return values.filter(function (r) { return r[0]; }).map(function (r) {
    return {
      rid: r[0], no: r[1], applyDate: fmtDate(r[2]), applicant: r[3], dept: r[4],
      product: r[5], version: normVersion(r[6]), createdAt: iso(r[7]), updatedAt: iso(r[8]),
      values: safeParse(r[9]), files: safeParse(r[10]),
      form: sh.getName()
    };
  });
}

/** 舊資料若被存成數字（2），補回 2.0 的字串形式 */
function normVersion(v) {
  if (v === '' || v === null || typeof v === 'undefined') return '';
  var s = String(v).trim();
  return /^\d+$/.test(s) ? s + '.0' : s;
}

function listRecords(form) {
  if (form) {
    var sh = findSheet(form);   // 查詢不建立工作表
    return sh ? rowsToRecords(sh) : [];
  }
  var out = [];
  allSheets().forEach(function (s) { out = out.concat(rowsToRecords(s)); });
  return out;
}

function findRecord(rid) {
  var shs = allSheets();
  for (var i = 0; i < shs.length; i++) {
    var row = rowOf(shs[i], rid);
    if (row > 0) return rowsToRecords(shs[i]).filter(function (r) { return r.rid === rid; })[0] || null;
  }
  return null;
}

function deleteRecord(rid, form) {
  var sheets = form ? [findSheet(form)].filter(Boolean) : allSheets();
  var removed = 0;
  sheets.forEach(function (sh) {
    var row = rowOf(sh, rid);
    if (row > 0) { sh.deleteRow(row); removed++; }
  });
  return removed > 0;
}

function safeParse(v) {
  if (!v) return {};
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch (e) { return {}; }
}

function iso(v) {
  if (!v) return '';
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function fmtDate(v) {
  if (!v) return '';
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v);
}
