import razorpay from "../database/razorpay.js";
import Course from "../models/course.model.js";
import CoursePurchase from "../models/coursePurchase.model.js";
import crypto from "crypto";

export const createPaymentOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    const amount = course.discountPrice || course.price;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `course_${courseId}_${Date.now()}`,
    });

    const purchase = await CoursePurchase.create({
      course: courseId,
      user: userId,
      amount,
      currency: "INR",
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      order: razorpayOrder,
      purchaseId: purchase._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import crypto from "crypto";

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const purchase = await CoursePurchase.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id,
    });

    if (!purchase) {
      throw new Error("Purchase not found");
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${purchase.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    purchase.razorpayPaymentId = razorpay_payment_id;
    purchase.razorpaySignature = razorpay_signature;
    purchase.status = "completed";

    await purchase.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


