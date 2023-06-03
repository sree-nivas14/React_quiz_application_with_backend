import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter, setFilter);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 400); //it waits for 400 milli sec after typing
  return (
    <span>
      <input
        placeholder="Filter table..."
        className="form-control border-secondary"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </span>
  );
};

export default GlobalFilter;
