import api from "../httpsCall";
import {
  ShopsListResponse,
  ShopResponse,
  ShopListParams,
  CreateShopPayload,
  UpdateShopPayload,
} from "../../types/shopTypes";

const ShopApi = {
  getShops: (params: ShopListParams): Promise<ShopsListResponse> =>
    api.get("/shops", { params }),

  getShop: (id: string): Promise<ShopResponse> =>
    api.get(`/shops/${id}`),

  createShop: (data: CreateShopPayload): Promise<ShopResponse> =>
    api.post("/shops", data),

  updateShop: (id: string, data: UpdateShopPayload): Promise<ShopResponse> =>
    api.put(`/shops/${id}`, data),

  deleteShop: (id: string): Promise<{ code: number; success: boolean; message: string }> =>
    api.delete(`/shops/${id}`),
};

export default ShopApi;
