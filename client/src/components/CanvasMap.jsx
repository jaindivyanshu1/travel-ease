import { useEffect, useRef } from "react";
import { fetchLogs } from "../utils/api";

export default function CanvasMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    async function drawPath() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const { data } = await fetchLogs();

      if (!data || data.length === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#1e40af"; // blue
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Map latitude/longitude to canvas coordinates (simple scaling)
      const minLat = Math.min(...data.map(p => p.lat));
      const minLng = Math.min(...data.map(p => p.lng));

      const scale = 10000;

      data.forEach((point, i) => {
        const x = (point.lng - minLng) * scale;
        const y = (point.lat - minLat) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
    }

    drawPath();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className="bg-white border border-gray-300 rounded shadow"
    />
  );
}
