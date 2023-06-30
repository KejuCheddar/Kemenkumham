import "./login.css";
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

toast.configure();

export default function Login() {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message

  useEffect(() => {
    localStorage.clear();
  }, []);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.registrationData) {
      toast.success("Data sudah ditambahkan"); // Display success notification
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLogin({ ...login, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", login);
      if (response.data) {
        console.log(response.data.role);
        const { id_user } = response.data;
        localStorage.setItem("id_user", id_user); // Store id_user in local storage
        navigate("/Gabungan");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Username atau Password Anda Salah!"); // Set error message
      if (error.response && error.response.status === 401) {
        setLogin({ ...login, password: "" }); // Clear only the password field
      } else {
        setLogin({ ...login, username: "" }); // Clear only the username field
      }
    }
  };

  return (
    <div className="container-navbar">
      <div className="navbar-container transparent-bg">
        <div className="logo-container">
          <img src="/images/logoham.png" alt="Logo" style={{ width: '100%', height: '65px' }} />
        </div>
        <div className="title-container">
          <h1 style={{ fontSize: '25px' }}>KANWIL KEMENKUMHAM DKI JAKARTA</h1>
          <h4 style={{ fontSize: '13', opacity: 0.8 }}>SUBBAG HUMAS, RB, TI </h4>
        </div>
      </div>
      <div className="login">
        <div className="loginCard">
          <h1 className="loginTitle">Masuk</h1>
          {errorMessage && ( // Conditionally render the error message
            <p style={{ color: "red" }}>{errorMessage}</p>
          )}
          <Form onSubmit={handleSubmit} className="loginForm">
            <Form.Group controlId="formUsername">
              <Form.Control
                type="text"
                name="username"
                value={login.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="loginInput"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                name="password"
                value={login.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="loginInput"
              />
            </Form.Group>
            <div style={{justifyContent: 'center', textAlign: 'center'}}>
              <Button variant="primary" type="submit" className="loginButton1">
                Login
              </Button>
            <p style={{ marginTop: "10px"}}>Belum Ada Akun? <a href="/register">
              <Link to="/register">Klik Disini</Link>
            </a></p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
