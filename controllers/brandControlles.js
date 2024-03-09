const Items = require('../models/itemsModel')
const cartItem= require('../models/cartItemModel')

const mongoose = require('mongoose')
const { findByIdAndUpdate } = require('../models/cartItemModel')



const Shop = async(req,res)=>{
   const {category} = req.params

   let  items = []
       if( category== "all"){
       items= await Items.find({})
      }
       else {
       items = await Items.find({ category:category})
       }
    res.status(200).json(items)

}
const ItemDetails = async(req,res)=>{
   const {id} = req.params
   const item = await Items.findById(id)
   res.status(200).json(item)
}
const ToCart = async (req, res) => {
    const { id,title, color, size, quantity } = req.body;
    try {

        const existingCartItem = await cartItem.findOne( {item: id, title,color, size})
        if (existingCartItem) {
           
            if (quantity == 0) {
                await cartItem.findOneAndDelete({ item: id, title,color, size})
                return res.status(200).json('deleted')
               
            } else {
                
                await cartItem.findOneAndUpdate({item: id, title,color, size }, { quantity: quantity })
                return res.status(200).json('updated')

            }
        } else {
            if (quantity > 0) {
                const newCartItem = await cartItem.create({ item: id, title,color, size, quantity: quantity });

                return res.status(200).json(newCartItem);
            }
        }
       // return res.status(200).json(item)
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// const RemoveFromCart = async(req,res)=>{
//  const {id}= req.params
//  const item = await Items.findOneAndUpdate({_id:id},{incart: false})
//  res.status(200).json(item)
// }
const ViewCart = async (req, res) => {
    try {
        const items = await cartItem.find({});
        let total = 0;
        
        for (const cartItem of items) {
            const item = await Items.findById(cartItem.item);
            total += item.price * cartItem.quantity;
        }
        
        res.status(200).json({ items, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Checkout = async (req, res) => {
    try {
        const items = await cartItem.find({});

        for (const cartItem of items) {
            const item = await Items.findById(cartItem.item);
            for (const sizeAndColor of item.sizesAndColors) {
                if (sizeAndColor.color === cartItem.color) {
                    for (const variation of sizeAndColor.variations) {
                        if (variation.size === cartItem.size) {
                            if (variation.quantity >= cartItem.quantity) {
                                const newQuantity = variation.quantity - cartItem.quantity;
                                await Items.findByIdAndUpdate(item._id, { $set: { "sizesAndColors.$[i].variations.$[j].quantity": newQuantity } }, { arrayFilters: [{ "i.color": cartItem.color }, { "j.size": cartItem.size }] });
                            } else {
                                return res.status(400).json({ message: `There is only ${variation.quantity} left of this item` });
                            }
                        }
                    }
                }
            }
        }

        await cartItem.deleteMany({}); // Clear cart after successful checkout
        return res.status(200).json({ message: "Checkout successful" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    Shop, ItemDetails, ToCart,ViewCart,Checkout
}