const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "src/images")));


pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected to MySQL Database...");
  connection.release();
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

// Konfigurasi penyimpanan file menggunakan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tentukan folder penyimpanan file
    cb(null, "./src/images/");
  },
  filename: function (req, file, cb) {
    // Tentukan nama file yang disimpan
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

// Membuat middleware multer dengan batasan ukuran file
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Batasan ukuran file (5 MB)
});

//mengambil data pada upt_dinas
app.get("/api/dataUpt", (req, res) => {
  const sql = "SELECT * FROM upt_dinas";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res
        .status(500)
        .json({
          message: "Terjadi kesalahan saat mengambil data."
        });
      return;
    }

    // Modify each row by adding a new property "isChecked" based on the absensi value
    const data = result.map((row) => ({
      ...row,
      isChecked: row.absensi === "Hadir",
    }));

    res.json(data);
  });
});

//menambahkan data pada upt_dinas
app.get("/api/dataUpt", (req, res) => {
  const {
    nama_upt,
    absensi
  } = req.body;
  const sql = `INSERT INTO upt_dinas (id_upt, nama_upt, absensi) VALUES ('', '${nama_upt}', '${absensi}')`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json({
      message: "Data berhasil ditambahkan."
    });
  });
});

// Updating data in upt_dinas based on checkbox selection
app.post("/api/updateDataUpt", (req, res) => {
  const {
    selectedRows
  } = req.body;

  // Map through the selected rows and update the absensi field based on the checkbox selection
  const updatePromises = selectedRows.map((rowId) => {
    const absensi = rowId ? "Hadir" : "Tidak Hadir";
    return new Promise((resolve, reject) => {
      const sql = `UPDATE upt_dinas SET absensi = ? WHERE id_upt = ?`;
      pool.query(sql, [absensi, rowId], (err, result) => {
        if (err) reject(err);
        resolve();
      });
    });
  });

  // Execute all update promises
  Promise.all(updatePromises)
    .then(() => {
      res.json({
        message: "Data berhasil diperbarui."
      });
    })
    .catch((err) => {
      console.error("Error updating data:", err);
      res
        .status(500)
        .json({
          message: "Terjadi kesalahan saat memperbarui data."
        });
    });
});

// Update dataUpt with the provided ID
app.put("/api/dataUpt/:id", (req, res) => {
  const {
    id
  } = req.params;
  const {
    absensi
  } = req.body;

  console.log("absensi value:", absensi); // Log the value of absensi

  const sql = `UPDATE upt_dinas SET absensi = '${absensi}' WHERE id_upt = ${id}`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json({
      message: "Data berhasil diperbarui."
    });
  });
});

// Add a new route for handling the search request
app.get("/api/dataUpt/search", (req, res) => {
  const searchTerm = req.query.q; // Get the search query parameter from the request
  // Modify your database query to include the search term
  const sql = "SELECT * FROM upt_dinas WHERE nama_upt LIKE ? OR id_upt LIKE ?";
  const searchValue = `%${searchTerm}%`;
  pool.query(sql, [searchValue, searchValue], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/api/dataAct", (req, res) => {
  const {
    nama_kegiatan
  } = req.query;

  let sql = `
    SELECT id_kegiatan, nama_kegiatan, recap, waktu
    FROM kegiatan`;

  if (nama_kegiatan) {
    sql += ` WHERE nama_kegiatan = '${nama_kegiatan}'`;
  }

  pool.query(sql, (err, kegiatanResult) => {
    if (err) {
      console.error("Error executing select query for kegiatan:", err);
      res.status(500).json({
        message: "Internal server error"
      });
      return;
    }

    const recapValues = kegiatanResult.map((row) => row.recap).join().split(","); // Split all recap values

    const updateQueries = recapValues.map((value, index) => {
      const absensi = value === "Hadir" ? "Hadir" : "Tidak Hadir";

      const updateQuery = `
        UPDATE upt_dinas
        SET absensi = ?
        WHERE id_upt = ?`;

      return new Promise((resolve, reject) => {
        pool.query(updateQuery, [absensi, index + 1], (err, updateResult) => {
          if (err) {
            console.error("Error executing update query:", err);
            reject(err);
          } else {
            console.log("Data updated:", updateResult);
            resolve();
          }
        });
      });
    });

    Promise.all(updateQueries)
      .then(() => {
        const selectQuery = `
          SELECT *
          FROM upt_dinas`;
        pool.query(selectQuery, (err, uptResult) => {
          if (err) {
            console.error("Error executing select query for upt_dinas:", err);
            res.status(500).json({
              message: "Internal server error"
            });
            return;
          }

          const responseData = {
            kegiatan: kegiatanResult,
            upt_dinas: uptResult
          };

          res.json(responseData.kegiatan); // Send only kegiatan data using res.json
        });
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        res.status(500).json({
          message: "Internal server error"
        });
      });
  });
});

app.put("/api/dataAct", (req, res) => {
  const {
    nama_kegiatan
  } = req.body;
  const insertQuery = `
    INSERT INTO kegiatan (nama_kegiatan, waktu, recap)
    SELECT ?, CURRENT_TIMESTAMP, GROUP_CONCAT(absensi SEPARATOR ',')
    FROM upt_dinas`;

  pool.query(insertQuery, [nama_kegiatan], (err, result) => {
    if (err) {
      console.error("Error executing insert query:", err);
      res.status(500).json({
        message: "Internal server error"
      });
      return;
    }

    res.json({
      message: "Data inserted successfully"
    });
  });
});

// ...

app.get("/api/DataAct/:nama", (req, res) => {
  const {
    nama
  } = req.params;

  const selectQuery = `
    SELECT nama_kegiatan, waktu
    FROM kegiatan`;

  pool.query(selectQuery, [nama], (err, result) => {
    if (err) {
      console.error("Error executing select query:", err);
      res.status(500).json({
        message: "Internal server error"
      });
      return;
    }

    res.json(result);
  });
});

// mengambil data pada tabel barang
app.get("/api/dataBarang", (req, res) => {
  const sql = "SELECT * FROM barang";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Endpoint untuk menambahkan data barang
app.post("/api/dataBarang", upload.single("foto"), (req, res) => {
  const { id_barang, tipe_barang, nama_barang, code_barang, jumlah, status } =
    req.body;
  const gambar = req.file.filename;
  const sql = `INSERT INTO barang (id_barang, tipe_barang, nama_barang, code_barang, jumlah, status, gambar) VALUES ('${id_barang}', '${tipe_barang}', '${nama_barang}', '${code_barang}', '${jumlah}', '${status}', '${gambar}')`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: "Data berhasil ditambahkan." });
  });
});

