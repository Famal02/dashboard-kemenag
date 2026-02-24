#  GLOBAL THEME CONSISTENCY - AUTO-APPLY

## Tujuan
Membuat **semua elemen** (card, tabel, section, spacing, tinggi, lebar) **konsisten secara otomatis** tanpa perlu mengubah kode di setiap halaman.

---

##  Yang Dilakukan

### 1.  **Spacing Konsisten (24px)**
Semua Row otomatis punya spacing 24px:

```css
.kemenag-page .row,
.kemenag-container .row {
    margin-bottom: 24px; /* Auto 24px */
}
```

**Efek:**
-  Tidak perlu `className="mb-4"` lagi
-  Semua row otomatis spacing 24px
-  Row terakhir otomatis margin 0

---

### 2.  **Card Sama Tinggi**
Card dalam 1 row otomatis sama tinggi:

```css
.kemenag-page .row .card {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}
```

**Efek:**
-  Card di Dashboard (Wakaf Chart & Top 5) otomatis sama tinggi
-  Card di Wakaf (Map & Table) otomatis sama tinggi
-  Card di ZIS otomatis sama tinggi

---

### 3.  **Card dengan Chart/Table = 400px**
Card yang punya chart, table, atau map otomatis min-height 400px:

```css
.kemenag-page .card:has(.apexcharts-canvas),
.kemenag-page .card:has(.table),
.kemenag-page .card:has(.jvectormap-container) {
    min-height: 400px;
}
```

**Efek:**
-  Semua chart card tinggi 400px
-  Semua table card tinggi 400px
-  Semua map card tinggi 400px

---

### 4.  **Table Konsisten**
Semua table otomatis punya styling yang sama:

```css
/* Table header sticky */
.kemenag-page .card .table thead {
    position: sticky;
    top: 0;
    background: var(--kemenag-primary);
}

/* Table max-height */
.kemenag-page .card .table-responsive {
    max-height: 400px;
    overflow-y: auto;
}
```

**Efek:**
-  Header table sticky saat scroll
-  Table max-height 400px
-  Hover effect konsisten
-  Warna konsisten

---

### 5.  **Grid Alignment**
Kolom dalam row otomatis sejajar:

```css
.kemenag-page .row > [class*="col-"] {
    display: flex;
    flex-direction: column;
}

.kemenag-page .row > [class*="col-"] > .card {
    flex: 1;
}
```

**Efek:**
-  Card dalam row otomatis sejajar vertikal
-  Tidak ada card yang "turun"

---

### 6.  **Section Title Konsisten**
Semua title otomatis sama:

```css
.kemenag-page h5.kemenag-title,
.kemenag-page h5.fw-bold {
    font-size: 20px !important;
    margin-bottom: 16px !important;
    color: var(--kemenag-primary);
}
```

**Efek:**
-  Semua title ukuran 20px
-  Margin bottom 16px
-  Warna Blue Fusion

---

### 7.  **Map Container Konsisten**
Semua map otomatis tinggi 400px:

```css
.kemenag-page .jvectormap-container {
    min-height: 400px;
    background: var(--kemenag-background);
    border-radius: 8px;
}
```

**Efek:**
-  Map di Wakaf tinggi 400px
-  Map di ZIS tinggi 400px
-  Map di Rumah Ibadah tinggi 400px

---

### 8.  **Responsive**
Otomatis menyesuaikan di mobile:

```css
@media (max-width: 768px) {
    .kemenag-page .card:has(.apexcharts-canvas),
    .kemenag-page .card:has(.table),
    .kemenag-page .card:has(.jvectormap-container) {
        min-height: auto; /* Hapus min-height */
    }
    
    .kemenag-page .row {
        margin-bottom: 16px; /* Spacing lebih kecil */
    }
}
```

---

##  Perbandingan

### Sebelum (Manual):
```javascript
// Harus set manual di setiap halaman
<Row className="mb-4">  {/* Manual */}
<Card style={{ minHeight: '400px' }}>  {/* Manual */}
<Table className="custom-table">  {/* Manual */}
```

**Masalah:**
-  Harus set manual di setiap file
-  Bisa lupa atau beda-beda
-  Sulit maintain

### Sesudah (Auto):
```javascript
// Otomatis dari global CSS
<Row>  {/* Auto 24px margin */}
<Card>  {/* Auto min-height 400px jika ada chart/table */}
<Table>  {/* Auto styling konsisten */}
```

**Keuntungan:**
-  Otomatis apply ke semua halaman
-  Konsisten tanpa effort
-  Mudah maintain

---

##  Apa yang Konsisten Sekarang?

###  Spacing
- Row margin: 24px (desktop), 16px (mobile)
- Section title margin: 16px
- Alert margin: 16px

###  Tinggi
- Card dengan chart: 400px (desktop), 300px (tablet), auto (mobile)
- Card dengan table: 400px (desktop), 300px (tablet), auto (mobile)
- Card dengan map: 400px (desktop), 300px (tablet), auto (mobile)
- Stats card: 140px
- Table max-height: 400px

###  Lebar
- Container: 2000px max-width
- Padding horizontal: 200px (desktop), 100px (tablet), 20px (mobile)

###  Warna
- Table header: Blue Fusion (#375673)
- Table header text: Cloud Dancer (#f0eee9)
- Table row hover: Golden Mist 10% opacity
- Title: Blue Fusion (#375673)

###  Alignment
- Card dalam row: Sama tinggi
- Kolom dalam row: Sejajar vertikal
- Table header: Sticky saat scroll

---

##  Testing

Refresh browser (Ctrl + F5) dan cek:

### Dashboard
- [ ] Stats cards spacing 24px? 
- [ ] ZIS chart spacing 24px? 
- [ ] Penyaluran chart spacing 24px? 
- [ ] Wakaf Chart & Top 5 Provinsi sama tinggi? 
- [ ] Semua section sejajar? 

### Wakaf
- [ ] Section spacing 24px? 
- [ ] Map & Table sama tinggi (400px)? 
- [ ] Map background Cloud Dancer? 

### ZIS
- [ ] Section spacing 24px? 
- [ ] Map & Table sama tinggi (400px)? 
- [ ] Table header sticky? 

### Rumah Ibadah
- [ ] Section spacing 24px? 
- [ ] Map & Table sama tinggi (400px)? 
- [ ] Padding horizontal 200px? 

---

##  Cara Kerja

### Auto-Detection
CSS menggunakan `:has()` selector untuk detect:
- Card punya chart? → min-height 400px
- Card punya table? → min-height 400px
- Card punya map? → min-height 400px

### Auto-Apply
CSS apply ke semua elemen di dalam:
- `.kemenag-page`
- `.kemenag-container`
- `.rumah-ibadah-page`

### No Code Change Needed
Tidak perlu ubah kode di halaman manapun!

---

##  File yang Dimodifikasi

**Total: 1 file**

1.  `src/assets/scss/kemenag-theme.css`
   - Tambah Global Consistency Rules (180+ baris)
   - Auto-apply ke semua halaman
   - Responsive built-in

---

##  Benefit

### Untuk Developer:
-  Tidak perlu set manual di setiap halaman
-  Konsisten otomatis
-  Mudah maintain
-  Satu tempat untuk update

### Untuk User:
-  Visual konsisten di semua halaman
-  Spacing sama
-  Tinggi card sama
-  Tidak ada section yang tidak rata
-  Professional look

---

**Update:** 2026-02-10 21:50  
**Status:**  GLOBAL THEME CONSISTENCY - AUTO-APPLY KE SEMUA HALAMAN
