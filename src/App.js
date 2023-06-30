import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RecapPage from "./componentsabsensi/RecapPage";
import InputForm from "./componentsabsensi/InputForm";
import OutputForm from "./componentsabsensi/OutputForm";
import DataBarang from "./componentsbarang/DataBarang";
import EditBarang from "./componentsbarang/EditBarang";
import RekapBarang from "./componentsbarang/RekapData";
import TambahBarang from "./componentsbarang/TambahBarang";

import DataUser from "./componentsuser/DataUser";

import Register from "./components/register";
import Login from "./components/login";
import PrivateRoutes from "./tools/PrivateRoutes";
import "./App.css"
import Gabungan from "./components/Gabungan";
import EditUser from "./componentsuser/EditUser";



function MainContent() {
  const location = useLocation();

  return (
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route element={<PrivateRoutes location={location} />}>
      <Route path="/Gabungan" element={<Gabungan />} />
        <Route path="/recapage" element={<RecapPage />} />
        <Route path="/input" element={<InputForm />} />
        <Route path="/output" element={<OutputForm />} />
        <Route path="/databarang" element={<DataBarang />} />
        <Route path="/dataBarang/editBarang/:id" element={<EditBarang />} />
        <Route path="/dataBarang/rekapData" element={<RekapBarang />} />
        <Route path="/dataBarang/tambahBarang" element={<TambahBarang />} />

        <Route path="/dataUser" element={<DataUser />} />
        <Route path="/dataUser/editUser/:id" element={<EditUser />} />

        </Route>
      </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  )
}

export default App;