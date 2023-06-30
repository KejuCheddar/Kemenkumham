import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/dataAct")
      .then((res) => setData(res.data[0]))
      .catch((err) => console.log(err));
  };

  return <h1>{data.nama_kegiatan}</h1>;
}
