# 💰 Simulasi Dana Masa Depan

Aplikasi web ini membantu mensimulasikan estimasi kebutuhan dana masa depan berdasarkan pengeluaran bulanan dan inflasi rata-rata tahunan. Cocok untuk perencanaan biaya pernikahan, pembelian mobil, atau kebutuhan finansial jangka menengah.

## 📌 Fitur Utama

- Pilihan sumber pengeluaran:
  - Berdasarkan **UMP Provinsi (Upah Minimum Provinsi)**
  - **Input manual** pengeluaran bulanan
- Estimasi pengeluaran masa depan berdasarkan inflasi rata-rata
- Perhitungan kebutuhan dana masa depan:
  - Biaya hidup selama 3 tahun setelah checkpoint umur
  - Biaya mobil (tetap): Rp 383.000.000
- Antarmuka sederhana dan responsif

---

## 📁 Struktur Proyek

```plaintext
/
├── index.html                # Antarmuka pengguna
├── style.css                 # Gaya tampilan
├── script.js                 # Logika perhitungan dan interaksi
├── assets/
│   ├── ump.json              # Data UMP provinsi
│   └── inflasi.json          # Data inflasi tahunan
└── README.md                 # Dokumentasi proyek
```

## 📦 Cara Menggunakan

1. **Buka** `index.html` di browser.
2. Pilih sumber pengeluaran:
- UMP Provinsi (pilih provinsi dari dropdown), atau
- Input manual pengeluaran bulanan
3. Masukkan:
- Tahun lahir
- Tahun sekarang
- Checkpoint umur
4. Klik tombol **Hitung**.
5. Hasil simulasi akan muncul berupa estimasi kebutuhan dana.

## 📊 Sumber Data
1. **UMP (Upah Minimum Provinsi)**
File: `assets/ump.json`
Data diambil dari daftar upah minimum provinsi di Indonesia

2. **Inflasi**
File: `assets/inflasi.json`
Berisi data inflasi Indonesia tahunan sejak 1981 hingga 2023, digunakan untuk menghitung rata-rata inflasi tahunan.

Data dikonversi dari file Excel menjadi JSON menggunakan alat seperti:
- https://tableconvert.com/excel-to-json
- Python script
- Alat konversi Excel lainnya

## 🧑‍💻 Teknologi yang Digunakan
- **HTML5** – struktur dan elemen antarmuka
- **CSS3** – desain dan responsivitas tampilan
- **JavaScript (Vanilla)** – logika perhitungan dan DOM interaksi
- **JSON** – data dinamis (UMP dan inflasi)
- Tidak membutuhkan backend – sepenuhnya berjalan di sisi client (browser)

## 📄 Lisensi
Proyek ini bersifat **open source** dan bebas digunakan untuk:
- Edukasi
- Penelitian
- Perencanaan keuangan pribadi
Jika Anda ingin memodifikasi atau membagikan, silakan mencantumkan kredit kepada pembuat dan menyertakan data sumber yang sesuai.