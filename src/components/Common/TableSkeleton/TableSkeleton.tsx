import "./TableSkeleton.css";

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

const TableSkeleton = ({ rows = 8, columns }: TableSkeletonProps) => (
  <>
    {Array.from({ length: rows }).map((_, ri) => (
      <tr key={ri} className="skeleton-row">
        {Array.from({ length: columns }).map((_, ci) => (
          <td key={ci}>
            <span className="skeleton-cell" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
