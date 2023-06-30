import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Form, Pagination } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Datauser = () => {
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
      .get("http://localhost:5000/api/dataUser")
      .then((response) => setData(response.data))
      .catch((err) => console.error(err));
  };

  const handleEdit = (id) => {
    navigate(`/dataUser/editUser/${id}`);
  };

  const hanleKembali = () => {
    navigate(`/gabungan`);
  };

  const handleDeleteBarang = (index, gambar) => {
    const confirmDelete = window.confirm(
      "Anda yakin ingin menghapus barang ini?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/api/dataUser/${index}`)
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

    return (
      item.username.toLowerCase().includes(searchLower) ||
      item.password.toLowerCase().includes(searchLower)
    );
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      const tableHeaders = ["ID", "Username", "Password"];
      const tableData = [];

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const currentItems = filteredData.slice(startIndex, endIndex);

      currentItems.forEach((item, index) => {
        const rowData = [startIndex + index + 1, item.username, item.password];
        tableData.push(rowData);
      });

      doc.text(`user - Page ${currentPage}`, 5, 5);
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
      });

      currentPage++;

      if (currentPage <= totalPages) {
        doc.addPage();
        generatePage();
      } else {
        doc.save("login.pdf");
      }
    };

    generatePage();
  };

  return (
    <div className="container">
      <div style={{ paddingBottom: "55px" }}>
        <h3
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
          Login
        </h3>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button
            onClick={hanleKembali}
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
            placeholder="Cari user..."
            value={search}
            onChange={handleSearch}
          />
          <Form.Text className="text-muted">
            Cari Berdasarkan Tipe BMN, Nama BMN, Code BMN, Jumlah BMN, Status
            BMN
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
                Username
              </th>
              <th
                className="table-header"
                style={{ backgroundColor: "#0085EA" }}
              >
                Password
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
              <tr key={index}>
                <td style={{ paddingTop: "45px" }}>{index + 1}</td>
                <td style={{ paddingTop: "45px" }}>{item.username}</td>
                <td style={{ paddingTop: "45px" }}>{item.password}</td>
                <td style={{ paddingTop: "30px" }}>
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="outline-dark"
                      onClick={() => handleEdit(item.id_user)}
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
                        handleDeleteBarang(item.id_user, item.gambar)
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
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <BsChevronLeft />
          </Pagination.Prev>
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
          >
            <BsChevronRight />
          </Pagination.Next>
        </Pagination>
      </center>
    </div>
  );
};

export default Datauser;
