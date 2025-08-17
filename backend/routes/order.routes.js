import express from 'express'
import authUser from '../middleware/authUser.js'
import { getAllOrders, getUserOrders, placeOnlineOrder, placeOrderCOD} from '../controller/orderController.js'

const orderRouter=express.Router()

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post("/online", placeOnlineOrder);

orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/orders', authUser, getAllOrders);


export default orderRouter

