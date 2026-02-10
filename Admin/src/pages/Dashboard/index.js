import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Table, Badge } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';
import { useDispatch } from 'react-redux';

// --- IMPORT HELPER & AXIOS ---
import { GET_DASHBOARD_DATA, GET_PENYALURAN_ZM_DATA, GET_WAKAF_TANAH_DATA, GET_PENERIMAAN_PROVINSI } from "../../helpers/url_helper";
import axios from "axios";

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "Rp 0";
    if (value >= 1000000000000) return "Rp " + (value / 1000000000000).toFixed(2).replace('.', ',') + " Triliun";
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(2).replace('.', ',') + " Miliar";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(0).replace('.', ',') + " Juta";
    return "Rp " + value.toLocaleString('id-ID');
};

const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0";
    return value.toLocaleString('id-ID');
};

// --- CHART COMPONENT WRAPPER ---
const ChartWithDetails = ({ title, options, series, labels, colors, totalValue, unit = "Rp", chartType = "donut", originalData = [] }) => {
    let total = 0;
    let seriesData = [];

    if (!series || (Array.isArray(series) && series.length === 0)) {
        return (
            <Card className="kemenag-card">
                <CardBody>
                    <h5 className="card-title mb-4">{title}</h5>
                    <div className="text-center text-muted py-5">Tidak ada data untuk ditampilkan</div>
                </CardBody>
            </Card>
        );
    }

    if (chartType === "bar") {
        seriesData = series[0]?.data || [];
        total = seriesData.length > 0 ? seriesData[seriesData.length - 1] : 0;
    } else {
        seriesData = series;
        total = seriesData.reduce((a, b) => a + b, 0);
    }

    return (
        <Card className="kemenag-card">
            <CardBody>
                <h5 className="card-title mb-4">{title}</h5>
                <Row className="align-items-center">
                    <Col xl={5} className="d-flex justify-content-center">
                        <ReactApexChart
                            options={options || {}}
                            series={series}
                            type={chartType}
                            height={280}
                        />
                    </Col>
                    <Col xl={7}>
                        <div className="mt-4 mt-xl-0">
                            {labels.map((label, index) => {
                                let value = 0;
                                let percent = 0;
                                let displayValue = 0;

                                if (chartType === "bar") {
                                    value = seriesData[index] || 0;
                                    displayValue = originalData.length > 0 ? originalData[index] : value;
                                } else {
                                    value = seriesData[index] || 0;
                                    displayValue = originalData.length > 0 ? originalData[index] : value;
                                    percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                }

                                const color = Array.isArray(colors) ? colors[index % colors.length] : (colors || '#000');

                                return (
                                    <div className="d-flex align-items-center border-bottom py-2" key={index}>
                                        <div className="flex-grow-1 d-flex align-items-center">
                                            <span
                                                className="rounded-circle me-2"
                                                style={{ width: '10px', height: '10px', backgroundColor: color }}
                                            ></span>
                                            <span className="text-muted font-size-12 mb-0 text-truncate" style={{ maxWidth: '150px' }} title={label}>
                                                {label}
                                            </span>
                                        </div>
                                        <div className="text-end" style={{ minWidth: '100px' }}>
                                            <h6 className="mb-0 font-size-13">{unit === "Rp" ? formatCurrency(displayValue) : formatNumber(displayValue)}</h6>
                                            {chartType !== "bar" && <small className="text-muted font-size-11">({percent}%)</small>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

// --- 1. ZIS DISTRIBUTION CHART ---
const ZisDistributionChart = () => {
    const [chartData, setChartData] = useState({
        labels: [], series: [], originalValues: [], loading: true, error: false
    });

    useEffect(() => {
        const fetchZisData = async () => {
            try {
                const response = await axios.get(GET_DASHBOARD_DATA, {
                    headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" }
                });

                const items = response.data?.data?.items || [];
                const apiData = items.length > 0 ? items[0] : {};

                const categories = {
                    'Zakat Fitrah': parseFloat(apiData.total_fitrah || 0),
                    'Zakat Mal': parseFloat(apiData.total_zm_perorangan || 0) + parseFloat(apiData.total_zm_badan || 0),
                    'Infaq': parseFloat(apiData.total_infak_penyaluran || 0),
                    'DSKL & Lainnya': parseFloat(apiData.total_dskl || 0) + parseFloat(apiData.total_csr || 0)
                };

                const dataPoints = Object.entries(categories)
                    .map(([label, value]) => ({ label, value }))
                    .filter(item => item.value > 0);

                const toBillions = (val) => val / 1000000000;

                setChartData({
                    labels: dataPoints.map(d => d.label),
                    series: dataPoints.map(d => toBillions(d.value)),
                    originalValues: dataPoints.map(d => d.value),
                    loading: false, error: false
                });

            } catch (error) { setChartData({ ...chartData, loading: false, error: true }); }
        };
        fetchZisData();
    }, []);

    const colors = ['#34c38f', '#556ee6', '#f1b44c', '#f46a6a'];
    const options = {
        chart: { type: 'pie' }, labels: chartData.labels, colors: colors, legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(1) + "%", style: { fontSize: '10px' } },
        stroke: { show: true, width: 0 },
        tooltip: { y: { formatter: (val) => formatCurrency(val * 1000000000) } }
    };

    if (chartData.loading) return <LoadingCard height={280} />;

    return <ChartWithDetails title="Komposisi Penerimaan ZIS" options={options} series={chartData.series} labels={chartData.labels} colors={colors} chartType="pie" unit="Rp" originalData={chartData.originalValues} />;
};

// --- 2. PENYALURAN BAR CHART ---
const PenyaluranBarChart = () => {
    const [chartData, setChartData] = useState({ series: [], categories: [], originalValues: [], loading: true, error: false });

    useEffect(() => {
        const fetchPenyaluranData = async () => {
            try {
                const response = await axios.get(GET_PENYALURAN_ZM_DATA, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } });
                const items = response.data?.data?.items || [];
                const apiData = items.length > 0 ? items[0] : {};

                const asnafData = [
                    { label: 'Fakir', value: parseFloat(apiData.total_asnaf_fakir || 0) },
                    { label: 'Miskin', value: parseFloat(apiData.total_asnaf_miskin || 0) },
                    { label: 'Fisabilillah', value: parseFloat(apiData.total_asnaf_fisabilillah || 0) },
                    { label: 'Amil', value: parseFloat(apiData.total_asnaf_amil || 0) },
                    { label: 'Muallaf', value: parseFloat(apiData.total_asnaf_muallaf || 0) },
                    { label: 'Lainnya', value: parseFloat(apiData.total_asnaf_riqab || 0) + parseFloat(apiData.total_asnaf_gharimin || 0) },
                ].sort((a, b) => b.value - a.value);

                setChartData({
                    series: [{ name: 'Nominal', data: asnafData.map(d => d.value / 1000000000) }],
                    categories: asnafData.map(d => d.label),
                    originalValues: asnafData.map(d => d.value),
                    loading: false, error: false
                });

            } catch (error) { setChartData({ ...chartData, loading: false, error: true }); }
        };
        fetchPenyaluranData();
    }, []);

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '70%', distributed: true } },
        dataLabels: { enabled: true, formatter: (val, opts) => formatCurrency(chartData.originalValues[opts.dataPointIndex]), style: { colors: ['#fff'] }, offsetX: 0 },
        colors: ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1', '#74788d'],
        xaxis: { categories: chartData.categories, labels: { formatter: (val) => formatNumber(val) + " M" } },
        tooltip: { y: { formatter: (val, opts) => formatCurrency(chartData.originalValues[opts.dataPointIndex]) } },
        legend: { show: false }
    };

    if (chartData.loading) return <LoadingCard height={350} />;

    return (
        <Card className="kemenag-card">
            <CardBody>
                <h5 className="card-title mb-4">Penyaluran Berdasarkan Asnaf</h5>
                <ReactApexChart options={options} series={chartData.series} type="bar" height={350} />
            </CardBody>
        </Card>
    );
};

// --- NEW 3. WAKAF PURPOSE CHART (From Wakaf Menu) ---
const WakafPeruntukanChart = () => {
    const [chartData, setChartData] = useState({ labels: [], series: [], loading: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_WAKAF_TANAH_DATA, {
                    headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" },
                    params: { limit: 5000 }
                });
                const items = response.data?.data?.items || [];
                let counts = { ibadah: 0, pendidikan: 0, sosial: 0, lainnya: 0 };

                items.forEach(item => {
                    const ket = (item.peruntukan_keterangan || "").toLowerCase();
                    if (ket.includes('masjid') || ket.includes('musholla')) counts.ibadah++;
                    else if (ket.includes('sekolah') || ket.includes('pesantren')) counts.pendidikan++;
                    else if (ket.includes('fakir') || ket.includes('sosial')) counts.sosial++;
                    else counts.lainnya++;
                });

                setChartData({
                    labels: ['Ibadah', 'Pendidikan', 'Sosial', 'Lainnya'],
                    series: [counts.ibadah, counts.pendidikan, counts.sosial, counts.lainnya],
                    loading: false
                });
            } catch (e) { setChartData({ ...chartData, loading: false }); }
        };
        fetchData();
    }, []);

    const colors = ['#34c38f', '#556ee6', '#f1b44c', '#74788d'];
    const options = {
        chart: { type: 'pie' }, labels: chartData.labels, colors: colors, legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(1) + "%", style: { fontSize: '10px' } },
        stroke: { show: true, width: 0 }
    };

    if (chartData.loading) return <LoadingCard height={400} />;

    return <ChartWithDetails title="Peruntukan Tanah Wakaf" options={options} series={chartData.series} labels={chartData.labels} colors={colors} chartType="pie" unit="Lokasi" originalData={chartData.series} height={400} />;
};

