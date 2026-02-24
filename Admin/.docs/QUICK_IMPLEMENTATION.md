# QUICK IMPLEMENTATION GUIDE - Kemenag Theme

##  Implementasi Cepat untuk Setiap Halaman

### 1. Update DataRumahIbadah.js  (SUDAH SELESAI)
File ini sudah menggunakan custom CSS sendiri yang compatible dengan theme global.

### 2. Update PetaSebaranWakaf.js

**Perubahan yang diperlukan:**

```jsx
// Di bagian return, wrap dengan kemenag-page
return (
    <div className="kemenag-page">  {/* TAMBAH INI */}
        <div className="kemenag-container">  {/* GANTI dari container biasa */}
            {/* Title Section */}
            <Row className="mb-4">
                <Col xs={12}>
                    <h4 className="kemenag-title">Sebaran Aset Wakaf Tanah</h4>  {/* TAMBAH CLASS */}
                    <p className="kemenag-subtitle">Data real-time dari SIWAK</p>  {/* TAMBAH CLASS */}
                </Col>
            </Row>

            {/* Stats Cards - GANTI CLASS */}
            <Card className="kemenag-stats-card kemenag-fade-in">
                <CardBody>
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <p className="text-muted">Total Aset</p>
                            <h4 className="stats-number">{totalCount}</h4>
                            <small>Titik Terdata</small>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="kemenag-stats-icon">
                                <i className="bx bx-map"></i>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Map Card - GANTI CLASS */}
            <Card className="kemenag-card">
                <CardBody>
                    <h4 className="card-title">Peta Sebaran</h4>
                    <div className="kemenag-map-container" style={{ height: '500px' }}>
                        <PetaIndonesia
                            colorScale={["#f0eee9", "#375673"]}  {/* UPDATE COLOR */}
                            {/* props lainnya */}
                        />
                        
                        {/* Legend */}
                        <div className="kemenag-map-legend">
                            <div className="kemenag-map-legend-item">
                                <span className="kemenag-map-legend-color" style={{ background: '#f0eee9' }}></span>
                                Sedikit
                            </div>
                            <div className="kemenag-map-legend-item">
                                <span className="kemenag-map-legend-color" style={{ background: '#375673' }}></span>
                                Banyak
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Table Card - GANTI CLASS */}
            <Card className="kemenag-table-card">
                <CardBody>
                    <h4 className="card-title">Daftar Aset Wakaf</h4>
                    
                    {/* Search Input */}
                    <input 
                        type="text" 
                        className="kemenag-search-input"  {/* GANTI CLASS */}
                        placeholder="Cari..."
                    />
                    
                    {/* Reset Button */}
                    <button className="kemenag-btn-secondary">  {/* GANTI CLASS */}
                        <i className="bx bx-x me-1"></i> Reset Filter
                    </button>
                    
                    <div className="kemenag-table-responsive">
                        <Table className="kemenag-table">
                            {/* table content */}
                        </Table>
                    </div>
                </CardBody>
            </Card>
        </div>
    </div>
);
```

### 3. Update PetaSebaranZis.js

**Sama seperti Wakaf, ganti:**

```jsx
return (
    <div className="kemenag-page">
        <div className="kemenag-container">
            <h4 className="kemenag-title">Sebaran ZIS</h4>
            
            {/* Stats Cards */}
            <Card className="kemenag-stats-card kemenag-fade-in">...</Card>
            
            {/* Map */}
            <Card className="kemenag-card">
                <div className="kemenag-map-container">
                    <PetaIndonesia colorScale={["#f0eee9", "#375673"]} />
                </div>
            </Card>
            
            {/* Table */}
            <Card className="kemenag-table-card">
                <Table className="kemenag-table">...</Table>
            </Card>
        </div>
    </div>
);
```

### 4. Update Dashboard/index.js

**Perubahan:**

```jsx
return (
    <div className="kemenag-page">
        <div className="kemenag-container">
            {/* Title */}
            <Row className="mb-4">
                <Col xs={12}>
                    <h4 className="kemenag-title">Dashboard Kemenag</h4>
                    <p className="kemenag-subtitle">Ringkasan Data ZIS, Wakaf, dan Rumah Ibadah</p>
                </Col>
            </Row>

            {/* Stats Row */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="kemenag-stats-card kemenag-fade-in">
                        <CardBody>
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <p className="text-muted">Total ZIS</p>
                                    <h4 className="stats-number">
                                        <CountUp end={totalZIS} />
                                    </h4>
                                    <small>Terkumpul</small>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="kemenag-stats-icon">
                                        <i className="bx bx-dollar"></i>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* Repeat untuk stats lainnya dengan delay */}
                <Col md={3}>
                    <Card className="kemenag-stats-card kemenag-fade-in-delay-1">...</Card>
                </Col>
                <Col md={3}>
                    <Card className="kemenag-stats-card kemenag-fade-in-delay-2">...</Card>
                </Col>
                <Col md={3}>
                    <Card className="kemenag-stats-card kemenag-fade-in-delay-3">...</Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row>
                <Col lg={6}>
                    <Card className="kemenag-card">
                        <CardBody>
                            <h4 className="card-title">Trend Penerimaan</h4>
                            <ReactApexChart {...chartProps} />
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="kemenag-card">
                        <CardBody>
                            <h4 className="card-title">Distribusi</h4>
                            <ReactApexChart {...chartProps} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Table Row */}
            <Row>
                <Col xs={12}>
                    <Card className="kemenag-table-card">
                        <CardBody>
                            <h4 className="card-title">Penyaluran Terbaru</h4>
                            <div className="kemenag-table-responsive">
                                <Table className="kemenag-table">
                                    <thead className="sticky-top">
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* table rows */}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>
);
```

