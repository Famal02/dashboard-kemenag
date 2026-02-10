# Dashboard Kemenag RI

Dashboard eksekutif untuk monitoring data Zakat, Infaq, Sedekah (ZIS), Wakaf, dan Rumah Ibadah secara nasional.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## 📊 Fitur Utama

### 1. Dashboard Eksekutif
- Ringkasan data ZIS, Wakaf, dan Rumah Ibadah
- Statistik real-time
- Visualisasi data interaktif

### 2. Menu ZIS (Zakat, Infaq, Sedekah)
- Dashboard Nasional ZIS
- Laporan Dana (Peta Sebaran Penerimaan & Penyaluran)
- Komposisi penerimaan & penyaluran

### 3. Menu Wakaf
- Dashboard Wakaf Nasional
- Peta Sebaran Aset Wakaf Tanah
- Daftar Aset Wakaf dengan detail lengkap
- Pertumbuhan aset wakaf

### 4. Menu Rumah Ibadah
- Data Rumah Ibadah per provinsi
- Peta sebaran rumah ibadah
- Statistik nasional

## 🎨 Theme

**Kemenag Color Palette:**
- Primary: Blue Fusion `#375673`
- Background: Cloud Dancer `#f0eee9`
- Accent: Golden Mist `#d5cd94`

## 📁 Struktur Project

```
Admin/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, CSS, data
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   │   ├── Dashboard/   # Dashboard utama
│   │   ├── ZIS/         # Menu ZIS
│   │   ├── Wakaf/       # Menu Wakaf
│   │   └── RumahIbadah/ # Menu Rumah Ibadah
│   ├── helpers/         # API helpers
│   └── routes/          # Route configuration
└── .docs/               # Dokumentasi teknis (untuk developer)
```

## 🔧 Teknologi

- **React** - UI Framework
- **Reactstrap** - Bootstrap components
- **ApexCharts** - Data visualization
- **React Vector Maps** - Interactive maps
- **Leaflet** - Detailed location maps
- **Axios** - HTTP client

## 📱 Responsive Design

Dashboard fully responsive:
- Desktop: 200px horizontal padding
- Tablet: 100px horizontal padding
- Mobile: 20px horizontal padding

## 🌐 API Integration

API endpoints configured in `src/helpers/url_helper.js`:
- ZIS Data: Penerimaan & Penyaluran
- Wakaf Data: Aset tanah wakaf
- Rumah Ibadah Data: Data per provinsi

## 📝 Dokumentasi Lengkap

Dokumentasi teknis tersedia di folder `.docs/` (untuk developer).

## 👥 Support

Untuk pertanyaan atau bantuan, hubungi tim developer.

---

**© 2026 Kementerian Agama Republik Indonesia**
