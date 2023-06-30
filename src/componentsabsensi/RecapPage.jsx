import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./form.css";
import { Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RecapPage = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [waktu, setWaktu] = useState("");
  const [hadirData, setHadirData] = useState([]);
  const [tidakHadirData, setTidakHadirData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const storedSelectedRows = localStorage.getItem("selectedRows");
    if (storedSelectedRows) {
      setSelectedRows(JSON.parse(storedSelectedRows));
    }

    return () => {};
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedRows", JSON.stringify(selectedRows));
  }, [selectedRows]);

const fetchData = () => {
  const uptUrl = "http://localhost:5000/api/dataUpt";
  const actUrl = `http://localhost:5000/api/dataAct?nama_kegiatan=${searchQuery}`;

  axios
    .all([axios.get(uptUrl), axios.get(actUrl)])
    .then(
      axios.spread((uptResponse, actResponse) => {
        const uptData = uptResponse.data;
        const actData = actResponse.data;

        const hadirData = uptData.filter((row) => row.absensi === "Hadir");
        const tidakHadirData = uptData.filter((row) => row.absensi !== "Hadir");

        console.log("Hadir Data:", hadirData);
        console.log("Tidak Hadir Data:", tidakHadirData);

        setHadirData(hadirData);
        setTidakHadirData(tidakHadirData);

        const updatedData = uptData.map((row) => {
          const attendanceStatus = hadirData.some((item) => item.nama_upt === row.nama_upt) ?
            "Hadir" :
            "Tidak Hadir";
          return {
            ...row,
            isChecked: selectedRows.includes(row.id_upt),
            attendance: attendanceStatus,
          };
        });

        setData(updatedData);

        const selectedActData = actData.length > 0 ? actData[0] : null;
        const waktuValue = selectedActData ? selectedActData.waktu : null;
        setWaktu(waktuValue ? moment(waktuValue).format("YYYY-MM-DD HH:mm:ss") : "");
      })
    )
    .catch((err) => console.error(err));
};



  const handleSearch = () => {
    setNamaKegiatan(searchQuery); // Update namaKegiatan with the value of searchQuery
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNavigate = () => {
    navigate("/gabungan");
  };

  console.log("Hadir Data:", hadirData);
  console.log("Tidak Hadir Data:", tidakHadirData);

  return (
    <div>
      <div className="header-container">
        <h1>{namaKegiatan}</h1>
        <div className="timestamp-container" style={{marginTop: '10px'}}>
          <Card className="timestamp-card">
            <Card.Body>
              <Card.Text>{waktu}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="container-search" style={{marginRight:"55px"}}>
        <input
          type="text"
          placeholder="Cari Kegiatan..."
          value={searchQuery}
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div>
          <Button
            onClick={handleNavigate}
            style={{
              marginBottom: "10px",
            }}
          >
            Kembali Ke Beranda
          </Button>
        </div>
      <div>
        <div>
          <h3>Hadir</h3>
          <Table striped bordered hover className="modern-table">
            <thead>
              <tr>
                <th style={{ width: "150px" }}>Nomor Upt</th>
                <th style={{ width: "150px" }}>Nama Upt</th>
              </tr>
            </thead>
            <tbody>
              {hadirData.map((row) => (
                <tr key={row.id_upt}>
                  <td>{row.id_upt}</td>
                  <td>{row.nama_upt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div>
          <h3>Tidak Hadir</h3>
          <Table striped bordered hover className="modern-table">
            <thead>
              <tr>
                <th style={{ width: "150px" }}>Nomor Upt</th>
                <th style={{ width: "150px" }}>Nama Upt</th>
              </tr>
            </thead>
            <tbody>
              {tidakHadirData.map((row) => (
                <tr key={row.id_upt}>
                  <td>{row.id_upt}</td>
                  <td>{row.nama_upt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RecapPage;
