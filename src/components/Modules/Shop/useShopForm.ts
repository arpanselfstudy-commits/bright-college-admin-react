import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import ShopApi from "../../../service/apis/Shop.api";
import { Shop, CreateShopPayload, UpdateShopPayload, DayTiming } from "../../../types/shopTypes";

export interface ShopFormValues {
  name: string;
  type: string;
  location: string;
  distance: string;
  photo: string;
  poster: string;
  contactEmail: string;
  contactPhone: string;
  photos: string[];
  topItems: string[];
  allItems: string[];
  shopTiming: {
    monday: DayTiming;
    tuesday: DayTiming;
    wednesday: DayTiming;
    thursday: DayTiming;
    friday: DayTiming;
    saturday: DayTiming;
    sunday: DayTiming;
  };
}

const dayTimingSchema = Yup.object().shape({
  isOpen: Yup.boolean().default(false),
  opensAt: Yup.string().nullable(),
  closesAt: Yup.string().nullable(),
}) as any;

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Shop name is required"),
  type: Yup.string().trim().required("Shop type is required"),
  location: Yup.string().trim().required("Location is required"),
  distance: Yup.string().trim().required("Distance is required"),
  photo: Yup.string().trim(), // optional
  poster: Yup.string().trim(), // optional
  contactEmail: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Contact email is required"),
  contactPhone: Yup.string()
    .trim()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Contact phone is required"),
  photos: Yup.array().of(
    Yup.string()
      .trim()
      .test("url-or-empty", "Enter a valid URL (must start with http:// or https://)", (val) =>
        !val || /^https?:\/\/.+/.test(val)
      )
  ), // optional — but validated if provided
  topItems: Yup.array().of(Yup.string().trim()), // optional
  allItems: Yup.array()
    .of(Yup.string().trim().required("Item name cannot be empty"))
    .min(1, "At least one item is required"),
  shopTiming: Yup.object().shape({
    monday: dayTimingSchema,
    tuesday: dayTimingSchema,
    wednesday: dayTimingSchema,
    thursday: dayTimingSchema,
    friday: dayTimingSchema,
    saturday: dayTimingSchema,
    sunday: dayTimingSchema,
  }) as any,
});

const defaultDay: DayTiming = { isOpen: true, opensAt: "09:00", closesAt: "18:00" };
const defaultWeekend: DayTiming = { isOpen: false, opensAt: "", closesAt: "" };

const emptyDefaults: ShopFormValues = {
  name: "",
  type: "",
  location: "",
  distance: "",
  photo: "",
  poster: "",
  contactEmail: "",
  contactPhone: "",
  photos: [],
  topItems: [],
  allItems: [],
  shopTiming: {
    monday: defaultDay,
    tuesday: defaultDay,
    wednesday: defaultDay,
    thursday: defaultDay,
    friday: defaultDay,
    saturday: defaultWeekend,
    sunday: defaultWeekend,
  },
};

const shopToFormValues = (shop: Shop): ShopFormValues => ({
  name: shop.name || "",
  type: shop.type || "",
  location: shop.location || "",
  distance: shop.distance || "",
  photo: shop.photo || "",
  poster: shop.poster || "",
  contactEmail: shop.contactDetails?.email || "",
  contactPhone: shop.contactDetails?.phoneNo || "",
  photos: shop.photos || [],
  topItems: shop.topItems || [],
  allItems: shop.allItems || [],
  shopTiming: {
    monday: shop.shopTiming?.monday || defaultDay,
    tuesday: shop.shopTiming?.tuesday || defaultDay,
    wednesday: shop.shopTiming?.wednesday || defaultDay,
    thursday: shop.shopTiming?.thursday || defaultDay,
    friday: shop.shopTiming?.friday || defaultDay,
    saturday: shop.shopTiming?.saturday || defaultWeekend,
    sunday: shop.shopTiming?.sunday || defaultWeekend,
  },
});

const useShopForm = (onSuccess: () => void, editShop?: Shop | null) => {
  const [loading, setLoading] = useState(false);
  const isEdit = !!editShop;

  const formMethods = useForm<ShopFormValues>({
    defaultValues: editShop ? shopToFormValues(editShop) : emptyDefaults,
    resolver: yupResolver(schema) as any,
    mode: "onTouched",
  });

  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(editShop ? shopToFormValues(editShop) : emptyDefaults);
  }, [editShop]);

  const onSubmit: SubmitHandler<ShopFormValues> = async (data) => {
    setLoading(true);
    try {
      const base = {
        name: data.name,
        type: data.type,
        location: data.location,
        distance: data.distance,
        photo: data.photo || "",
        poster: data.poster || "",
        photos: data.photos.filter((p) => p.trim() !== ""),
        topItems: data.topItems.filter((t) => t.trim() !== ""),
        allItems: data.allItems.filter((a) => a.trim() !== ""),
        contactDetails: { email: data.contactEmail, phoneNo: data.contactPhone },
        shopTiming: data.shopTiming,
      };

      if (isEdit && editShop) {
        const payload: UpdateShopPayload = { ...base, _id: editShop._id };
        const res = await ShopApi.updateShop(editShop._id, payload);
        if (res.success) {
          toast.success("Shop updated successfully");
          reset(emptyDefaults);
          onSuccess();
        } else {
          toast.error(res.message || "Failed to update shop");
        }
      } else {
        const payload: CreateShopPayload = { ...base };
        const res = await ShopApi.createShop(payload);
        if (res.success) {
          toast.success("Shop created successfully");
          reset(emptyDefaults);
          onSuccess();
        } else {
          toast.error(res.message || "Failed to create shop");
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    formMethods,
    loading,
    isEdit,
    onSubmit: handleSubmit(onSubmit),
  };
};

export default useShopForm;
