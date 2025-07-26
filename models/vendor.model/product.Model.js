import {Schema,model} from "mongoose"


const productSchema = new Schema(
  {
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
      default: 'Generic',
    },
    unitType: {
      type: String,
      default: 'Piece',
    },
    size: {
      type: String,
      default: 'Medium',
    },
    stock: {
      type: Number,
      default: 0,
    },
    rateUnit: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    importedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = model('Product', productSchema);

export default productModel ;