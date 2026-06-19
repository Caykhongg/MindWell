import { traceable } from 'langsmith/traceable';
import { Client } from 'langsmith';

const client = (() => {
  try {
    const apiKey = process.env.LANGSMITH_API_KEY || process.env.LANGCHAIN_API_KEY;
    if (!apiKey) return null;
    return new Client({ apiUrl: 'https://api.smith.langchain.com' });
  } catch {
    return null;
  }
})();

export function trace<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: { name?: string; metadata?: Record<string, unknown> } = {}
): T {
  if (!client) return fn;

  return traceable(fn, {
    ...options,
    client,
    project_name: process.env.LANGSMITH_PROJECT || 'mindwell',
  }) as unknown as T;
}

export function getTracingClient(): Client | null {
  return client;
}
