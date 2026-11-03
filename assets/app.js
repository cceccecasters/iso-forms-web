/* ISO 紀錄表單 — 介面邏輯
 * 表單結構全部來自 forms.js；本檔只負責渲染、草稿、匯出與列印。
 */
(function () {
  "use strict";

  var META = window.ISO_META;
  var FORMS = window.ISO_FORMS;
  var HISTORY = window.ISO_HISTORY;
  var FILE_LIMIT = 1024 * 1024;

  var state = { current: FORMS[0].id, files: {}, savedAt: null, editingRid: null,
    viewRid: null, recLocked: false };

  /* ---------- utils ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function key(formId, path) { return formId + "::" + path; }
  function draftKey(formId) { return "iso:draft:" + formId; }
  function formById(id) {
    return FORMS.filter(function (f) { return f.id === id; })[0] || FORMS[0];
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function nowLabel() {
    var d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  /* ---------- serial ---------- */
  // IndexedDB 被其他分頁佔用時 open/讀取可能永不回應，一律加逾時避免整站卡住
  function withTimeout(p, ms, tag) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error(tag || "timeout"));
      }, ms);
      p.then(function (v) {
        if (done) return;
        done = true; clearTimeout(t); resolve(v);
      }, function (e) {
        if (done) return;
        done = true; clearTimeout(t); reject(e);
      });
    });
  }

  // 取號 = 歷史紀錄現有最大號 + 1。純計算、不自增計數器，
  // 所以連續點「取號」會停在同一號，存檔後才會推進。
  // fmt "year"：PREFIX-YYYY-NNN（預設）；fmt "seq"：PREFIX-NNN（文件類，跨年度連續）
  function serialOf(no, prefix, year, fmt) {
    var re = fmt === "seq"
      ? new RegExp("^" + prefix + "-(\\d+)$")
      : new RegExp("^" + prefix + "-" + year + "-(\\d+)$");
    var m = String(no || "").match(re);
    return m ? parseInt(m[1], 10) : 0;
  }

  function serialText(prefix, year, n, fmt) {
    return fmt === "seq"
      ? prefix + "-" + String(n).padStart(3, "0")
      : prefix + "-" + year + "-" + String(n).padStart(3, "0");
  }

  // 同一前綴可能由多張表單共用（例如 DOC-QA 的 SIP 與控制計畫），取號要跨表單合併計算
  function formsWithPrefix(prefix) {
    // 只有 pairs 的 rows 是二維陣列；table 的 rows 是列數，需先判斷型別
    return FORMS.filter(function (x) {
      if (x.prefix === prefix) return true;
      return (x.sections || []).some(function (s) {
        if (!Array.isArray(s.rows)) return false;
        return s.rows.some(function (row) {
          return Array.isArray(row) && row.some(function (c) { return c && c.serial === prefix; });
        });
      });
    });
  }

  function nextSerial(prefix, fmt, formId) {
    try {
      return nextSerialInner(prefix, fmt, formId);
    } catch (e) {
      return Promise.resolve("");
    }
  }

  function nextSerialInner(prefix, fmt, formId) {
    var year = new Date().getFullYear();
    var fs = formsWithPrefix(prefix);
    if (!fs.length && formId) fs = FORMS.filter(function (x) { return x.id === formId; });
    var start = 1;
    fs.forEach(function (x) { if ((x.serialStart || 1) > start) start = x.serialStart || 1; });
    var rowsP = window.ISOStore
      ? Promise.all(fs.map(function (x) {
          return withTimeout(window.ISOStore.list(x.id), 8000, "serial timeout")
            .catch(function () { return []; });
        }))
      : Promise.resolve([]);
    return rowsP.then(function (groups) {
      var max = start - 1;
      (groups || []).forEach(function (rows) {
        (rows || []).forEach(function (r) {
          var n = serialOf(r.no, prefix, year, fmt);
          if (n > max) max = n;
        });
      });
      return serialText(prefix, year, max + 1, fmt);
    }).catch(function () {
      return "";
    });
  }

  /* ---------- render helpers ---------- */
  function input(f, path, opts) {
    opts = opts || {};
    var id = key(f.id, path);
    var common = ' data-k="' + esc(path) + '" id="' + esc(id) + '"';
    var reqAttr = opts.req ? ' data-req="1" data-req-label="' + esc(opts.label || "必填欄位") + '"' : "";
    if (opts.type === "date") return '<input type="date"' + common + ' value="' + esc(opts.value || "") + '"' + reqAttr + ">";
    if (opts.type === "number") return '<input type="number" inputmode="decimal"' + common + ' placeholder="' + esc(opts.ph || "") + '">';
    return '<input type="text"' + common + ' placeholder="' + esc(opts.ph || "") + '"' + reqAttr + ">";
  }

  // 照片欄：每列獨立上傳，dataURL 存在 state.files，列印與匯出時一併帶出
  function photoCell(path) {
    return '<div class="photo-cell">' +
      '<label class="img-drop img-drop-sm">' +
      '<input type="file" accept="image/*" data-img="' + esc(path) + '">' +
      '<span class="img-hint">＋ 照片</span>' +
      '<img alt="照片預覽" hidden data-preview="' + esc(path) + '">' +
      "</label>" +
      '<button type="button" class="img-clear" data-clear-img="' + esc(path) + '" hidden>移除</button>' +
      "</div>";
  }

  function radioGroup(f, path, options, cls) {
    // 同一題的選項共用一個 name 才會互斥；id 仍逐選項唯一
    var gname = key(f.id, path);
    return '<div class="opt-row ' + (cls || "") + '">' + (options || []).map(function (o) {
      var id = key(f.id, path + "|" + o);
      return '<label class="opt"><input type="radio" id="' + esc(id) + '" name="' + esc(gname) + '" data-k="' + esc(path) + '" value="' + esc(o) + '"><span>' + esc(o) + "</span></label>";
    }).join("") + "</div>";
  }

  function historyTable(f) {
    var rows = HISTORY[f.id] || [];
    return '<table class="tbl tbl-history"><thead><tr><th style="width:14%">版次</th><th style="width:18%">日期</th><th>修訂內容</th><th style="width:16%">修訂人</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + esc(c || "—") + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table>";
  }

  /* ---------- section renderers ---------- */
  var R = {
    pairs: function (f, s, si) {
      var body = s.rows.map(function (row) {
        return "<tr>" + row.map(function (c) {
          var path = "s" + si + "." + c.k;
          var cell;
          if (c.serial) {
            var sp = typeof c.serial === "string" ? c.serial : f.prefix;
            var sfmt = f.serialFmt || "year";
            cell = '<div class="serial"><input type="text" data-k="' + esc(path) + '" id="' + esc(key(f.id, path)) +
              '" placeholder="' + esc(serialText(sp, new Date().getFullYear(), f.serialStart || 1, sfmt)) +
              '"><button type="button" class="btn-mini" data-serial="' + esc(sp) +
              '" data-fmt="' + esc(sfmt) + '" data-form="' + esc(f.id) +
              '" data-target="' + esc(path) + '">取號</button></div>';
          } else if (c.ver) {
            cell = '<div class="serial"><input type="text" data-k="' + esc(path) + '" id="' + esc(key(f.id, path)) +
              '" placeholder="1.0" data-req="1" data-req-label="版次"><button type="button" class="btn-mini" data-version="' + esc(f.id) +
              '" data-src="' + esc("s" + si + "." + (c.verSrc || "no")) +
              '" data-target="' + esc(path) + '">領版</button></div>';
          } else {
            cell = input(f, path, { type: c.t, req: c.req, label: c.l });
          }
          return '<th class="row-h">' + esc(c.l) + (c.req ? ' <span class="req">*</span>' : "") + "</th><td>" + cell + "</td>";
        }).join("") + "</tr>";
      }).join("");
      return '<table class="tbl tbl-pairs"><tbody>' + body + "</tbody></table>";
    },

    checks: function (f, s, si) {
      var base = "s" + si + "." + s.k;
      var html = '<div class="opt-wrap">' + s.items.map(function (it) {
        var path = base + "|" + it;
        return '<label class="chip"><input type="checkbox" data-k="' + esc(path) + '" id="' + esc(key(f.id, path)) + '"><span>' + esc(it) + "</span></label>";
      }).join("");
      if (s.other) {
        var p = base + "|其他";
        html += '<label class="chip"><input type="checkbox" data-k="' + esc(p) + '" data-other="1"><span>其他</span></label>' +
          '<input class="inline-text" type="text" data-k="' + esc(base + ".其他說明") + '" data-other-for="1" placeholder="請說明" hidden>';
      }
      return html + "</div>";
    },

    textarea: function (f, s, si) {
      var path = "s" + si + "." + s.k;
      var secLabel = s.h.replace(/^[一二三四五六七八九十]+、/, "");
      var html = '<textarea data-k="' + esc(path) + '" id="' + esc(key(f.id, path)) + '" rows="' + (s.rows || 4) + '"' +
        (s.req ? ' data-req="1" data-req-label="' + esc(secLabel) + '"' : "") +
        ' placeholder="' + esc(s.hint || "") + '"></textarea>';
      if (s.extras) {
        html += '<div class="extra-row">' + s.extras.map(function (e) {
          var ep = "s" + si + "." + e.k;
          if (e.opts) {
            return '<div class="extra"><span class="extra-l">' + esc(e.l) + "</span>" + radioGroup(f, ep, e.opts) + "</div>";
          }
          return '<div class="extra"><span class="extra-l">' + esc(e.l) + '</span><input type="text" data-k="' + esc(ep) + '"></div>';
        }).join("") + "</div>";
      }
      return html;
    },

    grid: function (f, s, si) {
      var head = "<tr>" + s.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr>";
      var textCols = s.photo ? s.cols.length - 1 : s.cols.length;
      var body = "";
      for (var i = 0; i < s.rows; i++) {
        body += "<tr>";
        body += '<td class="num">' + (i + 1) + "</td>";
        for (var j = 1; j < textCols; j++) {
          var p = "s" + si + "." + s.k + "." + (i + 1) + "." + j;
          body += "<td>" + input(f, p, {}) + "</td>";
        }
        if (s.photo) body += '<td class="cell-photo">' + photoCell("s" + si + "." + s.k + "." + (i + 1) + ".img") + "</td>";
        body += "</tr>";
      }
      return '<table class="tbl tbl-grid' + (s.photo ? " has-photo" : "") + '"><thead>' + head + "</thead><tbody>" + body + "</tbody></table>";
    },

    // 通用表格：欄位可為固定列名(static)、流水號(num)、單選(opts) 或文字輸入
    table: function (f, s, si) {
      var hasPhoto = (s.cols || []).some(function (c) { return c.photo; });
      var head = "<tr>" + s.cols.map(function (c) {
        return "<th" + (c.w ? ' style="width:' + c.w + '"' : "") + ">" + esc(c.l) + "</th>";
      }).join("") + "</tr>";
      var body = "";
      for (var i = 0; i < s.rows; i++) {
        body += "<tr>";
        for (var j = 0; j < s.cols.length; j++) {
          var c = s.cols[j];
          var p = "s" + si + "." + s.k + "." + i + "." + j;
          if (c.num) body += '<td class="num">' + (i + 1) + "</td>";
          else if (c.static) body += "<td>" + esc((s.rowLabels && s.rowLabels[i]) || c.l) + "</td>";
          else if (c.opts) body += "<td>" + radioGroup(f, p, c.opts) + "</td>";
          else if (c.photo) body += '<td class="cell-photo">' + photoCell(p + ".img") + "</td>";
          else body += "<td>" + input(f, p, { type: c.t, ph: c.ph }) + "</td>";
        }
        body += "</tr>";
      }
      return '<table class="tbl tbl-grid' + (hasPhoto ? " has-photo" : "") + '"><thead>' + head +
        "</thead><tbody>" + body + "</tbody></table>";
    },

    assess: function (f, s, si) {
      var body = s.items.map(function (it, i) {
        var p = "s" + si + "." + s.k + "." + i;
        var opts = it.opts || ["無", "有"];
        return "<tr><th class=\"row-h\">" + esc(it.l) + "</th><td>" + radioGroup(f, p + ".flag", opts) + "</td><td>" +
          '<input type="text" data-k="' + esc(p + ".note") + '" placeholder="' + esc(it.note || "") + '">' + "</td></tr>";
      }).join("");
      var html = '<table class="tbl tbl-assess"><thead><tr><th style="width:32%">評估項目</th><th style="width:22%">影響</th><th>說明</th></tr></thead><tbody>' + body + "</tbody></table>";
      if (s.footer) {
        html += '<div class="extra-row">' + s.footer.map(function (e) {
          var p = "s" + si + "." + s.k + "." + e.k;
          var control = e.opts ? radioGroup(f, p, e.opts) : input(f, p, {});
          return '<div class="extra"><span class="extra-l">' + esc(e.l) + "</span>" + control + "</div>";
        }).join("") + "</div>";
      }
      return html;
    },

    verify: function (f, s, si) {
      var cols = s.cols || ["驗證項目", "要求", "結果", "判定"];
      var body = s.rows.map(function (r, i) {
        var p = "s" + si + "." + s.k + "." + i;
        var pre = (s.presets && s.presets[r]) || "";
        return "<tr><th class=\"row-h\">" + esc(r) + "</th><td>" + input(f, p + ".req", { ph: pre }) + "</td><td>" + input(f, p + ".res", {}) + "</td><td>" +
          radioGroup(f, p + ".judge", ["OK", "NG"]) + "</td></tr>";
      }).join("");
      var html = '<table class="tbl tbl-verify"><thead><tr>' + cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" + body + "</tbody></table>";
      var cp = "s" + si + "." + s.k + ".conclusion";
      html += '<div class="conclusion"><span class="extra-l">驗證結論</span>' + radioGroup(f, cp, s.conclusion) +
        '<input class="cond" type="text" data-k="' + esc(cp + ".cond") + '" placeholder="條件說明（選填）"></div>';
      return html;
    },

    m1e: function (f, s, si) {
      var body = s.rows.map(function (r, i) {
        var p = "s" + si + "." + s.k + "." + i;
        return "<tr><th class=\"row-h\">" + esc(r[0]) + "</th><td class=\"muted\">" + esc(r[1]) + "</td><td>" +
          '<select data-k="' + esc(p + ".level") + '"><option value="">—</option><option>低</option><option>中</option><option>高</option></select>' +
          "</td><td>" + input(f, p + ".action", {}) + "</td></tr>";
      }).join("");
      var html = '<table class="tbl tbl-m1e"><thead><tr><th style="width:20%">構面</th><th style="width:22%">風險項目</th><th style="width:14%">等級</th><th>因應措施</th></tr></thead><tbody>' + body + "</tbody></table>";
      html += '<div class="other-impact"><span class="extra-l">其他影響</span>' +
        ["品質", "產能", "安全", "成本", "交期", "不良率"].map(function (n, i) {
          var p = "s" + si + "." + s.k + ".other." + i;
          return '<span class="oi"><em>' + esc(n) + "</em>" + radioGroup(f, p, ["無", "有"]) +
            (n === "成本" ? '<input class="inline-text" type="text" data-k="' + esc(p + ".amount") + '" placeholder="金額">' : "") + "</span>";
        }).join("") + "</div>";
      return html;
    },

    docs: function (f, s, si) {
      var body = s.rows.map(function (r, i) {
        var p = "s" + si + "." + s.k + "." + i;
        return "<tr><th class=\"row-h\">" + esc(r) + "</th><td>" + input(f, p + ".no", {}) + "</td><td>" + input(f, p + ".ver", {}) + "</td><td>" + input(f, p + ".done", { type: "date" }) + "</td></tr>";
      }).join("");
      return '<table class="tbl tbl-docs"><thead><tr><th style="width:34%">需更新文件</th><th>文件編號</th><th style="width:14%">版次</th><th style="width:20%">完成日</th></tr></thead><tbody>' + body + "</tbody></table>" +
        '<div class="extra-row"><div class="extra"><span class="extra-l">教育訓練</span>' +
        ['對象', '時數', '講師', '完成日'].map(function (l, i) {
          return '<label class="inline-field"><em>' + l + '</em><input type="text" data-k="' + esc("s" + si + "." + s.k + ".train." + i) + '"></label>';
        }).join("") + "</div></div>";
    },

    sig: function (f, s, si) {
      var head = "<tr><th style=\"width:26%\">" + (s.opinion ? "單位" : "角色") + "</th><th>姓名</th>" +
        (s.opinion ? "<th>意見</th>" : "") + "<th style=\"width:18%\">簽核</th><th style=\"width:18%\">日期</th></tr>";
      var body = s.rows.map(function (r, i) {
        var p = "s" + si + "." + s.k + "." + i;
        return "<tr><th class=\"row-h\">" + esc(r) + "</th><td>" + input(f, p + ".name", {}) + "</td>" +
          (s.opinion ? "<td>" + input(f, p + ".opinion", {}) + "</td>" : "") +
          "<td>" + input(f, p + ".sign", {}) + "</td><td>" + input(f, p + ".date", { type: "date" }) + "</td></tr>";
      }).join("");
      return '<table class="tbl tbl-sig"><thead>' + head + "</thead><tbody>" + body + "</tbody></table>";
    },

    defect: function (f, s, si) {
      var p = "s" + si + "." + s.k;
      return '<div class="defect">' +
        '<div class="defect-main"><textarea data-k="' + esc(p + ".desc") + '" rows="3" placeholder="產品不良描述（尺寸、外觀、功能等具體現象）"></textarea>' +
        '<div class="extra-row">' +
        '<label class="inline-field"><em>不良數量 (pcs)</em><input type="number" inputmode="decimal" data-k="' + esc(p + ".qty") + '"></label>' +
        '<label class="inline-field"><em>不良率 (%)</em><input type="number" inputmode="decimal" data-k="' + esc(p + ".rate") + '"></label>' +
        '<span class="extra"><span class="extra-l">發現階段</span>' + radioGroup(f, p + ".stage", s.stages) + "</span>" +
        "</div></div>" +
        '<div class="defect-img"><label class="img-drop"><input type="file" accept="image/*" data-img="' + esc(p + ".img") + '"><span>附圖（點選或拖放）</span><img alt="預覽" hidden data-preview="' + esc(p + ".img") + '"></label></div>' +
        "</div>";
    },

    customer: function (f, s, si) {
      var p = "s" + si + "." + s.k;
      return '<table class="tbl tbl-pairs"><tbody>' +
        '<tr><th class="row-h">是否需告知客戶</th><td>' + radioGroup(f, p + ".notify", s.notify) + "</td></tr>" +
        '<tr><th class="row-h">同意方式</th><td><div class="opt-wrap">' + s.methods.map(function (m) {
          return '<label class="chip"><input type="checkbox" data-k="' + esc(p + ".method|" + m) + '"><span>' + esc(m) + "</span></label>";
        }).join("") + "</div></td></tr>" +
        '<tr><th class="row-h">客戶代表</th><td>' + input(f, p + ".rep", {}) + "</td></tr>" +
        '<tr><th class="row-h">同意日期</th><td>' + input(f, p + ".date", { type: "date" }) + "</td></tr>" +
        '<tr><th class="row-h">附件／郵件編號</th><td>' + input(f, p + ".ref", {}) + "</td></tr>" +
        '<tr><th class="row-h">客戶附帶條件</th><td>' + input(f, p + ".terms", {}) + "</td></tr>" +
        "</tbody></table>";
    },

    ship: function (f, s, si) {
      var p = "s" + si + "." + s.k;
      return '<div class="ship">' + s.items.map(function (it, i) {
        return '<label class="ship-row"><input type="checkbox" data-k="' + esc(p + "." + i + ".on") + '"><span class="ship-l">' + esc(it.v) + '</span>' +
          '<input type="text" class="ship-note" data-k="' + esc(p + "." + i + ".note") + '" placeholder="' + esc(it.note) + '"></label>';
      }).join("") + "</div>";
    },

    history: function (f) { return historyTable(f); }
  };

  /* ---------- form shell ---------- */
  function renderForm(f) {
    var head = '<header class="doc-head">' +
      '<div class="doc-title"><h2>' + esc(f.title) + "</h2>" +
      '<p class="doc-clause">對應條文：' + esc(f.clause) + "</p>" +
      (f.usage ? '<p class="doc-usage">使用時機：' + esc(f.usage) + "</p>" : "") + "</div>" +
      '<table class="tbl tbl-meta"><tbody><tr>' +
      "<th>文件編號</th><th>版次</th><th>頁次</th><th>生效日期</th></tr><tr>" +
      "<td>" + esc(f.id) + "</td><td class=\"ver\">" + esc(f.version) + "</td><td>1 / 1</td><td>" + esc(f.effective) + "</td></tr></tbody></table>" +
      "</header>";

    var body = f.sections.map(function (s, si) {
      var fn = R[s.type];
      if (!fn) return "";
      return '<section class="sec" data-sec="' + si + '"><h3>' + esc(s.h) + "</h3>" + fn(f, s, si) + "</section>";
    }).join("");

    return '<article class="doc" id="doc-' + esc(f.id) + '" data-form="' + esc(f.id) + '" hidden>' + head + body + "</article>";
  }

  /* ---------- collect / restore ---------- */
  function collect(formId) {
    var card = document.querySelector('[data-form="' + formId + '"]');
    var out = {};
    if (!card) return out;
    card.querySelectorAll("[data-k]").forEach(function (el) {
      var k = el.getAttribute("data-k");
      if (el.type === "radio") { if (el.checked) out[k] = el.value; }
      else if (el.type === "checkbox") out[k] = el.checked;
      else out[k] = el.value;
    });
    return out;
  }

  function restore(formId, values) {
    var card = document.querySelector('[data-form="' + formId + '"]');
    if (!card) return;
    card.querySelectorAll("[data-k]").forEach(function (el) {
      var k = el.getAttribute("data-k");
      var v = values[k];
      if (el.type === "radio") el.checked = v !== undefined && String(v) === el.value;
      else if (el.type === "checkbox") el.checked = !!v;
      else el.value = v === undefined ? "" : v;
    });
    // 其他勾選回填時同步顯示說明欄
    card.querySelectorAll("[data-other]").forEach(function (el) {
      var wrap = el.closest(".opt-wrap");
      var inp = wrap && wrap.querySelector("[data-other-for]");
      if (inp) inp.hidden = !el.checked;
    });
    card.querySelectorAll("[data-preview]").forEach(function (img) {
      var kk = img.getAttribute("data-preview");
      if (state.files[kk]) {
        img.src = state.files[kk];
        img.hidden = false;
        var clr = card.querySelector('[data-clear-img="' + kk + '"]');
        if (clr) clr.hidden = false;
      }
    });
  }

  /* ---------- persistence ---------- */
  var saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    setStatus("編輯中…", "");
    saveTimer = setTimeout(saveNow, 500);
  }
  function saveNow() {
    var f = formById(state.current);
    var payload = { id: f.id, version: f.version, at: new Date().toISOString(), values: collect(f.id), files: state.files };
    try {
      localStorage.setItem(draftKey(f.id), JSON.stringify(payload));
      state.savedAt = new Date();
      var el = document.querySelector("[data-status]");
      // 必填警告與「紀錄已儲存」優先，避免自動存檔把提示蓋掉
      if (!(el && el.classList.contains("warn")) && Date.now() > (state.stickyUntil || 0)) {
        setStatus("草稿已儲存 " + nowLabel(), "ok");
      }
    } catch (e) {
      setStatus("草稿儲存失敗（可能超過瀏覽器容量）", "warn");
    }
  }
  function loadDraft(formId) {
    state.files = {};
    try {
      var raw = localStorage.getItem(draftKey(formId));
      if (!raw) return false;
      var d = JSON.parse(raw);
      state.files = d.files || {};
      restore(formId, d.values || {});
      return true;
    } catch (e) { return false; }
  }
  function clearDraft() {
    var f = formById(state.current);
    var card = document.querySelector('[data-form="' + f.id + '"]');
    if (!card) return;
    if (!confirm("清除「" + f.title + "」的本機草稿？此動作不影響已匯出的檔案。")) return;
    state.editingRid = null;
    localStorage.removeItem(draftKey(f.id));
    card.querySelectorAll("[data-k]").forEach(function (el) {
      if (el.type === "radio" || el.type === "checkbox") el.checked = false; else el.value = "";
    });
    card.querySelectorAll("[data-preview]").forEach(function (img) { img.hidden = true; img.removeAttribute("src"); });
    state.files = {};
    setStatus("草稿已清除", "");
    renderProgress(f.id);
  }

  /* ---------- progress + validation ---------- */
  function renderProgress(formId) {
    var v = collect(formId);
    var keys = Object.keys(v);
    var filled = keys.filter(function (k) {
      var val = v[k];
      return typeof val === "boolean" ? val : String(val || "").trim() !== "";
    }).length;
    var pct = keys.length ? Math.round((filled / keys.length) * 100) : 0;
    var bar = document.querySelector("[data-progress]");
    if (bar) {
      bar.style.width = pct + "%";
      var label = document.querySelector("[data-progress-label]");
      if (label) label.textContent = pct + "% 完成";
    }
  }
  function hasMissingRequired(card) {
    var miss = false;
    card.querySelectorAll("[data-req]").forEach(function (el) {
      if (!String(el.value || "").trim()) miss = true;
    });
    return miss;
  }

  function validate() {
    var card = document.querySelector('[data-form="' + state.current + '"]');
    if (!card) return false;
    var missing = [];
    card.querySelectorAll("[data-req]").forEach(function (el) { el.classList.remove("is-invalid"); });
    card.querySelectorAll("[data-req]").forEach(function (el) {
      if (!String(el.value || "").trim()) {
        el.classList.add("is-invalid");
        var th = el.closest("tr") ? el.closest("tr").querySelector("th") : null;
        var label = el.getAttribute("data-req-label") || (th ? th.textContent : "") || "必填欄位";
        missing.push(label.replace("*", "").trim());
      }
    });
    if (missing.length) {
      setStatus("尚有必填欄位：" + missing.join("、"), "warn");
      return false;
    }
    setStatus("必填欄位已完成", "ok");
    return true;
  }

  function setStatus(msg, kind) {
    var el = document.querySelector("[data-status]");
    if (!el) return;
    el.textContent = msg;
    el.className = "status" + (kind ? " " + kind : "");
  }

  /* ---------- export / import ---------- */
  function exportJSON() {
    var f = formById(state.current);
    var payload = {
      form: f.id, title: f.title, version: f.version, effective: f.effective,
      exportedAt: new Date().toISOString(),
      values: collect(f.id), files: state.files
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = f.id + "_" + (payload.values["s0.no"] || "draft") + ".json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    setStatus("已匯出 " + a.download, "ok");
  }

  function importJSON(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        var id = d.form;
        if (!formById(id) || !document.querySelector('[data-form="' + id + '"]')) throw new Error("unknown form");
        show(id);
        state.files = d.files || {};
        restore(id, d.values || {});
        saveNow();
        setStatus("已載入 " + file.name, "ok");
        renderProgress(id);
      } catch (e) {
        setStatus("檔案格式不符，無法載入", "warn");
      }
    };
    reader.readAsText(file);
  }

  /* ---------- 紀錄儲存 ---------- */
  var STORE = window.ISOStore;
  var drawerRecords = [];

  function metaOf(values, f) {
    return {
      no: values["s0.no"] || "",
      applyDate: values[(f && f.applyDateKey) || "s0.applyDate"] || "",
      // 003 沒有 s0.applicant，申請人落在核准表的第 1 列
      applicant: values[(f && f.applicantKey) || "s0.applicant"] || "",
      dept: values["s0.dept"] || "",
      product: values[(f && f.productKey) || "s0.product"] || "",
      itemNo: values["s0.itemNo"] || ""
    };
  }

  // 跨表單列出同一編號系列的紀錄（DOC-QA 由 SIP 與控制計畫共用）
  function listAcross(ids) {
    return Promise.all(ids.map(function (id) {
      return withTimeout(STORE.list(id), 8000, "list timeout").catch(function () { return []; });
    })).then(function (groups) {
      var out = [];
      (groups || []).forEach(function (g) { out = out.concat(g || []); });
      return out;
    });
  }

  function saveRecord() {
    // 檢視中或已鎖定：不准寫入，避免誤存成新紀錄
    if (state.viewRid && !state.editingRid) {
      setStatus("目前為檢視模式，請先按「修改」才能儲存", "warn");
      state.stickyUntil = Date.now() + 5000;
      return;
    }
    var f = formById(state.current);
    var card = document.querySelector('[data-form="' + f.id + '"]');
    var noInput = card.querySelector('[data-k="s0.no"]');
    // 沒有單號就自動取號，避免紀錄無法識別
    var ready = (noInput && !String(noInput.value || "").trim())
      ? nextSerial(f.prefix, f.serialFmt, f.id).then(function (no) {
          if (!no) throw new Error("serial failed");
          noInput.value = no;
          renderProgress(f.id);
        })
      : Promise.resolve();
    ready.then(function () {
      return commitRecord(f, card, noInput);
    }).catch(function () {
      setStatus("儲存逾時或取號失敗，請重新整理後再試", "warn");
      state.stickyUntil = Date.now() + 7000;
    });
  }

  function commitRecord(f, card, noInput) {
    // 必填未完成就不寫入雲端，避免產生沒有申請人的無效紀錄
    if (hasMissingRequired(card)) {
      validate();
      setStatus("尚有必填欄位，補齊後再儲存", "warn");
      state.stickyUntil = Date.now() + 5000;
      return;
    }

    var values = collect(f.id);
    var m = metaOf(values, f);
    var rec = {
      form: f.id, title: f.title, version: f.version, effective: f.effective,
      values: values, files: state.files,
      no: m.no, applyDate: m.applyDate, applicant: m.applicant, dept: m.dept, product: m.product
    };
    var isUpdate = !!state.editingRid;
    if (isUpdate) rec.rid = state.editingRid;
    setStatus("儲存中…", "");
    var siblingIds = formsWithPrefix(f.prefix).map(function (x) { return x.id; });
    if (siblingIds.indexOf(f.id) < 0) siblingIds.push(f.id);
    listAcross(siblingIds).then(function (rows) {
      // 單號已被別筆紀錄用掉時，自動換新號，避免兩筆同號（含同系列的其他表單）
      var dupe = rows.filter(function (r) {
        return m.no && r.no === m.no && r.rid !== rec.rid && r.form === f.id;
      })[0];
      if (!dupe) return STORE.save(rec);
      // 同表單、同單號 → 直接覆蓋原紀錄，單號不變（不再另取新號）
      rec.rid = dupe.rid;
      rec.values["s0.no"] = m.no;
      return STORE.save(rec);
    }).then(function (saved) {
      state.viewRid = saved.rid;
      state.editingRid = null;
      // 寫入後回讀確認，避免儲存空間異常時靜默失敗
      return STORE.list(rec.form).then(function (rows) {
        refreshCount();
        var ok = rows.some(function (r) { return r.rid === saved.rid; });
        if (ok) {
          setStatus((isUpdate ? "已覆蓋紀錄 " : "紀錄已儲存 ") + (saved.no || ""), "ok");
          state.stickyUntil = Date.now() + 5000;
          applyRecMode();
        } else {
          setStatus("紀錄未寫入，請重新載入頁面後再試", "warn");
        }
      });
    }).catch(function () {
      setStatus("紀錄儲存失敗", "warn");
    });
  }

  function refreshCount() {
    var badge = document.querySelector("[data-count]");
    if (!badge || !STORE) return;
    STORE.list(state.current).then(function (rows) {
      badge.textContent = rows.length;
    });
  }

  function openDrawer() {
    var f = formById(state.current);
    document.querySelector("[data-drawer]").hidden = false;
    document.querySelector("[data-drawer-title]").textContent = f.title + " · 歷史紀錄";
    document.querySelector("[data-drawer-sub]").textContent =
      f.id + "　版次 " + f.version + "　（" + ((window.ISO_CONFIG || {}).remoteUrl ? "雲端＋本機" : "僅本機") + "）";
    document.querySelector("[data-record-search]").value = "";
    loadRecords();
  }

  function closeDrawer() {
    document.querySelector("[data-drawer]").hidden = true;
  }

  function loadRecords() {
    var box = document.querySelector("[data-record-list]");
    if (!box) return;
    box.innerHTML = '<p class="drawer-empty">載入中…</p>';
    withTimeout(STORE.list(state.current), 12000, "list timeout").then(function (rows) {
      drawerRecords = rows;
      renderRecords();
      refreshCount();
    }).catch(function () {
      drawerRecords = [];
      box.innerHTML = '<p class="drawer-empty">讀取逾時：請關閉其他分頁後按「重新整理」。</p>';
    }).then(function () {
      var btn = document.querySelector("[data-record-reload]");
      if (btn) btn.disabled = false;
    });
  }

  function renderRecords() {
    var box = document.querySelector("[data-record-list]");
    var q = String((document.querySelector("[data-record-search]") || {}).value || "").trim().toLowerCase();
    var rows = drawerRecords.filter(function (r) {
      if (!q) return true;
      var f = formById(r.form);
      var extra = (f.listFields || []).map(function (fd) { return (r.values || {})[fd.k] || ""; });
      return [r.no, r.applicant, r.product, r.applyDate, r.dept].concat(extra).join(" ").toLowerCase().indexOf(q) > -1;
    });
    document.querySelector("[data-drawer-count]").textContent = rows.length + " 筆";
    if (!rows.length) {
      box.innerHTML = '<p class="drawer-empty">' + (q ? "沒有符合「" + esc(q) + "」的紀錄" : "尚無紀錄，填完表單按「儲存紀錄」即可建立。") + "</p>";
      return;
    }
    box.innerHTML = rows.map(function (r) {
      var f = formById(r.form);
      var outdated = r.version !== f.version;
      var detail = (f.listFields || []).map(function (fd) {
        var v = (r.values || {})[fd.k] || "";
        return '<div class="rec-cell"><span class="rec-l">' + esc(fd.l) + "</span>" +
          '<span class="rec-v' + (v ? "" : " is-empty") + '">' + esc(v || "—") + "</span></div>";
      }).join("");
      return '<article class="rec" data-rid="' + esc(r.rid) + '">' +
        '<div class="rec-main">' +
        '<div class="rec-no">' + esc(r.no || "（未取號）") +
        (outdated ? '<span class="rec-tag">舊版次 ' + esc(r.version) + "</span>" : "") +
        (r.pendingSync ? '<span class="rec-tag rec-tag-warn">未同步</span>' : "") +
        (r.values && r.values.__locked ? '<span class="rec-tag rec-tag-lock">已鎖定</span>' : "") + "</div>" +
        '<div class="rec-meta">' + esc(f.title) + "　" + esc([r.applyDate, r.applicant, r.dept].filter(Boolean).join(" · ") || "—") + "</div>" +
        "</div>" +
        '<div class="rec-time">' + esc(fmtTime(r.updatedAt)) + "</div>" +
        '<div class="rec-detail">' + detail + "</div>" +
        '<div class="rec-ops">' +
        '<button type="button" class="btn btn-sm" data-rec-open="' + esc(r.rid) + '">開啟</button>' +
        '<button type="button" class="btn btn-sm" data-rec-edit="' + esc(r.rid) + '"' +
        (r.values && r.values.__locked ? " disabled" : "") + ">修改</button>" +
        '<button type="button" class="btn btn-sm" data-rec-lock="' + esc(r.rid) + '">' +
        (r.values && r.values.__locked ? "解鎖" : "鎖定") + "</button>" +
        '<button type="button" class="btn btn-sm" data-rec-print="' + esc(r.rid) + '">列印</button>' +
        '<button type="button" class="btn btn-sm" data-rec-export="' + esc(r.rid) + '">匯出</button>' +
        '<button type="button" class="btn btn-sm btn-danger" data-rec-del="' + esc(r.rid) + '">刪除</button>' +
        "</div></article>";
    }).join("");
  }

  function fmtTime(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function findRecord(rid) {
    return drawerRecords.filter(function (r) { return r.rid === rid; })[0];
  }

  function loadRecordIntoForm(rec, edit) {
    show(rec.form);
    state.files = rec.files || {};
    restore(rec.form, rec.values || {});
    state.viewRid = rec.rid;
    state.recLocked = !!(rec.values && rec.values.__locked);
    state.editingRid = (edit && !state.recLocked) ? rec.rid : null;
    renderProgress(rec.form);
    applyRecMode();
    if (rec.version !== formById(rec.form).version) {
      setStatus("此紀錄為 v" + rec.version + "，現行表單為 v" + formById(rec.form).version, "warn");
    } else {
      setStatus((edit ? "修改紀錄 " : "檢視紀錄 ") + (rec.no || ""), "ok");
    }
    if (edit && !state.recLocked) {
      var first = document.querySelector('[data-form="' + rec.form + '"] [data-k]');
      if (first) first.focus();
    }
  }

  /* ---------- 紀錄模式：檢視 / 修改 / 鎖定 ---------- */
  function applyRecMode() {
    var bar = document.querySelector("[data-recbar]");
    if (!bar) return;
    var card = document.querySelector('[data-form="' + state.current + '"]');
    var saveBtn = document.querySelector("[data-act='record']");
    var btnEdit = document.querySelector("[data-act='rec-edit']");
    var btnLock = document.querySelector("[data-act='rec-lock']");
    var txt = document.querySelector("[data-recbar-text]");
    var viewing = !!state.viewRid;
    var editing = !!state.editingRid;

    if (card) card.classList.toggle("is-view", viewing && !editing);
    bar.hidden = !viewing;
    if (saveBtn) saveBtn.disabled = viewing && !editing;
    if (!viewing) return;

    bar.classList.toggle("is-locked", state.recLocked);
    if (btnEdit) {
      btnEdit.hidden = state.recLocked;
      btnEdit.disabled = editing;
      btnEdit.textContent = editing ? "修改中" : "修改";
    }
    if (btnLock) btnLock.textContent = state.recLocked ? "解鎖" : "鎖定";
    if (txt) {
      if (state.recLocked) {
        txt.textContent = "🔒 此紀錄已鎖定，不可修改（僅能檢視、列印）。";
      } else if (editing) {
        txt.textContent = "修改模式：修改後按「儲存紀錄」會覆蓋同一筆紀錄，單號不變。";
      } else {
        txt.textContent = "檢視模式：紀錄為唯讀，按「修改」才能編輯。";
      }
    }
  }

  function startEdit() {
    if (state.recLocked) {
      setStatus("此紀錄已鎖定，無法修改", "warn");
      state.stickyUntil = Date.now() + 4000;
      return;
    }
    if (!state.viewRid) return;
    state.editingRid = state.viewRid;
    applyRecMode();
    setStatus("已進入修改模式，儲存後會覆蓋原紀錄", "ok");
    state.stickyUntil = Date.now() + 4000;
  }

  function closeRecordView() {
    state.viewRid = null;
    state.editingRid = null;
    state.recLocked = false;
    applyRecMode();
    setStatus("已結束檢視（目前內容仍為該筆紀錄，可直接另存新紀錄）", "");
  }

  function toggleLock() {
    var rec = findRecord(state.viewRid);
    if (!rec) {
      setStatus("請重新開啟歷史紀錄後再操作", "warn");
      state.stickyUntil = Date.now() + 4000;
      return;
    }
    var next = !state.recLocked;
    if (next && !confirm("鎖定後此紀錄就不能再修改，確定鎖定 " + (rec.no || "") + "？")) return;
    rec.values = rec.values || {};
    if (next) rec.values.__locked = true;
    else delete rec.values.__locked;
    setStatus(next ? "鎖定中…" : "解鎖中…", "");
    STORE.save(rec).then(function () {
      state.recLocked = next;
      if (next) state.editingRid = null;
      applyRecMode();
      setStatus((next ? "已鎖定紀錄 " : "已解鎖紀錄 ") + (rec.no || ""), "ok");
      state.stickyUntil = Date.now() + 4000;
      loadRecords();
    }).catch(function () {
      setStatus("操作失敗，請確認網路後再試", "warn");
      state.stickyUntil = Date.now() + 6000;
    });
  }

  function exportRecord(rec) {
    var payload = {
      form: rec.form, title: rec.title, version: rec.version, effective: rec.effective,
      savedAt: rec.updatedAt, values: rec.values, files: rec.files
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = rec.form + "_" + (rec.no || rec.rid) + ".json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- routing ---------- */
  function show(id) {
    // 未知的 id 一律回到第一張，否則所有表單都會被隱藏（整頁空白）
    var fCheck = formById(id);
    if (fCheck.id !== id) id = fCheck.id;
    var prevForm = state.current;
    state.current = id;
    document.querySelectorAll(".doc").forEach(function (d) { d.hidden = d.getAttribute("data-form") !== id; });
    document.querySelectorAll("[data-tab]").forEach(function (t) {
      t.classList.toggle("is-active", t.getAttribute("data-tab") === id);
    });
    if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
    var f = formById(id);
    document.title = f.id + " " + f.title + " · " + META.companyCN;
    // 只有切換表單才清掉檢視／修改狀態；同表單重繪若清掉，存檔會變成新增一筆
    if (prevForm !== id) {
      state.files = {};
      state.editingRid = null;
      state.viewRid = null;
      state.recLocked = false;
    }
    if (!loadDraft(id)) setStatus("尚未填寫", "");
    else setStatus("已載入本機草稿", "ok");

    // 申請日期未填時預設當日，避免每次都要手動選
    var dEl = document.querySelector('[data-form="' + id + '"] [data-k="s0.applyDate"]');
    if (dEl && !dEl.value) {
      dEl.value = today();
      saveNow();
    }
    renderProgress(id);
    refreshCount();
    renderSideNav();
    applyRecMode();  // 切換表單時同步側欄分類展開狀態
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }


  // 桌機右側分類（依文件使用情境，非 ISO 章節）
  var FORM_GROUPS = [
    { t: "開發與變更", ids: ["FRM-EN-001", "FRM-QA-001", "FRM-QA-002"] },
    { t: "進料與供應商", ids: ["FRM-QA-004", "FRM-QA-010"] },
    { t: "製程與出貨", ids: ["FRM-QA-003", "FRM-QA-013"] },
    { t: "量測與不合格", ids: ["FRM-QA-005", "FRM-QA-006", "FRM-QA-007"] },
    { t: "訂單與顧客", ids: ["FRM-QA-012", "FRM-QA-016"] },
    { t: "系統管理", ids: ["FRM-QA-008", "FRM-QA-009", "FRM-QA-011", "FRM-QA-017"] },
    { t: "組織與規劃", ids: ["FRM-QA-014", "FRM-QA-015", "FRM-QA-018", "FRM-QA-019", "FRM-QA-020"] },
    { t: "文件與訓練", ids: ["SOP-PD-001", "SIP-QA-001", "FMEA-EN-001", "CLP-QA-001"] }
  ];


  /* ---------- 右側分類（可收合下拉） ---------- */
  var openGroup = 0;
  var lastSyncedForm = null;

  function groupOf(id) {
    for (var i = 0; i < FORM_GROUPS.length; i++) {
      if (FORM_GROUPS[i].ids.indexOf(id) >= 0) return i;
    }
    return -1;
  }

  function sideItem(f) {
    return '<button type="button" class="side-item' + (state.current === f.id ? " is-active" : "") +
      '" data-tab="' + esc(f.id) + '" title="' + esc(f.id + " " + f.title + " v" + f.version) + '">' +
      '<span class="side-code">' + esc(f.id) + "</span>" +
      '<span class="side-name">' + esc(f.title) + "</span></button>";
  }

  function renderSideNav() {
    var box = document.querySelector("[data-sidenav]");
    if (!box) return;
    var used = {};
    // 只在切換表單時同步所屬分類；使用者手動收合/展開則保留其選擇
    if (state.current !== lastSyncedForm) {
      lastSyncedForm = state.current;
      var cur = groupOf(state.current);
      if (cur >= 0) openGroup = cur;
    }

    var html = '<div class="side-head">表單分類　' + FORMS.length + " 張</div>";

    FORM_GROUPS.forEach(function (g, gi) {
      var items = g.ids.map(function (id) {
        var f = FORMS.filter(function (x) { return x.id === id; })[0];
        if (!f) return "";
        used[id] = true;
        return sideItem(f);
      }).join("");
      if (!items) return;
      var open = gi === openGroup;
      html += '<div class="side-group' + (open ? " is-open" : "") + '">' +
        '<button type="button" class="side-group-t" data-gt="' + gi + '" aria-expanded="' + open + '">' +
        "<span>" + esc(g.t) + '</span><span class="side-cnt">' + g.ids.length + "</span></button>" +
        '<div class="side-list">' + items + "</div></div>";
    });

    var rest = FORMS.filter(function (f) { return !used[f.id]; });
    if (rest.length) {
      html += '<div class="side-group' + (openGroup === -1 ? " is-open" : "") + '">' +
        '<button type="button" class="side-group-t" data-gt="-1" aria-expanded="false">' +
        "<span>未分類</span><span class=\"side-cnt\">" + rest.length + "</span></button>" +
        '<div class="side-list">' + rest.map(sideItem).join("") + "</div></div>";
    }

    box.innerHTML = html;

    if (!box.__bound) {
      box.__bound = true;
      box.addEventListener("click", function (e) {
        var gt = e.target.closest("[data-gt]");
        if (gt) {
          var gi = parseInt(gt.getAttribute("data-gt"), 10);
          if (isNaN(gi)) gi = -1;
          openGroup = openGroup === gi ? -1 : gi;
          renderSideNav();
          return;
        }
        var b = e.target.closest("[data-tab]");
        if (!b) return;
        var id = b.getAttribute("data-tab");
        saveNow();
        show(id);
        renderSideNav();
      });
    }
  }

  /* ---------- boot ---------- */
  function boot() {
    var nav = document.querySelector("[data-nav]");
    var main = document.querySelector("[data-main]");
    renderSideNav();

    nav.innerHTML = FORMS.map(function (f) {
      return '<button type="button" class="tab" data-tab="' + esc(f.id) + '" title="' + esc(f.id + ' ' + f.title + ' v' + f.version) + '"><span class="tab-code">' + esc(f.id) + '</span><span class="tab-name">' + esc(f.title) + '</span><span class="tab-ver">v' + esc(f.version) + "</span></button>";
    }).join("");

    main.innerHTML = FORMS.map(renderForm).join("");

    document.querySelector("[data-company]").textContent = META.companyCN + " · " + META.company;
    document.querySelector("[data-updated]").textContent = "管制版本更新 " + META.updated;

    nav.addEventListener("click", function (e) {
      var t = e.target.closest("[data-tab]");
      if (!t) return;
      var tid = t.getAttribute("data-tab");
      saveNow();
      show(tid);
      renderSideNav();
    });

    main.addEventListener("input", function (e) {
      if (e.target.matches("[data-k]")) { scheduleSave(); renderProgress(state.current); }
    });
    // 單選項目再點一次可取消（點圓圈或點標籤文字都算）
    var radioWasOn = false;
    var radioRef = null;
    main.addEventListener("mousedown", function (e) {
      var r = null;
      if (e.target.matches && e.target.matches('input[type="radio"]')) {
        r = e.target;
      } else if (e.target.closest) {
        var lb = e.target.closest("label");
        if (lb) r = lb.querySelector('input[type="radio"]');
      }
      radioRef = r;
      radioWasOn = !!(r && r.checked);
    }, true);
    main.addEventListener("click", function (e) {
      if (!radioWasOn || !radioRef || !radioRef.isConnected) {
        radioWasOn = false;
        radioRef = null;
        return;
      }
      var nm = radioRef.name;
      var all = main.querySelectorAll('input[type="radio"]');
      for (var i = 0; i < all.length; i++) {
        if (all[i].name === nm) all[i].checked = false;
      }
      e.preventDefault();
      radioWasOn = false;
      radioRef = null;
      // 瀏覽器預設 activation 在事件派送後才執行，會在下一輪把 radio 勾回來
      setTimeout(function () {
        var again = main.querySelectorAll('input[type="radio"]');
        for (var j = 0; j < again.length; j++) {
          if (again[j].name === nm) again[j].checked = false;
        }
        scheduleSave();
        renderProgress(state.current);
      }, 0);
    }, true);

    main.addEventListener("change", function (e) {
      if (e.target.matches("[data-other]")) {
        var wrap = e.target.closest(".opt-wrap");
        var inp = wrap && wrap.querySelector("[data-other-for]");
        if (inp) {
          inp.hidden = !e.target.checked;
          if (!e.target.checked) inp.value = "";
        }
      }
      if (e.target.matches('input[type="checkbox"],input[type="radio"],select')) { scheduleSave(); renderProgress(state.current); }
      if (e.target.matches("[data-img]")) handleImage(e.target);
    });

    main.addEventListener("click", function (e) {
      var del = e.target.closest("[data-clear-img]");
      if (del) {
        var dk = del.getAttribute("data-clear-img");
        delete state.files[dk];
        var img = document.querySelector('[data-preview="' + dk + '"]');
        if (img) { img.hidden = true; img.removeAttribute("src"); }
        var picker = document.querySelector('[data-img="' + dk + '"]');
        if (picker) picker.value = "";
        del.hidden = true;
        saveNow();
        return;
      }
      var b = e.target.closest("[data-serial]");
      if (b) {
        var path = b.getAttribute("data-target");
        var el = document.querySelector('[data-form="' + state.current + '"] [data-k="' + path + '"]');
        if (el) {
          b.disabled = true;
          var ph = el.getAttribute("placeholder");
          if (!el.value) el.setAttribute("placeholder", "取號中…");
          setStatus("取號中…", "");
          nextSerial(b.getAttribute("data-serial"), b.getAttribute("data-fmt"), b.getAttribute("data-form")).then(function (no) {
            b.disabled = false;
            if (ph !== null) el.setAttribute("placeholder", ph);
            if (!no) {
              setStatus("取號失敗：無法讀取歷史紀錄，請確認網路後再試", "warn");
              state.stickyUntil = Date.now() + 6000;
              return;
            }
            el.value = no;
            state.editingRid = null;  // 取新號 = 開新紀錄，不再覆蓋原紀錄
        state.viewRid = null;
        state.recLocked = false;
        applyRecMode();
            saveNow();
            renderProgress(state.current);
            setStatus("已取號 " + no + "（存檔後才會換下一號）", "ok");
            // 取號後自動領版，文件類表單不必再手動點一次
            var vbtn = document.querySelector('[data-form="' + state.current + '"] [data-version]');
            if (vbtn) setTimeout(function () { vbtn.click(); }, 50);
          });
        }
        return;
      }

      // 領版：同一個文件編號已有紀錄時，取下一個小版次（1.0 → 1.1 → 1.2）
      var vb = e.target.closest("[data-version]");
      if (vb) {
        var vpath = vb.getAttribute("data-target");
        var spath = vb.getAttribute("data-src");
        var vcard = document.querySelector('[data-form="' + state.current + '"]');
        var srcEl = vcard.querySelector('[data-k="' + spath + '"]');
        var vEl = vcard.querySelector('[data-k="' + vpath + '"]');
        var curNo = srcEl ? String(srcEl.value || "").trim() : "";
        if (!curNo) {
          setStatus("請先取號，再領取版次", "warn");
          state.stickyUntil = Date.now() + 5000;
          return;
        }
        vb.disabled = true;
        setStatus("領取版次中…", "");
        STORE.list(state.current).then(function (rows) {
          var max = 0;
          (rows || []).forEach(function (r) {
            var vals = r.values || {};
            if (String(vals[spath] || "").trim() !== curNo) return;
            var m = String(vals[vpath] || "").match(/^(\d+)\.(\d+)$/);
            if (!m) return;
            var n = parseInt(m[1], 10) + parseInt(m[2], 10) / 10;
            if (n > max) max = n;
          });
          var next = max ? (Math.round((max + 0.1) * 10) / 10).toFixed(1) : "1.0";
          vEl.value = next;
          saveNow();
          renderProgress(state.current);
          vb.disabled = false;
          setStatus("版次 " + next + (max ? "（同編號前一版 +0.1）" : "（新文件初版）"), "ok");
        }).catch(function () {
          vb.disabled = false;
          setStatus("領版失敗：無法讀取歷史紀錄，請確認網路後再試", "warn");
          state.stickyUntil = Date.now() + 6000;
        });
      }
    });

    var imp = document.querySelector("[data-import]");
    if (imp) {
      imp.addEventListener("change", function () {
        if (imp.files && imp.files[0]) importJSON(imp.files[0]);
        imp.value = "";
      });
    }

    // 先決定要顯示哪張表單並回填草稿，任何後續錯誤都不會造成白屏
    var hash = location.hash.slice(1);
    show(FORMS.some(function (f) { return f.id === hash; }) ? hash : FORMS[0].id);

    var f = formById(state.current);
    var d = document.querySelector('[data-form="' + f.id + '"] [data-k="s0.applyDate"]');
    if (d && !d.value) d.value = today();

    on("[data-act='record']", "click", saveRecord);
    on("[data-act='rec-edit']", "click", startEdit);
    on("[data-act='rec-lock']", "click", toggleLock);
    on("[data-act='rec-close']", "click", closeRecordView);
    on("[data-act='history']", "click", openDrawer);
    document.querySelectorAll("[data-drawer-close]").forEach(function (el) {
      el.addEventListener("click", closeDrawer);
    });
    on("[data-record-search]", "input", renderRecords);
    on("[data-record-reload]", "click", function () {
      var btn = document.querySelector("[data-record-reload]");
      if (btn) btn.disabled = true;
      loadRecords();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !document.querySelector("[data-drawer]").hidden) closeDrawer();
    });

    on("[data-record-list]", "click", function (e) {
      var open = e.target.closest("[data-rec-open]");
      var edit = e.target.closest("[data-rec-edit]");
      var lock = e.target.closest("[data-rec-lock]");
      var print = e.target.closest("[data-rec-print]");
      var exp = e.target.closest("[data-rec-export]");
      var del = e.target.closest("[data-rec-del]");
      var rec;
      if (open) {
        rec = findRecord(open.getAttribute("data-rec-open"));
        if (rec) { loadRecordIntoForm(rec, false); closeDrawer(); }
      } else if (edit) {
        rec = findRecord(edit.getAttribute("data-rec-edit"));
        if (rec) { loadRecordIntoForm(rec, true); closeDrawer(); }
      } else if (lock) {
        rec = findRecord(lock.getAttribute("data-rec-lock"));
        if (rec) {
          var locked = !!(rec.values && rec.values.__locked);
          if (!locked || confirm("解除鎖定後此紀錄可再次修改，確定解鎖 " + (rec.no || "") + "？")) {
            rec.values = rec.values || {};
            if (locked) delete rec.values.__locked; else rec.values.__locked = true;
            STORE.save(rec).then(function () {
              setStatus((locked ? "已解鎖 " : "已鎖定 ") + (rec.no || ""), "ok");
              state.stickyUntil = Date.now() + 4000;
              loadRecords();
            });
          }
        }
      } else if (print) {
        rec = findRecord(print.getAttribute("data-rec-print"));
        if (rec) { loadRecordIntoForm(rec, false); closeDrawer(); setTimeout(function () { window.print(); }, 120); }
      } else if (exp) {
        rec = findRecord(exp.getAttribute("data-rec-export"));
        if (rec) exportRecord(rec);
      } else if (del) {
        rec = findRecord(del.getAttribute("data-rec-del"));
        if (rec && confirm("刪除紀錄 " + (rec.no || rec.rid) + "？此動作無法復原，其他同事下次開啟時也會消失。")) {
          STORE.remove(rec.rid, rec.form).then(function (ok) {
            if (!ok) {
              setStatus("刪除失敗：雲端未回應，請確認網路後再試", "warn");
              state.stickyUntil = Date.now() + 6000;
              return;
            }
            setStatus("已刪除紀錄 " + (rec.no || ""), "ok");
            state.stickyUntil = Date.now() + 4000;
            loadRecords();
            refreshCount();
          });
        }
      }
    });

    var note = document.querySelector("[data-storage-note]");
    if (note) note.textContent = (window.ISO_CONFIG || {}).remoteUrl ? "紀錄同步至雲端並保留本機副本" : "紀錄儲存於本機瀏覽器";
    refreshCount();

    on("[data-act='save']", "click", saveNow);
    on("[data-act='print']", "click", function () { saveNow(); window.print(); });
    on("[data-act='export']", "click", exportJSON);
    on("[data-act='clear']", "click", clearDraft);
    on("[data-act='check']", "click", validate);
    on("[data-save-hint]", "click", function () { saveNow(); });

    window.addEventListener("hashchange", function () {
      var h = location.hash.slice(1);
      if (!h) return;
      var known = FORMS.some(function (f) { return f.id === h; });
      if (!known) {  // 無效 hash：留在原表單並把網址改回有效值
        history.replaceState(null, "", "#" + state.current);
        return;
      }
      if (h !== state.current) show(h);
    });
  }

  function on(sel, ev, fn) {
    var el = document.querySelector(sel);
    if (el) el.addEventListener(ev, fn);
  }

  function handleImage(el) {
    var file = el.files && el.files[0];
    if (!file) return;
    if (file.size > FILE_LIMIT) { setStatus("圖片超過 2 MB，請先壓縮", "warn"); el.value = ""; return; }
    var keyName = el.getAttribute("data-img");
    var reader = new FileReader();
    reader.onload = function () {
      state.files[keyName] = reader.result;
      var img = document.querySelector('[data-preview="' + keyName + '"]');
      if (img) { img.src = reader.result; img.hidden = false; }
      var clr = document.querySelector('[data-clear-img="' + keyName + '"]');
      if (clr) clr.hidden = false;
      saveNow();
    };
    reader.readAsDataURL(file);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
