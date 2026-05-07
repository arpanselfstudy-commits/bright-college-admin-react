import { Dialog, DialogContent } from "@mui/material";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import FormField from "../../Common/form/FormField";
import CustomButton from "../../Common/custombutton/CustomButton";
import RichTextEditor from "../../Common/RichTextEditor/RichTextEditor";
import useCmsForm, { CMS_TYPES } from "./useCmsForm";
import { CmsItem } from "../../../types/cmsTypes";

interface CmsFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editItem?: CmsItem | null;
}

const CmsFormModal = ({ open, onClose, onSaved, editItem }: CmsFormModalProps) => {
  const { formMethods, loading, isEdit, setValue, onSubmit } = useCmsForm(() => {
    onSaved();
    onClose();
  }, editItem);

  const { register, watch, formState: { errors } } = formMethods;
  const content = watch("content");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      slotProps={{
        paper: { className: "modal-paper" },
      }}
    >
      {/* Header */}
      <div className="modal-header">
        <h3 className="modal-header-title">
          {isEdit ? "Edit CMS Item" : "Create CMS Item"}
        </h3>
        <button type="button" onClick={onClose} className="modal-close-btn">
          <IoCloseOutline size={20} />
        </button>
      </div>

      <DialogContent className="modal-dialog-content">
        <form onSubmit={onSubmit} className="form-main">

          <div className="grid grid-cols-2 gap-4">
            {/* Type select */}
            <div className="form-group mb-5">
              <label htmlFor="cms-type" className="block font-semibold mb-1 label-colr">
                Type <span className="mandatory-icon">*</span>
              </label>
              <select
                id="cms-type"
                {...register("type")}
                className="form-control w-full"
                disabled={isEdit}
              >
                {CMS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type.message}</div>}
            </div>

            {/* Title */}
            <FormField
              label="Title"
              name="title"
              placeholder="e.g. Terms & Conditions"
              required
              register={register("title")}
              error={errors.title?.message}
            />
          </div>

          {/* Active toggle */}
          <div className="form-group mb-5 toggle-field">
            <label className="font-semibold label-colr toggle-field-label">Active</label>
            <label className="toggle-label">
              <input type="checkbox" {...register("isActive")} className="toggle-input" />
              <span className={`toggle-track${watch("isActive") ? " toggle-track--on" : ""}`}>
                <span className={`toggle-thumb${watch("isActive") ? " toggle-thumb--on" : ""}`} />
              </span>
            </label>
          </div>

          {/* Rich text editor */}
          <RichTextEditor
            label="Content"
            required
            value={content}
            onChange={(val) => setValue("content", val, { shouldValidate: true, shouldDirty: true })}
            error={errors.content?.message}
            minHeight={280}
          />

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="modal-cancel-btn">
              Cancel
            </button>
            <CustomButton
              label={loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create")}
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

export default CmsFormModal;
