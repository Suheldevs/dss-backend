// models/productCategoryModel.js
import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", // Vendor user
      required: true,
    },
  },
  { timestamps: true }
);

const ProductCategoryModel = mongoose.model("ProductCategory", productCategorySchema);
export default ProductCategoryModel

