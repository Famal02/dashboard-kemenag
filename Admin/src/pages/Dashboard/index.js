import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Row, Table, Badge } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';

// --- IMPORT HELPER & AXIOS ---
import { GET_DASHBOARD_DATA, GET_PENYALURAN_ZM_DATA, GET_WAKAF_TANAH_DATA, GET_PENERIMAAN_PROVINSI } from "../../helpers/url_helper";
import axios from "axios";
import SkeletonLoader from "../../components/Common/SkeletonLoader";


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
const ChartWithDetails = ({ title, options, series, labels, colors, totalValue, unit = "Rp", chartType = "pie", originalData = [] }) => {
    const { t } = useTranslation();
    let total = 0;
    let seriesData = [];

    if (!series || (Array.isArray(series) && series.length === 0)) {
        return (
            <Card className="kemenag-card kemenag-card-interactive">
                <CardBody>
                    <h5 className="card-title mb-4">{title}</h5>
                    <div className="text-center text-muted py-5">{t("No_Data")}</div>
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

    // Force chart type in options
    const chartOptions = {
        ...(options || {}),
        chart: {
            ...(options?.chart || {}),
            type: chartType
        }
    };

    return (
        <Card className="kemenag-card kemenag-card-interactive">
            <CardBody>
                <h5 className="card-title mb-4">{title}</h5>
                <Row className="align-items-center">
                    <Col xl={5} className="d-flex justify-content-center">
                        <ReactApexChart
                            key={chartType} // Force remount on type change
                            options={chartOptions}
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
    const { t } = useTranslation();
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

    const colors = ['#34c38f', '#375673', '#d5cd94', '#f46a6a'];
    const pieOptions = {
        chart: { type: 'pie', id: 'zis-pie-chart' },
        labels: chartData.labels,
        colors: colors,
        legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(1) + "%", style: { fontSize: '10px' } },
        stroke: { show: true, width: 0 },
        tooltip: { y: { formatter: (val) => formatCurrency(val * 1000000000) } }
    };

    if (chartData.loading) return <SkeletonLoader type="chart" height={350} />;

    return <ChartWithDetails title={t("Source_Fund")} options={pieOptions} series={chartData.series} labels={chartData.labels} colors={colors} chartType="pie" unit="Rp" originalData={chartData.originalValues} height={350} />;
};

// --- 2. PENYALURAN BAR CHART ---
const PenyaluranBarChart = () => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState({ labels: [], series: [], originalValues: [], loading: true, error: false });

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
                    labels: asnafData.map(d => d.label),
                    series: asnafData.map(d => d.value / 1000000000),
                    originalValues: asnafData.map(d => d.value),
                    loading: false, error: false
                });

            } catch (error) { setChartData({ ...chartData, loading: false, error: true }); }
        };
        fetchPenyaluranData();
    }, []);

    const colors = ['#34c38f', '#375673', '#f46a6a', '#d5cd94', '#50a5f1', '#74788d'];
    const asnafPieOptions = {
        chart: { type: 'pie', id: 'asnaf-pie-chart' },
        labels: chartData.labels,
        colors: colors,
        legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(1) + "%", style: { fontSize: '10px' } },
        stroke: { show: true, width: 0 },
        tooltip: { y: { formatter: (val) => formatCurrency(val * 1000000000) } }
    };

    if (chartData.loading) return <SkeletonLoader type="chart" height={350} />;

    return (
        <ChartWithDetails
            title={t("Asnaf_Distribution")}
            options={asnafPieOptions}
            series={chartData.series}
            labels={chartData.labels}
            colors={colors}
            chartType="pie"
            unit="Rp"
            originalData={chartData.originalValues}
            height={350}
        />
    );
};

// --- NEW 3. WAKAF PURPOSE CHART (From Wakaf Menu) ---
const WakafPeruntukanChart = ({ data, loading }) => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState({ labels: [], series: [], loading: true });

    useEffect(() => {
        if (loading) {
            setChartData(prev => ({ ...prev, loading: true }));
            return;
        }

        const items = data || [];
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
    }, [data, loading]);

    const colors = ['#375673', '#d5cd94', '#34c38f', '#74788d'];
    const options = {
        chart: { type: 'pie' }, labels: chartData.labels, colors: colors, legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(1) + "%", style: { fontSize: '10px' } },
        stroke: { show: true, width: 0 }
    };

    if (chartData.loading) return <SkeletonLoader type="chart" height={400} />;

    return <ChartWithDetails title={t("Wakaf_Allocation")} options={options} series={chartData.series} labels={chartData.labels} colors={colors} chartType="pie" unit="Lokasi" originalData={chartData.series} height={400} />;
};

