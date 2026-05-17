/**
 * ReadmeForge - Local-First Data Engine
 * Complete browser-side persistence layer utilizing IndexedDB, LocalPreferences,
 * LocalAnalytics, Multi-Tab Sync Broadcast tunnels, and backup recovery pipelines.
 * 
 * Zero backend. Zero cloud trackers. 100% privacy-first.
 */

// ====================================================
// 1. TYPINGS & SYSTEM SCHEMAS
// ====================================================

export interface ReadmeSectionField {
  key: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "tags"
    | "steps"
    | "features"
    | "api-endpoints"
    | "env-vars"
    | "install-tabs"
    | "roadmap-timeline"
    | "faq-accordion"
    | "hero-banner-editor";
  value: any;
  placeholder: string;
}

export interface ReadmeSection {
  id: string;
  title: string;
  enabled: boolean;
  collapsed: boolean;
  fields: ReadmeSectionField[];
}

export interface LocalWorkspace {
  id: string;
  name: string;
  description: string;
  template: string;
  sections: ReadmeSection[];
  readmeTheme: string;
  healthScore: number;
  lastEdited: string;
  isPinned: boolean;
  isArchived: boolean;
  exportsCount: number;
  collaborators: string[];
}

export interface LocalSnapshot {
  id: string;
  workspaceId: string;
  label: string;
  timestamp: string;
  sections: ReadmeSection[];
}

export interface LocalExport {
  id: string;
  workspaceId: string;
  workspaceName: string;
  filename: string;
  format: "md" | "zip" | "html" | "pdf";
  timestamp: string;
  sizeBytes: number;
  content: string; // Stored compiled GFM text
}

export interface LocalSnippet {
  id: string;
  name: string;
  category: string;
  fields: ReadmeSectionField[];
  timestamp: string;
}

export interface LocalPreference {
  key: string;
  value: any;
}

export interface LocalMetric {
  event: string;
  count: number;
  lastTriggered: string;
}

export interface LocalActivityLog {
  id: string;
  type: "save" | "export" | "snapshot" | "preferences" | "security" | "analytics";
  message: string;
  timestamp: string;
}

// ====================================================
// 2. BROADCAST CHANNEL FOR MULTI-TAB SYNCHRONIZATION
// ====================================================
let tabSyncChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined") {
  try {
    tabSyncChannel = new BroadcastChannel("readmeforge_tab_sync");
  } catch (err) {
    console.warn("BroadcastChannel not supported in this browser:", err);
  }
}

export function broadcastStateChange(type: string, payload: any) {
  if (tabSyncChannel) {
    tabSyncChannel.postMessage({ type, payload, originTab: window.name || "tab-main" });
  }
}

export function registerTabSyncListener(callback: (event: any) => void) {
  if (tabSyncChannel) {
    tabSyncChannel.onmessage = (event) => callback(event.data);
  }
}

// ====================================================
// 3. INDEXEDDB SETUP & INITIALIZATION
// ====================================================
const DB_NAME = "ReadmeForgeDB";
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);
    if (typeof window === "undefined") return reject(new Error("IndexedDB is client-side only"));

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      // Workspaces Object Store
      if (!db.objectStoreNames.contains("workspaces")) {
        const workspaceStore = db.createObjectStore("workspaces", { keyPath: "id" });
        workspaceStore.createIndex("isPinned", "isPinned", { unique: false });
        workspaceStore.createIndex("isArchived", "isArchived", { unique: false });
      }

      // Snapshots Object Store
      if (!db.objectStoreNames.contains("snapshots")) {
        const snapshotStore = db.createObjectStore("snapshots", { keyPath: "id" });
        snapshotStore.createIndex("workspaceId", "workspaceId", { unique: false });
      }

      // Exports Object Store
      if (!db.objectStoreNames.contains("exports")) {
        const exportStore = db.createObjectStore("exports", { keyPath: "id" });
        exportStore.createIndex("workspaceId", "workspaceId", { unique: false });
      }

      // Snippets Object Store
      if (!db.objectStoreNames.contains("snippets")) {
        db.createObjectStore("snippets", { keyPath: "id" });
      }

      // Preferences Store
      if (!db.objectStoreNames.contains("preferences")) {
        db.createObjectStore("preferences", { keyPath: "key" });
      }

      // Local Analytics Store
      if (!db.objectStoreNames.contains("analytics")) {
        db.createObjectStore("analytics", { keyPath: "event" });
      }

      // Local Activity Logs Store
      if (!db.objectStoreNames.contains("activityLogs")) {
        const logStore = db.createObjectStore("activityLogs", { keyPath: "id" });
        logStore.createIndex("type", "type", { unique: false });
      }
    };

    request.onsuccess = (event: any) => {
      dbInstance = event.target.result;
      resolve(dbInstance!);
    };

    request.onerror = (event: any) => {
      reject(event.target.error || new Error("Failed to open IndexedDB"));
    };
  });
}

