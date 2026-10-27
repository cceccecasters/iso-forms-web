/* 表單紀錄儲存層
 * 本機用 IndexedDB（不支援時退回 localStorage），若 config.js 設了 REMOTE_URL
 * 則同時寫入遠端，列表時合併遠端資料。
 */
(function () {
  "use strict";

  var DB_NAME = "isoforms";
  var DB_VER = 1;
  var STORE = "records";
  var LS_KEY = "iso:records";
  var dbPromise = null;

  function hasIDB() {
    try { return !!window.indexedDB; } catch (e) { return false; }
  }

  var idbBroken = false;
  var repairing = false;

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

  var remote = function () {
    var url = (window.ISO_CONFIG || {}).remoteUrl || "";
    return url;
  };

  function postRemote(payload) {
    var url = remote();
    if (!url) return Promise.resolve(null);
    return fetch(url, {
      method: "POST",
      // text/plain 避免 Apps Script 的 CORS 預檢被擋
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).catch(function () { idbBroken = true; return null; });
  }

  var Store = {
    uid: uid,

    save: function (rec) {
      normalize(rec);
      var local = hasIDB()
        ? openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
              var tx = db.transaction(STORE, "readwrite");
              tx.objectStore(STORE).put(rec);
              tx.oncomplete = function () { resolve(true); };
              tx.onerror = function () { reject(tx.error); };
            });
          }).catch(function () { idbBroken = true; return null; })
        : Promise.resolve(null);

      return local.then(function (ok) {
        if (ok === null) {
          var list = lsAll().filter(function (r) { return r.rid !== rec.rid; });
          list.push(rec);
          lsWrite(list);
        }
        return postRemote({ action: "save", record: rec }).then(function () { return rec; });
      });
    },

    list: function (form) {
      var local = hasIDB()
        ? openDB().then(function (db) {
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
          }).catch(function () { idbBroken = true; return null; })
        : Promise.resolve(null);

      return local.then(function (rows) {
        var mine = rows === null ? lsAll().filter(function (r) { return r.form === form; }) : rows;
        if (!remote()) return sortDesc(mine);
        return postRemote({ action: "list", form: form }).then(function (res) {
          var merged = mine.slice();
          if (res && res.records) {
            res.records.forEach(function (r) {
              var hit = merged.filter(function (m) { return m.rid === r.rid; })[0];
              if (!hit) merged.push(r);
              else if ((r.updatedAt || "") > (hit.updatedAt || "")) Object.assign(hit, r);
            });
          }
          return sortDesc(merged);
        });
      });
    },

    remove: function (rid) {
      var local = hasIDB()
        ? openDB().then(function (db) {
            return new Promise(function (resolve) {
              var tx = db.transaction(STORE, "readwrite");
              tx.objectStore(STORE).delete(rid);
              tx.oncomplete = function () { resolve(true); };
              tx.onerror = function () { resolve(false); };
            });
          }).catch(function () { return false; })
        : Promise.resolve(false);

      return local.then(function (ok) {
        if (!ok) lsWrite(lsAll().filter(function (r) { return r.rid !== rid; }));
        return postRemote({ action: "delete", rid: rid }).then(function () { return true; });
      });
    }
  };

  function sortDesc(rows) {
    return rows.sort(function (a, b) {
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    });
  }

  window.ISOStore = Store;
})();
