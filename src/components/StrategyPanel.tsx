type StrategyPanelProps = {
  title: string;
  steps: string[];
  sourceLabel?: string;
  sourceUrl?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoProvider?: string;
};

export function StrategyPanel({
  title,
  steps,
  sourceLabel,
  sourceUrl,
  videoUrl,
  videoTitle,
  videoProvider,
}: StrategyPanelProps) {
  if (!title || steps.length === 0) return null;

  return (
    <details className="strategy-panel" aria-label={`Strategy: ${title}`}>
      <summary className="strategy-summary">
        <span className="strategy-summary-text">How to solve this</span>
        <span className="strategy-summary-chevron" aria-hidden="true" />
      </summary>
      <div className="strategy-panel-body">
        <h2 className="strategy-title">{title}</h2>
        {sourceLabel && sourceUrl && (
          <p className="strategy-source">
            Source:{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceLabel}
            </a>
          </p>
        )}
        <ol className="strategy-steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {videoUrl && videoTitle && (
          <a
            className="btn secondary strategy-video"
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶ {videoProvider?.includes("Storyline") ? "Listen to a story" : "Watch lesson"}:{" "}
            {videoTitle}
          </a>
        )}
      </div>
    </details>
  );
}

export function StrategyFromParams({ params }: { params: Record<string, unknown> }) {
  const title = typeof params.strategy === "string" ? params.strategy : "";
  const steps = Array.isArray(params.strategySteps) ? (params.strategySteps as string[]) : [];
  const source =
    params.strategySource && typeof params.strategySource === "object"
      ? (params.strategySource as { label?: string; url?: string })
      : null;
  const videoUrl = typeof params.videoUrl === "string" ? params.videoUrl : undefined;
  const videoTitle = typeof params.videoTitle === "string" ? params.videoTitle : undefined;
  const videoProvider = typeof params.videoProvider === "string" ? params.videoProvider : undefined;

  const panelKey = `${title}::${steps[0] ?? ""}`;

  return (
    <StrategyPanel
      key={panelKey}
      title={title}
      steps={steps}
      sourceLabel={source?.label}
      sourceUrl={source?.url}
      videoUrl={videoUrl}
      videoTitle={videoTitle}
      videoProvider={videoProvider}
    />
  );
}
