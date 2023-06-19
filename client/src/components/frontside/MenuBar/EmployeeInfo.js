import React from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config";
import * as helper from "../../../api/helper";

const EmployeeInfo = () => {
    const navigate = useNavigate();
    const logout = () => {
      helper.logout();
      navigate("/login");
    };
  return (
    <>
      <div
        className="modal fade"
        id="view_profile"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-center">
              <h5 className="modal-title text-center" id="exampleModalLabel">
                Profile Information
              </h5>
              {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" /> */}
            </div>
            <div className="modal-body">
              <div className="employee_information">
                <div className="img text-center mb-3">
                  <img src={config.URL + helper.getCookie().profile} alt="" />
                </div>
                <div className="d-flex justify-content-between px-3">
                  <p className="mb-0">Name</p>
                  <p className="mb-0">{helper.getCookie().name}</p>
                </div>
                <hr />
                <div className="d-flex justify-content-between mt-2 px-3">
                  <p className="mb-0">Phone number</p>
                  <p className="mb-0">{helper.getCookie().phone}</p>
                </div>
                <hr />
                <div className="d-flex justify-content-between mt-2 px-3">
                  <p className="mb-0">Role</p>
                  <p className="mb-0">{helper.getCookie().role_name}</p>
                </div>
                <hr />
                <div className="d-flex justify-content-between mt-2 px-3">
                  <p className="mb-0">Address</p>
                  <p className="mb-0">{helper.getCookie().address}</p>
                </div>
                <hr />

                <div className="mt-3">
                  <div
                    className="card border-0 p-3"
                    data-bs-toggle="modal"
                    href="#profile_logout"
                  >
                    <div className="d-flex justify-content-between">
                      <div className="mb-0">Logout</div>
                      <div className="mb-0">
                        <i className="fa-solid fa-right-from-bracket"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="profile_logout"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <div className="mb-3 ">
                <img
                  className="comfirm_msg_icon"
                  src="/images/warning_message.svg"
                  alt=""
                />
              </div>
              <h4>Are you sure you want to logout?</h4>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn me-3"
                  data-bs-target="#view_profile"
                  data-bs-toggle="modal"
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfo;
