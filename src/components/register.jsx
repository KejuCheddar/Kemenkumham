import "./register.css";
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hash } from "bcryptjs";
import "./Navbarlogin2.css";

function Register() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const hashedPassword = await hash(user.password, 10);
    const formData = {
      username: user.username,
      password: hashedPassword,
    };
    const response = await axios.post(
      "http://localhost:5000/api/dataUser",
      formData
    );
    if (response.data.success) {
      toast.success(response.data.message); // Display success notification
      setUser({ username: "", password: "" });
      navigate("/"); // Pass registration data as state
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
  <div className="container-navbar">
    <div className="navbar-container transparent-bg">
      <div className="logo-container">
        <img src="/images/logoham.png" alt="Logo" style={{ width: '100%', height: '65px' }} />
      </div>
      <div className="title-container">
        <h1 style={{ fontSize: '25px' }}>KANWIL KEMENKUMHAM DKI JAKARTA</h1>
        <h4 style={{fontSize: '13', opacity: 0.8}}>SUBBAG HUMAS, RB, TI </h4>
      </div>
    </div>
    <div className="register">
      <div className="registerCard">
        <span className="registerTitle">Buat Akun</span>
        <Form onSubmit={handleSubmit} className="registerForm">
          <Form.Group controlId="formNama">
            <Form.Control
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Masukkan Username"
              className="registerInput"
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Control
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
              className="registerInput"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="registerButton">
            Simpan
          </Button>
          <p style={{ marginTop: "10px"}}>Sudah Ada Akun? <a href="/">
            <Link to="/">Klik Disini</Link>
          </a></p>
        </Form>
      </div>
    </div>
  </div>
  );
}

export default Register;