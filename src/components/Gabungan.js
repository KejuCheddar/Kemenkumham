import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineUser } from 'react-icons/ai';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Gabungan.css";

function Gabungan() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container1">
        <div className="container2">
          <div style={{ textAlign: "left", marginTop: "-70px", color: "white" }}>
            <div style={{ display: "flex" }}>
              <div style={{ marginLeft: '55px', marginBottom: '25px', fontFamily: 'system-ui' }}>
                <p className="description" style={{ marginLeft: "5px", fontSize: "20px" }}><b>Pilih salah satu opsi di bawah untuk melanjutkan:</b></p>
              </div>
            </div>
          </div>
          <div style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'left', marginLeft: "90px" }}>
            <hr className="horizontal-line" style={{ marginLeft: "-80px", marginRight: "10px" }} />
          </div>

          <div className="button-container" style={{ textAlign: "center", marginTop: "20px" }}>
            <div>
              <Link to="/dataUser" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data User</span>
              </Link>
            </div>
            <div>
              <Link to="/dataBarang" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data BMN</span>
              </Link>
            </div>
            <div>
              <Link to="/recapage" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Recap Page</span>
              </Link>
            </div>
            <div>
              <Link to="/input" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Input Form</span>
              </Link>
            </div>
          </div>

          <div className="button-container" style={{ textAlign: "center", marginTop: "20px" }}>
            <div>
              <Link to="/dataUser" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data User</span>
              </Link>
            </div>
            <div>
              <Link to="/dataBarang" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data BMN</span>
              </Link>
            </div>
            <div>
              <Link to="/recapage" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Recap Page</span>
              </Link>
            </div>
            <div>
              <Link to="/input" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Input Form</span>
              </Link>
            </div>
          </div>
    
          <div className="button-container" style={{ textAlign: "center", marginTop: "20px" }}>
            <div>
              <Link to="/dataUser" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data User</span>
              </Link>
            </div>
            <div>
              <Link to="/dataBarang" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data BMN</span>
              </Link>
            </div>
            <div>
              <Link to="/recapage" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Recap Page</span>
              </Link>
            </div>
            <div>
              <Link to="/input" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Input Form</span>
              </Link>
            </div>
          </div>

          <div className="button-container" style={{ textAlign: "center", marginTop: "20px" }}>
            <div>
              <Link to="/dataUser" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data User</span>
              </Link>
            </div>
            <div>
              <Link to="/dataBarang" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Data BMN</span>
              </Link>
            </div>
            <div>
              <Link to="/recapage" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Recap Page</span>
              </Link>
            </div>
            <div>
              <Link to="/input" className="custom-button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AiOutlineUser className="button-icon" style={{ fontSize: "24px", strokeWidth: "2px" }} />
                <span className="button-text">Input Form</span>
              </Link>
            </div>
          </div>
          
        </div>
        <img src={require('../images/background.jpg')} alt="Gambar" style={{ marginLeft: "20px", width: '45%', height: '50%', marginRight: '60px',borderRadius: "30px", marginBottom: '200px' }} />
      </div>
      <div className="footer" >
        <Footer/>
      </div>

    </div>
  );
}

export default Gabungan;
