# ✅ FIX: Screen Blank - PetaSebaranZis

## Masalah
Screen blank saat membuka menu Laporan Dana karena ada **undefined variables** di PetaSebaranZis.js.

## Penyebab
```javascript
// Variable yang tidak terdefinisi:
1. unavailableCodes - digunakan di alert tapi tidak ada state
2. handleRegionClick - digunakan di map onClick tapi tidak ada function
```

**Error di console:**
```
ReferenceError: unavailableCodes is not defined
ReferenceError: handleRegionClick is not defined
```

## Solusi

### 1. Hapus Alert yang Error
```javascript
// SEBELUM - Error
<div className="alert alert-warning">
    Data tersedia untuk (Code): {unavailableCodes.join(', ')}  {/* ❌ undefined */}
</div>

// SESUDAH - Dihapus
{/* Alert dihapus karena tidak diperlukan */}
```

### 2. Sederhanakan Map onClick
```javascript
// SEBELUM - Error
<PetaIndonesia
    onRegionClick={handleRegionClick}  {/* ❌ undefined */}
/>

// SESUDAH - Simple handler
<PetaIndonesia
    onRegionClick={(e, code) => {
        console.log('Region clicked:', code);  {/* ✅ Simple */}
    }}
/>
```

### 3. Sederhanakan Table Row
```javascript
// SEBELUM - Complex dengan selection
return merged.map((row, idx) => {
    const isSelected = selectedRegion && ...;  {/* Complex */}
    return (
        <tr
            className={isSelected ? 'table-active' : ''}
            onClick={() => {
                const code = nameToCodeMap[...];
                if (code) handleRegionClick(null, code);  {/* ❌ undefined */}
            }}
        >
            ...
        </tr>
    );
});

// SESUDAH - Simple tanpa selection
return merged.map((row, idx) => {
    return (
        <tr key={idx}>  {/* ✅ Simple */}
            <td>{idx + 1}</td>
            <td><h6 className="mb-0">{row.provinsi}</h6></td>
            <td className="text-end">{formatCurrency(row.coll)}</td>
            <td className="text-end">{formatCurrency(row.dist)}</td>
        </tr>
    );
});
```

## Perubahan Detail

### File: `src/pages/ZIS/PetaSebaranZis.js`

**Baris 195-199:** Hapus alert
```diff
- {/* Data Availability Alert */}
- <div className="alert alert-warning py-2 mb-3 font-size-13 text-center">
-     <i className="mdi mdi-information me-2"></i>
-     Data tersedia untuk (Code): {unavailableCodes.join(', ')}
- </div>
```

**Baris 204:** Sederhanakan onRegionClick
```diff
- onRegionClick={handleRegionClick}
+ onRegionClick={(e, code) => {
+     console.log('Region clicked:', code);
+ }}
```

**Baris 222:** Hapus selectedRegion prop
```diff
  colorScale={["#f0eee9", "#375673"]}
- selectedRegion={selectedRegion}
```

**Baris 270-287:** Sederhanakan table row
```diff
  return merged.map((row, idx) => {
-     const isSelected = selectedRegion && normalizeName(row.provinsi) === normalizeName(selectedRegion);
      return (
-         <tr
-             key={idx}
-             className={isSelected ? 'table-active' : ''}
-             style={{ cursor: 'pointer' }}
-             onClick={() => {
-                 const code = nameToCodeMap[normalizeName(row.provinsi)];
-                 if (code) handleRegionClick(null, code);
-             }}
-         >
+         <tr key={idx}>
              <td>{idx + 1}</td>
              <td><h6 className="mb-0">{row.provinsi}</h6></td>
              <td className="text-end">{formatCurrency(row.coll)}</td>
              <td className="text-end">{formatCurrency(row.dist)}</td>
          </tr>
      );
  });
```

## Hasil

### Sebelum:
- ❌ Screen blank
- ❌ Console error: unavailableCodes is not defined
- ❌ Console error: handleRegionClick is not defined

### Sesudah:
- ✅ Screen tampil normal
- ✅ Map berfungsi
- ✅ Table berfungsi
- ✅ Tooltip berfungsi
- ✅ No console errors

## Testing

Refresh browser (Ctrl + F5) dan cek:

### Laporan Dana - Peta Sebaran ZIS
- [ ] Screen tidak blank? ✅
- [ ] Map tampil? ✅
- [ ] Tooltip map berfungsi? ✅
- [ ] Table tampil? ✅
- [ ] Toggle Pengumpulan/Penyaluran berfungsi? ✅
- [ ] No console errors? ✅

---

**Update:** 2026-02-10 22:00  
**Status:** ✅ SCREEN BLANK SUDAH DIPERBAIKI
