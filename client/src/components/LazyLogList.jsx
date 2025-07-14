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
    <div className="w-full max-w-xl mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">📌 Journey Timeline</h2>
      <ol className="relative border-l border-blue-400">
        {visibleLogs.map((log, i) => (
          <li key={log.timestamp} className="ml-4 mb-6">
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white" />
            <time className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</time>
            <p className="text-base font-medium text-gray-800">
              📍 Lat: {log.lat.toFixed(4)}, Lng: {log.lng.toFixed(4)}
            </p>
          </li>
        ))}
      </ol>
      <div ref={lastRef} className="h-8" />
    </div>
  );
}