// mengambil data siswa berdasarkan ID
app.get("/api/dataBarang/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM barang WHERE id_barang = ?";
  pool.query(sql, id, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put("/api/dataBarang/:id", upload.single("foto"), (req, res) => {
  const id = req.params.id;
  const getPicQuery = "SELECT gambar FROM barang WHERE id_barang = ?";
  pool.query(getPicQuery, id, (err, result) => {
    if (err) throw err;
    const oldPic = result[0].gambar;
    const oldPicPath = path.join(__dirname, "src/images", oldPic);
    fs.unlink(oldPicPath, (err) => {
      if (err) console.log(err);
    });
  });
  const gambar = req.file.filename;
  const { tipe_barang, nama_barang, code_barang, jumlah, status } = req.body;
  const sql =
    "UPDATE barang SET tipe_barang = ?, nama_barang = ?, code_barang = ?, jumlah = ?, status = ?, gambar = ? WHERE id_barang = ?";
  pool.query(
    sql,
    [tipe_barang, nama_barang, code_barang, jumlah, status, gambar, id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Data berhasil diperbarui." });
    }
  );
});

app.delete("/api/dataBarang/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM barang WHERE id_barang = ?";
  pool.query(sql, id, (err, result) => {
    if (err) throw err;
    res.json({ message: "Data berhasil dihapus." });
  });
});

app.delete("/api/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const path = `./src/images/${filename}`;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal menghapus file." });
    } else {
      res.json({ message: "File berhasil dihapus." });
    }
  });
});

// LOGIN PART

// memeriksa apakah user terautentikasi saat melakukan login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM user WHERE username = ?";
  pool.query(sql, [username], async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const storedPassword = result[0].password;

      // Compare passwords without bcrypt
      if (password === storedPassword) {
        const id_user = result[0].id_user;
        res.json({ id_user });
      } else {
        res.status(401).json({ message: "Password salah." });
      }
    } else {
      res.status(404).json({ message: "Username tidak ditemukan." });
    }
  });
});


// mengambil data pada user
app.get("/api/dataUser", (req, res) => {
  const sql = "SELECT * FROM user";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/api/dataUser", (req, res) => {
  const { username, password } = req.body;
  const checkUsernameSql = `SELECT * FROM user WHERE username = '${username}'`;

  pool.query(checkUsernameSql, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // Username already exists
      res.status(400).json({ error: "Username already exists." });
    } else {
      // Insert the new user into the database
      const insertUserSql = `INSERT INTO user (id_user, username, password) VALUES ('', '${username}', '${password}')`;

      pool.query(insertUserSql, (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: "Data berhasil ditambahkan." });
      });
    }
  });
});



app.put("/api/dataUser/:id", (req, res) => {
  const id = req.params.id;
  const { username, password } = req.body;
  const sql = "UPDATE user SET username = ?, password = ? WHERE id_user = ?";
  pool.query(sql, [username, password, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update data." });
    } else {
      res.json({ message: "Data berhasil diperbarui." });
    }
  });
});


// menghapus data user berdasarkan ID
app.delete("/api/dataUser/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM user WHERE id_user = ?";
  pool.query(sql, id, (err, result) => {
    if (err) throw err;
    res.json({
      message: "Data berhasil dihapus."
    });
  });
});