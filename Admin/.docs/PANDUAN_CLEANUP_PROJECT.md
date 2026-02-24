#  PANDUAN PEMBERSIHAN PROJECT - AMAN & SISTEMATIS

##  Tujuan
Membersihkan project dari file, folder, code double, code menimpa, teks tidak berguna, dan dependency yang tidak terpakai **tanpa merusak fungsi website**.

---

##  PENTING: Backup Dulu!

### Sebelum Mulai:
```bash
# 1. Commit semua perubahan ke Git
git add .
git commit -m "Before cleanup"

# 2. Buat branch backup
git checkout -b backup-before-cleanup

# 3. Kembali ke branch utama
git checkout main
```

**Atau:** Copy folder `Admin/` ke tempat lain sebagai backup.

---

##  FASE 1: IDENTIFIKASI (Analisis Dulu, Jangan Hapus)

### 1.1. Cek Dependency yang Tidak Terpakai

#### Cara 1: Manual Check `package.json`
```bash
# Lihat semua dependency
npm list --depth=0
```

#### Cara 2: Gunakan Tool (Recommended)
```bash
# Install depcheck
npm install -g depcheck

# Jalankan analisis
depcheck
```

**Output:** List dependency yang tidak terpakai.

#### Dependency yang Kemungkinan Tidak Terpakai:
- `@fullcalendar/*` - Jika tidak ada kalender
- `chart.js` - Jika hanya pakai ApexCharts
- `react-chartjs-2` - Jika tidak dipakai
- `simplebar-react` - Jika tidak ada scrollbar custom
- `toastr` - Jika tidak ada notifikasi
- dll

** JANGAN HAPUS DULU!** Catat saja.

---

### 1.2. Cek File yang Tidak Digunakan

#### A. File Component yang Tidak Diimport

**Cara Manual:**
1. Buka folder `src/components/`
2. Cek setiap file
3. Search di project: Apakah file ini di-import?

**Contoh:**
```bash
# Cek apakah BitcoinNews.js dipakai
grep -r "BitcoinNews" src/
```

Jika tidak ada hasil → File tidak dipakai.

#### B. File Pages yang Tidak Di-route

**Cara:**
1. Buka `src/routes/allRoutes.js`
2. Lihat semua route yang terdaftar
3. Cek folder `src/pages/`
4. File yang tidak ada di route → Tidak dipakai

**Contoh File yang Mungkin Tidak Terpakai:**
- `src/pages/Calendar/` - Jika tidak ada route
- `src/pages/Crypto/` - Jika tidak dipakai
- `src/pages/Email/` - Jika tidak dipakai
- `src/pages/Ecommerce/` - Jika tidak dipakai
- dll

#### C. File CSS/SCSS yang Tidak Diimport

**Cara:**
```bash
# Cek file CSS yang tidak di-import
find src/ -name "*.css" -o -name "*.scss"
```

Lalu cek satu-satu apakah di-import di file JS.

---

### 1.3. Cek Code Double/Duplicate

#### A. Component yang Duplikat

**Contoh:**
- `PetaIndonesia.js` di folder ZIS
- `PetaIndonesia.js` di folder Wakaf (jika ada)

**Solusi:** Pindahkan ke `src/components/Common/` dan import dari sana.

#### B. CSS yang Duplikat

**Contoh:**
```css
/* Di file A */
.kemenag-card { ... }

/* Di file B (duplicate) */
.kemenag-card { ... }
```

**Solusi:** Hapus yang duplikat, pakai yang di global theme.

---

### 1.4. Cek Code yang Menimpa (Override)

#### A. CSS yang Saling Menimpa

**Contoh:**
```css
/* kemenag-theme.css */
.kemenag-page { padding: 24px; }

/* custom.css (menimpa) */
.kemenag-page { padding: 0; }
```

**Solusi:** Hapus yang menimpa, pakai satu sumber truth.

#### B. Inline Style yang Menimpa CSS

**Contoh:**
```javascript
<div className="kemenag-card" style={{ padding: '50px' }}>
  {/* Menimpa padding dari .kemenag-card */}
</div>
```

**Solusi:** Hapus inline style, pakai class CSS.

---

### 1.5. Cek Teks/Comment yang Tidak Berguna

#### A. Comment yang Tidak Perlu

**Contoh:**
```javascript
// TODO: Fix this later (sudah di-fix)
// console.log('debug') (sudah tidak perlu)
// Old code (sudah tidak dipakai)
```

#### B. Console.log yang Tertinggal

```javascript
console.log('test');
console.log('debug data:', data);
```

**Solusi:** Hapus semua console.log di production.

---

##  FASE 2: PEMBERSIHAN BERTAHAP

###  ATURAN EMAS:
1. **Hapus satu kategori per waktu**
2. **Test setelah setiap penghapusan**
3. **Commit setelah test berhasil**

