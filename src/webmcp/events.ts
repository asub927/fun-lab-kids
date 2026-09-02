export type AgentEventType =
  | "route_changed"
  | "check_completed"
  | "board_updated"
  | "celebration_shown"
  | "revision_pending"
  | "guiding_question_shown"
  | "confirm_requested"
  | "confirm_resolved"
  | "question_advanced";

export type AgentEvent = {
  id: string;
  type: AgentEventType;
  at: number;
  payload: Record<string, unknown>;
};

const MAX_EVENTS = 40;
const events: AgentEvent[] = [];
const listeners = new Set<(event: AgentEvent) => void>();

export function emitAgentEvent(type: AgentEventType, payload: Record<string, unknown> = {}): AgentEvent {
  const event: AgentEvent = {
    id: crypto.randomUUID(),
    type,
    at: Date.now(),
    payload,
  };
  events.unshift(event);
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
  for (const listener of listeners) listener(event);
  return event;
}

export function getRecentAgentEvents(limit = 20, since?: number): AgentEvent[] {
  const capped = Math.max(1, Math.min(limit, MAX_EVENTS));
  return events
    .filter((event) => (since == null ? true : event.at > since))
    .slice(0, capped);
}

export function subscribeAgentEvents(listener: (event: AgentEvent) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test helper */
export function clearAgentEvents(): void {
  events.length = 0;
}
