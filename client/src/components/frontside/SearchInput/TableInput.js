import React from "react";

const TableInput = () => {
  return (
    <div className="col-lg-6 mx-auto mb-3">
      <h5 className="text-center">Search The Table</h5>
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Enter the table number ( 4 )"
      />
    </div>
  );
};

export default TableInput;
