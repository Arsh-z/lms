import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "other"],
      default: "other",
    },

    paymentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    refundId: {
      type: String,
      default: null,
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundReason: {
      type: String,
      of: String,
    },

    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

coursePurchaseSchema.index({ user: 1, course: 1 });

coursePurchaseSchema.index({ status: 1 });

coursePurchaseSchema.index({ createdAt: -1 });

coursePurchaseSchema.virtual("isRefundable").get(function () {
  if (this.status !== "completed") return false;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return this.createdAt > thirtyDaysAgo;
});

//method to process refund

coursePurchaseSchema.methods.processRefund = async function (reason, amount) {
  this.status = "refunded";
  this.refundAmount = amount || this.amount;
  this.refundReason = reason;
  return this.save();
};

const CoursePurchase = mongoose.model("CoursePurchase", coursePurchaseSchema);

export default CoursePurchase;
