import express  from "express";
const vendorRoutes = express.Router();
import { bulkImportProducts, createProduct, getProducts, updateProduct } from "../../controller/vendor.controller/product.Controller.js";
import authMiddleware from "../../middlewares/vendor.middlewares/authMiddlewares.js";
import { createOrder, getOrders } from "../../controller/vendor.controller/order.Controller.js";
import { getDashboardStats } from "../../controller/vendor.controller/dashboard.Controller.js";



// Dashboard Data details fethced 
vendorRoutes.get("/dashboard/data",authMiddleware,getDashboardStats);     // Create product Data
// Dashboard Data details fethced End 


// Product Section Started Here
vendorRoutes.post("/product/add",authMiddleware,createProduct);     // Create product Data
vendorRoutes.post("/product/import",authMiddleware,bulkImportProducts);     // Create product Data in Bulk
vendorRoutes.get("/product/get",authMiddleware,getProducts);        // Get List by user
vendorRoutes.put('/product/update/:id', authMiddleware, updateProduct); //update product
// Product Section End Here

// Order Section Started 
vendorRoutes.post("/orders/create",authMiddleware,createOrder)
vendorRoutes.get("/orders/get",authMiddleware,getOrders)
// Order Section End


export default vendorRoutes;
 