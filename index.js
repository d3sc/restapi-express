const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./connection')
const port = 3000
const response = require('./response')
const cors = require("cors")

const corsOption = {
    origin: "*",
    optionsSuccessStatus: 200,
}

app.use(cors(corsOption))
app.use(bodyParser.json())

// http://localhost:3000/
app.get('/', (req, res) => {
    const sql = "SELECT * FROM mahasiswa"
    db.query(sql, (error, result) => {
        response(200, result, "get all data from mahasiswa", res)
    })
})

// http://localhost:3000/find?nim=1001
app.get('/find', (req, res) => {
    const sql = `SELECT * FROM mahasiswa WHERE nim = ${req.query.nim}`
    db.query(sql, (error, result) => {
        response(200, result, "find mahasiswa name", res)
    })
})

// http://localhost:3000/update?nim=1001
app.put('/update', (req, res) => {
    const nim = req.query.nim
    const { nama_lengkap, kelas, alamat } = req.body;
    if (nim && (nama_lengkap || kelas || alamat)) {
        const query = `UPDATE mahasiswa SET nama_lengkap = "${nama_lengkap}", kelas = "${kelas}", alamat = "${alamat}" WHERE nim = ${nim}`
        db.query(query, (error, result) => {
            if (error) {
                response(500, { error: error.message }, "Error saat mengupdate data", res);
            } else {
                response(200, { affectedRows: result.affectedRows }, "Data berhasil diupdate", res);
            }
        });
    } else {
        response(400, {}, "NIM dan setidaknya satu field lain harus disertakan", res);
    }
});

// http://localhost:3000/create
app.post('/create', (req, res) => {
    const { nim, nama_lengkap, kelas, alamat } = req.body
    if (nim && nama_lengkap && kelas && alamat) {
        const insertSql = "INSERT INTO mahasiswa (nim, nama_lengkap, kelas, alamat) VALUES (?, ?, ?, ?)"
        db.query(insertSql, [nim, nama_lengkap, kelas, alamat], (error, result) => {
            response(200, result, "Data berhasil dibuat!", res)
        })
    }
})

// http://localhost:3000/delete?nim=1001
app.delete("/delete", (req, res) => {
    const nim = req.query.nim
    const sql = "DELETE FROM mahasiswa WHERE nim = ?"
    db.query(sql, [nim], (error, result) => {
        response(200, result, "delete mahasiswa " + nim, res)
    })
})

// http://localhost:3000/create/user
app.post('/create/user', (req, res) => {
    const { username, email, password } = req.body
    if (username && email && password) {
        const insertSql = "INSERT INTO user (username ,email, password) VALUES (?, ?, ?)"
        db.query(insertSql, [username, email, password], (error, result) => {
            res.send('buat data berhasil')
        })
    }
})

// http://localhost:3000/login
app.post('/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.send("email dan password tidak boleh kosong")

    const sql = `SELECT * FROM user WHERE email = "${email}" AND password = "${password}"`
    db.query(sql, (error, result) => {
        if (result.length == 0) return res.send("login error")
        res.send('login berhasil')
    })
})

app.put('/username', (req, res) => {
    console.log({ updateData: req.body })
    res.send('update berhasil')
})

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})
