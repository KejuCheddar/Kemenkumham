import React, { useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const styles = StyleSheet.create({
  container: {
    fontFamily: "Courier",
    fontSize: 12,
    marginBottom: "20pt",
  },
  timestamp: {
    marginBottom: "10pt",
  },
  downloadButton: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    cursor: "pointer",
  },
});

const PDFButton = ({ hadirData, tidakHadirData, namaKegiatan }) => {
  const [showAlert, setShowAlert] = useState(false);

  const generatePDF = () => {
    const MyDocument = () => (
      <Document>
        <Page size="A4">
          <View style={styles.container}>
            <View style={styles.timestamp}>
              <Text>{namaKegiatan}</Text>
              <Text>{moment().format("MMMM Do YYYY, h:mm:ss a")}</Text>
            </View>
            <Text>Hadir</Text>
            <View style={{ marginBottom: "10pt" }}>
              {hadirData.map((row) => (
                <Text key={row.id_upt}>
                  Nomor: {String(row.id_upt).padStart(2, "0")}, Nama:{" "}
                  {row.nama_upt}
                </Text>
              ))}
            </View>
            <Text>Tidak Hadir</Text>
            <View>
              {tidakHadirData.map((row) => (
                <Text key={row.id_upt}>
                  Nomor: {String(row.id_upt).padStart(2, "0")}, Nama :{" "}
                  {row.nama_upt}
                </Text>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );

    const handleDownload = () => {
      setShowAlert(true);
    };

    const pdfBlob = (
      <>
        <PDFDownloadLink
          document={<MyDocument />}
          fileName={`output_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`}>
          {({ blob, url, loading, error }) => (
            <button
              style={styles.downloadButton}
              disabled={loading}
              onClick={handleDownload}>
              {loading ? "Menghasilkan PDF..." : "Unduh PDF"}
            </button>
          )}
        </PDFDownloadLink>
        <Snackbar
          open={showAlert}
          autoHideDuration={1000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <MuiAlert
            onClose={() => setShowAlert(false)}
            severity="success"
            sx={{ width: "100%" }}>
            Mengunduh PDF
          </MuiAlert>
        </Snackbar>
      </>
    );

    return pdfBlob;
  };

  return <div>{generatePDF()}</div>;
};

export default PDFButton;
