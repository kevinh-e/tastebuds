import { useEffect, useState } from "react";

export function ProgressBar({ startTime, duration }) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration * 1000 - elapsed);
      const ratio = remaining / (duration * 1000);
      setProgress(ratio);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  return (
    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
      <div
        className="h-full bg-green-500 transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
