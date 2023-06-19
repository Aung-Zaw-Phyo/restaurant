import React from "react";

const MenuInput = () => {
  return (
    <div className="col-lg-6 mx-auto mb-3">
      <h5 className="text-center">Search The Menu</h5>
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Enter the menu name"
      />
    </div>
  );
};

export default MenuInput;
