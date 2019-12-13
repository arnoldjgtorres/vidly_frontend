import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      className="form-control my-3"
      type="text"
      placeholder="Search"
      aria-label="Search"
      value={value}
      onChange={e => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBar;
