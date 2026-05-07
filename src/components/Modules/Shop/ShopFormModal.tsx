import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import { IoAddOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";
import FormField from "../../Common/form/FormField";
import DatePickerField from "../../Common/DatePickerField/DatePickerField";
import CustomButton from "../../Common/custombutton/CustomButton";
import useShopForm from "./useShopForm";
import { Shop } from "../../../types/shopTypes";

interface ShopFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editShop?: Shop | null;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const sectionTitle = (text: string) => (
  <div className="section-title-divider">
    <span className="section-title-text">{text}</span>
  </div>
);

const ShopFormModal = ({ open, onClose, onSaved, editShop }: ShopFormModalProps) => {
  const { formMethods, loading, isEdit, onSubmit } = useShopForm(() => {
    onSaved();
    onClose();
  }, editShop);

  const { register, watch, setValue, formState: { errors } } = formMethods;

  const photos = watch("photos") || [];
  const topItems = watch("topItems") || [];
  const allItems = watch("allItems") || [];

  const [topItemInput, setTopItemInput] = React.useState("");
  const [allItemInput, setAllItemInput] = React.useState("");

  const addToArray = (field: "photos" | "topItems" | "allItems", current: string[]) =>
    setValue(field, [...current, ""], { shouldDirty: true });

  const updateArrayItem = (field: "photos" | "topItems" | "allItems", current: string[], index: number, value: string) => {
    const updated = [...current];
    updated[index] = value;
    setValue(field, updated, { shouldDirty: true });
  };

  const removeFromArray = (field: "photos" | "topItems" | "allItems", current: string[], index: number) =>
    setValue(field, current.filter((_, i) => i !== index), { shouldDirty: true });

  const handleAddTopItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && topItemInput.trim()) {
      e.preventDefault();
      setValue("topItems", [...topItems, topItemInput.trim()], { shouldDirty: true });
      setTopItemInput("");
    }
  };

  const handleAddAllItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && allItemInput.trim()) {
      e.preventDefault();
      setValue("allItems", [...allItems, allItemInput.trim()], { shouldDirty: true });
      setAllItemInput("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: { className: "modal-paper" },
      }}
    >
      {/* Sticky header */}
      <div className="modal-header">
        <h3 className="modal-header-title">
          {isEdit ? "Edit Shop" : "Create New Shop"}
        </h3>
        <button type="button" onClick={onClose} className="modal-close-btn">
          <IoCloseOutline size={20} />
        </button>
      </div>

      <DialogContent className="modal-dialog-content">
        <form onSubmit={onSubmit} className="form-main">

          {/* ── Basic Info ── */}
          {sectionTitle("Basic Info")}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Shop Name" name="name" placeholder="e.g. ABC Bookstore" required
              register={register("name")} error={errors.name?.message} />
            <FormField label="Shop Type" name="type" placeholder="e.g. Bookstore" required
              register={register("type")} error={errors.type?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Location" name="location" placeholder="e.g. 1st Floor, Main Campus" required
              register={register("location")} error={errors.location?.message} />
            <FormField label="Distance" name="distance" placeholder="e.g. 10m away" required
              register={register("distance")} error={errors.distance?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contact Email" name="contactEmail" type="email" placeholder="shop@example.com" required
              register={register("contactEmail")} error={errors.contactEmail?.message} />
            <FormField label="Contact Phone" name="contactPhone" type="text" placeholder="0123456789" required
              register={register("contactPhone")} error={errors.contactPhone?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Shop Cover Photo URL" name="photo" placeholder="https://example.com/cover.jpg"
              register={register("photo")} error={errors.photo?.message} />
            <FormField label="Poster Image URL" name="poster" placeholder="https://example.com/poster.jpg"
              register={register("poster")} error={errors.poster?.message} />
          </div>

          {/* ── Photos ── */}
          {sectionTitle("Shop Photos (optional)")}
          <div className="photos-list">
            {photos.map((_, index) => (
              <div key={index} className="photo-row">
                <div className="photo-row-inner">
                  <input
                    value={photos[index]}
                    onChange={(e) => updateArrayItem("photos", photos, index, e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="form-control photo-input"
                  />
                  <button type="button" onClick={() => removeFromArray("photos", photos, index)}
                    className="photo-remove-btn">
                    <IoTrashOutline size={15} />
                  </button>
                </div>
                {(errors.photos as any)?.[index]?.message && (
                  <span className="photo-error">
                    {(errors.photos as any)[index].message}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addToArray("photos", photos)}
            className="add-item-btn add-photo-btn">
            <IoAddOutline size={16} /> Add Photo URL
          </button>

          {/* ── Top Items ── */}
          {sectionTitle("Top Items")}
          <div className="tag-chips">
            {topItems.map((item, index) => (
              <span key={index} className="tag-chip">
                {item}
                <button type="button" onClick={() => removeFromArray("topItems", topItems, index)}
                  className="tag-chip-remove">
                  <IoCloseOutline size={15} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={topItemInput}
            onChange={(e) => setTopItemInput(e.target.value)}
            onKeyDown={handleAddTopItem}
            placeholder="Type item name and press Enter..."
            className="form-control tag-input"
          />

          {/* ── All Items ── */}
          {sectionTitle("All Items")}
          <div className="tag-chips">
            {allItems.map((item, index) => (
              <span key={index} className="tag-chip">
                {item}
                <button type="button" onClick={() => removeFromArray("allItems", allItems, index)}
                  className="tag-chip-remove">
                  <IoCloseOutline size={15} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={allItemInput}
            onChange={(e) => setAllItemInput(e.target.value)}
            onKeyDown={handleAddAllItem}
            placeholder="Type item name and press Enter... (required)"
            className="form-control tag-input tag-input--last"
          />
          {errors.allItems && (
            <div className="tag-error">
              {typeof errors.allItems.message === "string"
                ? errors.allItems.message
                : "At least one item is required"}
            </div>
          )}

          {/* ── Shop Timing ── */}
          {sectionTitle("Shop Timing")}
          <div className="shop-timing-list">
            {DAYS.map((day) => {
              const isOpen = watch(`shopTiming.${day}.isOpen`);
              return (
                <div key={day} className={`shop-timing-row${isOpen ? " shop-timing-row--open" : ""}`}>
                  {/* Day label + toggle */}
                  <div className="shop-timing-day">
                    <label className="shop-timing-toggle-label">
                      <input type="checkbox" {...register(`shopTiming.${day}.isOpen`)}
                        className="shop-timing-toggle-input"
                        onChange={(e) => setValue(`shopTiming.${day}.isOpen`, e.target.checked, { shouldDirty: true })}
                        checked={!!isOpen}
                      />
                      <span className={`shop-timing-track${isOpen ? " shop-timing-track--on" : ""}`}>
                        <span className={`shop-timing-thumb${isOpen ? " shop-timing-thumb--on" : ""}`} />
                      </span>
                    </label>
                    <span className="shop-timing-day-name">{day}</span>
                  </div>

                  {/* Status */}
                  <span className={`shop-timing-status${isOpen ? " shop-timing-status--open" : ""}`}>
                    {isOpen ? "Open" : "Closed"}
                  </span>

                  {/* Opens At */}
                  <div className="shop-timing-time-group">
                    <label>Opens At</label>
                    <input type="time" {...register(`shopTiming.${day}.opensAt`)} disabled={!isOpen}
                      className={`form-control shop-timing-time-input${!isOpen ? " shop-timing-time-input--disabled" : ""}`} />
                  </div>

                  {/* Closes At */}
                  <div className="shop-timing-time-group">
                    <label>Closes At</label>
                    <input type="time" {...register(`shopTiming.${day}.closesAt`)} disabled={!isOpen}
                      className={`form-control shop-timing-time-input${!isOpen ? " shop-timing-time-input--disabled" : ""}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="modal-cancel-btn">
              Cancel
            </button>
            <CustomButton
              label={loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Shop")}
              variant="contained"
              type="submit"
              disabled={loading}
              icon={<IoAddOutline size={16} />}
            />
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShopFormModal;
