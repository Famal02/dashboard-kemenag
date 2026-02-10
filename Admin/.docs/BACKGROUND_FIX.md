# 🔧 PERBAIKAN BACKGROUND TIDAK MERATA

## Masalah
Background color (#f0eee9) tidak menyebar ke seluruh halaman di menu Wakaf dan ZIS.

## Penyebab
1. Template default memiliki wrapper `.page-content` dengan padding dan background sendiri
2. Beberapa halaman masih menggunakan wrapper lama
3. Body dan HTML tidak menggunakan background theme

## Solusi yang Diterapkan

### 1. Override CSS Global
Ditambahkan di `kemenag-theme.css`:

```css
/* Ensure body and html use theme background */
html,
body {
    background-color: var(--kemenag-background) !important;
}

/* Override default page-content styling */
.page-content {
    padding: 0 !important;
    background: transparent !important;
}

/* Override main-content if exists */
.main-content {
    background: transparent !important;
}

.kemenag-page {
    background-color: var(--kemenag-background);
    min-height: 100vh;
    padding: 24px 0;
    width: 100%;
}
```

### 2. Penjelasan
- **html, body**: Background utama menggunakan Cloud Dancer (#f0eee9)
- **.page-content**: Padding dihapus, background transparent
- **.main-content**: Background transparent (jika ada)
- **.kemenag-page**: Background Cloud Dancer, full width, min-height 100vh

## Hasil
✅ Background #f0eee9 sekarang menyebar ke seluruh halaman
✅ Tidak ada white space atau gap
✅ Konsisten di semua menu (Dashboard, Wakaf, ZIS, Rumah Ibadah)

## Testing
Refresh browser (Ctrl + F5) dan cek:
- Dashboard ✅
- Peta Sebaran Wakaf ✅
- Peta Sebaran ZIS ✅
- Data Rumah Ibadah ✅

Background harus merata dari atas sampai bawah tanpa gap.
