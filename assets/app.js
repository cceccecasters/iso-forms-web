/* ISO 表單填寫系統 — 介面邏輯
 * 表單結構全部來自 forms.js；本檔只負責渲染、草稿、匯出與列印。
 */
(function () {
  "use strict";

  var META = window.ISO_META;
  var FORMS = window.ISO_FORMS;
  var HISTORY = window.ISO_HISTORY;
  var FILE_LIMIT = 2 * 1024 * 1024;

  var state = { current: FORMS[0].id, files: {}, savedAt: null };

  /* ---------- utils ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function key(formId, path) { return formId + "::" + path; }
  function draftKey(formId) { return "iso:draft:" + formId; }
  function serialKey(prefix, year) { return "iso:serial:" + prefix + ":" + year; }
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
  function nextSerial(prefix) {
    var year = new Date().getFullYear();
    var n = parseInt(localStorage.getItem(serialKey(prefix, year)) || "0", 10) + 1;
    localStorage.setItem(serialKey(prefix, year), String(n));
    return prefix + "-" + year + "-" + String(n).padStart(3, "0");
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

  function radioGroup(f, path, options, cls) {
    return '<div class="opt-row ' + (cls || "") + '">' + (options || []).map(function (o) {
      var id = key(f.id, path + "|" + o);
      return '<label class="opt"><input type="radio" name="' + esc(id) + '" data-k="' + esc(path) + '" value="' + esc(o) + '"><span>' + esc(o) + "</span></label>";
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
          var cell = c.serial
            ? '<div class="serial"><input type="text" data-k="' + esc(path) + '" id="' + esc(key(f.id, path)) + '" placeholder="' + esc(f.prefix) + "-" + new Date().getFullYear() + '-001"><button type="button" class="btn-mini" data-serial="' + esc(f.prefix) + '" data-target="' + esc(path) + '">取號</button></div>'
            : input(f, path, { type: c.t, req: c.req, label: c.l });
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
        html += '<label class="chip"><input type="checkbox" data-k="' + esc(p) + '"><span>其他</span></label>' +
          '<input class="inline-text" type="text" data-k="' + esc(base + ".其他說明") + '" placeholder="請說明">';
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
      var body = "";
      for (var i = 0; i < s.rows; i++) {
        body += "<tr>";
        body += '<td class="num">' + (i + 1) + "</td>";
        for (var j = 1; j < s.cols.length; j++) {
          var p = "s" + si + "." + s.k + "." + (i + 1) + "." + j;
          body += "<td>" + input(f, p, {}) + "</td>";
        }
        body += "</tr>";
      }
      return '<table class="tbl tbl-grid"><thead>' + head + "</thead><tbody>" + body + "</tbody></table>";
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
    card.querySelectorAll("[data-preview]").forEach(function (img) {
      var kk = img.getAttribute("data-preview");
      if (state.files[kk]) { img.src = state.files[kk]; img.hidden = false; }
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
      // 必填警告優先，避免自動存檔把提示蓋掉
      if (!(el && el.classList.contains("warn"))) setStatus("草稿已儲存 " + nowLabel(), "ok");
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
  function validate() {
    var card = document.querySelector('[data-form="' + state.current + '"]');
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

  /* ---------- routing ---------- */
  function show(id) {
    state.current = id;
    document.querySelectorAll(".doc").forEach(function (d) { d.hidden = d.getAttribute("data-form") !== id; });
    document.querySelectorAll("[data-tab]").forEach(function (t) {
      t.classList.toggle("is-active", t.getAttribute("data-tab") === id);
    });
    if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
    var f = formById(id);
    document.title = f.id + " " + f.title + " · " + META.system;
    state.files = {};
    if (!loadDraft(id)) setStatus("尚未填寫", "");
    else setStatus("已載入本機草稿", "ok");
    renderProgress(id);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ---------- boot ---------- */
  function boot() {
    var nav = document.querySelector("[data-nav]");
    var main = document.querySelector("[data-main]");

    nav.innerHTML = FORMS.map(function (f) {
      return '<button type="button" class="tab" data-tab="' + esc(f.id) + '"><span class="tab-code">' + esc(f.id) + '</span><span class="tab-name">' + esc(f.title) + '</span><span class="tab-ver">v' + esc(f.version) + "</span></button>";
    }).join("");

    main.innerHTML = FORMS.map(renderForm).join("");

    document.querySelector("[data-company]").textContent = META.companyCN + " · " + META.company;
    document.querySelector("[data-updated]").textContent = "管制版本更新 " + META.updated;

    nav.addEventListener("click", function (e) {
      var t = e.target.closest("[data-tab]");
      if (t) { saveNow(); show(t.getAttribute("data-tab")); }
    });

    main.addEventListener("input", function (e) {
      if (e.target.matches("[data-k]")) { scheduleSave(); renderProgress(state.current); }
    });
    main.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"],input[type="radio"],select')) { scheduleSave(); renderProgress(state.current); }
      if (e.target.matches("[data-img]")) handleImage(e.target);
    });

    main.addEventListener("click", function (e) {
      var b = e.target.closest("[data-serial]");
      if (b) {
        var path = b.getAttribute("data-target");
        var el = document.querySelector('[data-form="' + state.current + '"] [data-k="' + path + '"]');
        if (el) {
          el.value = nextSerial(b.getAttribute("data-serial"));
          saveNow();
          renderProgress(state.current);
          setStatus("已取號 " + el.value, "ok");
        }
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

    on("[data-act='save']", "click", saveNow);
    on("[data-act='print']", "click", function () { saveNow(); window.print(); });
    on("[data-act='export']", "click", exportJSON);
    on("[data-act='clear']", "click", clearDraft);
    on("[data-act='check']", "click", validate);
    on("[data-save-hint]", "click", function () { saveNow(); });

    window.addEventListener("hashchange", function () {
      var h = location.hash.slice(1);
      if (h && h !== state.current) show(h);
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
      saveNow();
    };
    reader.readAsDataURL(file);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
