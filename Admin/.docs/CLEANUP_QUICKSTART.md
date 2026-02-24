#  QUICK START: Cleanup Project (Praktis)

##  Langkah Cepat (30 Menit)

### STEP 1: Backup (2 menit)
```bash
git add .
git commit -m "Before cleanup"
git checkout -b backup-cleanup
git checkout main
```

### STEP 2: Cek Dependency Tidak Terpakai (5 menit)
```bash
npm install -g depcheck
depcheck
```

**Catat hasilnya**, jangan hapus dulu!

### STEP 3: Hapus Dependency (10 menit)
```bash
# Contoh yang AMAN dihapus (cek dulu!):
npm uninstall @fullcalendar/core @fullcalendar/daygrid
npm uninstall chart.js react-chartjs-2
npm uninstall toastr

# Test
npm start
```

### STEP 4: Hapus Folder Tidak Terpakai (10 menit)
```bash
# Cek route dulu di src/routes/allRoutes.js
# Lalu hapus folder yang tidak ada route-nya

# Contoh (HATI-HATI, cek dulu!):
rm -rf src/pages/Calendar
rm -rf src/pages/Email
rm -rf src/pages/Ecommerce

# Test
npm start
```

### STEP 5: Commit (1 menit)
```bash
git add .
git commit -m "Cleanup: Remove unused dependencies and pages"
```

### STEP 6: Build Test (2 menit)
```bash
npm run build
```

Jika berhasil → **SELESAI!** 

---

##  Checklist Cepat

- [ ] Backup dengan Git
- [ ] Jalankan `depcheck`
- [ ] Hapus dependency tidak terpakai
- [ ] Test dengan `npm start`
- [ ] Hapus folder tidak terpakai
- [ ] Test lagi
- [ ] Commit
- [ ] Build test dengan `npm run build`

---

##  Jika Error

```bash
# Revert semua perubahan
git reset --hard HEAD

# Atau revert commit terakhir
git revert HEAD
```

---

**Baca panduan lengkap di:** `PANDUAN_CLEANUP_PROJECT.md`
