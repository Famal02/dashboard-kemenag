import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Row } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';

// --- IMPORT HELPER & AXIOS ---
import { GET_ZAKAT_PENERIMAAN_BS, GET_ZAKAT_PENYALURAN_TAHUN, GET_WAKAF_TANAH_DATA, GET_ZAKAT_PENERIMAAN_PROVINSI } from "../../helpers/url_helper";
import axios from "axios";
import SkeletonLoader from "../../components/Common/SkeletonLoader";


// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "Rp 0";
    if (value >= 1000000000000) return "Rp " + (value / 1000000000000).toFixed(2).replace('.', ',') + " T";
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(2).replace('.', ',') + " M";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(0).replace('.', ',') + " Jt";
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
            <Card className="h-100 shadow-sm border-0 kemenag-hover-card">
                <CardBody>
                    <h5 className="card-title mb-4 fw-bold">{title}</h5>
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

    const chartOptions = {
        ...(options || {}),
        chart: { ...(options?.chart || {}), type: chartType },
        legend: { show: false }
    };

    const hasScrollableList = labels.length > 6;

    return (
        <Card className="h-100 shadow-sm border-0 kemenag-hover-card">
            <CardBody>
                <h5 className="card-title mb-4 fw-bold">{title}</h5>
                <Row className="align-items-center">
                    <Col xl={5} className="d-flex justify-content-center">
                        <ReactApexChart
                            key={chartType}
                            options={chartOptions}
                            series={series}
                            type={chartType}
                            height={280}
                        />
                    </Col>
                    <Col xl={7}>
                        <div className={`mt-4 mt-xl-0${hasScrollableList ? ' chart-legend-scroll' : ''}`} style={hasScrollableList ? { maxHeight: '310px', overflowY: 'auto' } : {}}>
                            {(labels || []).map((label, index) => {
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
                                        <div className="flex-grow-1 d-flex align-items-center" style={{ overflow: 'hidden' }}>
                                            <span className="rounded-circle me-2 flex-shrink-0" style={{ width: '10px', height: '10px', backgroundColor: color }}></span>
                                            <span className="text-muted font-size-12 mb-0 text-truncate" title={label}>
                                                {label}
                                            </span>
                                        </div>
                                        <div className="text-end flex-shrink-0 ms-2" style={{ minWidth: '100px' }}>
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
        const CACHE_KEY = 'dash_zis_dist_cache';
        const CACHE_TTL = 30 * 60 * 1000;

        const processItems = (items) => {
            let categories = {
                'Zakat Maal Perorangan': 0, 'Zakat Maal Badan': 0, 'Zakat Fitrah': 0,
                'Infak Penyaluran': 0, 'Infak Terikat': 0, 'Infak Tidak Terikat': 0, 'Infak Operasional': 0,
                'CSR': 0, 'DSKL': 0, 'Fidyah': 0, 'Kurban': 0
            };
            items.forEach(item => {
                categories['Zakat Maal Perorangan'] += (item.total_zm_perorangan || 0) + (item.total_zakat_perorangan || 0);
                categories['Zakat Maal Badan'] += (item.total_zm_badan || 0) + (item.total_zakat_badan || 0);
                categories['Zakat Fitrah'] += (item.total_fitrah || item.zakat_fitrah || 0);
                categories['Infak Penyaluran'] += (item.total_infak_penyaluran || 0);
                categories['Infak Terikat'] += (item.total_ist || 0);
                categories['Infak Tidak Terikat'] += (item.total_istt || 0);
                categories['Infak Operasional'] += (item.total_is_ops || 0);
                categories['CSR'] += (item.total_csr || 0);
                categories['DSKL'] += (item.total_dskl || 0);
                categories['Fidyah'] += (item.total_fidyah || 0);
                categories['Kurban'] += (item.total_kurban || 0);
            });
            const dataPoints = Object.entries(categories).map(([label, value]) => ({ label, value })).filter(item => item.value > 0);
            const toBillions = (val) => val / 1000000000;
            setChartData({ labels: dataPoints.map(d => d.label), series: dataPoints.map(d => toBillions(d.value)), originalValues: dataPoints.map(d => d.value), loading: false, error: false });
        };

        const fetchZisData = async () => {
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) { const { data, timestamp } = JSON.parse(cached); if (Date.now() - timestamp < CACHE_TTL && data) { processItems(data); return; } }
            } catch (e) { }
            try {
                const response = await axios.get(`${GET_ZAKAT_PENERIMAAN_BS}?limit=100`, { headers: { "x-api-key": "prod-2cf350c4-cc0f-494a-af78-5685349627a7" } });
                const items = response.data?.data?.items || response.data?.data || [];
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() })); } catch (e) { }
                processItems(items);
            } catch (error) { setChartData({ ...chartData, loading: false, error: true }); }
        };
        fetchZisData();
    }, []);

    const colors = ['#34c38f', '#375673', '#d5cd94', '#f46a6a', '#556ee6', '#f1b44c', '#50a5f1', '#e83e8c', '#2ab57d', '#fd625e', '#ffc107', '#20c997', '#8e44ad'];
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
        const CACHE_KEY = 'dash_penyaluran_cache';
        const CACHE_TTL = 30 * 60 * 1000;

        const processItems = (items) => {
            let asnafTotals = { fakir: 0, miskin: 0, amil: 0, muallaf: 0, fisabilillah: 0, riqab: 0, gharimin: 0, ibnusabil: 0 };
            items.forEach(item => {
                asnafTotals.fakir += (item.total_asnaf_fakir || 0);
                asnafTotals.miskin += (item.total_asnaf_miskin || 0);
                asnafTotals.amil += (item.total_asnaf_amil || 0);
                asnafTotals.muallaf += (item.total_asnaf_muallaf || 0);
                asnafTotals.fisabilillah += (item.total_asnaf_fisabilillah || 0);
                asnafTotals.riqab += (item.total_asnaf_riqab || 0);
                asnafTotals.gharimin += (item.total_asnaf_gharimin || 0);
                asnafTotals.ibnusabil += (item.total_asnaf_ibnusabil || 0);
            });
            const asnafData = [
                { label: 'Fakir', value: asnafTotals.fakir }, { label: 'Miskin', value: asnafTotals.miskin },
                { label: 'Fisabilillah', value: asnafTotals.fisabilillah }, { label: 'Amil', value: asnafTotals.amil },
                { label: 'Muallaf', value: asnafTotals.muallaf }, { label: 'Riqab', value: asnafTotals.riqab },
                { label: 'Gharimin', value: asnafTotals.gharimin }, { label: 'Ibnu Sabil', value: asnafTotals.ibnusabil },
            ].filter(d => d.value > 0).sort((a, b) => b.value - a.value);
            setChartData({ labels: asnafData.map(d => d.label), series: asnafData.map(d => d.value / 1000000000), originalValues: asnafData.map(d => d.value), loading: false, error: false });
        };

        const fetchPenyaluranData = async () => {
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) { const { data, timestamp } = JSON.parse(cached); if (Date.now() - timestamp < CACHE_TTL && data) { processItems(data); return; } }
            } catch (e) { }
            try {
                const response = await axios.get(`${GET_ZAKAT_PENYALURAN_TAHUN}?limit=100`, { headers: { "x-api-key": "prod-2cf350c4-cc0f-494a-af78-5685349627a7" } });
                const items = response.data?.data?.items || response.data?.data || [];
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() })); } catch (e) { }
                processItems(items);
            } catch (error) { setChartData({ ...chartData, loading: false, error: true }); }
        };
        fetchPenyaluranData();
    }, []);

    const colors = ['#34c38f', '#375673', '#f46a6a', '#d5cd94', '#50a5f1', '#ffc107', '#e83e8c', '#74788d'];
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

