import { hasWebMCP } from "../webmcp/register";

export function WebMCPBanner() {
  if (hasWebMCP()) return null;

  return (
    <div className="webmcp-banner" role="status" aria-live="polite">
      <strong>Agent tools unavailable.</strong> Open in ChatGPT&apos;s in-app browser or enable{" "}
      <a
        href="https://developer.chrome.com/docs/ai/webmcp"
        target="_blank"
        rel="noopener noreferrer"
      >
        WebMCP in Chrome
      </a>{" "}
      (<code translate="no">chrome://flags/#enable-webmcp-testing</code>). You can still play
      without an agent.
    </div>
  );
}
