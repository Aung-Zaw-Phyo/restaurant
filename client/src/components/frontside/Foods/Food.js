import React from "react";
import { config } from "../../../config";
import classes from "./Food.module.css";

const Food = (props) => {
  return (
    <div className="col-lg-4 col-xl-3">
      <div className={`${classes.item}`}>
        <div className={`${classes["menu-img"]}`}>
          <img
            src={props.food.image ? config.URL + props.food.image : null}
            alt=""
          />
          <div className={classes.price}>
            {props.food.price} <small>MMK</small>
          </div>
        </div>
        <div className={`${classes.content}`}>
          <div className="d-flex justify-content-between mb-3">
            <div className={classes.name}>{props.food.name}</div>
            <div>
              <span className="badge badge-pill badge-light text-dark">
                {props.food.quantity}
              </span>
            </div>
          </div>
          <button onClick={() => props.onOrder(props.food)}>
            <i className="fa-solid fa-cart-shopping cart me-2"></i>
            ORDER
          </button>
        </div>
      </div>
    </div>
    // <tr>
    //   <th scope="row">{props.count}</th>
    //   <td></td>
    //   <td>
    //     <img
    //       className={classes["menu-img"]}
    //       src={props.food.image ? config.URL + props.food.image : null}
    //       alt=""
    //     />
    //   </td>
    //   <td>
    //     <div className={`${classes['badge--font-size']} badge bg-danger`}>{props.food.price}</div>
    //   </td>
    //   <td>
    //     <div className={`${classes['badge--font-size']} badge bg-danger`}>{props.food.quantity}</div>
    //   </td>
    //   <td>
    //     <i
    //       onClick={() => props.onOrder(props.food)}
    //       className="fa-solid fa-cart-shopping cart"
    //     ></i>
    //   </td>
    // </tr>
  );
};

export default Food;
