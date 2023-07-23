const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const addressSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  street: { type: String, required: true },
  contactNumber: { type: String, required: true },
  landmark: { type: String },
  zipcode: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

module.exports = model('Address', addressSchema);