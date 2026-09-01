type ClockVisualProps = {
  time: string; // "H:MM" or "HH:MM"
};

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(":").map((n) => Number(n));
  return {
    hour: Number.isFinite(h) ? h : 12,
    minute: Number.isFinite(m) ? m : 0,
  };
}

export function ClockVisual({ time }: ClockVisualProps) {
  const { hour, minute } = parseTime(time);
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;

  return (
    <figure className="visual-board clock-visual" aria-label="Analog clock">
      <svg viewBox="0 0 200 200" role="img">
        <title>Analog clock showing a time to read</title>
        <circle cx="100" cy="100" r="88" className="clock-face" />
        <circle cx="100" cy="100" r="82" className="clock-face-inner" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = ((i + 1) / 12) * 2 * Math.PI - Math.PI / 2;
          const x = 100 + 68 * Math.cos(angle);
          const y = 100 + 68 * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} className="clock-num" textAnchor="middle" dominantBaseline="middle">
              {i + 1}
            </text>
          );
        })}
        {/* minute hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 58 * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={100 - 58 * Math.cos((minuteAngle * Math.PI) / 180)}
          className="clock-hand clock-hand-minute"
        />
        {/* hour hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 38 * Math.sin((hourAngle * Math.PI) / 180)}
          y2={100 - 38 * Math.cos((hourAngle * Math.PI) / 180)}
          className="clock-hand clock-hand-hour"
        />
        <circle cx="100" cy="100" r="5" className="clock-pin" />
      </svg>
    </figure>
  );
}
