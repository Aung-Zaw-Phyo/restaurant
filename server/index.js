const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./config/connectDb");
const path = require("path");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(http);

const Table = require("./models/table_model");
const Order = require("./models/order_model");

io.on("connection", (socket) => {
  socket.on("create_order", (data) => {
    socket.broadcast.emit("send_created_order", data);
  });

  socket.on("finish_order", async (data) => {
    const tables = await Table.find();
    const orders = await Order.find({ status: true }).populate([
      { path: "table_id", select: "code status" },
      { path: "chef", select: "name" },
    ]);
    socket.broadcast.emit("send_finish_order", {
      tables: tables,
      orders: orders,
    });
  });

  socket.on("update_order", async (data) => {
    const orders = await Order.find({ status: true }).populate([
      { path: "table_id", select: "code status" },
      { path: "chef", select: "name" },
    ]);
    socket.broadcast.emit("send_update_order", orders);
  });

  socket.on("done", async (data) => {
    const orders = await Order.find({ status: true }).populate([
      { path: "table_id", select: "code status" },
      { path: "chef", select: "name" },
    ]);
    socket.broadcast.emit("send_done", orders);
  });
});

const cors = require("cors");

mongoose.set("strictQuery", true);

connectDb();

app.use(cors());
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is here ........" });
});
const uploadedFiles = express.static(path.join(__dirname, "uploads"));
app.use("/uploads", uploadedFiles);
app.use("/employee", require("./routes/employee_route"));
app.use("/food", require("./routes/food_route"));
app.use("/table", require("./routes/table_route"));
app.use("/order", require("./routes/order_route"));

app.use("/*", (req, res) => {
  res.status(404).send("Not Found");
});

const errorHandler = require("./middleware/errorHandler");
const table_model = require("./models/table_model");

app.use(errorHandler);

http.listen(port, () => console.log("Server is running on: ", port));
