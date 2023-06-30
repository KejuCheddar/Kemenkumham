import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import PDFButton from "./PdfButton";
import { useNavigate } from "react-router-dom";

const OutputPage = () => {
  const [hadirData, setHadirData] = useState([]);
  const [tidakHadirData, setTidakHadirData] = useState([]);
  const [namaKegiatan, setNamaKegiatan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = () => {
  const apiUrl1 = "http://localhost:5000/api/dataUpt";
  const apiUrl2 = "http://localhost:5000/api/dataAct/nama";

  axios
    .all([axios.get(apiUrl1), axios.get(apiUrl2)])
    .then(
      axios.spread((response1, response2) => {
        const dataUpt = response1.data;
        const dataAct = response2.data;

        // Process dataUpt and extract hadirData and tidakHadirData
        const hadirData = dataUpt.filter((row) => row.absensi === "Hadir");
        const tidakHadirData = dataUpt.filter(
          (row) => row.absensi !== "Hadir"
        );
        console.log("Hadir Data:", hadirData);
        console.log("Tidak Hadir Data:", tidakHadirData);
        setHadirData(hadirData);
        setTidakHadirData(tidakHadirData);

        // Process dataAct and extract the desired information
        const recentDataAct = dataAct[dataAct.length - 1]; // Get the recently inserted data
        const namaKegiatan = recentDataAct.nama_kegiatan;
        setNamaKegiatan(namaKegiatan);
        console.log("Data Kegiatan:", namaKegiatan);
      })
    )
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Halaman Hasil</h2>
        <Button onClick={handleNavigate}>Kembali Ke Beranda</Button>
      </div>
      <div className="mb-3">
        <PDFButton
          hadirData={hadirData}
          tidakHadirData={tidakHadirData}
          namaKegiatan={namaKegiatan}
        />
      </div>
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
  );
};

export default OutputPage;
