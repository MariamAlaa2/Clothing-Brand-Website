import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ItemDetails from './itemDetails';
const Shop = () => {
    const { category } = useParams(); // Extract category from URL parameters
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/brand/shop/${category}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setItems(data); // Update state with fetched items
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [category]);

    return (
        <div>
            <h2>Shop {category}</h2>
            <div className="item-grid">
                {items.map(item => (
                    <Link to={`/itemDetails/${item._id}`} className="item-link">
                        <div className="item-card">
                            <img src={item.imagePath} alt={item.title} className="item-image" />
                            <div className="item-details">
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-description">{item.description}</p>
                                <p className="item-price">${item.price}</p>
                            </div>
                        
                        </div>
                  </Link>
                ))}
            </div>
        </div>
    );
}

export default Shop;
