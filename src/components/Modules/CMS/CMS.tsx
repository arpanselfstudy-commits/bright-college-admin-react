import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { IoAddOutline } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import dayjs from "dayjs";

import DataTable, { ColumnDef } from "../../Common/DataTable/DataTable";
import CmsFormModal from "./CmsFormModal";
import CustomButton from "../../Common/custombutton/CustomButton";
import useCmsList from "./useCmsList";
import { CmsItem } from "../../../types/cmsTypes";
import { CMS_TYPES } from "./useCmsForm";

const typeLabel = (type: string) =>
  CMS_TYPES.find((t) => t.value === type)?.label ?? type;

const CMS = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CmsItem | null>(null);

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item: CmsItem) => { setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const { items, loading, refresh } = useCmsList();

  const columns: ColumnDef<CmsItem>[] = [
    {
      key: "type",
      label: "Type",
      render: (row) => <span className="default-status req-submit">{typeLabel(row.type)}</span>,
    },
    { key: "title", label: "Title" },
    {
      key: "content",
      label: "Content Preview",
      render: (row) => {
        const text = row.content.replace(/<[^>]*>/g, "");
        return <span title={text}>{text.length > 60 ? text.slice(0, 60) + "…" : text}</span>;
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span className={`default-status ${row.isActive ? "req-submit" : "cancelled"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      render: (row) => dayjs(row.updatedAt).format("DD MMM YYYY"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="table-action">
          <ul>
            <li>
              <Tooltip title="Edit" placement="top" TransitionComponent={Zoom} arrow>
                <button
                  className="tbl-icon-btn tbl-icon-btn--primary"
                  onClick={() => openEdit(row)}
                >
                  <FiEdit2 size={17} />
                </button>
              </Tooltip>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboardholder">
      <DataTable<CmsItem>
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No CMS content found. Create your first page."
      />

      <CmsFormModal
        open={modalOpen}
        onClose={closeModal}
        onSaved={refresh}
        editItem={editItem}
      />
    </div>
  );
};

export default CMS;
