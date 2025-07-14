import { useEffect, useState } from "react";

export default function useGeolocation(enable = true) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!enable || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        };
        setPosition(coords);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enable]);

  return position;
}
