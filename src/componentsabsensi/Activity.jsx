// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

// const EditAct = () => {
//   const navigate = useNavigate();
//   const [dataAct, setDataAct] = useState({});

//   useEffect(() => {
//     fetchDataAct();
//   }, []);

//   const fetchDataAct = () => {
//     axios
//       .get("http://localhost:5000/api/dataAct")
//       .then((res) => setDataAct(res.data[0]))
//       .catch((err) => console.log(err));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setDataAct((prevDataAct) => ({
//       ...prevDataAct,
//       [name]: value,
//     }));
//   };

//   const handleSubmitAct = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.put(
//         "http://localhost:5000/api/dataAct",
//         dataAct
//       );
//       if (response.data) {
//         alert(response.data.message);
//         navigate("/");
//         return;
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   };

//   return (
//     <Container>
//       <Row className="justify-content-center">
//         <Col md={6}>
//           <Card>
//             <Card.Body>
//               <h2 className="text-center">Edit Data Artikel</h2>
//               <Form onSubmit={handleSubmitAct}>
//                 <Form.Group controlId="formNamaKegiatan">
//                   <Form.Label>Nama Kegiatan</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="nama_kegiatan"
//                     value={dataAct.nama_kegiatan}
//                     onChange={handleInputChange}
//                     placeholder="Masukkan Nama Kegiatan"
//                   />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" style={{ marginTop: "10px" }} block>
//                   Simpan
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default EditAct;
