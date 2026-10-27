/**
 * ISO 表單紀錄儲存後端（Google Apps Script + Google Sheets）
 *
 * 部署步驟
 * 1. 建立一份 Google 試算表，命名為「ISO 表單紀錄」。
 * 2. 試算表 → 擴充功能 → Apps Script，刪除預設內容，貼上本檔全部程式碼。
 * 3. 部署 → 新增部署作業 → 類型「網頁應用程式」
 *    執行身分：我　｜　存取權：知道連結的任何人
 * 4. 複製 /exec 網址，貼到 site/assets/config.js 的 remoteUrl。
 *
 * 每張表單自動寫入獨立工作表（FRM-QA-001、FRM-QA-002 …），
 * 照片以 dataURL 收到後存進 Drive 資料夾，儲存格只放連結（試算表單格上限 5 萬字元）。
 */

var HEADERS = ['rid', '單號', '申請日期', '申請人', '申請部門', '產品名稱', '版次', '建立時間', '更新時間', '欄位內容', '照片'];
var PHOTO_FOLDER = 'ISO表單照片';

function doGet(e) {
  return json({ ok: true, service: 'iso-form-store', time: new Date().toISOString() });
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
      case 'save':   return json({ ok: true, record: saveRecord(body.record) });
      case 'list':   return json({ ok: true, records: listRecords(body.form) });
      case 'get':    return json({ ok: true, record: getRecord(body.rid) });
      case 'delete': return json({ ok: true, deleted: deleteRecord(body.rid, body.form) });
      default:       return json({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetFor(form) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(form);
  if (!sh) {
    sh = ss.insertSheet(form);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function allSheets() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().filter(function (sh) {
    return sh.getName().indexOf('FRM-') === 0;
  });
}

function saveRecord(rec) {
  if (!rec || !rec.form || !rec.rid) throw new Error('missing form/rid');
  var sh = sheetFor(rec.form);
  var urls = archivePhotos(rec);
  var row = [
    rec.rid, rec.no || '', rec.applyDate || '', rec.applicant || '', rec.dept || '',
    rec.product || '', rec.version || '', rec.createdAt || new Date().toISOString(),
    new Date().toISOString(), JSON.stringify(rec.values || {}), JSON.stringify(urls)
  ];
  var ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  var hit = -1;
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === rec.rid) { hit = i + 2; break; }
  }
  if (hit > 0) sh.getRange(hit, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);

  rec.files = urls;
  rec.updatedAt = row[8];
  return rec;
}

/** 把 dataURL 照片存進 Drive，回傳 key -> 連結 */
function archivePhotos(rec) {
  var files = rec.files || {};
  var out = {};
  var folder = null;
  for (var key in files) {
    var val = files[key];
    if (!val) continue;
    if (val.indexOf('data:') !== 0) { out[key] = val; continue; }  // 已是連結
    var m = val.match(/^data:(image\/[a-z+]+);base64,(.*)$/);
    if (!m) continue;
    if (!folder) folder = folderFor(rec.form);
    var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], rec.rid + '_' + key.replace(/\./g, '-') + '.' + m[1].split('/')[1]);
    var f = folder.createFile(blob);
    out[key] = f.getUrl();
  }
  return out;
}

function folderFor(form) {
  var it = DriveApp.getFoldersByName(PHOTO_FOLDER);
  var root = it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER);
  it = root.getFoldersByName(form);
  return it.hasNext() ? it.next() : root.createFolder(form);
}

function rowsToRecords(sh) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return values.filter(function (r) { return r[0]; }).map(function (r) {
    return {
      rid: r[0], no: r[1], applyDate: fmtDate(r[2]), applicant: r[3], dept: r[4],
      product: r[5], version: r[6], createdAt: iso(r[7]), updatedAt: iso(r[8]),
      values: safeParse(r[9]), files: safeParse(r[10]),
      form: sh.getName(), title: '', effective: ''
    };
  });
}

function listRecords(form) {
  if (form) return rowsToRecords(sheetFor(form));
  var out = [];
  allSheets().forEach(function (sh) { out = out.concat(rowsToRecords(sh)); });
  return out;
}

function getRecord(rid) {
  var all = listRecords();
  for (var i = 0; i < all.length; i++) if (all[i].rid === rid) return all[i];
  return null;
}

function deleteRecord(rid, form) {
  var sheets = form ? [sheetFor(form)] : allSheets();
  var removed = 0;
  sheets.forEach(function (sh) {
    var last = sh.getLastRow();
    if (last < 2) return;
    var ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = ids.length - 1; i >= 0; i--) {
      if (ids[i][0] === rid) { sh.deleteRow(i + 2); removed++; }
    }
  });
  return removed > 0;
}

function safeParse(v) {
  if (!v) return {};
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