### 5. Update Stakeholder.js

```jsx
return (
    <div className="kemenag-page">
        <div className="kemenag-container">
            <h4 className="kemenag-title">Stakeholder Dashboard</h4>
            
            {/* Stats Grid */}
            <Row className="mb-4">
                {statsData.map((stat, idx) => (
                    <Col md={3} key={idx}>
                        <Card className={`kemenag-stats-card kemenag-fade-in-delay-${idx}`}>
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <p className="text-muted">{stat.label}</p>
                                        <h4 className="stats-number">{stat.value}</h4>
                                        <small>{stat.desc}</small>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="kemenag-stats-icon">
                                            <i className={stat.icon}></i>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Map + Charts */}
            <Row>
                <Col lg={8}>
                    <Card className="kemenag-card">
                        <CardBody>
                            <h4 className="card-title">Peta Stakeholder</h4>
                            <div className="kemenag-map-container" style={{ height: '500px' }}>
                                <PetaIndonesia colorScale={["#f0eee9", "#375673"]} />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="kemenag-card">
                        <CardBody>
                            <h4 className="card-title">Distribusi</h4>
                            <ReactApexChart {...chartProps} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>
);
```

##  Color Mapping untuk Chart

Gunakan warna theme untuk charts:

```javascript
const chartColors = {
    primary: '#375673',
    accent: '#d5cd94',
    light: '#f0eee9',
    gradient: ['#f0eee9', '#d5cd94', '#375673']
};

// Untuk ApexCharts
const chartOptions = {
    colors: [chartColors.primary, chartColors.accent],
    // atau gradient
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: [chartColors.accent],
            inverseColors: false,
            opacityFrom: 0.8,
            opacityTo: 0.4,
        }
    }
};
```

##  Checklist Perubahan

Untuk setiap file:

1. **Wrapper:**
   - [ ] Tambah `<div className="kemenag-page">`
   - [ ] Ganti container dengan `kemenag-container`

2. **Typography:**
   - [ ] Title → `kemenag-title`
   - [ ] Subtitle → `kemenag-subtitle`
   - [ ] Breadcrumb → `kemenag-breadcrumb`

3. **Cards:**
   - [ ] Stats cards → `kemenag-stats-card`
   - [ ] General cards → `kemenag-card`
   - [ ] Table cards → `kemenag-table-card`

4. **Components:**
   - [ ] Tables → `kemenag-table` dengan `kemenag-table-responsive`
   - [ ] Buttons → `kemenag-btn-primary/secondary/accent`
   - [ ] Search → `kemenag-search-input`
   - [ ] Map container → `kemenag-map-container`
   - [ ] Map legend → `kemenag-map-legend`

5. **Colors:**
   - [ ] Map colorScale → `["#f0eee9", "#375673"]`
   - [ ] Chart colors → use theme colors

6. **Animations:**
   - [ ] Add `kemenag-fade-in` untuk cards
   - [ ] Use `kemenag-fade-in-delay-1/2/3` untuk staggered animations

##  Search & Replace Pattern

Gunakan Find & Replace di VS Code:

**Find:** `className="mini-stats-wid"`  
**Replace:** `className="kemenag-stats-card kemenag-fade-in"`

**Find:** `className="card-h-100"`  
**Replace:** `className="kemenag-card"`

**Find:** `colorScale={\[.*?\]}`  
**Replace:** `colorScale={["#f0eee9", "#375673"]}`

##  Notes

- Semua perubahan bersifat **non-breaking** - class lama tetap berfungsi
- Theme global akan **override** styling default
- Untuk customization khusus, buat file CSS terpisah seperti `DataRumahIbadah.css`
- Gunakan `!important` hanya jika benar-benar diperlukan

##  Priority Order

1. **High Priority:**
   - Dashboard/index.js (halaman utama)
   - PetaSebaranWakaf.js
   - PetaSebaranZis.js

2. **Medium Priority:**
   - Stakeholder.js
   - RingkasanZis.js

3. **Low Priority:**
   - Utility pages
   - Detail pages

Apakah Anda ingin saya langsung implementasikan perubahan ini ke file-file tersebut?
