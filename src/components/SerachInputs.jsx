import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchInputs({ handleSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const savedSearchTerm = localStorage.getItem("searchTerm") || "";

  const [searchTerm, setSearchTerm] = useState(savedSearchTerm);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    localStorage.setItem("searchTerm", value);
    handleSearch(value);
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="search-inputs">
      <input
        type="text"
        placeholder="Qidiruv..."
        value={searchTerm}
        onChange={handleChange}
      />
      <i className="fas fa-search"></i>
    </div>
  );
}

export default SearchInputs;
