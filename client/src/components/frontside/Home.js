import React, { useContext, useEffect, useState } from "react";
import { TableInfo } from "./store/TableInfo";
import * as helper from "../../api/helper";
import axios from "axios";
import { config } from "./../../config";
import io from "socket.io-client";

import noti from "../../assets/noti.mp3";
import MenuBar from "./MenuBar/MenuBar";
import TableInput from "./SearchInput/TableInput";
import MenuInput from "./SearchInput/MenuInput";
import Tables from "./Tables/Tables";
import Foods from "./Foods/Foods";
import SelectedTableInfo from "./SelectedTableInfo/SelectedTableInfo";
let notisound = new Audio(noti);
let socket;

const Home = (props) => {
  const { showTableInfo, setShowTableInfo } = useContext(TableInfo);
  const [searchInput, setSearchInput] = useState(false);
  const [foods, setFoods] = useState(null);
  const [tables, setTables] = useState(null);
  const { currentTable, setCurrentTable } = props;
  const [message, setMessage] = useState("");

  const [orders, setOrders] = useState([]); // orders of only table
  const [updateOrder, setUpdateOrder] = useState(null); // to take order's id especially!
  const [updateStatus, setUpdateStatus] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const ENDPT = "http://localhost:5000";
  useEffect(() => {
    socket = io(ENDPT);
    socket.on("send_finish_order", (data) => {
      // get tables
      console.log(data.tables, data.orders);
      setTables(data.tables);
      if (updateOrder) {
        const order = data.orders.find((single) => {
          console.log(single._id, updateOrder._id);
          return single._id == updateOrder._id;
        });
        console.log("============= ", order);
        setUpdateOrder(order);
        setOrders(order.items);
      }
      notisound.play();
    });
  }, [updateOrder]);

  useEffect(() => {
    axios
      .get(`${config.URL}/table`, {
        headers: {
          Authorization: `Bearer ${helper.getCookie().token}`,
        },
      })
      .then((result) => {
        const tables = result.data.tables;
        setTables(tables);
      })
      .catch((error) => {
        console.log(error.response);
      });

    axios
      .get(`${config.URL}/food`, {
        headers: {
          Authorization: `Bearer ${helper.getCookie().token}`,
        },
      })
      .then((result) => {
        const foods = result.data.foods;
        setFoods(foods);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  useEffect(() => {
    let toco = 0;
    for (let i = 0; i < orders.length; i++) {
      toco += parseInt(orders[i].total_price);
    }
    setTotalCost(toco);
  }, [orders]);

  const createOrder = async (food) => {
    if (!currentTable) {
      helper.warning("Please choose the table before.");
      return;
    }
    const isExist = orders.find((order) => order.food_id === food._id);
    if (isExist) {
      helper.warning("This menu is already taken.");
      return;
    }
    setUpdateStatus(true);

    const order = {
      food_id: food._id,
      name: food.name,
      price: food.price,
      quantity: 1,
      total_price: food.price,
      add_quantity: 0,
    };
    await setOrders([...orders, order]);
  };

  const controlQuantity = (action, id, update = false) => {
    if (action === "add") {
      const newOrders = orders.filter((order) => {
        if (order.food_id === id) {
          const limit_quantity = foods.find((food) => food._id === id).quantity;
          let reach_quantity = 0;
          if (update) {
            const original_limit_quantity = updateOrder.items.find(
              (itm) => itm._id === order._id
            );
            reach_quantity =
              order.add_quantity - original_limit_quantity.add_quantity;
          } else {
            reach_quantity = order.quantity + order.add_quantity;
          }

          if (update) {
            if (limit_quantity <= reach_quantity) {
              helper.warning("This menu is not enough!");
              return order;
            } else {
              order.add_quantity += 1;
              order.total_price =
                (order.quantity + order.add_quantity) * order.price;
              setUpdateStatus(true);
              return order;
            }
          } else {
            if (!(limit_quantity > reach_quantity)) {
              helper.warning("This menu is not enough!");
              return order;
            } else {
              order.quantity += 1;
              order.total_price =
                (order.quantity + order.add_quantity) * order.price;
              return order;
            }
          }
        } else {
          return order;
        }
      });
      setOrders(newOrders);
    } else if (action === "reduce") {
      const newOrders = orders.filter((order) => {
        if (order.food_id === id) {
          if (0 == order.quantity && !update && order.add_quantity == 0) {
          } else {
            update ? (order.add_quantity -= 1) : (order.quantity -= 1);
            order.total_price =
              (order.quantity + order.add_quantity) * order.price;
            if (0 !== order.quantity) {
              return order;
            }
          }
        } else {
          return order;
        }
      });
      setOrders(newOrders);
      if (updateOrder && updateOrder.items.length < newOrders.length) {
        setUpdateStatus(true);
      } else if (update) {
        let status = false;
        for (let i = 0; i < newOrders.length; i++) {
          const order = newOrders[i];
          const original_order = updateOrder.items.find(
            (item) => item._id == order._id
          );
          order.add_quantity > original_order.add_quantity || status
            ? (status = true)
            : (status = false);
        }
        setUpdateStatus(status);
      }
    }
  };

  const getOriginalQuantity = (id) => {
    //order._id
    let originalItem = updateOrder.items.find((itm) => itm._id === id);
    return originalItem.add_quantity;
  };

  const submitOrder = () => {
    for (let i = 0; i < orders.length; i++) {
      let order = orders[i];
      const limit_quantity = foods.find(
        (food) => food._id === order.food_id
      ).quantity;
      if (limit_quantity < order.quantity) {
        helper.warning("This menu is not enough!");
        return;
      }
    }

    let table_id = tables.find((table) => table.code === currentTable)._id;
    axios({
      method: "post",
      url: `${config.URL}/order/create`,
      data: { items: orders, table_id: table_id },
      headers: {
        Authorization: `Bearer ${helper.getCookie().token}`,
      },
    })
      .then(async (result) => {
        const data = result.data;
        console.log(data);
        setFoods(data.foods);
        setTables(data.tables);
        setOrders(data.orders.items);
        setUpdateOrder(data.updateOrder);
        setUpdateStatus(false);
        socket.emit("create_order", data.orders);
      })
      .catch((error) => console.log("error__", error));
  };

  const submitUpdateOrder = () => {
    axios({
      method: "put",
      url: `${config.URL}/order/update/` + updateOrder._id,
      data: { items: orders },
      headers: {
        Authorization: `Bearer ${helper.getCookie().token}`,
      },
    })
      .then(async (result) => {
        const data = result.data;
        console.log(data);
        setFoods(data.foods);
        setTables(data.tables);
        setOrders(data.orders.items);
        setUpdateOrder(data.updateOrder);
        setUpdateStatus(false);
        socket.emit("update_order", "updated order!");
      })
      .catch((error) => console.log("error__", error));
  };

  const showCurrentTable = (table, status) => {
    setCurrentTable(table.code);
    if (status === "active") {
      axios({
        method: "get",
        url: `${config.URL}/order/get_by_table_id/` + table._id,
        headers: {
          Authorization: `Bearer ${helper.getCookie().token}`,
        },
      })
        .then(async (result) => {
          const data = result.data;
          setOrders(data.order.items);
          setUpdateOrder(data.updateOrder);
          console.log(data.updateOrder);
          setUpdateStatus(false);
        })
        .catch((error) => console.log("error__", error));
    } else {
      console.log(status);
      setOrders([]);
      setUpdateOrder(null);
    }
  };

  const done = () => {
    axios({
      method: "post",
      url: `${config.URL}/order/done/` + updateOrder._id,
      headers: {
        Authorization: `Bearer ${helper.getCookie().token}`,
      },
    })
      .then(async (result) => {
        const data = result.data;
        console.log(data);
        setTables(result.data.tables);
        setOrders([]);
        setUpdateOrder(null);
        socket.emit("done", "already done!");
      })
      .catch((error) => console.log("error__", error));
  };

  const searchInputHandler = () => {
    setSearchInput((prevState) => !prevState);
  };

  const messageHandler = (message) => {
    setMessage(message)
  }

  return (
    <div>
      <div className="container py-5">
        <MenuBar onSearchInputHandler={searchInputHandler} />

        <SelectedTableInfo
          orders={orders}
          showTableInfo={showTableInfo}
          onGetOriginalQuantity={getOriginalQuantity}
          onControlQuantity={controlQuantity}
          totalCost={totalCost}
          onMessageHandler={messageHandler}
          updateStatus={updateStatus}
          onSubmitUpdateOrder={submitUpdateOrder}
          updateOrder={updateOrder}
          onSubmitOrder={submitOrder}
          onDone={done}
        />

        <div>
          {searchInput && <TableInput />}
          {tables ? (
            <Tables tables={tables} onShowTable={showCurrentTable} />
          ) : (
            <div className="text-danger text-center text-muted fs-3 my-5">
              Oops, something went wrong.
            </div>
          )}
        </div>
        <div className=" mt-5">
          {searchInput && <MenuInput />}

          {foods && <Foods foods={foods} onCreateOrder={createOrder} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
