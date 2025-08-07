
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productCode: {
      type: String,
      required: true,
      uppercase: true,
    },
   productName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: '',
    },
    unitType: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
   description: {
      type: String,
      default: '',
    },
    rateUnit: {
      type: Number,
      default: 0,
    },
  inStock: {
     type: Number,
      default: 0 
    },
  usedStock: {
     type: Number,
      default: 0
     },
     totalStock:{
      type: Number,
      default: 0
     },
   importedBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
}, { timestamps: true }
);

const productModel = mongoose.model('Product', productSchema);
export default productModel ; 
