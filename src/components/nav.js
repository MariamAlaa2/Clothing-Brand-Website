import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <div className="navbar-brand">
       <Link to="/"> MyBrand </Link> 
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/brand/shop/all">Shop All</Link>
        </li>
        <li>
          <Link to="/brand/shop/tops">Shop Tops</Link>
        </li>
        <li>
          <Link to="/brand/shop/bottoms">Shop Bottoms</Link>
        </li>
        <li>
          <Link to="/viewcart">My Cart</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
