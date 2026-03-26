import { SubjectType } from "../domain/subjectType";
import { scoreStackOverlap } from "../domain/recommendationScoring";
import type { HttpJobsClient, JobsRawItem } from "../infrastructure/externalJobsClient";
import type { HttpProfileClient, ProfileRaw } from "../infrastructure/httpProfileClient";

function extractStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((x): x is string => typeof x === "string");
  }
  return [];
}

function extractValuesArray(value: unknown): string[] {
  // Ожидаем OData-like структуру: { $id, $values: [ ... ] }
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (Array.isArray(v.$values)) {
      return extractStringArray(v.$values);
    }
  }
  // иногда просто приходит массив/строка
  if (typeof value === "string") return [value];
  return extractStringArray(value);
}

function extractTechnologiesForScoring(raw: JobsRawItem): string[] {
  const o = raw as Record<string, unknown>;
  const tech = o.technologies ?? o.stack ?? o.skills ?? o.specialization;
  return extractValuesArray(tech);
}

function extractProfileStack(profile: ProfileRaw): string[] {
  if (profile && typeof profile === "object") {
    const o = profile as Record<string, unknown>;
    const stack = o.stack;
    return extractStringArray(stack);
  }
  return [];
}

export class GetRecommendationsForMe {
  constructor(
    private readonly profiles: HttpProfileClient,
    private readonly jobs: HttpJobsClient,
  ) {}

  async execute(xUserId: string, xRoles: string, subjectType: SubjectType): Promise<JobsRawItem[]> {
    const profile = await this.profiles.getMe(xUserId, xRoles);
    if (!profile) {
      throw new Error("не удалось найти профиль");
    }

    const profileStack = extractProfileStack(profile);

    if (subjectType === SubjectType.JOB) {
      const jobs = await this.jobs.listOpenJobs();
      if (!jobs.length) {
        throw new Error("не удалось найти задачи");
      }

      const scored = jobs.map((job) => {
        const tags = extractTechnologiesForScoring(job);
        return {
          job,
          score: scoreStackOverlap(profileStack, tags).score,
        };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.map((x) => x.job);
    }

    const executors = await this.jobs.listExecutorCandidates();
    if (!executors.length) {
      throw new Error("не удалось найти исполнителей");
    }

    const scored = executors.map((ex) => {
      const tags = extractTechnologiesForScoring(ex);
      return {
        ex,
        score: scoreStackOverlap(profileStack, tags).score,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((x) => x.ex);
  }
}
