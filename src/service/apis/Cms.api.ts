import api from "../httpsCall";
import { CmsListResponse, CmsResponse, CmsPayload } from "../../types/cmsTypes";

const CmsApi = {
  getAll: (): Promise<CmsListResponse> =>
    api.get("/cms"),

  getByType: (type: string): Promise<CmsResponse> =>
    api.get(`/cms/${type}`),

  create: (data: CmsPayload): Promise<CmsResponse> =>
    api.post("/cms", data),

  update: (id: string, data: CmsPayload): Promise<CmsResponse> =>
    api.put(`/cms/${id}`, data),

  delete: (id: string): Promise<{ code: number; success: boolean; message: string }> =>
    api.delete(`/cms/${id}`),
};

export default CmsApi;
