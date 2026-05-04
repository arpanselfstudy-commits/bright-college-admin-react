export interface DayTiming {
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
}

export interface ShopTiming {
  monday: DayTiming;
  tuesday: DayTiming;
  wednesday: DayTiming;
  thursday: DayTiming;
  friday: DayTiming;
  saturday: DayTiming;
  sunday: DayTiming;
}

export interface ShopContactDetails {
  email: string;
  phoneNo: string;
}

export interface Shop {
  _id: string;
  name: string;
  shopId: string;
  type: string;
  location: string;
  distance?: string;
  photo?: string;
  photos?: string[];
  poster?: string;
  topItems?: string[];
  allItems?: string[];
  contactDetails: ShopContactDetails;
  shopTiming: ShopTiming;
}

export interface ShopsListResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    shops: Shop[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface ShopResponse {
  code: number;
  success: boolean;
  message: string;
  data: Shop;
}

export interface ShopListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type CreateShopPayload = Omit<Shop, "shopId">;
export type UpdateShopPayload = Shop;
