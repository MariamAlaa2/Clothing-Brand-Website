const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartItemSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'Items', required: true }, // Reference to Item schema
    title: { type: String, required: true  },
    color: { type: String , required: true },
    size: { type: String , required: true },
    quantity: { type: Number , required: true }
});


module.exports = mongoose.model('cartItems', cartItemSchema);
