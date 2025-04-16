require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  })
);
app.use(express.json()); // Middleware to parse JSON request bodies
let orders = [
  { id: 1, item: "Taco", quantity: 2, customer: "Alice" },
  { id: 2, item: "Burger", quantity: 1, customer: "Bob" },
  { id: 3, item: "Nachos", quantity: 1, customer: "Alice" },
];

app.get("/orderz", (req, res) => {
  res.json(orders);
});
// app.get("/orders/:id", (req, res) => {
//   const orderId = parseInt(req.params.id);
//   const order = orders.find(({ id }) => id === orderId);
//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404).json({ error: "Order not found" });
//   }
// });
app.get("/order/search", (req, res) => {
  const customerName = req.query.customer;
  console.log(customerName);
  const foodName = req.query.item;
  console.log(foodName);

  const filterOrders = (orders) => {
    if (customerName && foodName) {
      const filteredOrders = orders.filter(
        (order) => order.customer === customerName && order.item === foodName
      );
      return filteredOrders;
    } else if (customerName && !foodName) {
      const filteredOrders = orders.filter(
        (order) => order.customer === customerName
      );
      console.log(filteredOrders);
      return filteredOrders;
    } else if (!customerName && foodName) {
      const filteredOrders = orders.filter((order) => order.item === foodName);
      console.log(filteredOrders);
      return filteredOrders;
    }
    return orders;
  };
  const filteredOrders = filterOrders(orders);
  console.log(filteredOrders);
  if (filteredOrders.length > 0) {
    res.json(filteredOrders);
  } else {
    res.status(404).json({ error: "No orders found" });
  }
});

app.post("/orders", (req, res) => {
  console.log(req.body);
  const { item, quantity, customer } = req.body;
  const newOrder = {
    id: orders.length + 1,
    item,
    quantity,
    customer,
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});
app.put("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(({ id }) => id === orderId);
  if (orderIndex != -1) {
    const { item, quantity, customer } = req.body;
    orders[orderIndex] = { id: orderId, item, quantity, customer };
    res.json(orders[orderIndex]);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});
app.put("/delete/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(({ id }) => id === orderId);
  if (orderIndex != -1) {
    orders.splice(orderIndex, 1);
    res.status(204).json({ message: "Order deleted successfully" });
    for (let i = 0; i < orders.length; i++) {
      orders[i].id = i + 1;
    }
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