---

### Step 1: Hapus Dependency yang Tidak Terpakai

#### Cara Aman:
```bash
# 1. Catat dependency yang akan dihapus
# Contoh: chart.js, toastr, @fullcalendar/core

# 2. Hapus satu per satu
npm uninstall chart.js

# 3. Test aplikasi
npm start

# 4. Jika error, install kembali
npm install chart.js

# 5. Jika OK, commit
git add package.json package-lock.json
git commit -m "Remove unused dependency: chart.js"

# 6. Ulangi untuk dependency lain
```

#### Dependency yang AMAN Dihapus (Jika Tidak Dipakai):
```bash
# Cek dulu dengan search di project!
npm uninstall @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
npm uninstall chart.js react-chartjs-2
npm uninstall toastr
npm uninstall simplebar-react
```

** JANGAN HAPUS:**
- `react`, `react-dom` - Core
- `reactstrap`, `bootstrap` - UI
- `apexcharts`, `react-apexcharts` - Charts (dipakai)
- `axios` - HTTP (dipakai)
- `react-router-dom` - Routing (dipakai)
- `@react-jvectormap/*` - Maps (dipakai)
- `leaflet`, `react-leaflet` - Maps (dipakai)

---

### Step 2: Hapus File Pages yang Tidak Dipakai

#### Cara Aman:
```bash
# 1. Identifikasi folder yang tidak dipakai
# Contoh: src/pages/Calendar/, src/pages/Email/

# 2. Rename dulu (jangan hapus langsung)
mv src/pages/Calendar src/pages/_Calendar_unused

# 3. Test aplikasi
npm start

# 4. Jika error, kembalikan
mv src/pages/_Calendar_unused src/pages/Calendar

# 5. Jika OK, hapus permanent
rm -rf src/pages/_Calendar_unused

# 6. Commit
git add .
git commit -m "Remove unused Calendar pages"
```

#### Folder yang Mungkin Tidak Terpakai:
- `src/pages/Calendar/` - Jika tidak ada route
- `src/pages/Email/` - Jika tidak ada route
- `src/pages/Ecommerce/` - Jika tidak ada route
- `src/pages/Crypto/` - Jika tidak ada route
- `src/pages/Chat/` - Jika tidak ada route
- `src/pages/Contacts/` - Jika tidak ada route
- `src/pages/Tasks/` - Jika tidak ada route

**Cara Cek:** Buka `src/routes/allRoutes.js` dan lihat route yang terdaftar.

---

### Step 3: Hapus File Components yang Tidak Dipakai

#### Cara Aman:
```bash
# 1. Cek apakah component dipakai
grep -r "BitcoinNews" src/

# 2. Jika tidak ada hasil, rename dulu
mv src/components/BitcoinNews.js src/components/_BitcoinNews_unused.js

# 3. Test aplikasi
npm start

# 4. Jika OK, hapus
rm src/components/_BitcoinNews_unused.js

# 5. Commit
git add .
git commit -m "Remove unused BitcoinNews component"
```

---

### Step 4: Hapus CSS/SCSS yang Tidak Dipakai

#### Cara Aman:
```bash
# 1. Identifikasi file CSS yang tidak di-import
# Contoh: custom-old.css

# 2. Comment dulu import-nya
# Di App.js atau index.js:
// import './assets/css/custom-old.css';

# 3. Test aplikasi
npm start

# 4. Jika OK, hapus file
rm src/assets/css/custom-old.css

# 5. Commit
git add .
git commit -m "Remove unused custom-old.css"
```

---

### Step 5: Bersihkan Code Double/Duplicate

#### A. Pindahkan Component Shared ke Common

**Contoh:**
```bash
# Jika PetaIndonesia dipakai di ZIS dan Wakaf
# Pindahkan ke Common
mv src/pages/ZIS/PetaIndonesia.js src/components/Common/PetaIndonesia.js

# Update import di ZIS
# Dari: import PetaIndonesia from "./PetaIndonesia";
# Jadi: import PetaIndonesia from "../../components/Common/PetaIndonesia";

# Update import di Wakaf juga
```

#### B. Hapus CSS Duplicate

**Cara:**
1. Cari CSS yang sama di beberapa file
2. Pindahkan ke `kemenag-theme.css` (global)
3. Hapus dari file lokal
4. Test

---

### Step 6: Hapus Console.log dan Comment

#### Cara Otomatis:
```bash
# Install tool untuk hapus console.log
npm install -g babel-plugin-transform-remove-console

# Atau manual: Search dan hapus satu-satu
# Di VS Code: Ctrl+Shift+F
# Search: console.log
# Hapus satu-satu
```

#### Cara Manual (Recommended):
1. Search `console.log` di project
2. Hapus yang tidak perlu
3. Sisakan yang penting untuk debugging
4. Test
5. Commit

