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
      stock,
      rateUnit,
      description,
    } = req.body;

    const newProduct = new productModel({
      productName,
      productCode,
      brand,
      unitType,
      size,
      stock,
      rateUnit,
      description,
      importedBy : req.user._id  // Automatically set from middleware
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

//create new data in Bulk
export const bulkImportProducts = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided." });
    }

    const enrichedProducts = products.map(product => ({
      ...product,
      productCode: product.productCode?.toUpperCase(),
      productName: product.productName?.trim(),
      importedBy: vendorId,
    }));

    const insertedProducts = await productModel.insertMany(enrichedProducts);

    res.status(201).json({
      message: `${insertedProducts.length} products uploaded successfully.`,
      data: insertedProducts,
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Failed to import products.', error: error.message });
  }
};


// Get all products
export const getProducts = async (req, res) => {
  try {

    const products = await productModel.find({ importedBy: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error:error.message });
  }
};


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
    const { id } = req.params; // Product ID from route
    const updateFields = req.body;

    // Optional: Ensure only allowed fields are updated
    const allowedFields = [
      "productName",
      "productCode",
      "brand",
      "unitType",
      "size",
      "stock",
      "rateUnit",
      "description"
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (updateFields[key] !== undefined) {
        updates[key] = updateFields[key];
      }
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: id, importedBy: req.user._id }, // ensures vendor can only update their own product
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

