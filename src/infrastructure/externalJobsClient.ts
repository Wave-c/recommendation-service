export type JobsRawItem = unknown;

/**
 * jobs-service client.
 * Ничего не “мэпим” — возвращаем исходный JSON-массив как есть,
 * потому что фронту нужны все поля.
 */
export class HttpJobsClient {
  constructor(private readonly baseUrl: string) {}

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, "")}${path}`;
  }

  async listOpenJobs(): Promise<JobsRawItem[]> {
    const res = await fetch(this.url("/jobs/open"), { method: "GET" });
    if (!res.ok) throw new Error("не удалось найти задачи");
    const data: unknown = await res.json();
    return Array.isArray(data) ? data : [];
  }

  async listExecutorCandidates(): Promise<JobsRawItem[]> {
    const res = await fetch(this.url("/executors/candidates"), { method: "GET" });
    if (!res.ok) throw new Error("не удалось найти исполнителей");
    const data: unknown = await res.json();
    return Array.isArray(data) ? data : [];
  }
}

export function createJobsClient(): HttpJobsClient {
  const raw = process.env.JOBS_SERVICE_BASE_URL?.trim();
  if (!raw) throw new Error("JOBS_SERVICE_BASE_URL is not configured");
  return new HttpJobsClient(raw);
}
