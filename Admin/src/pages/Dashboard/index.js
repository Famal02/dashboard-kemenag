import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';
import { useDispatch } from 'react-redux';

// --- IMPORT HELPER & AXIOS ---
import { GET_DASHBOARD_DATA, GET_PENYALURAN_ZM_DATA, GET_WAKAF_TANAH_DATA } from "../../helpers/url_helper";
import axios from "axios";

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "Rp 0";
    if (value >= 1000000000000) return "Rp " + (value / 1000000000000).toFixed(2).replace('.', ',') + " Triliun";
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(2).replace('.', ',') + " Miliar";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(2).replace('.', ',') + " Juta";
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

    // Defensive check for series
    if (!series || (Array.isArray(series) && series.length === 0)) {
        return (
            <Card className="card-h-100 border-0 shadow-sm rounded-3">
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
        <Card className="card-h-100 border-0 shadow-sm rounded-3">
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

// --- SPECIFIC CHART DATA ---

const ZisDistributionChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        series: [],
        originalValues: [],
        loading: true,
        error: false
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
                    'Zakat Mal Perorangan': parseFloat(apiData.total_zm_perorangan || apiData.total_zakat || 0),
                    'Zakat Mal Badan': parseFloat(apiData.total_zm_badan || apiData.total_za_badal || 0),
                    'Infaq': parseFloat(apiData.total_infak_penyaluran || apiData.total_infak || 0),
                    'Fidyah': parseFloat(apiData.total_fidyah || 0),
                    'DSKL': parseFloat(apiData.total_dskl || 0),
                    'CSR': parseFloat(apiData.total_csr || 0),
                    'Kurban': parseFloat(apiData.total_kurban || 0),
                    'IS OPS, IST & ISTT': parseFloat(apiData.total_is_ops || 0) + parseFloat(apiData.total_ist || 0) + parseFloat(apiData.total_istt || 0)
                };

                const dataPoints = Object.entries(categories)
                    .map(([label, value]) => ({ label, value }))
                    .filter(item => item.value > 0);

                const toBillions = (val) => val / 1000000000;

                setChartData({
                    labels: dataPoints.map(d => d.label),
                    series: dataPoints.map(d => toBillions(d.value)),
                    originalValues: dataPoints.map(d => d.value),
                    loading: false,
                    error: false
                });

            } catch (error) {
                console.error('Error fetching ZIS distribution data:', error);
                setChartData({
                    labels: [], series: [], originalValues: [],
                    loading: false, error: true
                });
            }
        };

        fetchZisData();
    }, []);

    const colors = ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1', '#74788d', '#e83e8c', '#20c997', '#6f42c1', '#fd7e14', '#0dcaf0'];

    const options = {
        chart: { type: 'pie' },
        labels: chartData.labels,
        colors: colors,
        legend: { show: false },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(1) + "%";
            },
            style: { fontSize: '10px' }
        },
        stroke: { show: true, width: 0 },
        tooltip: {
            y: {
                formatter: (val) => {
                    const originalVal = (val || 0) * 1000000000;
                    return formatCurrency(originalVal);
                }
            }
        }
    };

    if (chartData.loading) {
        return (
            <Card className="card-h-100 border-0 shadow-sm rounded-3">
                <CardBody className="d-flex justify-content-center align-items-center" style={{ minHeight: '280px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (chartData.error || chartData.series.length === 0) {
        return (
            <Card className="card-h-100 border-0 shadow-sm rounded-3">
                <CardBody className="d-flex justify-content-center align-items-center" style={{ minHeight: '280px' }}>
                    <div className="text-muted">Data Penerimaan tidak tersedia</div>
                </CardBody>
            </Card>
        );
    }

    return (
        <ChartWithDetails
            title="Komposisi Penerimaan ZIS"
            options={options}
            series={chartData.series}
            labels={chartData.labels}
            colors={colors}
            chartType="pie"
            unit="Rp"
            originalData={chartData.originalValues}
        />
    );
};

const PenyaluranBarChart = () => {
    const [chartData, setChartData] = useState({
        series: [{ name: 'Penyaluran (Miliar)', data: [] }],
        categories: [],
        originalValues: [],
        loading: true,
        error: false
    });

    useEffect(() => {
        const fetchPenyaluranData = async () => {
            try {
                const response = await axios.get(GET_PENYALURAN_ZM_DATA, {
                    headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" }
                });

                const items = response.data?.data?.items || [];
                const apiData = items.length > 0 ? items[0] : {};

                const asnafData = [
                    { label: 'Fakir', value: parseFloat(apiData.total_asnaf_fakir || 0) },
                    { label: 'Miskin', value: parseFloat(apiData.total_asnaf_miskin || 0) },
                    { label: 'Amil', value: parseFloat(apiData.total_asnaf_amil || 0) },
                    { label: 'Muallaf', value: parseFloat(apiData.total_asnaf_muallaf || 0) },
                    { label: 'Riqab', value: parseFloat(apiData.total_asnaf_riqab || 0) },
                    { label: 'Gharimin', value: parseFloat(apiData.total_asnaf_gharimin || 0) },
                    { label: 'Fisabilillah', value: parseFloat(apiData.total_asnaf_fisabilillah || 0) },
                    { label: 'Ibnu Sabil', value: parseFloat(apiData.total_asnaf_ibnusabil || 0) },
                ].sort((a, b) => b.value - a.value);

                const toBillions = val => val / 1000000000;

                setChartData({
                    series: [{
                        name: 'Nominal',
                        data: asnafData.map(d => toBillions(d.value))
                    }],
                    categories: asnafData.map(d => d.label),
                    originalValues: asnafData.map(d => d.value),
                    loading: false,
                    error: false
                });

            } catch (error) {
                console.error('Error fetching Penyaluran data:', error);
                setChartData({ series: [], categories: [], loading: false, error: true });
            }
        };

        fetchPenyaluranData();
    }, []);

    const options = {
        chart: {
            type: 'bar',
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '70%',
                distributed: true
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                if (!chartData.originalValues || chartData.originalValues.length === 0) return val;
                const originalVal = chartData.originalValues[opts.dataPointIndex] || 0;

                if (originalVal >= 1e12) return (originalVal / 1e12).toFixed(1) + " T";
                if (originalVal >= 1e9) return (originalVal / 1e9).toFixed(0) + " M";
                return val;
            },
            style: { colors: ['#fff'] },
            offsetX: 0
        },
        colors: ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1', '#74788d', '#e83e8c', '#20c997'],
        xaxis: {
            categories: chartData.categories,
            labels: {
                formatter: (val) => formatNumber(val) + " M"
            }
        },
        tooltip: {
            y: {
                formatter: function (val, opts) {
                    const originalVal = chartData.originalValues ? chartData.originalValues[opts.dataPointIndex] : 0;
                    return formatCurrency(originalVal);
                }
            }
        },
        legend: { show: false }
    };

    if (chartData.loading) {
        return (
            <Card className="card-h-100 border-0 shadow-sm rounded-3">
                <CardBody className="d-flex justify-content-center align-items-center" style={{ minHeight: '350px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (chartData.error || chartData.categories.length === 0) {
        return (
            <Card className="card-h-100 border-0 shadow-sm rounded-3">
                <CardBody>
                    <h5 className="card-title mb-4">Penyaluran Berdasarkan Asnaf</h5>
                    <div className="text-center text-muted p-5">Data Penyaluran tidak tersedia</div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="card-h-100 border-0 shadow-sm rounded-3">
            <CardBody>
                <h5 className="card-title mb-4">Penyaluran Berdasarkan Asnaf</h5>
                <ReactApexChart
                    options={options}
                    series={chartData.series}
                    type="bar"
                    height={350}
                />
            </CardBody>
        </Card>
    );
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon, color, unit = "", loading = false }) => (
    <Col xl={3} md={6}>
        <Card className="card-h-100 border-0 shadow-sm rounded-3">
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
                        <div className="spinner-grow spinner-grow-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        unit === "Rp " ? formatCurrency(value) : <CountUp end={value || 0} duration={2} separator="." />
                    )}
                </h4>
            </CardBody>
        </Card>
    </Col>
);

const Dashboard = () => {
    document.title = "Dashboard Utama | Kemenag RI";

    const dispatch = useDispatch();

    // Global Loading State (Optional, but good for sync)
    // Individual Stat Loading States
    const [loadingZis, setLoadingZis] = useState(true);
    const [loadingWakaf, setLoadingWakaf] = useState(true);

    const [stats, setStats] = useState([
        { title: "Total Penerimaan ZIS", value: 0, icon: "bx bx-money", color: "success", isCurrency: true },
        { title: "Total Lokasi Wakaf", value: 0, icon: "bx bx-map-pin", color: "primary", isCurrency: false },
        { title: "Total Rumah Ibadah", value: 740000, icon: "bx bx-home-heart", color: "danger", isCurrency: false },
        { title: "Lembaga Zakat", value: 650, icon: "bx bxs-institution", color: "warning", isCurrency: false },
    ]);

    // Independent Fetch Function for ZIS
    const fetchZisStats = async () => {
        try {
            const resZis = await axios.get(GET_DASHBOARD_DATA, {
                headers: { "x-api-key": "prod-7161ca4b-ece2-4d90-b454-6be16c10c8a9" }
            });

            const itemZis = resZis.data?.data?.items?.[0] || {};
            const nilaiTotalZis = itemZis.total_penerimaan_all || 0;
            const nilaiTotalInfaq = itemZis.total_infak_penyaluran || 0;

            setStats(prevStats => {
                const newStats = [...prevStats];
                newStats[0].value = nilaiTotalZis; // Update ZIS
                newStats[3].title = "Total Infaq"; // Update Infaq Card config
                newStats[3].value = nilaiTotalInfaq;
                newStats[3].icon = "bx bx-donate-heart";
                newStats[3].isCurrency = true;
                return newStats;
            });
        } catch (error) {
            console.error("GAGAL FETCH ZIS STATS:", error);
            // Optionally set error state for UI feedback
        } finally {
            setLoadingZis(false);
        }
    };

    // Independent Fetch Function for Wakaf
    const fetchWakafStats = async () => {
        try {
            const resWakaf = await axios.get(GET_WAKAF_TANAH_DATA, {
                headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" },
                params: { limit: 20000 } // Keep high limit for count, consider optimizing backend later
            });

            const totalWakafLocations = resWakaf.data?.data?.items?.length || 0;

            setStats(prevStats => {
                const newStats = [...prevStats];
                newStats[1].title = "Total Lokasi Wakaf";
                newStats[1].value = totalWakafLocations;
                newStats[1].isCurrency = false;
                newStats[1].unit = "";
                return newStats;
            });
        } catch (error) {
            console.error("GAGAL FETCH WAKAF STATS:", error);
        } finally {
            setLoadingWakaf(false);
        }
    };

    useEffect(() => {
        // Execute independent fetches in parallel
        fetchZisStats();
        fetchWakafStats();
    }, []);

    return (
        <React.Fragment>
            <div className="page-content bg-light bg-opacity-10">
                <div className="custom-container">

                    {/* Header */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4 className="mb-1 fw-bold text-dark">Dashboard Eksekutif Kemenag</h4>
                                    <p className="text-muted mb-0 font-size-13">Ringkasan data Zakat, Wakaf, dan Layanan Keagamaan Nasional</p>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Stats Row */}
                    <Row className="g-3 mb-4">
                        {stats.map((stat, idx) => {
                            // Determine loading state for each card
                            // Idx 0 (ZIS) & 3 (Infaq) depends on ZIS API
                            // Idx 1 (Wakaf) depends on Wakaf API
                            // Idx 2 (Rumah Ibadah) is static, no loading needed
                            let isLoading = false;
                            if (idx === 0 || idx === 3) isLoading = loadingZis;
                            if (idx === 1) isLoading = loadingWakaf;

                            return (
                                <StatCard
                                    key={idx}
                                    title={stat.title}
                                    value={stat.value}
                                    unit={stat.isCurrency ? "Rp " : ""}
                                    icon={stat.icon}
                                    color={stat.color}
                                    loading={isLoading}
                                />
                            );
                        })}
                    </Row>

                    {/* Charts Row */}
                    <Row className="g-3 mb-4">
                        <Col xl={12}>
                            <ZisDistributionChart />
                        </Col>
                    </Row>

                    {/* New Penyaluran Chart Row */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <PenyaluranBarChart />
                        </Col>
                    </Row>

                    {/* Map Section */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm rounded-3">
                                <CardBody>
                                    <h5 className="card-title mb-3">Peta Sebaran Tanah Wakaf</h5>
                                    <div className="alert alert-info d-flex align-items-center">
                                        <i className="bx bx-info-circle me-2 font-size-20"></i>
                                        Peta interaktif sebaran lokasi tanah wakaf dapat dilihat secara lengkap pada menu <strong>Wakaf</strong>.
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        </React.Fragment>
    );
}

export default Dashboard;