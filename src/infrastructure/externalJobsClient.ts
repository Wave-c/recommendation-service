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
    const res = await fetch(this.url("/api/tasks"), { method: "GET" });
    if (!res.ok) throw new Error("не удалось найти задачи");
    const data: unknown = await res.json();
    return Array.isArray(data) ? data : [];
  }

  /** Отфильтрованный список задач (те же поля, что и у `/api/tasks`, включая `technologies`). */
  async listFilteredTasks(): Promise<JobsRawItem[]> {
    const res = await fetch(this.url("/api/tasks/filtered"), { method: "GET" });
    if (!res.ok) throw new Error("не удалось найти задачи");
    const data: unknown = await res.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      const o = data as Record<string, unknown>;
      if (Array.isArray(o.items)) return o.items as JobsRawItem[];
      if (Array.isArray(o.tasks)) return o.tasks as JobsRawItem[];
      if (Array.isArray(o.data)) return o.data as JobsRawItem[];
    }
    return [];
  }
}

export function createJobsClient(): HttpJobsClient | null {
  const raw = process.env.JOBS_SERVICE_BASE_URL?.trim();
  if (!raw) return null;
  return new HttpJobsClient(raw);
}
