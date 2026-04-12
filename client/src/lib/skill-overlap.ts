export function normalizeSkill(value: string): string {
  return value.trim().toLowerCase();
}

export function enrolledSkillsFromRows(skillsLists: string[][]): Set<string> {
  const set = new Set<string>();
  for (const list of skillsLists) {
    for (const s of list) {
      set.add(normalizeSkill(s));
    }
  }
  return set;
}

/** True when at least one job skill appears in the learner's enrolled course skills */
export function jobHasEnrolledSkillOverlap(
  jobSkills: string[],
  enrolledSkills: Set<string>,
): boolean {
  if (jobSkills.length === 0 || enrolledSkills.size === 0) return false;
  return jobSkills.some((s) => enrolledSkills.has(normalizeSkill(s)));
}

export function countJobsMatchingCourseSkills(
  jobSkills: string[],
  jobs: { skills: string[] }[],
): number {
  if (jobSkills.length === 0) return 0;
  const want = new Set(jobSkills.map(normalizeSkill));
  return jobs.filter((job) =>
    job.skills.some((s) => want.has(normalizeSkill(s))),
  ).length;
}
