import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dataUser/" + id)
      .then((res) => setUser(res.data[0]))
      .catch((err) => console.log(err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleKembali = () => {
    navigate(`/dataUser`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { username, password } = user;

      console.log("PUT Request Payload:", { username, password });

      const response = await axios.put(
        `http://localhost:5000/api/dataUser/${id}`,
        { username, password }
      );

      if (response.data) {
        alert(response.data.message);
        navigate("/dataUser");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update data.");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Edit Data Barang
      </h2>
      <Form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          border: "3px solid #000080",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <Form.Group controlId="formusername">
          <Form.Label>
            <b>Username</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={user.username || ""}
            onChange={handleInputChange}
            placeholder="Masukkan username"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>
            <b>Password</b>
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={user.password || ""}
            onChange={handleInputChange}
            placeholder="Masukkan password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
          Simpan
        </Button>
        <Button
          variant="danger"
          onClick={handleKembali}
          style={{ marginTop: "20px", marginLeft: "10px" }}
        >
          Kembali
        </Button>
      </Form>
    </div>
  );
};

export default EditUser;
