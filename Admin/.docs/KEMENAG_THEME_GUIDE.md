# KEMENAG DASHBOARD - GLOBAL THEME GUIDE

##  Color Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Blue Fusion** (Primary) | `#375673` | RGB(55, 86, 115) | Headings, primary text, buttons, map fills |
| **Cloud Dancer** (Background) | `#f0eee9` | RGB(240, 238, 233) | Page background, light fills |
| **Golden Mist** (Accent) | `#d5cd94` | RGB(213, 205, 148) | Borders, highlights, selected states |

##  Installation

Global theme sudah diimport di `App.js`:
```javascript
import "./assets/scss/kemenag-theme.css";
```

##  CSS Variables

Gunakan CSS variables untuk konsistensi:

```css
:root {
    --kemenag-primary: #375673;
    --kemenag-background: #f0eee9;
    --kemenag-accent: #d5cd94;
    --kemenag-accent-dark: #c5b884;
    --kemenag-white: #ffffff;
    --kemenag-text: #375673;
    --kemenag-text-light: rgba(55, 86, 115, 0.6);
}
```

##  Available Classes

### Page Layout

```jsx
<div className="kemenag-page">
    <div className="kemenag-container">
        {/* Your content */}
    </div>
</div>
```

### Typography

```jsx
<h4 className="kemenag-title">Page Title</h4>
<p className="kemenag-subtitle">Subtitle text</p>

<ol className="breadcrumb kemenag-breadcrumb">
    <li className="breadcrumb-item">Home</li>
    <li className="breadcrumb-item active">Current Page</li>
</ol>
```

### Cards

**General Card:**
```jsx
<Card className="kemenag-card">
    <CardBody>
        <h4 className="card-title">Card Title</h4>
        {/* Content */}
    </CardBody>
</Card>
```

**Stats Card:**
```jsx
<Card className="kemenag-stats-card kemenag-fade-in">
    <CardBody>
        <div className="d-flex">
            <div className="flex-grow-1">
                <p className="text-muted">Label</p>
                <h4 className="stats-number">123,456</h4>
                <small>Description</small>
            </div>
            <div className="flex-shrink-0">
                <div className="kemenag-stats-icon">
                    <i className="bx bx-home-alt"></i>
                </div>
            </div>
        </div>
    </CardBody>
</Card>
```

**Table Card:**
```jsx
<Card className="kemenag-table-card">
    <CardBody>
        <h4 className="card-title">Table Title</h4>
        <div className="kemenag-table-responsive">
            <Table className="kemenag-table">
                <thead className="sticky-top">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Item</td>
                        <td>Value</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    </CardBody>
</Card>
```

### Buttons

```jsx
{/* Primary Button */}
<button className="kemenag-btn-primary">
    <i className="bx bx-plus me-1"></i> Primary Action
</button>

{/* Secondary Button */}
<button className="kemenag-btn-secondary">
    <i className="bx bx-x me-1"></i> Reset Filter
</button>

{/* Accent Button */}
<button className="kemenag-btn-accent">
    Accent Action
</button>
```

### Map Components

```jsx
<div className="kemenag-map-container" style={{ height: '500px' }}>
    <PetaIndonesia
        value={mapValues}
        colorScale={["#f0eee9", "#375673"]}
        {/* other props */}
    />
    
    {/* Legend */}
    <div className="kemenag-map-legend">
        <div className="kemenag-map-legend-item">
            <span className="kemenag-map-legend-color" style={{ background: '#f0eee9' }}></span>
            Low
        </div>
        <div className="kemenag-map-legend-item">
            <span className="kemenag-map-legend-color" style={{ background: '#375673' }}></span>
            High
        </div>
    </div>
</div>
```

### Search Input

```jsx
<input 
    type="text" 
    className="kemenag-search-input" 
    placeholder="Search..."
/>
```

### Badges

```jsx
<span className="kemenag-badge">Default</span>
<span className="kemenag-badge kemenag-badge-primary">Primary</span>
<span className="kemenag-badge kemenag-badge-accent">Accent</span>
```

### Animations

