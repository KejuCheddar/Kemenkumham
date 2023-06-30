import React from 'react';
import "./Navbar.css";

function Navbarlogin() {

  return (
    <div className="navbar-container transparent-bg">
      <div className="logo-container">
        <img src="/images/logoham.png" alt="Logo" style={{ width: '100%', height: '65px' }} />
      </div>
      <div className="title-container">
        <h1 style={{ fontSize: '25px' }}>KANWIL KEMENKUMHAM DKI JAKARTA</h1>
        <h4 style={{fontSize: '13', opacity: 0.8}}>SUBBAG HUMAS, RB, TI </h4>
      </div>
    </div>
  );
}

export default Navbarlogin;