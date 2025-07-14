import { useEffect, useRef, useState } from "react";
import { fetchLogs } from "../utils/api";

export default function LazyLogList() {
  const [logs, setLogs] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const lastRef = useRef(null);

  useEffect(() => {
    fetchLogs().then((res) => {
      setLogs(res.data || []);
      setVisibleLogs(res.data.slice(0, 5));
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleLogs.length < logs.length) {
          const next = logs.slice(0, visibleLogs.length + 5);
          setVisibleLogs(next);
        }
      },
      { threshold: 1.0 }
    );

    if (lastRef.current) observer.observe(lastRef.current);
    return () => observer.disconnect();
  }, [logs, visibleLogs]);

  return (
    <div className="w-full max-w-xl mt-6 space-y-2">
      {visibleLogs.map((log, i) => (
        <div key={log.timestamp} className="bg-white p-2 rounded shadow text-sm">
          📍 Lat: {log.lat.toFixed(4)}, Lng: {log.lng.toFixed(4)}
          <br />
          🕒 {new Date(log.timestamp).toLocaleString()}
        </div>
      ))}
      <div ref={lastRef} className="h-8" />
    </div>
  );
}
