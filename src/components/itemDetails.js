import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetails = () => {
    const { itemId } = useParams(); // Extract itemId from URL parameters
    const [item, setItem] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); // State to track selected size
    const [quantity, setQuantity] = useState(0); // Initialize quantity to 0

    useEffect(() => {
        // Fetch item details based on itemId when the component mounts
        const fetchItemDetails = async () => {
            try {
                const response = await fetch(`/brand/itemdetails/${itemId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item details');
                }
                const itemData = await response.json();
                setItem(itemData);
            } catch (error) {
                console.error('Error fetching item details:', error);
            }
        };

        fetchItemDetails();
    }, [itemId]); // Fetch item details again if itemId changes

    useEffect(() => {
        if (selectedColor && selectedSize) {
            fetchCartState();
        }
    }, [selectedColor, selectedSize]); // Fetch cart state again if selectedColor or selectedSize changes

    useEffect(() => {
        if (quantity >= 0 && selectedColor && selectedSize) {
            updateCart();
        }
    }, [quantity]);

    const fetchCartState = async () => {
        try {
            const response = await fetch('/brand/viewcart');
            if (!response.ok) {
                throw new Error('Failed to fetch cart state');
            }
            const cartItems = await response.json();
            console.log(cartItems.items)

            // Check if cartItems is an array
            if (!Array.isArray(cartItems.items)) {
                throw new Error('Cart items data is not in the expected format');
            }

            const currentItem = cartItems.items.find(cartItem => cartItem.item === itemId && cartItem.color === selectedColor && cartItem.size === selectedSize);
            if (currentItem) {
                setQuantity(currentItem.quantity); // Set quantity to the previous value in the cart
            } else {
                setQuantity(0); // If no matching item found in cart, set quantity to 0
            }
        } catch (error) {
            console.error('Error fetching cart state:', error);
        }
    };

    const handleClickColor = (color) => {
        setSelectedColor(color);
        setSelectedSize(null); // Reset selected size when color changes
    };

    const handleClickSize = (size) => {
        setSelectedSize(size);
    };

    const handleIncrement = () => {
        if (selectedColor && selectedSize) {
            const selectedVariation = item.sizesAndColors.find(color => color.color === selectedColor).variations.find(variation => variation.size === selectedSize);
            if (selectedVariation && selectedVariation.quantity > quantity) {
                setQuantity(prevQuantity => prevQuantity + 1); 
            } else {
                alert('Insufficient quantity');
            }
        } else {
            alert('Please select color and size');
        }
    };

    const handleDecrement = () => {
        if (quantity >= 1) {
            setQuantity(prevQuantity => prevQuantity - 1); 
        }
    };

    const updateCart = async () => {
        if (!selectedColor || !selectedSize) {
            // If color or size is not selected, prompt the user to select them
            alert('Please select color and size');
            return;
        }
        console.log(quantity);
        try {
            const response = await fetch('/brand/tocart', {
                method: 'POST',
                body: JSON.stringify({ id:itemId,title:item.title, color: selectedColor, size: selectedSize,quantity: quantity }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
          
            if (!response.ok) {
                throw new Error('Failed to update cart');
            }
            const json = await response.json();
            console.log('Item added to cart:', json);
        } catch (error) {
            console.error('Error updating cart:', error);
            alert('Failed to update cart. Please try again later.');
        }
    };
    
    if (!item) {
        return <div>Loading...</div>; // Render loading message while fetching item details
    }

    return (
        <div className="item-details">
            <h2>{item.title}</h2>
            <img src={item.imagePath} alt={item.title} className="item-image" />
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
           
            {/* Display available colors */}
            <div className="available-colors">
                <h3>Available Colors:</h3>
                {item.sizesAndColors.map((color, index) => (
                    <span
                        key={index}
                        onClick={() => handleClickColor(color.color)}
                        style={{ backgroundColor: color.color }}
                        className="color-circle"
                    ></span>
                ))}
            </div>

            {/* Display available sizes for selected color */}
            {selectedColor && (
                <div className="available-sizes">
                    <h3>Available Sizes for {selectedColor}:</h3>
                    <ul>
                        {item.sizesAndColors.find(color => color.color === selectedColor).variations.map((variation, index) => (
                            variation.quantity > 0 && (
                                <li
                                    key={index}
                                    onClick={() => handleClickSize(variation.size)} // Set selected size when clicked
                                    className={selectedSize === variation.size ? 'selected-size' : ''}
                                >
                                    {variation.size}
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            )}

            {/* Quantity selection */}
            <div className="quantity-selection">
                <button onClick={handleDecrement}>-</button>
                <span>{quantity}</span>
                <button onClick={handleIncrement}>+</button>
            </div>

        </div>
    );
};

export default ItemDetails;
