import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const ViewCart = () => {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch("/brand/viewcart");
                if (!response.ok) {
                    throw new Error('Failed to view the cart');
                }
                const cartItems = await response.json();
                setCart(cartItems.items);

           
                setTotal(cartItems.total);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();

    }, []);
    const handleCheckout = async() => {
        const response = await fetch('/brand/checkout', {
            method: 'GET'
        });      
       
    };
    return (
        <div>
            <h2>My Cart</h2>
            <div className="item-grid">
                {cart && cart.map(item => (
                    <Link to={`/itemDetails/${item.item}`} className="item-link" key={item.item}>
                        <div className="item-card">
                            {/* <img src={item.imagePath} alt={item.title} className="item-image" /> */}
                            <div className="item-details">
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-color">{item.color}</p>
                                <p className="item-size">{item.size}</p>
                                <p className="item-quantity">${item.quantity}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <p className="total">Total: ${total}</p>
            <button className="checkout-btn"  onClick={handleCheckout}>Checkout</button>
        </div>
    );
}

export default ViewCart;
