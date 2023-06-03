import React from "react";

const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <input
        className="form-control"
        placeholder="Filter columns..."
        value={filterValue || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
  );
};

export default ColumnFilter;
