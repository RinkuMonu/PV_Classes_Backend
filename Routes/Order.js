// routes/checkoutRoutes.js
import express from "express";


import authMiddleware from "../middleware/auth.js";
import { changeOrderStatus, checkout, getAllOrders, getOrderById } from "../Controllers/Order.js";



const checkoutRouter = express.Router();

checkoutRouter.post("/", authMiddleware, checkout);

checkoutRouter.get("/get-all", getAllOrders);

checkoutRouter.get("/:orderId", getOrderById);

checkoutRouter.put("/:orderId/status", changeOrderStatus);

export default checkoutRouter;