// --- NEW 4. TOP 5 PROVINCES TABLE (From Laporan Dana) ---
const TopProvincesTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_PENERIMAAN_PROVINSI, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } });
                const items = response.data?.data?.items || [];

                const processed = items.map(item => ({
                    provinsi: item.provinsi,
                    total: parseFloat(item.total_zakat_perorangan || 0) + parseFloat(item.total_zakat_badan || 0) + parseFloat(item.zakat_fitrah || 0) + parseFloat(item.total_infak_penyaluran || 0)
                })).sort((a, b) => b.total - a.total).slice(0, 5);

                setData(processed);
                setLoading(false);
            } catch (e) { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingCard height={400} />;

    return (
        <Card className="kemenag-table-card" style={{ minHeight: '400px' }}>
            <CardBody>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="card-title mb-0">5 Provinsi Pengumpulan Tertinggi</h5>
                    <Badge color="soft-success" className="text-success p-2">Real-time</Badge>
                </div>
                <div className="kemenag-table-responsive">
                    <Table className="kemenag-table">
                        <thead className="sticky-top">

                            <tr>
                                <th>No</th>
                                <th>Provinsi</th>
                                <th className="text-end">Total Dana</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td className="fw-bold">{row.provinsi}</td>
                                    <td className="text-end text-success fw-bold">{formatCurrency(row.total)}</td>
                                    <td>
                                        <div className="progress" style={{ height: '6px', width: '80px' }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    );
};

const LoadingCard = ({ height }) => (
    <Card className="kemenag-card">
        <CardBody className="d-flex justify-content-center align-items-center" style={{ minHeight: height || 200 }}>
            <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>
        </CardBody>
    </Card>
);

// --- STAT CARD ---
const StatCard = ({ title, value, icon, color, isCurrency, loading = false }) => (
    <Col xl={3} md={6}>
        <Card className="kemenag-stats-card">
            <CardBody className="p-3">
                <div className="d-flex align-items-center mb-2">
                    <div className={`avatar-xs me-3`}>
                        <span className={`avatar-title rounded-circle bg-${color} bg-opacity-25 text-${color} font-size-18`}>
                            <i className={icon}></i>
                        </span>
                    </div>
                    <h6 className="font-size-12 text-muted mb-0 text-uppercase">{title}</h6>
                </div>
                <h4 className="mt-2 mb-0">
                    {loading ? (
                        <div className="spinner-grow spinner-grow-sm text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                    ) : (
                        isCurrency ? formatCurrency(value) : <CountUp end={value || 0} duration={2} separator="." />
                    )}
                </h4>
            </CardBody>
        </Card>
    </Col>
);

const Dashboard = () => {
    document.title = "Dashboard Utama | Kemenag RI";
    const dispatch = useDispatch();

    const [loadingZis, setLoadingZis] = useState(true);
    const [loadingWakaf, setLoadingWakaf] = useState(true);

    const [stats, setStats] = useState([
        { title: "Total Penerimaan ZIS", value: 0, icon: "bx bx-money", color: "success", isCurrency: true },
        { title: "Total Lokasi Wakaf", value: 0, icon: "bx bx-map-pin", color: "primary", isCurrency: false },
        { title: "Total Rumah Ibadah", value: 740000, icon: "bx bx-home-heart", color: "danger", isCurrency: false },
        { title: "Total Infaq", value: 0, icon: "bx bx-donate-heart", color: "warning", isCurrency: true },
    ]);

    useEffect(() => {
        // Fetch ZIS Stats
        const fetchZis = async () => {
            try {
                const res = await axios.get(GET_DASHBOARD_DATA, { headers: { "x-api-key": "prod-7161ca4b-ece2-4d90-b454-6be16c10c8a9" } });
                const item = res.data?.data?.items?.[0] || {};
                setStats(prev => {
                    const n = [...prev];
                    n[0].value = item.total_penerimaan_all || 0;
                    n[3].value = item.total_infak_penyaluran || 0;
                    return n;
                });
            } catch (e) { console.error(e); } finally { setLoadingZis(false); }
        };

        // Fetch Wakaf Stats
        const fetchWakaf = async () => {
            try {
                const res = await axios.get(GET_WAKAF_TANAH_DATA, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" }, params: { limit: 20000 } });
                const count = res.data?.data?.items?.length || 0;
                setStats(prev => {
                    const n = [...prev];
                    n[1].value = count;
                    return n;
                });
            } catch (e) { console.error(e); } finally { setLoadingWakaf(false); }
        };

        fetchZis();
        fetchWakaf();
    }, []);

    return (
        <div className="kemenag-page">
            <div className="kemenag-container">
                {/* Header */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <h4 className="kemenag-title">Dashboard Eksekutif Kemenag</h4>
                        <p className="kemenag-subtitle">Ringkasan data Zakat, Wakaf, dan Layanan Keagamaan Nasional</p>
                    </Col>
                </Row>

                {/* Stats Row */}
                <Row className="g-3 mb-4">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} loading={idx === 1 ? loadingWakaf : (idx === 0 || idx === 3 ? loadingZis : false)} />
                    ))}
                </Row>

                {/* Original Charts Row (ZIS) */}
                <Row className="g-3 mb-4">
                    <Col xl={12}>
                        <ZisDistributionChart />
                    </Col>
                </Row>

                {/* Penyaluran Chart */}
                <Row className="g-3 mb-4">
                    <Col xs={12}>
                        <PenyaluranBarChart />
                    </Col>
                </Row>

                {/* NEW SECTION: Wakaf Insights & Laporan Dana Top Provinces */}
                <Row className="mb-3">
                    <Col xs={12}><h5 className="kemenag-title" style={{ fontSize: '20px', marginBottom: '0' }}>Insight Wakaf & Wilayah</h5></Col>
                </Row>
                <Row className="g-3 mb-4">
                    {/* 1. Wakaf Peruntukan (From Menu Wakaf) */}
                    <Col xl={6}>
                        <WakafPeruntukanChart />
                    </Col>
                    {/* 2. Top Provinces Table (From Laporan Dana) */}
                    <Col xl={6}>
                        <TopProvincesTable />
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default Dashboard;