---

##  FASE 3: VERIFIKASI & TESTING

### 3.1. Test Fungsionalitas

#### Checklist Testing:
- [ ] `npm start` - Aplikasi jalan tanpa error?
- [ ] Dashboard - Tampil normal?
- [ ] Menu ZIS - Berfungsi?
- [ ] Menu Wakaf - Berfungsi?
- [ ] Menu Rumah Ibadah - Berfungsi?
- [ ] Peta - Interaktif?
- [ ] Table - Data tampil?
- [ ] Chart - Render dengan baik?
- [ ] Responsive - Mobile OK?

### 3.2. Test Build Production

```bash
# Build untuk production
npm run build

# Jika berhasil, berarti semua dependency OK
# Jika error, ada dependency yang hilang
```

### 3.3. Check Bundle Size

```bash
# Setelah build, cek ukuran
ls -lh build/static/js/

# Bandingkan dengan sebelum cleanup
# Seharusnya lebih kecil
```

---

##  FASE 4: DOKUMENTASI HASIL

### 4.1. Catat Apa yang Dihapus

**Buat file:** `CLEANUP_LOG.md`

```markdown
# Cleanup Log - 2026-02-10

## Dependency Dihapus:
- chart.js (tidak dipakai)
- toastr (tidak dipakai)
- @fullcalendar/core (tidak dipakai)

## Folder Dihapus:
- src/pages/Calendar/ (tidak ada route)
- src/pages/Email/ (tidak ada route)

## File Dihapus:
- src/components/BitcoinNews.js (tidak dipakai)
- src/assets/css/custom-old.css (tidak di-import)

## Hasil:
- Bundle size: 2.5MB → 1.8MB (28% lebih kecil)
- Dependencies: 45 → 38 (7 dependency dihapus)
- Files: 250 → 220 (30 file dihapus)
```

---

##  CHECKLIST AKHIR

### Sebelum Dianggap Selesai:

- [ ] Semua dependency yang tidak terpakai sudah dihapus
- [ ] Semua file yang tidak terpakai sudah dihapus
- [ ] Code duplicate sudah dibersihkan
- [ ] Console.log sudah dihapus
- [ ] Comment tidak berguna sudah dihapus
- [ ] `npm start` jalan tanpa error
- [ ] `npm run build` berhasil
- [ ] Semua fitur masih berfungsi
- [ ] Responsive masih OK
- [ ] Bundle size lebih kecil
- [ ] Semua perubahan sudah di-commit

---

##  TROUBLESHOOTING

### Jika Aplikasi Error Setelah Cleanup:

#### Error: Module not found
```
Solusi:
1. Cek dependency yang dihapus
2. Install kembali: npm install <package-name>
3. Atau revert commit: git revert HEAD
```

#### Error: Component not found
```
Solusi:
1. Cek file yang dihapus
2. Restore dari backup
3. Atau revert commit: git revert HEAD
```

#### Error: CSS tidak tampil
```
Solusi:
1. Cek CSS yang dihapus
2. Restore import CSS
3. Atau revert commit: git revert HEAD
```

---

##  TIPS PRO

### 1. Jangan Terburu-buru
- Hapus satu kategori per hari
- Test dengan teliti
- Commit setelah setiap step

### 2. Gunakan Git dengan Baik
```bash
# Setiap step, commit dengan message jelas
git commit -m "Remove unused Calendar pages"
git commit -m "Remove unused chart.js dependency"
```

### 3. Backup Sebelum Hapus
```bash
# Rename dulu, jangan langsung hapus
mv file.js _file_unused.js

# Test dulu
# Jika OK, baru hapus permanent
```

### 4. Dokumentasikan
- Catat apa yang dihapus
- Catat alasan kenapa dihapus
- Berguna untuk referensi

---

##  ESTIMASI HASIL

### Sebelum Cleanup:
- Dependencies: ~45 packages
- Files: ~250 files
- Bundle size: ~2.5MB
- node_modules: ~200MB

### Setelah Cleanup (Estimasi):
- Dependencies: ~35 packages (-22%)
- Files: ~200 files (-20%)
- Bundle size: ~1.8MB (-28%)
- node_modules: ~150MB (-25%)

**Lebih ringan, lebih cepat, lebih mudah maintain!**

---

##  KESIMPULAN

### Prinsip Pembersihan Aman:
1. **Identifikasi dulu** - Jangan langsung hapus
2. **Backup dulu** - Git commit atau copy folder
3. **Hapus bertahap** - Satu kategori per waktu
4. **Test setiap step** - Pastikan masih jalan
5. **Commit setiap step** - Mudah revert jika error
6. **Dokumentasikan** - Catat apa yang dihapus

**Dengan cara ini, project bersih tanpa merusak fungsi!** 
