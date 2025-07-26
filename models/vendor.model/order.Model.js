import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        rateUnit: {
          type: Number,
          required: true,
        },
        totalCost: {
          type: Number,
          required: true, // quantity * rateUnit
        },
        discount: {
          type: Number,
          default: 0, // per-product discount
        },
        netCost: {
          type: Number,
          required: true, // totalCost - discount
        },
      },
    ],

    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
     importedBy: {
          type: Schema.Types.ObjectId,
          ref: "Registration",
          required: true,
        },

    // Order Status
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Invoice and Payment
    invoiceId: {
      type: String,
      unique: true,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Partially Paid", "Failed"],
      default: "Unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Card"],
      default: "Cash",
    },

    // Overall Financial Summary
    overallAmount: {
      type: Number,
      required: true, // sum of all product totalCost
    },
    overallDiscount: {
      type: Number,
      default: 0, // sum of all product-level discount or additional
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true, // overallAmount - overallDiscount + shippingCharges
    },

    // Delivery Address
    deliveryAddress: {
      fullName: String,
      contactNumber: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pinCode: String,
      country: { type: String, default: "India" },
    },

    // Logistics & Meta
    dispatchDate: Date,
    deliveryDate: Date,
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const orderModel = model("Order", orderSchema);

export default orderModel;
