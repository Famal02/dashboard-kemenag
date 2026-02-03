import React, { useState } from "react"
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress } from "reactstrap"
import Chart from "react-apexcharts"
import classnames from "classnames"

// Import Vector Map
import { VectorMap } from "@react-jvectormap/core"
import { idnMerc } from "@react-jvectormap/indonesia"

const Stakeholder = () => {
    document.title = "Stakeholder Dashboard | Dashboard Kemenag"
    const [activeTab, setActiveTab] = useState("1") // 1: Muzakki, 2: Mustahik, 3: Amil

    // --- 1. Mini Chart Options (Sparklines) ---
    const sparklineOptions = (color) => ({
        chart: { type: 'area', sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05, stops: [0, 100] } },
        colors: [color],
        tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } }, marker: { show: false } }
    })

    // --- 2. Main Trend Chart Options ---
    const mainChartOptions = {
        chart: { toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "'Inter', sans-serif" },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#059669', '#fbbf24'], // Green & Amber
        fill: { type: 'solid', opacity: [0.1, 1] }, // First series soft fill, second line only
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], axisBorder: { show: false }, axisTicks: { show: false } },
        legend: { position: 'top', horizontalAlign: 'right' },
    }

    // --- 3. Radial Bar Options (Distribution) ---
    const radialOptions = {
        chart: { type: 'radialBar', fontFamily: "'Inter', sans-serif" },
        plotOptions: {
            radialBar: {
                hollow: { size: '65%' },
                dataLabels: {
                    name: { offsetY: -10, color: "#888", fontSize: "13px" },
                    value: { color: "#111", fontSize: "24px", show: true }
                }
            }
        },
        labels: ['Active Rate'],
        colors: ['#10b981'],
        stroke: { lineCap: 'round' },
    }

    // --- Helpers for Dynamic Data based on Active Tab ---
    const getTabLabel = () => {
        switch (activeTab) {
            case "1": return { title: "Muzakki", sub1: "Individu", sub2: "Entitas Corp" };
            case "2": return { title: "Mustahik", sub1: "Fakir Miskin", sub2: "Asnaf Lain" };
            case "3": return { title: "Amil", sub1: "Pusat", sub2: "Daerah" };
            default: return { title: "Data", sub1: "Type A", sub2: "Type B" };
        }
    }
    const label = getTabLabel();

    return (
        <div className="page-content bg-light">
            <div className="custom-container">
                {/* Removed Container fluid as custom-container handles layout */}
                <style>{`
           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
           .page-content { font-family: 'Inter', sans-serif; background-color: #f8fafc !important; }
           
           /* Custom Card Styling */
           .card-stats { border: none; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); transition: transform 0.2s; }
           .card-stats:hover { transform: translateY(-3px); }
           
           /* Header Tab Styling */
           .nav-pills-custom .nav-link {
              background: #fff; color: #64748b; font-weight: 500; padding: 10px 24px; border-radius: 8px; border: 1px solid #e2e8f0; margin-right: 10px;
           }
           .nav-pills-custom .nav-link.active {
              background: #065f46; color: #fff; border-color: #065f46; box-shadow: 0 4px 6px rgba(6, 95, 70, 0.2);
           }
           
           /* Map Styling */
           .map-container { position: relative; overflow: hidden; border-radius: 16px; background: #fff; }
        `}</style>

                {/* === HEADER & NAVIGATION === */}
                <Row className="align-items-center mb-4">
                    <Col>
                        <h4 className="font-size-20 fw-bold text-dark mb-1">Dashboard {label.title}</h4>
                        <p className="text-muted mb-0">Overview kinerja dan sebaran data {label.title.toLowerCase()}.</p>
                    </Col>
                    <Col xs="auto">
                        <Nav pills className="nav-pills-custom">
                            {["1", "2", "3"].map((id, idx) => (
                                <NavItem key={id}>
                                    <NavLink
                                        className={classnames({ active: activeTab === id })}
                                        onClick={() => setActiveTab(id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {idx === 0 ? "Muzakki" : idx === 1 ? "Mustahik" : "Amil"}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    </Col>
                </Row>

                {/* === 1. TOP STATS CARDS (Widgets) === */}
                <Row>
                    <Col md={3}>
                        <Card className="card-stats mb-4">
                            <CardBody>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar-xs me-3">
                                        <span className="avatar-title rounded-circle bg-soft-success text-success font-size-18"><i className="bx bx-user"></i></span>
                                    </div>
                                    <h5 className="font-size-14 mb-0 text-muted">Total {label.title}</h5>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div>
                                        <h3 className="mb-1 fw-bold">145,200</h3>
                                        <span className="text-success small fw-bold"><i className="bx bx-up-arrow-alt"></i> +12%</span> <span className="text-muted small">vs last month</span>
                                    </div>
                                    <div style={{ width: '80px' }}>
                                        <Chart options={sparklineOptions("#10b981")} series={[{ data: [12, 14, 20, 15, 18, 25, 20] }]} type="area" height={40} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="card-stats mb-4">
                            <CardBody>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar-xs me-3">
                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-18"><i className="bx bx-wallet"></i></span>
                                    </div>
                                    <h5 className="font-size-14 mb-0 text-muted">Transaksi Aktif</h5>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div>
                                        <h3 className="mb-1 fw-bold">32,450</h3>
                                        <span className="text-danger small fw-bold"><i className="bx bx-down-arrow-alt"></i> -2%</span> <span className="text-muted small">vs last month</span>
                                    </div>
                                    <div style={{ width: '80px' }}>
                                        <Chart options={sparklineOptions("#3b82f6")} series={[{ data: [25, 22, 20, 18, 20, 18, 15] }]} type="area" height={40} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="card-stats mb-4">
                            <CardBody>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar-xs me-3">
                                        <span className="avatar-title rounded-circle bg-soft-warning text-warning font-size-18"><i className="bx bx-analyse"></i></span>
                                    </div>
                                    <h5 className="font-size-14 mb-0 text-muted">Retensi</h5>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div>
                                        <h3 className="mb-1 fw-bold">88.2%</h3>
                                        <span className="text-success small fw-bold"><i className="bx bx-up-arrow-alt"></i> +0.5%</span> <span className="text-muted small">stable</span>
                                    </div>
                                    <div style={{ width: '80px' }}>
                                        <Chart options={sparklineOptions("#f59e0b")} series={[{ data: [40, 50, 60, 55, 65, 70, 75] }]} type="area" height={40} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="card-stats mb-4">
                            <CardBody>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar-xs me-3">
                                        <span className="avatar-title rounded-circle bg-soft-info text-info font-size-18"><i className="bx bx-layer"></i></span>
                                    </div>
                                    <h5 className="font-size-14 mb-0 text-muted">Entitas Baru</h5>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div>
                                        <h3 className="mb-1 fw-bold">1,204</h3>
                                        <span className="text-success small fw-bold"><i className="bx bx-up-arrow-alt"></i> +45</span> <span className="text-muted small">new users</span>
                                    </div>
                                    <div style={{ width: '80px' }}>
                                        <Chart options={sparklineOptions("#06b6d4")} series={[{ data: [5, 8, 10, 12, 10, 14, 15] }]} type="area" height={40} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* === 2. MAIN CONTENT (Asymmetrical Grid) === */}
                <Row>
                    {/* -- Left: Main Chart -- */}
                    <Col xl={8}>
                        <Card className="card-stats mb-4" style={{ height: 'calc(100% - 24px)' }}>
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title fw-bold">Tren Pertumbuhan {label.title}</h4>
                                    <UncontrolledDropdown>
                                        <DropdownToggle color="light" size="sm" className="btn-light">
                                            Tahun 2025 <i className="mdi mdi-chevron-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>2025</DropdownItem>
                                            <DropdownItem>2024</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <Chart
                                    options={mainChartOptions}
                                    series={[
                                        { name: 'Total Aktif', type: 'area', data: [31, 40, 28, 51, 42, 109, 100, 120, 130, 140, 150, 160] },
                                        { name: 'Target', type: 'line', data: [40, 50, 45, 60, 55, 100, 110, 125, 135, 145, 155, 165] }
                                    ]}
                                    type="line"
                                    height={350}
                                />
                            </CardBody>
                        </Card>
                    </Col>

                    {/* -- Right: Distribution & Breakdown -- */}
                    <Col xl={4}>
                        {/* Distribution Donut */}
                        <Card className="card-stats mb-4">
                            <CardBody>
                                <h4 className="card-title fw-bold mb-3">Distribusi Tipe</h4>
                                <div style={{ marginTop: '-20px' }}>
                                    <Chart options={radialOptions} series={[76]} type="radialBar" height={250} />
                                </div>
                                <div className="text-center mt-3">
                                    <p className="text-muted mb-2">Didominasi oleh kategori <b>{label.sub1}</b> sebesar 76%.</p>
                                    <div className="d-flex justify-content-center gap-2">
                                        <span className="badge bg-soft-success text-success p-2">{label.sub1} 76%</span>
                                        <span className="badge bg-soft-secondary text-secondary p-2">{label.sub2} 24%</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Top Regions List (Mini) */}
                        <Card className="card-stats mb-4">
                            <CardBody>
                                <h4 className="card-title fw-bold mb-3">Top 3 Provinsi</h4>
                                <div className="d-flex flex-column gap-3">
                                    <div>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="fw-bold text-dark">Jawa Barat</span>
                                            <span className="text-muted">45%</span>
                                        </div>
                                        <Progress value={45} color="success" style={{ height: '6px' }} className="mb-0" />
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="fw-bold text-dark">DKI Jakarta</span>
                                            <span className="text-muted">30%</span>
                                        </div>
                                        <Progress value={30} color="warning" style={{ height: '6px' }} className="mb-0" />
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="fw-bold text-dark">Jawa Timur</span>
                                            <span className="text-muted">15%</span>
                                        </div>
                                        <Progress value={15} color="primary" style={{ height: '6px' }} className="mb-0" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* === 3. BOTTOM: VECTOR MAP === */}
                <Row>
                    <Col xs={12}>
                        <Card className="card-stats">
                            <CardBody>
                                <Row>
                                    {/* Map Controls & Description */}
                                    <Col md={3}>
                                        <h4 className="card-title fw-bold mb-2">Sebaran Wilayah</h4>
                                        <p className="text-muted small mb-4">Visualisasi kepadatan stakeholder di seluruh provinsi Indonesia.</p>

                                        <div className="d-grid gap-2">
                                            <button className="btn btn-soft-success text-start active"><i className="bx bx-map-pin me-2"></i> Peta Sebaran</button>
                                            <button className="btn btn-light text-start"><i className="bx bx-list-ul me-2"></i> Tabel Detail</button>
                                        </div>

                                        <div className="mt-4 p-3 bg-light rounded-3">
                                            <h6 className="fw-bold small text-uppercase text-muted">Highlight</h6>
                                            <h3 className="mb-0 text-dark fw-bold">34</h3>
                                            <span className="small text-muted">Provinsi Terdata</span>
                                        </div>
                                    </Col>

                                    {/* The Map */}
                                    <Col md={9}>
                                        <div id="indonesia-map" className="d-flex justify-content-center" style={{ height: "400px", width: "100%" }}>
                                            <VectorMap
                                                map={idnMerc}
                                                backgroundColor="transparent"
                                                zoomOnScroll={false}
                                                containerStyle={{ width: "100%", height: "100%" }}
                                                regionStyle={{
                                                    initial: { fill: "#e2e8f0", stroke: "#ffffff", "stroke-width": 1 },
                                                    hover: { "fill-opacity": 0.8, cursor: "pointer", fill: "#10b981" }, // Hover Green
                                                    selected: { fill: "#22c55e" }
                                                }}
                                                series={{
                                                    regions: [{
                                                        scale: ["#d1fae5", "#047857"], // Gradient Light to Dark Green
                                                        attribute: "fill",
                                                        values: { "ID-JK": 90, "ID-JB": 80, "ID-JT": 70, "ID-JI": 60, "ID-SU": 40 },
                                                        normalizeFunction: "polynomial",
                                                    }]
                                                }}
                                                onRegionTipShow={(e, el) => {
                                                    const count = Math.floor(Math.random() * 5000)
                                                    el.html(`<div class="px-2 py-1 bg-dark text-white rounded small">${el.html()}: <b>${count}</b></div>`)
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Stakeholder
