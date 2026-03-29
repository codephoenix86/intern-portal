import api from "@/lib/axios";
import type { JobCard, JobListQuery } from "@/services/studentPortal.service";

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

async function unwrap<T>(p: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await p;
  return data.data;
}

function jobQueryParams(q: JobListQuery): string {
  const p = new URLSearchParams();
  if (q.keyword) p.set("keyword", q.keyword);
  if (q.location) p.set("location", q.location);
  if (q.skills) p.set("skills", q.skills);
  if (q.sort) p.set("sort", q.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const listPublicJobs = (query: JobListQuery = {}) =>
  unwrap<{ jobs: JobCard[] }>(
    api.get(`/public/jobs${jobQueryParams(query)}`),
  );

export const getPublicJob = (jobId: string) =>
  unwrap<{ job: JobCard }>(api.get(`/public/jobs/${jobId}`));
