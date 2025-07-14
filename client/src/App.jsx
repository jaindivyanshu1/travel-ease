import { useEffect } from "react";
import useGeolocation from "./hooks/useGeolocation";
import { saveLogToDB, getUnsyncedLogs, clearDB, deleteLogsByTimestamps } from "./utils/db";
import { syncLogs } from "./utils/api";
import CanvasMap from "./components/CanvasMap";
import LazyLogList from "./components/LazyLogList";
import MapView from "./components/MapView";

function App() {
  const location = useGeolocation(true);

  // Save geolocation to IndexedDB
  useEffect(() => {
    if (location) {
      const log = {
        ...location,
        note: '',
        syncedFrom: 'client',
        pathIndex: 0,
        createdAt: new Date().toISOString(),
      };
      saveLogToDB(log);
      console.log("📍 Location saved to IndexedDB:", log);
    }
  }, [location]);

  // Sync on reconnect
  useEffect(() => {
    const handleSync = async () => {
      const logs = await getUnsyncedLogs();
      console.log("<<>>-1");
      if (logs.length > 0) {
        console.log("<<>>-2");
        try {
          const res = await syncLogs(logs);
          const syncedTimestamps = logs.map((log) => log.timestamp);
          await deleteLogsByTimestamps(syncedTimestamps); // flush only synced
          console.log(`✅ Synced ${logs.length} logs and cleared local copy`);
        } catch (err) {
          console.error("❌ Sync failed:", err);
        }
      }
    };

    // Manual trigger on mount (dev only)
    handleSync();

    window.addEventListener("online", handleSync);
    return () => window.removeEventListener("online", handleSync);
  }, []);

  useEffect(() => {
    const loopedSync = () => {
      const run = async () => {
        const logs = await getUnsyncedLogs();
        if (logs.length === 0) return;

        try {
          await syncLogs(logs);
          const syncedTimestamps = logs.map((log) => log.timestamp);
          await deleteLogsByTimestamps(syncedTimestamps);
          console.log("🔁 Periodic background sync");
        } catch (err) {
          console.warn("❌ Periodic sync error:", err.message);
        }
      };

      run();
    };

    const interval = setInterval(() => {
      if (navigator.scheduler?.postTask) {
        navigator.scheduler.postTask(loopedSync, { priority: 'background' });
      } else if ('requestIdleCallback' in window) {
        requestIdleCallback(loopedSync, { timeout: 5000 });
      } else {
        loopedSync();
      }
    }, 60 * 1000); // Every 60 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-800">TravelEase 🌍</h1>
      <MapView />
      <LazyLogList />
    </div>
  );
}

export default App;
