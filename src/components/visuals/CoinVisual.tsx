type CoinVisualProps = {
  /** Human-readable coin list, e.g. "2 quarters, 1 dime, 3 pennies" */
  coins: string;
};

type CoinGroup = { label: string; value: number; count: number; short: string };

function parseCoins(coins: string): CoinGroup[] {
  const groups: CoinGroup[] = [];
  const patterns: Array<{ re: RegExp; label: string; value: number; short: string }> = [
    { re: /(\d+)\s+quarters?/i, label: "quarters", value: 25, short: "25¢" },
    { re: /(\d+)\s+dimes?/i, label: "dimes", value: 10, short: "10¢" },
    { re: /(\d+)\s+nickels?/i, label: "nickels", value: 5, short: "5¢" },
    { re: /(\d+)\s+penn(?:y|ies)/i, label: "pennies", value: 1, short: "1¢" },
  ];
  for (const p of patterns) {
    const m = coins.match(p.re);
    if (m) {
      groups.push({
        label: p.label,
        value: p.value,
        count: Number(m[1]),
        short: p.short,
      });
    }
  }
  return groups;
}

export function CoinVisual({ coins }: CoinVisualProps) {
  const groups = parseCoins(coins);

  return (
    <figure className="visual-board coin-visual" aria-label={`Coins: ${coins}`}>
      {groups.length === 0 ? (
        <p className="visual-caption">{coins}</p>
      ) : (
        <ul className="coin-rows">
          {groups.map((g) => (
            <li key={g.label} className="coin-row">
              <span className="coin-row-label">
                {g.count} {g.label}
              </span>
              <span className="coin-dots" aria-hidden="true">
                {Array.from({ length: Math.min(g.count, 8) }, (_, i) => (
                  <span key={i} className={`coin-dot coin-${g.label}`}>
                    {g.short}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
