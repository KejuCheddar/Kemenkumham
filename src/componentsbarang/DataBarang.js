import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Image, Form, Pagination } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataBarang = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const handleEdit = (id) => {
    navigate(`/dataBarang/editBarang/${id}`);
  };

  const handleTambah = () => {
    navigate(`/dataBarang/tambahBarang`);
  };

  const handleKembali = () => {
    navigate(`/Gabungan`);
  };

  const handleRekap = () => {
    navigate(`/dataBarang/rekapData`);
  };

  const handleDeleteBarang = (id, gambar) => {
    const confirmDelete = window.confirm(
      "Anda yakin ingin menghapus barang ini?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/api/dataBarang/${id}`)
        .then(() => {
          if (gambar) {
            axios
              .delete(`http://localhost:5000/api/images/${gambar}`)
              .catch((err) => console.error(err));
          }
          fetchData();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const itemDate = new Date(item.modified);
    const formattedDate = `${itemDate.getDate()}/${
      itemDate.getMonth() + 1
    }/${itemDate.getFullYear()}, ${itemDate.toLocaleTimeString()}`;

    return (
      item.nama_barang.toLowerCase().includes(searchLower) ||
      item.tipe_barang.toLowerCase().includes(searchLower) ||
      item.code_barang.toLowerCase().includes(searchLower) ||
      item.jumlah.toString().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      formattedDate.includes(search)
    );
  });

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    let currentPage = 1;

    const generatePage = () => {
      const tableHeaders = [
        "ID",
        "Jenis BMN",
        "Merek / Tipe BMN",
        "Kode BMN",
        "Jumlah BMN",
        "Status BMN",
        "Tanggal Perubahan",
      ];
      const tableData = [];

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const currentItems = filteredData.slice(startIndex, endIndex);

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
        tableData.push(rowData);
      });

      doc.text(
        `INVENTARIS BMN SUBBAG HURMAS, RB, TI KANWIL KUMHAM DKI JAKARTA - Page ${currentPage}`,
        10,
        10
      );
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
      });

      currentPage++;

      if (currentPage <= totalPages) {
        doc.addPage();
        generatePage();
      } else {
        doc.save("data_barang.pdf");
      }
    };

    generatePage();
  };

  return (
    <div className="container">
      <div style={{ paddingBottom: "55px" }}>
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
          INVENTARIS BMN SUBBAG HURMAS, RB, TI KANWIL KUMHAM DKI JAKARTA
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
              marginRight: "10px",
            }}
          >
            Kembali
          </Button>
          <Button
            onClick={handleTambah}
            className="mb-2"
            variant="outline-primary"
            style={{
              fontSize: "17px",
              padding: "5px 20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            Tambah Item
          </Button>
          <Button
            onClick={handleRekap}
            className="mb-2"
            variant="outline-primary"
            style={{
              fontSize: "17px",
              padding: "5px 20px",
              marginLeft: "10px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            Rekap Data BMN
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="mb-2"
            variant="outline-primary"
            style={{
              fontSize: "17px",
              padding: "5px 20px",
              marginLeft: "15px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            Unduh PDF
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
            Cari Berdasarkan Tipe BMN, Nama BMN, Code BMN, Jumlah BMN, Status
            BMN, <br />
            dan Tanggal Perubahan
          </Form.Text>
        </Form>
      </div>
      <center>
        <Table striped bordered hover>
          <thead style={{ textAlign: "center" }}>
            <tr style={{ backgroundColor: "#87CEFA" }}>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                ID
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Jenis BMN
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Merek / Tipe BMN
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Kode BMN
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Jumlah BMN
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Status BMN
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Tanggal Perubahan
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Gambar BMN
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center", justifyContent: "center" }}>
            {currentItems.map((item, index) => (
              <tr key={item.id_barang}>
                <td style={{ paddingTop: "45px" }}>{index + 1}</td>
                <td style={{ paddingTop: "45px" }}>{item.tipe_barang}</td>
                <td style={{ paddingTop: "45px" }}>{item.nama_barang}</td>
                <td style={{ paddingTop: "45px" }}>{item.code_barang}</td>
                <td style={{ paddingTop: "45px" }}>{item.jumlah}</td>
                <td style={{ paddingTop: "45px" }}>{item.status}</td>
                <td style={{ paddingTop: "45px" }}>
                  {new Date(item.modified).toLocaleString()}
                </td>
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
                <td style={{ paddingTop: "30px" }}>
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="outline-dark"
                      onClick={() => handleEdit(item.id_barang)}
                      className="me-2"
                      style={{
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Ubah
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() =>
                        handleDeleteBarang(item.id_barang, item.gambar)
                      }
                      style={{
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ color: "white", border: "none", margin: "5px" }}
            >
              <BsChevronLeft />
            </Pagination.Prev>
            {pageNumbers.map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
                style={{
                  backgroundColor: "#87CEFA",
                  color: "white",
                  border: "none",
                  margin: "5px",
                }}
              >
                {number}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
              style={{ color: "white", border: "none", margin: "5px" }}
            >
              <BsChevronRight />
            </Pagination.Next>
          </Pagination>
        </div>
      </center>
    </div>
  );
};

export default DataBarang;