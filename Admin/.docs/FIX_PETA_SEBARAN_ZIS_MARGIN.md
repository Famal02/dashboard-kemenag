#  FIX: Peta Sebaran ZIS - Margin Konsisten

## Masalah
Section "Peta Sebaran Penerimaan ZIS" di menu Laporan Dana memiliki layout yang berbeda dengan section lain karena **double wrapper**.

## Penyebab
```javascript
// LaporanDana.js (Parent)
<div className="kemenag-page">
    <div className="kemenag-container">
        <PetaSebaranZis />  {/*  PetaSebaranZis punya wrapper sendiri */}
    </div>
</div>

// PetaSebaranZis.js (Child) - SEBELUM
<div className="kemenag-page">  {/*  Double wrapper! */}
    <div className="kemenag-container">  {/*  Double wrapper! */}
        <Card>...</Card>
    </div>
</div>
```

**Efek:**
-  Margin ganda (200px + 200px = 400px)
-  Layout tidak konsisten dengan section lain
-  Card terlalu sempit

## Solusi

### File: `src/pages/ZIS/PetaSebaranZis.js`

**Sebelum:**
```javascript
return (
    <div className="kemenag-page">
        <div className="kemenag-container">
            <Card className="kemenag-card">
                <CardBody>
                    {/* Content */}
                </CardBody>
            </Card>
        </div>
    </div>
);
```

**Sesudah:**
```javascript
return (
    <Card className="kemenag-card">
        <CardBody className="p-4" style={{ minHeight: '600px', position: 'relative' }}>
            {/* Content */}
        </CardBody>
    </Card>
);
```

**Perubahan:**
-  Hapus wrapper `kemenag-page`
-  Hapus wrapper `kemenag-container`
-  Return Card langsung
-  Margin sekarang konsisten dengan section lain

## Hasil

### Sebelum:
```
kemenag-page (LaporanDana)
└── kemenag-container (200px padding)
    └── kemenag-page (PetaSebaranZis)  Double!
        └── kemenag-container (200px padding)  Double!
            └── Card
```
**Total padding: 400px** 

### Sesudah:
```
kemenag-page (LaporanDana)
└── kemenag-container (200px padding)
    └── Card (PetaSebaranZis) 
```
**Total padding: 200px** 

## Testing

Refresh browser (Ctrl + F5) dan cek:

### Laporan Dana - Peta Sebaran ZIS
- [ ] Margin kiri/kanan sama dengan section lain? 
- [ ] Card tidak terlalu sempit? 
- [ ] Padding horizontal 200px (desktop)? 
- [ ] Sejajar dengan header? 

---

**Update:** 2026-02-10 21:58  
**Status:**  MARGIN PETA SEBARAN ZIS SUDAH KONSISTEN
