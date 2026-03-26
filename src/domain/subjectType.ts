export const SubjectType = {
  JOB: "JOB",
  EXECUTOR: "EXECUTOR",
} as const;

export type SubjectType = (typeof SubjectType)[keyof typeof SubjectType];

export function parseSubjectType(value: string | undefined): SubjectType | null {
  if (value === SubjectType.JOB || value === SubjectType.EXECUTOR) {
    return value;
  }
  return null;
}
