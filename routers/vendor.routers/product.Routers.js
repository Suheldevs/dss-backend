import express  from "express";
const vendorRoutes = express.Router();
import { bulkImportProducts, createProduct, getProducts, updateProduct } from "../../controller/vendor.controller/product.Controller.js";
import authMiddleware from "../../middlewares/vendor.middlewares/authMiddlewares.js";
// import { createOrder, getOrders } from "../../controller/vendor.controller/order.Controller.js";
import { getDashboardStats } from "../../controller/vendor.controller/dashboard.Controller.js";
import { uploadProfileImage } from "../../middlewares/vendor.middlewares/uploadMiddlewares.js";
import { createVendorProfile, updateVendorProfile, updateVendorProfileImage } from "../../controller/vendor.controller/profiledata.Controller.js";
import { createCustomerProfile, getCustomerProfiles } from "../../controller/vendor.controller/customers.Controller.js";
import { createInvoice, getInvoices, getNextInvoiceNumber, updateInvoicePayment } from "../../controller/vendor.controller/invoice.Controller.js";
import { createOrUpdateInvoiceDraft, deleteInvoiceDraft, getInvoiceDraftById, getInvoiceDrafts } from "../../controller/vendor.controller/invoiceDrafts.Controller.js";
import { createCategory, getCategories, updateCategory } from "../../controller/vendor.controller/productCategories.Controller.js";
import { addBank, getBanks } from "../../controller/vendor.controller/bankDetails.Controller.js";




// Memory storage for cloudinary upload
// import multer from "multer";
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

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
// vendorRoutes.post("/orders/create",authMiddleware,createOrder)
// vendorRoutes.get("/orders/get",authMiddleware,getOrders)
// Order Section End

// Updating Vendor Profile-Management-Data Start.
// vendorRoutes.post("/profile/update", upload.fields([
//     { name: "photo", maxCount: 1 },
//     { name: "contract", maxCount: 1 }
//   ]),createUserProfile)

// Updating Vendor Profile-Management-Data End.



// Vendor Profile Area code Start 
// Create Profile
vendorRoutes.post("/profile/create",uploadProfileImage.fields([{ name: "profileImage", maxCount: 1 },{ name: "contractForm", maxCount: 1 },]),createVendorProfile);

// Update Profile
vendorRoutes.put(
  "/profile/update/:userId",
  uploadProfileImage.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
  ]),
  updateVendorProfile
);


// PATCH request for updating only profile image
vendorRoutes.patch(
  "/profile-image/:userId",
  uploadProfileImage.fields([{ name: "profileImage", maxCount: 1 }]),
  updateVendorProfileImage
);
// Vendor Profile Area code End 

// Adding customers details start
vendorRoutes.post("/create-customers",authMiddleware, createCustomerProfile);
vendorRoutes.get("/get-customers",authMiddleware, getCustomerProfiles);
// Customer details End 


// invoice code satrt 
vendorRoutes.post("/create-invoices",authMiddleware,createInvoice);
vendorRoutes.get("/get-invoices", authMiddleware, getInvoices);
vendorRoutes.get("/next-invoice", authMiddleware, getNextInvoiceNumber);
vendorRoutes.put("/update-invoice-payment/:invoiceId", authMiddleware, updateInvoicePayment);
// invoice code End 

// Invoice Drafts code start 
vendorRoutes.post("/create-invoicedraft", authMiddleware, createOrUpdateInvoiceDraft);
vendorRoutes.get("/get-invoicedraft", authMiddleware, getInvoiceDrafts);
vendorRoutes.get("/get-single-invoicedraft/:draftId", authMiddleware, getInvoiceDraftById);
vendorRoutes.delete("/delete-invoicedraft/:draftId", authMiddleware, deleteInvoiceDraft);
// Invoice Drafts code End 

// Add and Get Product Categories Code Start
vendorRoutes.post("/add-category", authMiddleware, createCategory);
vendorRoutes.get("/get-categories", authMiddleware, getCategories);
vendorRoutes.put("/update-category/:id", authMiddleware, updateCategory);
// Add and Get Product Categories Code End

// Vendor Bank Details Area Code start
vendorRoutes.post("/add-bankdetails", addBank);       // ➤ Add new bank
vendorRoutes.get("/get-bankdetails", getBanks);      // ➤ Get all banks (id, bankName, accountNumber only)
// Vendor Bank Details Area Code End

export default vendorRoutes;
 