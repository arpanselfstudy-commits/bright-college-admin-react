import api from "../httpsCall";
import {
  JobsListResponse,
  JobResponse,
  JobListParams,
  CreateJobPayload,
  UpdateJobPayload,
} from "../../types/jobTypes";

const JobApi = {
  getJobs: (params: JobListParams): Promise<JobsListResponse> =>
    api.get("/jobs", { params }),

  getJob: (id: string): Promise<JobResponse> =>
    api.get(`/jobs/${id}`),

  createJob: (data: CreateJobPayload): Promise<JobResponse> =>
    api.post("/jobs", data),

  updateJob: (id: string, data: UpdateJobPayload): Promise<JobResponse> =>
    api.put(`/jobs/${id}`, data),

  deleteJob: (id: string): Promise<{ code: number; success: boolean; message: string }> =>
    api.delete(`/jobs/${id}`),
};

export default JobApi;
