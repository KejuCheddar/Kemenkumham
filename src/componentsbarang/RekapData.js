import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Image, Form, Pagination } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RekapBarang = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/dataBarang")
      .then((response) => setData(response.data))
      .catch((err) => console.error(err));
  };

  const handleKembali = () => {
    navigate(`/`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  
  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const itemDate = new Date(item.modified);
    const formattedDate = `${itemDate.getDate()}/${itemDate.getMonth() + 1}/${itemDate.getFullYear()}, ${itemDate.toLocaleTimeString()}`;

    return (
      item.nama_barang.toLowerCase().includes(searchLower) ||
      item.tipe_barang.toLowerCase().includes(searchLower) ||
      item.code_barang.toLowerCase().includes(searchLower) ||
      item.jumlah.toString().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      formattedDate.includes(search)
    );
  });

  // membuat data filter 3 kategori: bagus, rusak, hilang
  const bagusData = filteredData.filter((item) => item.status.toLowerCase() === "bagus");
  const rusakData = filteredData.filter((item) => item.status.toLowerCase() === "rusak");
  const hilangData = filteredData.filter((item) => item.status.toLowerCase() === "hilang");

  // Pagination logic for each table
  const getPaginatedData = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Menghitung jumlah total dari suatu kategori barang
  const getTotalJumlah = (items) => {
    const total = items.reduce((accumulator, item) => accumulator + item.jumlah, 0);
    return total;
  };

  const handlePageChange = (pageNumber, category) => {
    let numPages;
    let tableData;

    if (category === "bagus") {
      tableData = bagusData;
      numPages = Math.ceil(tableData.length / itemsPerPage);

      if (pageNumber >= 1 && pageNumber <= numPages) {
        setCurrentPage(pageNumber);
      } else if (pageNumber < 1) {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1);
    }
  };

  const renderTable = (tableData, title, category) => {
    const numPages = Math.ceil(tableData.length / itemsPerPage);
    const pageNumbers = Array.from({ length: numPages }, (_, index) => index + 1);

    const handleDownloadPDF = () => {
      const doc = new jsPDF();

      const totalPages = numPages;
      let currentPage = 1;

      const generatePage = () => {
        const tableHeaders = ["ID", "Tipe BMN", "Nama BMN", "Kode BMN", "Jumlah BMN", "Status BMN", "Tanggal Perubahan"];
        const tableBody = [];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const currentItems = tableData.slice(startIndex, endIndex);

        currentItems.forEach((item, index) => {
          const rowData = [
            index + 1,
            item.tipe_barang,
            item.nama_barang,
            item.code_barang,
            item.jumlah,
            item.status,
            new Date(item.modified).toLocaleString(),
          ];
          tableBody.push(rowData);
        });

        doc.text(`${title} - Page ${currentPage}`, 10, 10);
        doc.autoTable({
          head: [tableHeaders],
          body: tableBody,
        });

        currentPage++;

        if (currentPage <= totalPages) {
          doc.addPage();
          generatePage();
        } else {
          doc.save(`${title}.pdf`);
        }
      };

      generatePage();
    };

    return (
      <>
      <div style={{display: 'flex', justifyContent: "space-between"}}>
          <div>
            <h2>{title}</h2>
            <strong>Total Jumlah: {getTotalJumlah(tableData)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: '20px', paddingBottom : '10px' }}>
            <Button
              variant="primary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </div>
        </div>
        <Table striped bordered hover>
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Tipe BMN</th>
              <th>Nama BMN</th>
              <th>Kode BMN</th>
              <th>Jumlah BMN</th>
              <th>Status BMN</th>
              <th>Tanggal Perubahan</th>
              <th>Gambar BMN</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center", justifyContent: "center" }}>
            {getPaginatedData(tableData).map((item) => (
              <tr key={item.id_barang}>
                <td>{item.id_barang}</td>
                <td>{item.tipe_barang}</td>
                <td>{item.nama_barang}</td>
                <td>{item.code_barang}</td>
                <td>{item.jumlah}</td>
                <td>{item.status}</td>
                <td>{new Date(item.modified).toLocaleString()}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Image
                      src={`http://localhost:5000/images/${item.gambar}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: "100px",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1, category)}
              disabled={currentPage === 1}
            >
              <BsChevronLeft />
            </Pagination.Prev>
            {pageNumbers.map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number, category)}
              >
                {number}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1, category)}
              disabled={currentPage === numPages}
            >
              <BsChevronRight />
            </Pagination.Next>
          </Pagination>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <div style={{ paddingBottom: "40px" }}>
        <h1
          className="text-center my-4"
          style={{
            backgroundColor: "#87CEFA",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            fontFamily: "roboto",
          }}
        >
          REKAP BMN SUBBAG HURMAS, RB, TI KANWIL KUMHAM DKI JAKARTA
        </h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button
            onClick={handleKembali}
            className="mb-2"
            variant="outline-primary"
            style={{
              fontSize: "17px",
              padding: "5px 20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            Kembali
          </Button>
        </div>
        <Form className="mb-3">
          <Form.Control
            style={{
              width: "450px",
              borderWidth: "2px",
              borderColor: "black",
              alignItems: "end",
            }}
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={handleSearch}
          />
          <Form.Text className="text-muted">
            Cari Berdasarkan Tipe BMN, Nama BMN, Code BMN, Jumlah BMN, Status BMN, <br />
            dan Tanggal Perubahan
          </Form.Text>
        </Form>
      </div>
      <center>
        <h4 style={{ marginBottom: "35px", marginTop: "10px" }}>
          Total Jumlah Barang Bagus, Rusak, dan Hilang: {getTotalJumlah(bagusData) + getTotalJumlah(rusakData) + getTotalJumlah(hilangData)}
        </h4>
        {renderTable(bagusData, "Barang Bagus", "bagus")}
        {renderTable(rusakData, "Barang Rusak", "rusak")}
        {renderTable(hilangData, "Barang Hilang", "hilang")}
      </center>
    </div>
  );
};

export default RekapBarang;
