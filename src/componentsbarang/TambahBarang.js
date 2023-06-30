import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TambahBarang = () => {
  const [barang, setBarang] = useState({
    id_barang: "",
    tipe_barang: "",
    nama_barang: "",
    code_barang: "",
    status: "",
    jumlah: "",
    foto: null,
  });

  const navigate = useNavigate();

  const handleKembali = () => {
    navigate(`/dataBarang`);
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setBarang((prevBarang) => ({
    ...prevBarang,
    [name]: value,
  }));
};


  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "foto") {
      const file = files[0];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      const maxSizeInMB = maxSizeInBytes / (1024 * 1024);

      if (file.size > maxSizeInBytes) {
        alert(
          `Ukuran gambar melebihi ${maxSizeInMB}MB. Silakan pilih gambar lain.`
        );
        return;
      }

      setBarang({ ...barang, foto: file });
    } else {
      setBarang({ ...barang, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cek apakah barang dengan code_barang yang sama sudah ada
      const response = await axios.get("http://localhost:5000/api/dataBarang");
      const existingBarang = response.data;

      // Filter data yang memiliki code_barang yang sama dengan data yang akan ditambahkan
      const filteredBarang = existingBarang.filter(
        (item) => item.code_barang === barang.code_barang
      );

      if (filteredBarang.length > 0) {
        alert("Barang dengan Code Barang yang sama sudah ada!");
        return;
      }

      // Mendapatkan id_barang terbesar
      const maxIdBarang = existingBarang.reduce(
        (maxId, item) => Math.max(maxId, item.id_barang),
        0
      );

      const newIdBarang = maxIdBarang + 1; // Membuat id_barang baru yang unik

      const formData = new FormData();
      formData.append("id_barang", newIdBarang);
      formData.append("tipe_barang", barang.tipe_barang);
      formData.append("nama_barang", barang.nama_barang);
      formData.append("code_barang", barang.code_barang);
      formData.append("jumlah", barang.jumlah);
      formData.append("status", barang.status);
      formData.append("foto", barang.foto);
      const postResponse = await axios.post(
        "http://localhost:5000/api/dataBarang",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (postResponse.data) {
        alert(postResponse.data.message);
        setBarang({
          id_barang: "",
          tipe_barang: "",
          nama_barang: "",
          code_barang: "",
          jumlah: "",
          status: "",
          foto: null,
        });
        navigate("/dataBarang");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Tambah Data Barang
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
        <Form.Group controlId="formTipeBMN" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Tipe BMN</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="tipe_barang"
            value={barang.tipe_barang}
            onChange={handleChange}
            placeholder="Masukkan tipe BMN"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Masukkan Tipe BMN")}
          />
        </Form.Group>
        <Form.Group controlId="formNamaBMN" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Nama BMN</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="nama_barang"
            value={barang.nama_barang}
            onChange={handleChange}
            placeholder="Masukkan nama BMN"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Masukkan Nama BMN")}
          />
        </Form.Group>
        <Form.Group controlId="formKodeBMN" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Kode BMN</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="code_barang"
            value={barang.code_barang}
            onChange={handleChange}
            placeholder="Masukkan Code BMN"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Masukkan Code Barang")}
          />
        </Form.Group>
        <Form.Group controlId="formJumlah" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Jumlah</b>
          </Form.Label>
          <Form.Control
            type="number"
            name="jumlah"
            value={Math.max(0, parseInt(barang.jumlah, 10))}
            onChange={handleChange}
            placeholder="Masukkan Jumlah BMN"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Masukkan Jumlah BMN")}
          />
        </Form.Group>
        <Form.Group controlId="formStatusBmn" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Status BMN</b>
          </Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={barang.status || ""}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Pilih Status
            </option>
            <option value="Bagus">Bagus</option>
            <option value="Rusak">Rusak</option>
            <option value="Hilang">Hilang</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formFoto" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Gambar BMN</b>
          </Form.Label>
          <Form.Control
            type="file"
            name="foto"
            onChange={handleChange}
            placeholder="Masukkan gambar product"
            accept=".jpg, .jpeg, .png"
            max="5000000"
          />
          <Form.Text className="text-muted">
            Masukkan gambar dalam format JPG, PNG, atau JPEG
          </Form.Text>
          <br></br>
          <Form.Text className="text-muted">Maximal File 5MB!</Form.Text>
        </Form.Group>
        <div
          style={{ marginTop: "15px", margin: "10px", textAlign: "center" }}
        >
          <Button
            variant="primary"
            type="submit"
            style={{
              paddingLeft: "30px",
              paddingRight: "30px",
              marginRight: "5px",
            }}
          >
            Simpan
          </Button>
          <Button
            variant="primary"
            type="button"
            style={{
              paddingLeft: "30px",
              paddingRight: "30px",
            }}
            onClick={handleKembali}
          >
            Kembali
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TambahBarang;