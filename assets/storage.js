/* 表單紀錄儲存層
 * 本機用 IndexedDB（不支援時退回 localStorage）。設了 remoteUrl 時：
 *   - 儲存：本機 + 雲端雙寫，成功才標記 synced
 *   - 列表：以雲端為準，只補上「尚未上雲」的本機紀錄
 *     → 別台裝置刪除的紀錄，這裡下次載入就會消失
 */
(function () {
  "use strict";

  var DB_NAME = "isoforms";
  var DB_VER = 1;
  var STORE = "records";
  var LS_KEY = "iso:records";
  var dbPromise = null;
  var idbBroken = false;
  var repairing = false;

  function hasIDB() {
    try { return !!window.indexedDB; } catch (e) { return false; }
  }

  function createStore(db) {
    var os = db.createObjectStore(STORE, { keyPath: "rid" });
    os.createIndex("form", "form", { unique: false });
    os.createIndex("updatedAt", "updatedAt", { unique: false });
  }

  function openDB() {
    if (dbPromise) return dbPromise;
    if (idbBroken) return Promise.reject(new Error("idb disabled"));
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) createStore(db);
      };
      req.onsuccess = function () {
        var db = req.result;
        // 舊版殘留的空 DB：版本相同不會再觸發 upgrade，這裡自我修復一次
        if (!db.objectStoreNames.contains(STORE) && !repairing) {
          repairing = true;
          db.close();
          dbPromise = null;
          var del = indexedDB.deleteDatabase(DB_NAME);
          del.onsuccess = del.onerror = del.onblocked = function () { resolve(openDB()); };
          return;
        }
        if (!db.objectStoreNames.contains(STORE)) {
          idbBroken = true;
          db.close();
          reject(new Error("missing store"));
          return;
        }
        resolve(db);
      };
      req.onerror = function () { idbBroken = true; reject(req.error); };
    });
    return dbPromise;
  }

  function lsAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (e) { return []; }
  }

  function lsWrite(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function normalize(rec) {
    var now = new Date().toISOString();
    rec.rid = rec.rid || uid();
    rec.createdAt = rec.createdAt || now;
    rec.updatedAt = now;
    return rec;
  }

  function remote() {
    return (window.ISO_CONFIG || {}).remoteUrl || "";
  }

  function postRemote(payload) {
    var url = remote();
    if (!url) return Promise.resolve(null);
    return fetch(url, {
      method: "POST",
      // text/plain 避免 Apps Script 的 CORS 預檢被擋
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).catch(function () { return null; });
  }

  /* ---------- 本機讀寫 ---------- */

  function putLocal(rec) {
    if (!hasIDB()) {
      var list = lsAll().filter(function (r) { return r.rid !== rec.rid; });
      list.push(rec);
      lsWrite(list);
      return Promise.resolve(true);
    }
    return openDB().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(rec);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      });
    }).catch(function () {
      idbBroken = true;
      var list = lsAll().filter(function (r) { return r.rid !== rec.rid; });
      list.push(rec);
      lsWrite(list);
      return true;
    });
  }

  function dropLocal(rid) {
    if (!hasIDB()) {
      lsWrite(lsAll().filter(function (r) { return r.rid !== rid; }));
      return Promise.resolve(true);
    }
    return openDB().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(rid);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      });
    }).catch(function () {
      lsWrite(lsAll().filter(function (r) { return r.rid !== rid; }));
      return true;
    });
  }

  function readLocal(form) {
    if (!hasIDB()) {
      return Promise.resolve(lsAll().filter(function (r) { return r.form === form; }));
    }
    return openDB().then(function (db) {
      return new Promise(function (resolve) {
        var out = [];
        var tx = db.transaction(STORE, "readonly");
        var idx = tx.objectStore(STORE).index("form");
        idx.openCursor(IDBKeyRange.only(form)).onsuccess = function (ev) {
          var cur = ev.target.result;
          if (cur) { out.push(cur.value); cur.continue(); }
          else resolve(out);
        };
        tx.onerror = function () { resolve([]); };
      });
    }).catch(function () {
      idbBroken = true;
      return lsAll().filter(function (r) { return r.form === form; });
    });
  }

  function sortDesc(rows) {
    return rows.sort(function (a, b) {
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    });
  }

  var Store = {
    uid: uid,

    save: function (rec) {
      normalize(rec);
      return putLocal(rec).then(function () {
        return postRemote({ action: "save", record: rec }).then(function (res) {
          // 有沒有成功上雲，決定下次列表能不能被遠端刪除帶走
          if (res && res.ok) {
            rec.pendingSync = false;
            rec.syncedAt = new Date().toISOString();
          } else {
            rec.pendingSync = true;
          }
          return putLocal(rec).then(function () { return rec; });
        });
      });
    },

    list: function (form) {
      return readLocal(form).then(function (mine) {
        if (!remote()) return sortDesc(mine);
        return postRemote({ action: "list", form: form }).then(function (res) {
          // 後端不通：退回本機，避免整個歷史紀錄空白
          if (!res || !res.ok || !res.records) return sortDesc(mine);

          var byId = {};
          res.records.forEach(function (r) { byId[r.rid] = r; });

          // 雲端為準；只補上「離線新增、還沒上雲」的紀錄
          var pending = mine.filter(function (m) {
            return m.pendingSync === true && !byId[m.rid];
          });

          // 清掉本機殘留：雲端已不存在（別台刪掉）且不是待上傳的
          var stale = mine.filter(function (m) {
            return !byId[m.rid] && m.pendingSync !== true;
          });
          stale.forEach(function (m) { dropLocal(m.rid); });

          return sortDesc(res.records.concat(pending));
        });
      });
    },

    remove: function (rid) {
      return postRemote({ action: "delete", rid: rid }).then(function (res) {
        // 沒設後端＝純本機；有設但刪除失敗就別動本機，避免各裝置資料不一致
        if (remote() && !(res && res.ok)) return false;
        return dropLocal(rid).then(function () { return true; });
      });
    },

    // 手動清除本機快取（換裝置、資料異常時用）
    purge: function (form) {
      return readLocal(form).then(function (rows) {
        return Promise.all(rows.map(function (r) { return dropLocal(r.rid); }))
          .then(function () { return rows.length; });
      });
    }
  };

  window.ISOStore = Store;
})();
