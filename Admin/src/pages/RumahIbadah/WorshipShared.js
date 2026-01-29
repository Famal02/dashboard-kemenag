import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Input, Badge } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Vectormap from "../../pages/Maps/Vectormap";

// API Helpers
import { get } from "../../helpers/api_helper";
import { GET_WORSHIP_SUMMARY, GET_WORSHIP_PROVINCES } from "../../helpers/url_helper";

const WorshipShared = ({ religionName, color }) => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [loading, setLoading] = useState(false);

    // Default State
    const [dashboardData, setDashboardData] = useState({
        summary: {
            total: 0,
            growth: 0,
            highest: { name: '-', value: 0 },
            lowest: { name: '-', value: 0 }
        },
        trend: [],
        provinces: [],
        years: [2025, 2024, 2023, 2022, 2021, 2020]
    });

    // Fetch Data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get Summary & Trend
                const summaryPromise = get(`${GET_WORSHIP_SUMMARY}?religion=${religionName}&year=${selectedYear}`);
                // 2. Get Province Distribution
                const provincesPromise = get(`${GET_WORSHIP_PROVINCES}?religion=${religionName}&year=${selectedYear}`);

                const [summaryRes, provincesRes] = await Promise.all([summaryPromise, provincesPromise]);

                // Map Response to State
                const summary = summaryRes.data || {};
                const provinces = provincesRes.data || [];

                setDashboardData(prev => ({
                    ...prev,
                    summary: {
                        total: summary.total_national || 0,
                        growth: summary.growth_yoy_percentage || 0,
                        highest: summary.highest_province || { name: '-', value: 0 },
                        lowest: summary.lowest_province || { name: '-', value: 0 },
                    },
                    trend: summary.historical_trend || [], // Array of { year, total }
                    provinces: provinces // Array of { province_id, province_name, total_units, growth_percentage }
                }));

            } catch (error) {
                console.error("Gagal mengambil data rumah ibadah:", error);
                // Silent fail or toast could be added here
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear, religionName]);


    // --- CHARTS OPTIONS ---
    const trendOptions = {
        chart: { type: 'area', height: 350, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        colors: [color],
        xaxis: { categories: dashboardData.trend.map(d => d.year) },
        dataLabels: { enabled: false },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100]
            }
        },
        tooltip: { y: { formatter: val => val.toLocaleString('id-ID') } }
    };

    const rankingOptions = {
        chart: { type: 'bar', height: 400, toolbar: { show: false } },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '50%',
            }
        },
        colors: [color],
        xaxis: { categories: dashboardData.provinces.slice(0, 10).map(d => d.province_name) }, // Using province_name from API
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: { colors: ['#fff'] },
            formatter: val => val.toLocaleString('id-ID')
        },
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="custom-container">
                    {/* Header & Filter */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                        <Breadcrumbs title="Rumah Ibadah" breadcrumbItem={religionName} />

                        <div className="d-flex align-items-center gap-2">
                            {/* Year Filter */}
                            <div className="bg-white shadow-sm rounded-pill px-3 py-1 d-flex align-items-center">
                                <span className="font-size-13 fw-bold me-2 text-muted">Tahun:</span>
                                <Input
                                    type="select"
                                    className="border-0 bg-transparent p-0 shadow-none font-size-14 fw-bold text-primary"
                                    style={{ width: '80px', cursor: 'pointer' }}
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {dashboardData.years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </Input>
                            </div>

                            <button className="btn btn-primary btn-sm rounded-pill px-3">
                                <i className="bx bx-download me-1"></i> Export Data
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Summary Cards */}
                    <Row className="mb-4">
                        <Col xl={3} md={6}>
                            <Card className="card-h-100 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-xs me-3">
                                            <span className="avatar-title rounded-circle bg-primary bg-opacity-10 text-primary font-size-18">
                                                <i className="bx bx-building-house"></i>
                                            </span>
                                        </div>
                                        <h5 className="font-size-14 mb-0 text-muted">Total Nasional</h5>
                                    </div>
                                    <h2 className="mt-2 mb-0 fw-bold">
                                        {loading ? "..." : dashboardData.summary.total.toLocaleString('id-ID')}
                                    </h2>
                                    <p className="text-muted mb-0 mt-2 font-size-12">Unit Rumah Ibadah</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={3} md={6}>
                            <Card className="card-h-100 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-xs me-3">
                                            <span className="avatar-title rounded-circle bg-success bg-opacity-10 text-success font-size-18">
                                                <i className="bx bx-map"></i>
                                            </span>
                                        </div>
                                        <h5 className="font-size-14 mb-0 text-muted">Provinsi Terbanyak</h5>
                                    </div>
                                    <h4 className="mt-2 mb-0">{loading ? "..." : dashboardData.summary.highest.name}</h4>
                                    <p className="text-muted mb-0 mt-2 font-size-12">
                                        Total: <span className="fw-bold">{dashboardData.summary.highest.value.toLocaleString('id-ID')}</span> Unit
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={3} md={6}>
                            <Card className="card-h-100 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-xs me-3">
                                            <span className="avatar-title rounded-circle bg-warning bg-opacity-10 text-warning font-size-18">
                                                <i className="bx bx-map-pin"></i>
                                            </span>
                                        </div>
                                        <h5 className="font-size-14 mb-0 text-muted">Provinsi Tersedikit</h5>
                                    </div>
                                    <h4 className="mt-2 mb-0">{loading ? "..." : dashboardData.summary.lowest.name}</h4>
                                    <p className="text-muted mb-0 mt-2 font-size-12">
                                        Total: <span className="fw-bold">{dashboardData.summary.lowest.value.toLocaleString('id-ID')}</span> Unit
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={3} md={6}>
                            <Card className="card-h-100 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-xs me-3">
                                            <span className="avatar-title rounded-circle bg-info bg-opacity-10 text-info font-size-18">
                                                <i className="bx bx-trending-up"></i>
                                            </span>
                                        </div>
                                        <h5 className="font-size-14 mb-0 text-muted">Pertumbuhan (YoY)</h5>
                                    </div>
                                    <h2 className="mt-2 mb-0 fw-bold">{loading ? "..." : dashboardData.summary.growth}%</h2>
                                    <p className="text-muted mb-0 mt-2 font-size-12">Dibanding tahun lalu</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Row 3: Map & Ranking */}
                    <Row className="mb-4">
                        <Col xl={8}>
                            <Card className="h-100 border-0 shadow-sm">
                                <CardBody>
                                    <h4 className="card-title mb-4">Peta Sebaran {religionName}</h4>
                                    <div style={{ height: '350px', position: 'relative' }}>
                                        {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>Loading Map...</div>}
                                        <Vectormap
                                            value={dashboardData.provinces.reduce((acc, curr) => {
                                                // Map API province_id or name to Map Key
                                                // Assuming API returns standard IDs like "ID-JB", or names we need to map again if not standard.
                                                // For robustness, let's map names to keys again if needed, or assume ID is passed.
                                                // Ideally API sends "ID-AC", etc. in `province_id`.

                                                const mapKeys = {
                                                    "Aceh": "ID-AC", "Sumatera Utara": "ID-SU", "Sumatera Barat": "ID-SB", "Riau": "ID-RI",
                                                    "Jambi": "ID-JA", "Sumatera Selatan": "ID-SS", "Bengkulu": "ID-BE", "Lampung": "ID-LA",
                                                    "Kep. Bangka Belitung": "ID-BB", "Kepulauan Riau": "ID-KR", "DKI Jakarta": "ID-JK",
                                                    "Jawa Barat": "ID-JB", "Jawa Tengah": "ID-JT", "DI Yogyakarta": "ID-YO", "Jawa Timur": "ID-JI",
                                                    "Banten": "ID-BT", "Bali": "ID-BA", "Nusa Tenggara Barat": "ID-NB", "Nusa Tenggara Timur": "ID-NT",
                                                    "Kalimantan Barat": "ID-KB", "Kalimantan Tengah": "ID-KT", "Kalimantan Selatan": "ID-KS",
                                                    "Kalimantan Timur": "ID-KI", "Kalimantan Utara": "ID-KU", "Sulawesi Utara": "ID-SA",
                                                    "Sulawesi Tengah": "ID-ST", "Sulawesi Selatan": "ID-SN", "Sulawesi Tenggara": "ID-SG",
                                                    "Gorontalo": "ID-GO", "Sulawesi Barat": "ID-SR", "Maluku": "ID-MA", "Maluku Utara": "ID-MU",
                                                    "Papua Barat": "ID-PB", "Papua": "ID-PA", "Papua Barat Daya": "ID-PD", "Papua Selatan": "ID-PS",
                                                    "Papua Tengah": "ID-PT", "Papua Pegunungan": "ID-PP"
                                                };
                                                // Use ID if available, else map name
                                                const key = curr.province_id || mapKeys[curr.province_name] || curr.province_name;
                                                acc[key] = curr.total_units;
                                                return acc;
                                            }, {})}
                                            width="100%"
                                            color={color}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="h-100 border-0 shadow-sm">
                                <CardBody>
                                    <h4 className="card-title mb-4">Top 10 Provinsi</h4>
                                    <ReactApexChart
                                        options={rankingOptions}
                                        series={[{ name: 'Jumlah', data: dashboardData.provinces.slice(0, 10).map(p => p.total_units) }]}
                                        type="bar"
                                        height={360}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Row 4: Historical Trend */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex justify-content-between">
                                        <h4 className="card-title mb-4">Tren Pertumbuhan Nasional</h4>
                                    </div>
                                    <ReactApexChart
                                        options={trendOptions}
                                        series={[{ name: 'Total Nasional', data: dashboardData.trend.map(t => t.total) }]}
                                        type="area"
                                        height={300}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Row 5: Detailed Table */}
                    <Row>
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <h4 className="card-title mb-0">Data Detail Provinsi - Tahun {selectedYear}</h4>
                                        <div className="d-flex gap-2">
                                            <Input type="search" placeholder="Cari provinsi..." className="form-control-sm" style={{ width: '200px' }} />
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>No</th>
                                                    <th>Provinsi</th>
                                                    <th>Jumlah (Unit)</th>
                                                    <th>Pertumbuhan (%)</th>
                                                    <th>Kontribusi Nasional</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData.provinces.length > 0 ? dashboardData.provinces.map((prov, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td className="fw-bold">{prov.province_name}</td>
                                                        <td>{prov.total_units ? prov.total_units.toLocaleString('id-ID') : 0}</td>
                                                        <td>
                                                            <span className={`badge ${prov.growth_percentage > 0 ? 'bg-success' : prov.growth_percentage < 0 ? 'bg-danger' : 'bg-warning'} bg-opacity-25 text-${prov.growth_percentage > 0 ? 'success' : prov.growth_percentage < 0 ? 'danger' : 'warning'}`}>
                                                                {prov.growth_percentage > 0 ? '+' : ''}{prov.growth_percentage}%
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="progress" style={{ height: '6px', width: '100px' }}>
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{ width: `${Math.min((prov.national_contribution || 0) * 2, 100)}%`, backgroundColor: color }}
                                                                ></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan="5" className="text-center">Tidak ada data tersedia dari server.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        </React.Fragment>
    );
};

export default WorshipShared;
