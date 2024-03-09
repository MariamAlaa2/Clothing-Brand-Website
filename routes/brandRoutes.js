const express = require('express')
const router = express.Router()
const {Shop, ItemDetails, ToCart, ViewCart,Checkout} = require('../controllers/brandControlles')

// shop 
router.get('/shop/:category',Shop)

// item details
router.get('/itemdetails/:id',ItemDetails)

// add to cart
router.post('/tocart',ToCart)

// view cart
router.get('/viewcart',ViewCart)

// checkout
router.get('/checkout',Checkout)

module.exports = router