import productModel from "../../models/vendor.model/product.Model.js";

// Create new product
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productCode,
      brand,
      unitType,
      size,
      inStock,
      gstPercent,
      rateUnit,
      description,
      category,
    } = req.body;

        console.log("REQ BODY:", req.body); // <-- Debug here

 // 1️⃣ Check if productCode already exists
    const existingProduct = await productModel.findOne({ productCode });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with code "${productCode}" already exists`,
      });
    }

    const newProduct = new productModel({
      productName,
      productCode,
      brand,
      unitType,
      size,
      inStock,
      gstPercent,
      rateUnit,
      description,
      category,
      importedBy : req.user._id  // Automatically set from middleware
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    // 3️⃣ Handle duplicate key error from MongoDB
    if (error.code === 11000 && error.keyPattern?.productCode) {
      return res.status(400).json({
        success: false,
        message: `Product code "${req.body.productCode}" already exists`,
      });
    }
     res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

//create new data in Bulk
export const bulkImportProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided for import.",
      });
    }

    // ✅ Attach importedBy from logged-in vendor
    const vendorId = req.user._id;
    const productsWithVendor = products.map((p) => ({
      ...p,
      importedBy: vendorId,
      totalStock: p.inStock || 0,
    }));

    // ✅ Check for duplicate product codes in DB
    const codes = productsWithVendor.map((p) => p.productCode);
    const existing = await productModel.find({
      importedBy: vendorId,
      productCode: { $in: codes },
    }).select("productCode");

    if (existing.length > 0) {
      const existingCodes = existing.map((e) => e.productCode);
      return res.status(400).json({
        success: false,
        message: "Some product codes already exist.",
        duplicateCodes: existingCodes,
      });
    }

    // ✅ Insert products
    await productModel.insertMany(productsWithVendor);

    res.status(201).json({
      success: true,
      message: `${productsWithVendor.length} products imported successfully.`,
    });
  } catch (error) {
    // ✅ Handle Mongo duplicate key error (extra safety)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateField];
      return res.status(400).json({
        success: false,
        message: `Duplicate ${duplicateField}: "${duplicateValue}" already exists.`,
      });
    }

    console.error("Import error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import products.",
      error: error.message,
    });
  }
};


// Get all products
// ✅ Get all products for the logged-in vendor
export const getProducts = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch products for this vendor
    const products = await productModel.find({ importedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: [...products]
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// for delete db data 
// export const getProducts = async (req, res) => {
//   try {
//     // Ensure user is authenticated
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }

//     // 🔴 Delete all products of this vendor before fetching
//     await productModel.deleteMany({ importedBy: req.user._id });

//     // Now fetch (this will return empty array because sab delete ho gaya)
//     const products = await productModel.find({ importedBy: req.user._id }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Products deleted & fetched successfully",
//       data: products,
//     });
//   } catch (error) {
//     console.error("❌ Error in getProducts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete & fetch products",
//       error: error.message,
//     });
//   }
// };

// import productModel from "../models/productModel.js";
// import orderModel from "../models/orderModel.js"; // import your order model

// export const getProducts = async (req, res) => {
//   try {
//     const vendorId = req.user._id;

//     // 1. Fetch all products for this vendor
//     const products = await productModel.find({ importedBy: vendorId });

//     // 2. Extract product IDs
//     const productIds = products.map(p => p._id);

//     // 3. Fetch all related orders with status != pending
//     const relevantOrders = await orderModel.find({
//       productId: { $in: productIds },
//       status: { $in: ["dispatched", "completed"] }
//     });

//     // 4. Prepare a map to count used stock per product
//     const usedStockMap = {};

//     for (const order of relevantOrders) {
//       const id = order.productId.toString();
//       const qty = order.quantity || 0;

//       usedStockMap[id] = (usedStockMap[id] || 0) + qty;
//     }

//     // 5. Prepare final product response
//     const finalData = products.map(product => {
//       const usedStock = usedStockMap[product._id.toString()] || 0;
//       const inStock = product.stock - usedStock;

//       return {
//         productCode: product.productCode,
//         productName: product.productName,
//         brand: product.brand,
//         unitType: product.unitType,
//         size: product.size,
//         stock: product.stock,
//         usedstock: usedStock,
//         instock: inStock,
//         rateUnit: product.rateUnit,
//         description: product.description
//       };
//     });

//     res.status(200).json(finalData);
//   } catch (error) {
//     console.error("Error in getProducts:", error);
//     res.status(500).json({ message: "Failed to fetch products", error: error.message });
//   }
// };


// Update Product by ID

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const updateFields = req.body;
console.log(" req.body", req.body)
    // Find the product first
    const product = await productModel.findOne({
      _id: id,
      importedBy: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    // Optional: limit fields that can be updated
    const allowedFields = [
      "productName",
      "productCode",
      "brand",
      "unitType",
      "size",
      "rateUnit",
      "gstPercent",
      "description",
      "category"
    ];

    // Prepare update object
    const updates = {};

    // Copy allowed fields
    for (const key of allowedFields) {
      if (updateFields[key] !== undefined) {
        updates[key] = updateFields[key];
      }
    }

    // 🧠 Handle `instock` update logic
    if (updateFields.inStock !== undefined) {
      const addedStock = Number(updateFields.inStock);
      if (isNaN(addedStock)) {
        return res.status(400).json({ message: "Invalid stock value" });
      }

      // ✅ Add new stock to existing inStock
      const newInStock = product.inStock + addedStock;

      updates.inStock = newInStock;

      // ✅ Recalculate totalStock = instock + usedStock
      updates.totalStock = newInStock + (product.usedStock || 0);
    }

    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