```jsx
{/* Fade in with delays */}
<Card className="kemenag-stats-card kemenag-fade-in">...</Card>
<Card className="kemenag-stats-card kemenag-fade-in-delay-1">...</Card>
<Card className="kemenag-stats-card kemenag-fade-in-delay-2">...</Card>
<Card className="kemenag-stats-card kemenag-fade-in-delay-3">...</Card>
```

### Utility Classes

```jsx
{/* Text Colors */}
<p className="text-kemenag-primary">Primary text</p>
<p className="text-kemenag-accent">Accent text</p>

{/* Background Colors */}
<div className="bg-kemenag-primary">Primary background</div>
<div className="bg-kemenag-accent">Accent background</div>
<div className="bg-kemenag-background">Page background</div>

{/* Border Colors */}
<div className="border border-kemenag-accent">Accent border</div>
<div className="border border-kemenag-primary">Primary border</div>
```

##  Complete Example - Dashboard Page

```jsx
import React from 'react';
import { Card, CardBody, Col, Row, Table } from 'reactstrap';

const Dashboard = () => {
    return (
        <div className="kemenag-page">
            <div className="kemenag-container">
                {/* Page Title */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="kemenag-title">Dashboard</h4>
                            <ol className="breadcrumb kemenag-breadcrumb">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                        </div>
                    </Col>
                </Row>

                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="kemenag-stats-card kemenag-fade-in">
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <p className="text-muted">Total ZIS</p>
                                        <h4 className="stats-number">1.2 M</h4>
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
                    {/* Repeat for other stats */}
                </Row>

                {/* Map Section */}
                <Row>
                    <Col lg={8}>
                        <Card className="kemenag-card">
                            <CardBody>
                                <h4 className="card-title mb-4">Peta Sebaran</h4>
                                <div className="kemenag-map-container" style={{ height: '500px' }}>
                                    {/* Map component */}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    
                    <Col lg={4}>
                        <Card className="kemenag-table-card">
                            <CardBody>
                                <h4 className="card-title mb-4">Peringkat Provinsi</h4>
                                <div className="kemenag-table-responsive">
                                    <Table className="kemenag-table">
                                        {/* Table content */}
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Dashboard;
```

##  Responsive Design

Theme sudah include responsive breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

##  Color Scale untuk Peta

Gunakan gradient dari Cloud Dancer ke Blue Fusion:

```jsx
<PetaIndonesia
    colorScale={["#f0eee9", "#375673"]}
    // atau dengan 3 warna:
    colorScale={["#f0eee9", "#d5cd94", "#375673"]}
/>
```

##  Checklist Implementasi

Untuk setiap halaman baru:

- [ ] Wrap dengan `<div className="kemenag-page">`
- [ ] Gunakan `kemenag-container` untuk content
- [ ] Gunakan `kemenag-title` untuk page title
- [ ] Gunakan `kemenag-breadcrumb` untuk breadcrumbs
- [ ] Gunakan `kemenag-stats-card` untuk statistics
- [ ] Gunakan `kemenag-card` untuk general cards
- [ ] Gunakan `kemenag-table-card` dan `kemenag-table` untuk tables
- [ ] Gunakan `kemenag-btn-*` untuk buttons
- [ ] Tambahkan `kemenag-fade-in` untuk animations
- [ ] Set map `colorScale` ke `["#f0eee9", "#375673"]`

##  Migration dari Style Lama

### Before:
```jsx
<Card className="mini-stats-wid">
    <CardBody>
        <p className="text-muted">Label</p>
        <h4>Value</h4>
    </CardBody>
</Card>
```

### After:
```jsx
<Card className="kemenag-stats-card kemenag-fade-in">
    <CardBody>
        <div className="d-flex">
            <div className="flex-grow-1">
                <p className="text-muted">Label</p>
                <h4 className="stats-number">Value</h4>
            </div>
            <div className="flex-shrink-0">
                <div className="kemenag-stats-icon">
                    <i className="bx bx-icon"></i>
                </div>
            </div>
        </div>
    </CardBody>
</Card>
```

##  Support

Untuk pertanyaan atau customization lebih lanjut, hubungi tim development.