const TopProvincesTable = () => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState({ labels: [], series: [], loading: true });

    useEffect(() => {
        const CACHE_KEY = 'dash_top_prov_cache';
        const CACHE_TTL = 30 * 60 * 1000;

        const processItems = (items) => {
            const processed = items.map(item => {
                const totalVal = Object.keys(item).reduce((sum, key) => {
                    if (key.startsWith('total_') || key.startsWith('zakat_')) return sum + (typeof item[key] === 'number' ? item[key] : 0);
                    return sum;
                }, 0);
                return { provinsi: item.provinsi || item.nama_provinsi || "Lainnya", total: totalVal };
            }).sort((a, b) => b.total - a.total).slice(0, 5);
            setChartData({ labels: processed.map(d => d.provinsi), series: processed.map(d => d.total), loading: false });
        };

        const fetchData = async () => {
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) { const { data, timestamp } = JSON.parse(cached); if (Date.now() - timestamp < CACHE_TTL && data) { processItems(data); return; } }
            } catch (e) { }
            try {
                const response = await axios.get(`${GET_ZAKAT_PENERIMAAN_PROVINSI}?limit=100`, { headers: { "x-api-key": "prod-2cf350c4-cc0f-494a-af78-5685349627a7" } });
                const items = response.data?.data?.items || [];
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() })); } catch (e) { }
                processItems(items);
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
            <Card className="kemenag-stats-card" style={{ backgroundColor: '#1c3e5e', border: 'none', borderRadius: '8px', boxShadow: '-6px 6px 0px #d5cd94' }}>
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
        { titleKey: "Total Penerimaan ZIS", value: 0, icon: "bx bx-money", color: "success", isCurrency: true },
        { titleKey: "Total Wakaf Tanah", value: 0, icon: "bx bx-map-pin", color: "primary", isCurrency: false },
        { titleKey: "Total Infaq", value: 0, icon: "bx bx-donate-heart", color: "warning", isCurrency: true },
    ]);

    useEffect(() => {
        const CACHE_TTL = 30 * 60 * 1000;
        const API_HEADERS_ZIS = { "x-api-key": "prod-2cf350c4-cc0f-494a-af78-5685349627a7" };
        const API_HEADERS_WAKAF = { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" };

        // Fetch ZIS Stats (dengan cache)
        const fetchZis = async () => {
            const CACHE_KEY = 'dash_zis_stats_cache';
            let items;
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) { const { data, timestamp } = JSON.parse(cached); if (Date.now() - timestamp < CACHE_TTL && data) items = data; }
            } catch (e) { }
            if (!items) {
                try {
                    const res = await axios.get(`${GET_ZAKAT_PENERIMAAN_BS}?limit=100`, { headers: API_HEADERS_ZIS });
                    items = res.data?.data?.items || res.data?.data || [];
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() })); } catch (e) { }
                } catch (e) { console.error(e); setLoadingZis(false); return; }
            }

            let totalTerkumpul = 0, totalInfaq = 0;
            items.forEach(item => {
                const zm = (item.total_zm_perorangan || 0) + (item.total_zakat_perorangan || 0) + (item.total_zm_badan || 0) + (item.total_zakat_badan || 0);
                const fitrah = (item.total_fitrah || item.zakat_fitrah || 0);
                const infaq = (item.total_infak_penyaluran || 0) + (item.total_ist || 0) + (item.total_istt || 0) + (item.total_is_ops || 0);
                const lainnya = (item.total_fidyah || 0) + (item.total_kurban || 0) + (item.total_csr || 0) + (item.total_dskl || 0);
                totalTerkumpul += (zm + fitrah + infaq + lainnya);
                totalInfaq += infaq;
            });
            setStats(prev => { const n = [...prev]; n[0].value = totalTerkumpul; n[2].value = totalInfaq; return n; });
            setLoadingZis(false);
        };

        // Fetch Wakaf Stats & Data (pagination + cache)
        const fetchWakaf = async () => {
            const CACHE_KEY = 'wakaf_data_cache';
            let items;
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) { const { data, timestamp } = JSON.parse(cached); if (Date.now() - timestamp < CACHE_TTL && data && data.length > 0) items = data; }
            } catch (e) { }

            if (!items) {
                try {
                    const PAGE_SIZE = 2000;
                    const res1 = await axios.get(GET_WAKAF_TANAH_DATA, { headers: API_HEADERS_WAKAF, params: { limit: PAGE_SIZE, page: 1 } });
                    const page1Data = res1.data?.data || {};
                    items = [...(page1Data.items || [])];
                    const totalPages = page1Data.totalPages || 1;
                    if (totalPages > 1) {
                        const pageNums = []; for (let p = 2; p <= totalPages; p++) pageNums.push(p);
                        const results = await Promise.all(pageNums.map(p => axios.get(GET_WAKAF_TANAH_DATA, { headers: API_HEADERS_WAKAF, params: { limit: PAGE_SIZE, page: p } }).then(r => r.data?.data?.items || []).catch(() => [])));
                        results.forEach(r => { items = items.concat(r); });
                    }
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() })); } catch (e) { }
                } catch (e) { console.error(e); setLoadingWakaf(false); return; }
            }

            setWakafData(items);
            setStats(prev => { const n = [...prev]; n[1].value = items.length; return n; });
            setLoadingWakaf(false);
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
                        <StatCard key={idx} {...stat} title={stat.titleKey} loading={idx === 1 ? loadingWakaf : loadingZis} />
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


                <Row className="g-3 mb-4">
                    {/* 1. Wakaf Peruntukan */}
                    <Col xl={6}>
                        <WakafPeruntukanChart data={wakafData} loading={loadingWakaf} />
                    </Col>
                    {/* 2. Top Provinces Table */}
                    <Col xl={6}>
                        <TopProvincesTable />
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default Dashboard;