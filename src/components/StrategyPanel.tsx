export type StrategyPanelProps = {
  title: string;
  steps: string[];
  sourceLabel?: string;
  sourceUrl?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoProvider?: string;
  layout?: "accordion" | "rail";
};

export function parseStrategyParams(params: Record<string, unknown>) {
  const title = typeof params.strategy === "string" ? params.strategy : "";
  const steps = Array.isArray(params.strategySteps) ? (params.strategySteps as string[]) : [];
  const source =
    params.strategySource && typeof params.strategySource === "object"
      ? (params.strategySource as { label?: string; url?: string })
      : null;
  const videoUrl = typeof params.videoUrl === "string" ? params.videoUrl : undefined;
  const videoTitle = typeof params.videoTitle === "string" ? params.videoTitle : undefined;
  const videoProvider = typeof params.videoProvider === "string" ? params.videoProvider : undefined;

  return {
    title,
    steps,
    sourceLabel: source?.label,
    sourceUrl: source?.url,
    videoUrl,
    videoTitle,
    videoProvider,
    panelKey: `${title}::${steps[0] ?? ""}`,
  };
}

export function hasStrategyContent(props: Pick<StrategyPanelProps, "title" | "steps">): boolean {
  return Boolean(props.title && props.steps.length > 0);
}

function StrategyPanelBody({
  title,
  steps,
  sourceLabel,
  sourceUrl,
  videoUrl,
  videoTitle,
  videoProvider,
}: StrategyPanelProps) {
  return (
    <>
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
          ▶ {videoProvider?.includes("Storyline") ? "Listen to a story" : "Watch lesson"}: {videoTitle}
        </a>
      )}
    </>
  );
}

export function StrategyPanel({
  title,
  steps,
  sourceLabel,
  sourceUrl,
  videoUrl,
  videoTitle,
  videoProvider,
  layout = "accordion",
}: StrategyPanelProps) {
  if (!hasStrategyContent({ title, steps })) return null;

  if (layout === "rail") {
    return (
      <details className="strategy-panel strategy-panel--rail" aria-label={`Strategy: ${title}`}>
        <summary className="strategy-rail-summary">
          <span className="strategy-rail-summary-copy">
            <span className="strategy-summary-text">How to solve this</span>
            <span className="strategy-rail-hint">Tap for steps</span>
          </span>
          <span className="strategy-summary-chevron" aria-hidden="true" />
        </summary>
        <div className="strategy-panel-body strategy-panel-body--rail">
          <StrategyPanelBody
            title={title}
            steps={steps}
            sourceLabel={sourceLabel}
            sourceUrl={sourceUrl}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            videoProvider={videoProvider}
          />
        </div>
      </details>
    );
  }

  return (
    <details className="strategy-panel" aria-label={`Strategy: ${title}`}>
      <summary className="strategy-summary">
        <span className="strategy-summary-text">How to solve this</span>
        <span className="strategy-summary-chevron" aria-hidden="true" />
      </summary>
      <div className="strategy-panel-body">
        <StrategyPanelBody
          title={title}
          steps={steps}
          sourceLabel={sourceLabel}
          sourceUrl={sourceUrl}
          videoUrl={videoUrl}
          videoTitle={videoTitle}
          videoProvider={videoProvider}
        />
      </div>
    </details>
  );
}

export function StrategyFromParams({
  params,
  layout = "accordion",
}: {
  params: Record<string, unknown>;
  layout?: "accordion" | "rail";
}) {
  const parsed = parseStrategyParams(params);

  return (
    <StrategyPanel
      key={parsed.panelKey}
      title={parsed.title}
      steps={parsed.steps}
      sourceLabel={parsed.sourceLabel}
      sourceUrl={parsed.sourceUrl}
      videoUrl={parsed.videoUrl}
      videoTitle={parsed.videoTitle}
      videoProvider={parsed.videoProvider}
      layout={layout}
    />
  );
}
