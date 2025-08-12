const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  img: { type: String, required: true },
  new: { type: Boolean, default: false },
  price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  discount: { type: Number, required: true },
  status: String,
  quantity: { type: Number, required: true },
  related_images: [String],
  orderQuantity: Number,
  sizes: [String],
  weight: Number,
  thumb_img: { type: String, required: true },
  sm_desc: { type: String, required: true },
  parentCategory: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  title: { type: String, required: true },
  details: {
    details_text: { type: String },
    details_list: [String],
    details_text_2: { type: String },
  },
});

module.exports = mongoose.model("Product", productSchema);
