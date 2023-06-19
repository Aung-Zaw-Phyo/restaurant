import React, { useRef } from "react";
import * as helper from "../../../api/helper";
import classes from "./SelectedTableInfo.module.css";
import MyDocument from "./PDF";
import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";

const SelectedTableInfo = (props) => {
  const messageHandler = (e) => {
    props.onMessageHandler(e.target.value);
  };

  return (
    <div
      className={`${classes["table-info"]} p-2`}
      style={{ right: props.showTableInfo ? "0" : "-370px" }}
    >
      {/* <div className='text-danger text-center mb-2'>Order created successfully.</div> */}
      {props.orders.length > 0 ? (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">
                  Price <small>(MMK)</small>
                </th>
                <th scope="col">Quantity</th>
                <th scope="col">
                  Tol Price <small>(MMK)</small>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.price}</td>
                  <td>
                    <div className={classes["count-action"]}>
                      {order._id ? (
                        order.add_quantity <=
                        props.onGetOriginalQuantity(order._id) ? (
                          <span>
                            <i
                              onClick={() =>
                                helper.warning("This menu is not reduce!")
                              }
                              className={`${classes.disabled} fa-solid fa-minus`}
                            ></i>
                          </span>
                        ) : (
                          <span>
                            <i
                              onClick={() =>
                                props.onControlQuantity(
                                  "reduce",
                                  order.food_id,
                                  true
                                )
                              }
                              className="fa-solid fa-minus"
                            ></i>
                          </span>
                        )
                      ) : (
                        <span>
                          <i
                            onClick={() =>
                              props.onControlQuantity("reduce", order.food_id)
                            }
                            className="fa-solid fa-minus"
                          ></i>
                        </span>
                      )}

                      <span className={classes.count}>
                        {order.quantity + order.add_quantity}
                      </span>
                      <span>
                        <i
                          onClick={() =>
                            order._id
                              ? props.onControlQuantity(
                                  "add",
                                  order.food_id,
                                  true
                                )
                              : props.onControlQuantity("add", order.food_id)
                          }
                          className="fa-solid fa-plus"
                        ></i>
                      </span>
                    </div>
                  </td>
                  <td>{order.total_price}</td>
                </tr>
              ))}

              <tr>
                <td colSpan="2" className="fw-bold">
                  Total Cost
                </td>
                <td colSpan="2" className="fw-bold">
                  {props.totalCost} <small>MMK</small>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mb-3">
            <textarea
              rows={"3"}
              onChange={messageHandler}
              className="from-control w-100 p-2"
            ></textarea>
          </div>
          {props.orders[0]._id ? (
            <div>
              {props.updateStatus ? (
                <button
                  className="btn w-100"
                  onClick={props.onSubmitUpdateOrder}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn w-100"
                  onClick={props.onSubmitUpdateOrder}
                  disabled
                >
                  Update
                </button>
              )}
              {props.updateOrder.table_id.status == "finish" ? (
                <button className="btn w-100 mt-2" onClick={props.onDone}>
                  Done
                </button>
              ) : null}
              {props.updateOrder.table_id.status == "finish" ? (
                <PDFDownloadLink
                  className="text-light btn w-100 mt-2 text-decoration-none"
                  document={
                    <MyDocument
                      orders={props.orders}
                      totalCost={props.totalCost}
                    />
                  }
                  fileName="chillie.pdf"
                >
                  ExportPDF
                </PDFDownloadLink>
              ) : null}
            </div>
          ) : (
            <button className="btn w-100" onClick={props.onSubmitOrder}>
              Submit
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SelectedTableInfo;
