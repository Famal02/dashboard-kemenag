const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Library untuk generate string unik
const cors = require('cors'); // Tambahan: Biar bisa diakses dari React

const app = express();
app.use(cors()); // Aktifkan CORS

// Simulasi database sederhana di memori
let apiKeys = [];

app.use(express.json());

// 1. Endpoint untuk MEMBUAT API Key
app.post('/generate-key', (req, res) => {
    const newKey = uuidv4(); // Menghasilkan string seperti: '1b9d6bcd-bbfd-4b2d...'
    apiKeys.push(newKey);    // Simpan ke database

    console.log(`[Key Baru Dibuat] ${newKey}`); // Logging biar kelihatan di terminal
    res.json({ apiKey: newKey });
});

// 2. Endpoint yang DIPROTEKSI (Harus pakai API Key)
app.get('/data-rahasia', (req, res) => {
    const userKey = req.headers['x-api-key']; // Pastikan Header client ngirim 'x-api-key'

    if (apiKeys.includes(userKey)) {
        res.json({ message: "Akses diterima! Ini data rahasianya." });
    } else {
        res.status(401).json({ message: "API Key tidak valid!" });
    }
});

app.listen(5000, () => console.log('Server jalan di port 5000'));
