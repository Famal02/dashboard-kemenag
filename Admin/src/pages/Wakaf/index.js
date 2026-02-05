import React, { useEffect, useState } from 'react';
import { Col, Card, CardBody, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import WakafDistributionMap from "./WakafDistributionMap";
import axios from "axios";
import { GET_WAKAF_TANAH_DATA } from "../../helpers/url_helper";

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(1) + " M";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(1) + " Jt";
    return "Rp " + value.toLocaleString('id-ID');
};

const formatNumber = (value) => value.toLocaleString('id-ID');

// --- CHART COMPONENTS WITH DETAILS ---

const ChartWithDetails = ({ title, options, series, labels, colors, totalValue, unit = "Rp", chartType = "donut" }) => {
    // Handling Total Calculation
    // For Donut: sum of series
    // For Bar: series might be [{data: []}]. Check structure.
    let total = 0;
    let seriesData = [];

    if (chartType === "bar") {
        seriesData = series[0].data;
        total = seriesData.reduce((a, b) => a + b, 0); // Total accumulated? Or maybe just show latest?
        // Context: Growth chart total is usually "Current Total" (last item) not sum of history.
        // For Assets Growth, the last bar is the current asset count.
        total = seriesData[seriesData.length - 1];
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
                            options={options}
                            series={series}
                            type={chartType}
                            height={280}
                        />
                    </Col>
                    <Col xl={7}>
                        <div className="mt-4 mt-xl-0">
                            {labels.map((label, index) => {
                                let value = 0;
                                let percent = 0; // For Bar chart, maybe Growth %? Or just % of max?

                                if (chartType === "bar") {
                                    value = seriesData[index];
                                    // For growth, comparing to previous year would be nice, but consisteny with donut (share) is tricky.
                                    // Let's just show the Value.
                                    // Or if user wants "proporsi style", maybe just Value is enough.
                                } else {
                                    value = seriesData[index];
                                    percent = ((value / total) * 100).toFixed(1);
                                }

                                const color = Array.isArray(colors) ? colors[index % colors.length] : colors;

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
                                            <h6 className="mb-0 font-size-13">{unit === "Rp" ? formatCurrency(value) : formatNumber(value)}</h6>
                                            {chartType !== "bar" && <small className="text-muted font-size-11">({percent}%)</small>}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                                <h6 className="mb-0 text-uppercase text-muted font-size-12 fw-bold">
                                    {chartType === "bar" ? "Total Aset Saat Ini" : "Total"}
                                </h6>
                                <h5 className="mb-0 text-primary fw-bold">
                                    {totalValue || (unit === "Rp" ? formatCurrency(total) : formatNumber(total))}
                                </h5>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

// --- SPECIFIC SECTION COMPONENTS ---

// --- SPECIFIC SECTION COMPONENTS ---

// --- SPECIFIC SECTION COMPONENTS ---

const AssetsByPurposeChart = ({ data }) => {
    const labels = [
        'Sarana & Kegiatan Ibadah',
        'Sarana & Kegiatan Pendidikan',
        'Bantuan Fakir Miskin / Sosial',
        'Pemakaman',
        'Lainnya'
    ];

    // Default dummy if data not ready
    const defaultSeries = [0, 0, 0, 0, 0];
    const series = data && data.length > 0 ? data : defaultSeries;

    const colors = ['#34c38f', '#556ee6', '#f46a6a', '#343a40', '#50a5f1'];

    const options = {
        chart: { type: 'pie' },
        labels: labels,
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
            y: { formatter: (val) => val + " Aset" }
        }
    };

    return (
        <ChartWithDetails
            title="Aset Wakaf Tanah Sesuai Peruntukan"
            options={options}
            series={series}
            labels={labels}
            colors={colors}
            unit="Aset"
            totalValue={`${series.reduce((a, b) => a + b, 0).toLocaleString()} Aset`}
            chartType="pie"
        />
    );
};

const AssetsGrowthChart = ({ years, startYear = 2020, data = [] }) => {
    // If no real data passed, use static (fallback) or empty
    const defaultData = [0, 0, 0, 0, 0, 0];
    // Dynamic Years based on data
    const displayYears = years && years.length > 0 ? years : ['2020', '2021', '2022', '2023', '2024', '2025'];
    const displayData = data && data.length > 0 ? data : defaultData;

    const color = '#34c38f';

    const options = {
        chart: { type: 'bar', toolbar: { show: false } }, // Remove height here, handled by wrapper
        plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: displayYears,
            labels: { show: false } // Hide X labels in chart if they are in the list, or keep them? Let's hide to save space
        },
        yaxis: { show: false }, // Hide Y axis for cleaner look side-by-side
        grid: { show: false },
        colors: [color],
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => val + " Ribu Aset" } }
    };

    return (
        <ChartWithDetails
            title={`Pertumbuhan Aset Wakaf Tanah (${displayYears[0]} - ${displayYears[displayYears.length - 1]})`}
            options={options}
            series={[{ name: 'Aset Tanah', data: displayData }]}
            labels={displayYears} // Show years in the list
            colors={displayYears.map(() => color)} // Same color for all list markers
            chartType="bar"
            unit="Aset"
            totalValue={`${displayData.reduce((a, b) => a + b, 0).toLocaleString()} Aset`}
        />
    );
};


// --- STAT CARDS ---

const StatCard = ({ title, value, icon, color, isLoading }) => (
    <Col xl={4} md={6}>
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
                    {isLoading ? (
                        <span className="spinner-grow spinner-grow-sm text-primary" role="status"></span>
                    ) : (
                        <CountUp end={value} duration={2} separator="." />
                    )}
                </h4>
            </CardBody>
        </Card>
    </Col>
);


// --- MAIN PAGE WAKAF ---

const WakafPage = () => {
    document.title = "Dashboard Wakaf | Zakat Nasional";

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        wakif: 0,
        tanah: 0,
        nazhir: 0
    });

    const [purposeData, setPurposeData] = useState([]);
    const [growthData, setGrowthData] = useState({ years: [], counts: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_WAKAF_TANAH_DATA, {
                    headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" },
                    params: { limit: 20000 } // Fetch ample data
                });

                const items = response.data?.data?.items || [];

                // 1. Process Stats
                const uniqueWakif = new Set();
                const uniqueNazhir = new Set();
                items.forEach(item => {
                    if (item.wakif_nama) uniqueWakif.add(item.wakif_nama);
                    if (item.nazhir_nama) uniqueNazhir.add(item.nazhir_nama);
                });

                setStats({
                    tanah: items.length, // Total Locations based on data fetched
                    wakif: uniqueWakif.size,
                    nazhir: uniqueNazhir.size
                });

                // 2. Process Purpose (Peruntukan)
                // Categories: Ibadah, Pendidikan, Sosial/Fakir, Makam, Lainnya
                let counts = { ibadah: 0, pendidikan: 0, sosial: 0, makam: 0, lainnya: 0 };

                items.forEach(item => {
                    const ket = (item.peruntukan_keterangan || "").toLowerCase();
                    if (ket.includes('masjid') || ket.includes('musholla') || ket.includes('langgar') || ket.includes('ibadah')) {
                        counts.ibadah++;
                    } else if (ket.includes('sekolah') || ket.includes('madrasah') || ket.includes('pesantren') || ket.includes('pendidikan') || ket.includes('tpq')) {
                        counts.pendidikan++;
                    } else if (ket.includes('fakir') || ket.includes('miskin') || ket.includes('yatim') || ket.includes('sosial') || ket.includes('panti')) {
                        counts.sosial++;
                    } else if (ket.includes('makam') || ket.includes('kuburan')) {
                        counts.makam++;
                    } else {
                        counts.lainnya++;
                    }
                });

                setPurposeData([counts.ibadah, counts.pendidikan, counts.sosial, counts.makam, counts.lainnya]);

                // 3. Process Growth (Pertumbuhan Aset per Tahun)
                // Use permohonan_kode first 4 chars OR tanggal_sertifikat year
                let yearCounts = {};
                items.forEach(item => {
                    let year = null;
                    // Try code first (e.g., 2025XXXX)
                    if (item.permohonan_kode && item.permohonan_kode.length >= 4) {
                        const y = parseInt(item.permohonan_kode.substring(0, 4));
                        if (y > 1900 && y <= new Date().getFullYear()) year = y;
                    }
                    // Fallback to date
                    if (!year && item.tanggal_sertifikat) {
                        const d = new Date(item.tanggal_sertifikat);
                        if (!isNaN(d.getFullYear())) year = d.getFullYear();
                    }

                    if (year) {
                        yearCounts[year] = (yearCounts[year] || 0) + 1;
                    }
                });

                // Get last 6 sorted years
                const sortedYears = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
                // Filter realistic years (e.g. > 2000) just in case
                const recentYears = sortedYears.filter(y => y >= 2000).slice(-6); // Last 6 recorded years

                // If years are empty, maybe use mock 2024/2025
                if (recentYears.length > 0) {
                    setGrowthData({
                        years: recentYears.map(String),
                        counts: recentYears.map(y => yearCounts[y])
                    });
                } else if (items.length > 0) {
                    // Fallback if no dates found but data exists, put all in "Tahun Ini"
                    const currentYear = new Date().getFullYear();
                    setGrowthData({ years: [String(currentYear)], counts: [items.length] });
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching wakaf data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { title: "Jumlah Wakif", value: stats.wakif, icon: "bx bx-user", color: "primary" },
        { title: "Lokasi Tanah", value: stats.tanah, icon: "bx bx-map", color: "success" },
        { title: "Nazhir Sertif", value: stats.nazhir, icon: "bx bx-certification", color: "warning" }
    ];

    return (
        <React.Fragment>
            <div className="page-content bg-light bg-opacity-10">
                <div className="custom-container">

                    {/* Header */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4 className="mb-1 font-size-18 fw-bold text-dark">Dashboard Wakaf Nasional</h4>
                                    <p className="text-muted mb-0 font-size-13">Data Real-time Sistem Informasi Wakaf (SIWAK)</p>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-soft-success text-success font-size-12 p-2">
                                        <i className="bx bx-check-circle me-1"></i> Terhubung API
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Section Ringkasan Stats */}
                    <Row className="g-3 mb-4">
                        {statCards.map((stat, idx) => (
                            <StatCard key={idx} {...stat} isLoading={loading} />
                        ))}
                    </Row>

                    {/* Section Charts Row 2: Aset Breakdown (Dynamic) */}
                    <Row className="g-3 mb-4">
                        <Col xl={6}>
                            <AssetsByPurposeChart data={purposeData} />
                        </Col>
                        <Col xl={6}>
                            {growthData.years.length > 0 ? (
                                <AssetsGrowthChart years={growthData.years} data={growthData.counts} />
                            ) : (
                                <AssetsGrowthChart years={['No Data']} data={[0]} />
                            )}
                        </Col>
                    </Row>

                    {/* Section Sebaran Aset Wakaf (Peta Interaktif) */}
                    <WakafDistributionMap />

                </div>
            </div>
        </React.Fragment>
    );
}

export default WakafPage;