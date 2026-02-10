// --- ZIS & WAKAF ENDPOINTS (REAL KEMENAG API) ---

// 1. ZIS DATA (Penerimaan & Total)
export const GET_DASHBOARD_DATA = "https://spl-satudata.kemenag.go.id/core/api/penerimaan-zm/total";
// Fungsi: Mengambil total penerimaan Zakat, Infaq, Sedekah Nasional

// 2. WAKAF DATA (Tanah Wakaf)
export const GET_WAKAF_TANAH_DATA = "https://spl-satudata.kemenag.go.id/core/api/wakaf/tanah-wakaf";
// Fungsi: Mengambil data lokasi dan peruntukan tanah wakaf

// 3. PENYALURAN ZIS (Asnaf)
export const GET_PENYALURAN_ZM_DATA = "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/penyaluran";
// Fungsi: Mengambil data penyaluran dana berdasarkan asnaf (Fakir, Miskin, dll)

// 4. PENERIMAAN PROVINSI (Top 5)
export const GET_PENERIMAAN_PROVINSI = "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/penerimaan-provinsi";
// Fungsi: Mengambil data peringkat perolehan ZIS per provinsi

// 5. PENYALURAN PROVINSI (Sebaran)
export const GET_PENYALURAN_PROVINSI = "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/penyaluran-prov";
// Fungsi: Mengambil sebaran penyaluran dana ZIS per provinsi

// 6. DASHBOARD KEMENAG (Cadangan / Detail)
export const GET_DASHBOARD_KEMENAG_DATA = "https://spl-satudata.kemenag.go.id/core/apidev/penerimaan-zm/zm";
// Fungsi: Data detail penerimaan Zakat Mal

// --- OTHER NECESSARY ENDPOINTS ---
// (Tetap disimpan jika ada logika internal yang membutuhkannya, namun bisa dihapus jika 100% yakin tidak dipakai)
// Saat ini dikosongkan karena fokus hanya ke API Publik Kemenag.