// ====================================================
// 4. DATA OPS (CRUD CONTROLLERS WITH TAB BROADCASTS)
// ====================================================

function getStore(storeName: string, mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> {
  return initDB().then((db) => {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  });
}

// Workspaces
export function dbSaveWorkspace(ws: LocalWorkspace): Promise<void> {
  return getStore("workspaces", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.put(ws);
      req.onsuccess = () => {
        broadcastStateChange("WORKSPACE_UPDATED", { wsId: ws.id });
        dbLogActivity("save", `Workspace '${ws.name}' saved to IndexedDB.`);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbLoadWorkspaces(): Promise<LocalWorkspace[]> {
  return getStore("workspaces", "readonly").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbDeleteWorkspace(wsId: string): Promise<void> {
  return getStore("workspaces", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.delete(wsId);
      req.onsuccess = () => {
        broadcastStateChange("WORKSPACE_DELETED", { wsId });
        dbLogActivity("security", `Workspace ID ${wsId} permanently deleted.`);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
}

// Snapshots
export function dbSaveSnapshot(snap: LocalSnapshot): Promise<void> {
  return getStore("snapshots", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.put(snap);
      req.onsuccess = () => {
        dbLogActivity("snapshot", `Version snapshot '${snap.label}' registered.`);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbLoadSnapshots(wsId: string): Promise<LocalSnapshot[]> {
  return getStore("snapshots", "readonly").then((store) => {
    return new Promise((resolve, reject) => {
      const index = store.index("workspaceId");
      const req = index.getAll(IDBKeyRange.only(wsId));
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbDeleteSnapshot(snapId: string): Promise<void> {
  return getStore("snapshots", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.delete(snapId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

// Exports Registry
export function dbSaveExport(exp: LocalExport): Promise<void> {
  return getStore("exports", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.put(exp);
      req.onsuccess = () => {
        dbLogActivity("export", `Compiled file '${exp.filename}' logged in registry.`);
        dbIncrementMetric("total_exports");
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbLoadExports(): Promise<LocalExport[]> {
  return getStore("exports", "readonly").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbDeleteExport(expId: string): Promise<void> {
  return getStore("exports", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.delete(expId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

// Snippets
export function dbSaveSnippet(snip: LocalSnippet): Promise<void> {
  return getStore("snippets", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.put(snip);
      req.onsuccess = () => {
        dbLogActivity("save", `Snippet blueprint '${snip.name}' saved.`);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbLoadSnippets(): Promise<LocalSnippet[]> {
  return getStore("snippets", "readonly").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbDeleteSnippet(snipId: string): Promise<void> {
  return getStore("snippets", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.delete(snipId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

// User Preferences
export function dbSavePreference(key: string, value: any): Promise<void> {
  return getStore("preferences", "readwrite").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.put({ key, value });
      req.onsuccess = () => {
        broadcastStateChange("PREFERENCE_UPDATED", { key, value });
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbLoadPreferences(): Promise<Record<string, any>> {
  return getStore("preferences", "readonly").then((store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const prefs: Record<string, any> = {};
        (req.result || []).forEach((p: any) => {
          prefs[p.key] = p.value;
        });
        resolve(prefs);
      };
      req.onerror = () => reject(req.error);
    });
  });
}

// ====================================================
// 5. LOCAL-ONLY PRIVACY METRICS & ACTIVITY TIMELINE
// ====================================================
export function dbIncrementMetric(event: string): Promise<void> {
  return getStore("analytics", "readwrite").then((store) => {
    return new Promise((resolve) => {
      const getReq = store.get(event);
      getReq.onsuccess = () => {
        const curr = getReq.result || { event, count: 0 };
        curr.count += 1;
        curr.lastTriggered = new Date().toLocaleTimeString();
        store.put(curr).onsuccess = () => resolve();
      };
      getReq.onerror = () => resolve();
    });
  });
}

export function dbLoadMetrics(): Promise<LocalMetric[]> {
  return getStore("analytics", "readonly").then((store) => {
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  });
}

export function dbLogActivity(type: LocalActivityLog["type"], message: string): Promise<void> {
  const log: LocalActivityLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    message,
    timestamp: new Date().toLocaleTimeString()
  };
  return getStore("activityLogs", "readwrite").then((store) => {
    return new Promise((resolve) => {
      store.put(log).onsuccess = () => resolve();
      // Enforce log queue size ceiling of 100 entries for self-cleanup
      store.count().onsuccess = (ev: any) => {
        if (ev.target.result > 100) {
          store.openCursor().onsuccess = (curEv: any) => {
            const cursor = curEv.target.result;
            if (cursor) {
              store.delete(cursor.primaryKey);
            }
          };
        }
      };
    });
  });
}

export function dbLoadActivityLogs(): Promise<LocalActivityLog[]> {
  return getStore("activityLogs", "readonly").then((store) => {
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).reverse().slice(0, 50));
      req.onerror = () => resolve([]);
    });
  });
}

// ====================================================
// 6. LOCAL FUZZY SEARCH INDEXING
// ====================================================
export function localFuzzySearch(workspaces: LocalWorkspace[], query: string): LocalWorkspace[] {
  if (!query.trim()) return workspaces;
  const q = query.toLowerCase();

  return workspaces
    .map((ws) => {
      let score = 0;
      if (ws.name.toLowerCase().includes(q)) score += 10;
      if (ws.description.toLowerCase().includes(q)) score += 5;
      if (ws.template.toLowerCase().includes(q)) score += 2;

      // search inside fields
      ws.sections.forEach((sec) => {
        if (sec.title.toLowerCase().includes(q)) score += 3;
        sec.fields.forEach((f) => {
          if (typeof f.value === "string" && f.value.toLowerCase().includes(q)) {
            score += 1;
          }
        });
      });

      return { ws, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((match) => match.ws);
}

// ====================================================
// 7. COMPRESSION & BACKUP EXPORT/IMPORT PIPELINES
// ====================================================

// Simple XOR encryption mask just to serve as private storage serialization base
const SECRET_SALT = 84;
function encryptData(text: string): string {
  return Array.from(text)
    .map((c) => String.fromCharCode(c.charCodeAt(0) ^ SECRET_SALT))
    .join("");
}

export function dbExportBackup(): Promise<string> {
  const backupData: Record<string, any> = {};

  return Promise.all([
    dbLoadWorkspaces(),
    dbLoadSnippets(),
    dbLoadPreferences(),
    dbLoadMetrics(),
    dbLoadActivityLogs()
  ]).then(([workspaces, snippets, prefs, metrics, logs]) => {
    backupData.workspaces = workspaces;
    backupData.snippets = snippets;
    backupData.preferences = prefs;
    backupData.metrics = metrics;
    backupData.logs = logs;
    backupData.exportedAt = new Date().toISOString();
    backupData.clientSignature = "ReadmeForge_4.0_Local_Payload";

    const json = JSON.stringify(backupData);
    return encryptData(json);
  });
}

export function dbImportBackup(encryptedPayload: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const decrypted = encryptData(encryptedPayload);
      const data = JSON.parse(decrypted);

      if (data.clientSignature !== "ReadmeForge_4.0_Local_Payload") {
        return reject(new Error("Invalid backup file format or encryption signature."));
      }

      // Sync stores
      initDB().then((db) => {
        const tx = db.transaction(["workspaces", "snippets", "preferences"], "readwrite");

        // Clear and reload workspaces
        const wsStore = tx.objectStore("workspaces");
        wsStore.clear();
        (data.workspaces || []).forEach((ws: any) => wsStore.put(ws));

        // Clear and reload snippets
        const snipStore = tx.objectStore("snippets");
        snipStore.clear();
        (data.snippets || []).forEach((snip: any) => snipStore.put(snip));

        // Preferences
        const prefStore = tx.objectStore("preferences");
        Object.entries(data.preferences || {}).forEach(([key, val]) => {
          prefStore.put({ key, value: val });
        });

        tx.oncomplete = () => {
          broadcastStateChange("BACKUP_RESTORED", {});
          dbLogActivity("security", "Local-first backup database fully restored.");
          resolve();
        };

        tx.onerror = () => reject(new Error("IndexedDB transaction write conflict."));
      });
    } catch (err) {
      reject(new Error("Failed to unpack backup. Payload might be corrupted."));
    }
  });
}

export function dbClearAllStorage(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    initDB().then((db) => {
      const stores = Array.from(db.objectStoreNames);
      const tx = db.transaction(stores, "readwrite");
      stores.forEach((storeName) => tx.objectStore(storeName).clear());
      tx.oncomplete = () => {
        broadcastStateChange("STORAGE_RESET", {});
        resolve();
      };
    });
  });
}
