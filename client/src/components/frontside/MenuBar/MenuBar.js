import React from "react";
import EmployeeInfo from "./EmployeeInfo";
import classes from './MenuBar.module.css'

const MenuBar = (props) => {
  return (
    <div>
      <div className={`${classes.quick}`}>
        <div className={`${classes.bar}`}>
          <div className={`${classes['quick-link']} ${classes['quick-link-1']}`}>
            <div className={`${classes.search}`} onClick={props.onSearchInputHandler}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div className={`${classes['quick-link']} ${classes['quick-link-2']}`}>
            <div className={`${classes.table} m-auto`}>
              <i className="fa-solid fa-message"></i>
            </div>
          </div>
          <div className={`${classes['quick-link']} ${classes['quick-link-3']}`}>
            <div
              className={classes.checkout}
              data-bs-target="#view_profile"
              data-bs-toggle="modal"
            >
              <i className="fa-solid fa-address-card"></i>
            </div>
          </div>
          <div className={classes['bar-menu']}>
            <i className="fa-solid fa-house"></i>
          </div>
        </div>
      </div>

      {/* View Employee Modal Component */}
        <EmployeeInfo/>
    </div>
  );
};

export default MenuBar;
