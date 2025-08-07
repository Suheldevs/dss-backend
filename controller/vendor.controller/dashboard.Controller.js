import orderModel from "../../models/vendor.model/order.Model.js";
import productModel from "../../models/vendor.model/product.Model.js";


export const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user._id; // assuming req.user is set by auth middleware

    // 1. Products Available
    const products = await productModel.find({ importedBy: vendorId });

    const productsAvailable = products.length;

    // 2. Total Quantity in Stock
    const totalAvailableStock = products.reduce((sum, product) => sum + (product.inStock || 0), 0);

    // 3. Total Supplied (from orders)
    const dispatchedOrders = await orderModel.find({
      importedBy: vendorId,
      status: { $in: ["Dispatched", "Completed"] }
    });

    let totalSupplied = 0;
    dispatchedOrders.forEach((order) => {
      order.products.forEach((item) => {
        totalSupplied += item.quantity;
      });
    });

    // 4. Pending Deliveries
    const pendingDeliveries = await orderModel.countDocuments({
      importedBy: vendorId,
      status: "Pending"
    });

    // Sorting Recent Purchase Orders 
    

    res.status(200).json({
      productsAvailable,
      totalAvailableStock,
      totalSupplied,
      pendingDeliveries,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};
