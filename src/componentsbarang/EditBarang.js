import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const EditBarang = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barang, setBarang] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dataBarang/" + id)
      .then((res) => setBarang(res.data[0]))
      .catch((err) => console.log(err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBarang((prevBarang) => ({
      ...prevBarang,
      [name]: value,
    }));
  };

  const handleKembali = () => {
    navigate(`/dataBarang`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(barang.gambar);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if barang with the same code_barang already exists
    try {
      const response = await axios.get("http://localhost:5000/api/dataBarang");
      const existingBarang = response.data;

      // Find the original barang being edited
      const originalBarang = existingBarang.find((item) => item.id_barang === id);

      // If code_barang has been changed, check for duplicates
      if (originalBarang.code_barang !== barang.code_barang) {
        const filteredBarang = existingBarang.filter(
          (item) => item.code_barang === barang.code_barang
        );

        if (filteredBarang.length > 0) {
          alert("Barang dengan code_barang yang sama sudah ada!");
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    // prepare form data
    const formData = new FormData();
    formData.append("id_barang", barang.id_barang);
    formData.append("tipe_barang", barang.tipe_barang);
    formData.append("nama_barang", barang.nama_barang);
    formData.append("code_barang", barang.code_barang);
    formData.append("jumlah", barang.jumlah);
    formData.append("status", barang.status);

    // Check if selected file exists and its size
    if (selectedFile) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      const maxSizeInMB = maxSizeInBytes / (1024 * 1024);

      if (selectedFile.size > maxSizeInBytes) {
        alert(`Ukuran gambar melebihi ${maxSizeInMB}MB. Silakan pilih gambar lain.`);
        return;
      }

      formData.append("foto", selectedFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/dataBarang/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        alert(response.data.message);
        navigate("/dataBarang");
        return;
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
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
        <Form.Group controlId="formNmbmn">
          <Form.Label>
            <b>Tipe BMN</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="tipe_barang"
            value={barang.tipe_barang || ""}
            onChange={handleInputChange}
            placeholder="Masukkan Tipe BMN"
            required
          />
        </Form.Group>
        <Form.Group controlId="formNmbmn">
          <Form.Label>
            <b>Nama BMN</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="nama_barang"
            value={barang.nama_barang || ""}
            onChange={handleInputChange}
            placeholder="Masukkan Nama BMN"
            required
          />
        </Form.Group>
        <Form.Group controlId="formCodeBmn" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Kode BMN</b>
          </Form.Label>
          <Form.Control
            type="text"
            name="code_barang"
            value={barang.code_barang || ""}
            onChange={handleInputChange}
            placeholder="Masukkan Kode BMN"
            required
          />
        </Form.Group>
        <Form.Group controlId="formJumlahBmn" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Jumlah BMN</b>
          </Form.Label>
          <Form.Control
            type="number"
            name="jumlah"
            value={Math.max(0, parseInt(barang.jumlah, 10))}
            onChange={handleInputChange}
            placeholder="Masukkan Jumlah BMN"
            required
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
              Pilih Status Barang
            </option>
            <option value="Bagus">Bagus</option>
            <option value="Rusak">Rusak</option>
            <option value="Hilang">Hilang</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formFoto" style={{ marginTop: "10px" }}>
          <Form.Label>
            <b>Masukkan Gambar BMN</b>
          </Form.Label>
          <Form.Control
            type="file"
            name="foto"
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png"
            minSize="5000000"
          />
          {selectedFile && (
            <Form.Text className="text-muted">
              <strong>{selectedFile.name}</strong>
            </Form.Text>
          )}
          {barang.gambar && !selectedFile && (
            <Form.Text className="text-muted">
              <strong>Gambar saat ini: {barang.gambar}</strong> 
            </Form.Text>
          )}
          <br />
          <Form.Text className="text-muted">
            Masukkan gambar dalam format JPG, PNG, atau JPEG
          </Form.Text>
          <br />
          <Form.Text className="text-muted">
            Minimal File 5MB!
          </Form.Text>
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
            style={{ paddingLeft: "30px", paddingRight: "30px" }}
            onClick={() => handleKembali()}
          >
            Kembali
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditBarang;