// --- NEW 4. TOP 5 PROVINCES TABLE (From Laporan Dana) ---
// --- NEW 4. TOP 5 PROVINCES PIE CHART (From Laporan Dana) ---
const TopProvincesTable = () => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState({ labels: [], series: [], loading: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_PENERIMAAN_PROVINSI, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } });
                const items = response.data?.data?.items || [];

                const processed = items.map(item => ({
                    provinsi: item.provinsi,
                    total: parseFloat(item.total_zakat_perorangan || 0) + parseFloat(item.total_zakat_badan || 0) + parseFloat(item.zakat_fitrah || 0) + parseFloat(item.total_infak_penyaluran || 0)
                })).sort((a, b) => b.total - a.total).slice(0, 5);

                setChartData({
                    labels: processed.map(d => d.provinsi),
                    series: processed.map(d => d.total),
                    loading: false
                });
            } catch (e) { setChartData(prev => ({ ...prev, loading: false })); }
        };
        fetchData();
    }, []);

    const colors = ['#375673', '#34c38f', '#d5cd94', '#f46a6a', '#50a5f1'];
    const options = {
        chart: { type: 'pie' }, labels: chartData.labels, colors: colors, legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(1) + "%", style: { fontSize: '10px' } },
        stroke: { show: true, width: 0 },
        tooltip: { y: { formatter: (val) => formatCurrency(val) } }
    };

    if (chartData.loading) return <SkeletonLoader type="chart" height={400} />;

    return <ChartWithDetails title={t("Top_Provinces")} options={options} series={chartData.series} labels={chartData.labels} colors={colors} chartType="pie" unit="Rp" originalData={chartData.series} height={400} />;
};

const LoadingCard = ({ height }) => (
    <Card className="kemenag-card">
        <CardBody className="p-0">
            <SkeletonLoader type="chart" height={height || 200} />
        </CardBody>
    </Card>
);

// --- STAT CARD ---
const StatCard = ({ title, value, icon, color, isCurrency, loading = false }) => {
    return (
        <Col xl={4} md={6}>
            <Card className="kemenag-stats-card shadow-lg" style={{ backgroundColor: '#1c3e5e', border: 'none', borderLeft: '6px solid #d5cd94', borderRadius: '8px' }}>
                <CardBody className="p-3">
                    <div className="d-flex align-items-center mb-3">
                        <div className={`avatar-xs me-2`}>
                            <span className={`avatar-title rounded-circle bg-transparent text-${color} font-size-18`}>
                                <i className={icon}></i>
                            </span>
                        </div>
                        {/* Explicitly set Gold Mist color and remove text-muted */}
                        <h6 className="font-size-11 mb-0 text-uppercase fw-bold" style={{ color: '#d5cd94', opacity: 0.8, letterSpacing: '0.5px' }}>{title}</h6>
                    </div>
                    <h4 className="mt-0 mb-0 fw-bold" style={{ color: '#d5cd94', fontSize: '22px' }}>
                        {loading ? (
                            <SkeletonLoader type="text" width="60%" />
                        ) : (
                            isCurrency ? formatCurrency(value) : <CountUp end={value || 0} duration={2} separator="." />
                        )}
                    </h4>
                </CardBody>
            </Card>
        </Col>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    document.title = t("Dashboard_Title") + " | Kemenag RI";
    const [wakafData, setWakafData] = useState([]);
    const [loadingZis, setLoadingZis] = useState(true);
    const [loadingWakaf, setLoadingWakaf] = useState(true);

    const [stats, setStats] = useState([
        { titleKey: "Total_ZIS", value: 0, icon: "bx bx-money", color: "success", isCurrency: true },
        { titleKey: "Total_Wakaf", value: 0, icon: "bx bx-map-pin", color: "primary", isCurrency: false },
        // { titleKey: "Total_Rumah_Ibadah", value: 0, icon: "bx bx-home-heart", color: "danger", isCurrency: false }, // DISABLED
        { titleKey: "Total_Infaq", value: 0, icon: "bx bx-donate-heart", color: "warning", isCurrency: true },
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
                    n[2].value = item.total_infak_penyaluran || 0; // Updated index from 3 to 2
                    return n;
                });
            } catch (e) { console.error(e); } finally { setLoadingZis(false); }
        };

        // Fetch Wakaf Stats & Data (Once)
        const fetchWakaf = async () => {
            try {
                const res = await axios.get(GET_WAKAF_TANAH_DATA, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" }, params: { limit: 20000 } });
                const items = res.data?.data?.items || [];
                setWakafData(items);
                setStats(prev => {
                    const n = [...prev];
                    n[1].value = items.length;
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
                        <h4 className="kemenag-title">{t("Dashboard_Title")}</h4>
                        <p className="kemenag-subtitle">{t("Dashboard_Subtitle")}</p>
                    </Col>
                </Row>

                {/* Stats Row */}
                <Row className="g-3 mb-4">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} title={t(stat.titleKey)} loading={idx === 1 ? loadingWakaf : (idx === 0 || idx === 2 ? loadingZis : false)} />
                    ))}
                </Row>

                {/* ZIS & Penyaluran Charts (Side by Side) */}
                <Row className="g-3 mb-4">
                    <Col xl={6}>
                        <ZisDistributionChart />
                    </Col>
                    <Col xl={6}>
                        <PenyaluranBarChart />
                    </Col>
                </Row>

                {/* NEW SECTION: Wakaf Insights & Laporan Dana Top Provinces */}
                <Row className="g-3 mb-4">
                    {/* 1. Wakaf Peruntukan (From Menu Wakaf) */}
                    <Col xl={6}>
                        <WakafPeruntukanChart data={wakafData} loading={loadingWakaf} />
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