import React from 'react';
import { Col, Card, CardBody, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import WakafDistributionMap from "./WakafDistributionMap";

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

const AssetsByPurposeChart = () => {
    const labels = [
        'Sarana & Kegiatan Ibadah',
        'Sarana & Kegiatan Pendidikan serta Kesehatan',
        'Bantuan Fakir Miskin / Anak Terlantar / Yatim Piatu / Beasiswa',
        'Kemajuan & Peningkatan Ekonomi Umat',
        'Kemajuan & Kesejahteraan Umum Lainnya'
    ];
    const series = [450, 380, 220, 180, 120];
    const colors = ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1'];

    const options = {
        chart: { type: 'donut' },
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
        plotOptions: { donut: { size: '70%' } },
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
            totalValue="1.350 Aset"
        />
    );
};

const MoneyWaqfPermanentChart = () => {
    const labels = [
        'Wakaf Bergerak Selain Uang',
        'Wakaf Melalui Uang',
        'Wakaf Tidak Bergerak',
        'Wakaf Uang',
        'Wakaf Uang Temporer Jangka Pendek'
    ];
    const series = [15000000000, 12000000000, 18000000000, 10000000000, 2000000000];
    const colors = ['#556ee6', '#34c38f', '#f46a6a', '#f1b44c', '#50a5f1'];

    const options = {
        chart: { type: 'donut' },
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
        plotOptions: { donut: { size: '65%' } },
        stroke: { show: true, width: 0 },
        tooltip: {
            y: { formatter: (val) => formatCurrency(val) }
        }
    };

    return (
        <ChartWithDetails
            title="Penerimaan Wakaf Uang (Permanen)"
            options={options}
            series={series}
            labels={labels}
            colors={colors}
        />
    );
};

const MoneyWaqfTemporaryChart = () => {
    const labels = [
        'Wakaf Bergerak Selain Uang',
        'Wakaf Melalui Uang',
        'Wakaf Temporer Jangka Panjang',
        'Wakaf Tidak Bergerak',
        'Wakaf Uang',
        'Wakaf Uang Temporer Jangka Panjang',
        'Wakaf Uang Temporer Jangka Pendek'
    ];
    const series = [2000000000, 3000000000, 2500000000, 1500000000, 3500000000, 2000000000, 2000000000];
    const colors = ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1', '#343a40', '#999999'];

    const options = {
        chart: { type: 'donut' },
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
        plotOptions: { donut: { size: '65%' } },
        stroke: { show: true, width: 0 },
        tooltip: {
            y: { formatter: (val) => formatCurrency(val) }
        }
    };

    return (
        <ChartWithDetails
            title="Penerimaan Wakaf Uang (Temporer)"
            options={options}
            series={series}
            labels={labels}
            colors={colors}
        />
    );
};

const AssetsGrowthChart = () => {
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    const data = [400, 420, 435, 442, 448, 455];
    const color = '#34c38f';

    const options = {
        chart: { type: 'bar', toolbar: { show: false } }, // Remove height here, handled by wrapper
        plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: years,
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
            title="Pertumbuhan Aset Wakaf Tanah"
            options={options}
            series={[{ name: 'Aset Tanah', data: data }]}
            labels={years} // Show years in the list
            colors={years.map(() => color)} // Same color for all list markers
            chartType="bar"
            unit="Ribuan"
        />
    );
};


// --- STAT CARDS ---

const StatCard = ({ title, value, icon, color }) => (
    <Col xl={2} md={4} sm={6}>
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
                    <CountUp end={value} duration={2} separator="." />
                </h4>
            </CardBody>
        </Card>
    </Col>
);


// --- MAIN PAGE WAKAF ---

const WakafPage = () => {
    document.title = "Dashboard Wakaf | Zakat Nasional";

    const stats = [
        { title: "Jumlah Wakif", value: 3845, icon: "bx bx-user", color: "primary" },
        { title: "Lokasi Tanah", value: 442000, icon: "bx bx-map", color: "success" },
        { title: "Nazhir Sertif", value: 1250, icon: "bx bx-certification", color: "warning" },
        { title: "Nazhir Uang", value: 340, icon: "bx bx-money", color: "info" },
        { title: "LKS-PWU", value: 28, icon: "bx bxs-bank", color: "danger" },
        { title: "Bank Syariah", value: 15, icon: "bx bxs-building-house", color: "dark" },
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
                                    <p className="text-muted mb-0 font-size-13">Data terbaru dan perkembangan wakaf di Indonesia</p>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-soft-primary text-primary font-size-12 p-2">
                                        Update: Januari 2026
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Section Ringkasan Stats */}
                    <Row className="g-3 mb-4">
                        {stats.map((stat, idx) => (
                            <StatCard key={idx} {...stat} />
                        ))}
                    </Row>

                    {/* Section Laporan Penerimaan Wakaf Uang (Highlight) */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm rounded-3 bg-white">
                                <CardBody className="p-4">
                                    <Row className="align-items-center">
                                        <Col md={8}>
                                            <h5 className="card-title mb-1 font-size-16">Laporan Penerimaan Wakaf Uang</h5>
                                            <p className="text-muted mb-0">Total akumulasi penerimaan wakaf uang nasional (Permanen + Temporer)</p>
                                        </Col>
                                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                                            <h2 className="mb-0 fw-bold text-primary">Rp 73.5 Milyar</h2>
                                            <span className="badge badge-soft-success font-size-12 mt-1">
                                                <i className="mdi mdi-arrow-up me-1"></i> +12.5% YoY
                                            </span>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Section Charts Row 1: Wakaf Uang Breakdown */}
                    <Row className="g-3 mb-4">
                        <Col xl={6}>
                            <MoneyWaqfPermanentChart />
                        </Col>
                        <Col xl={6}>
                            <MoneyWaqfTemporaryChart />
                        </Col>
                    </Row>

                    {/* Section Charts Row 2: Aset Breakdown */}
                    <Row className="g-3 mb-4">
                        <Col xl={6}>
                            <AssetsByPurposeChart />
                        </Col>
                        <Col xl={6}>
                            <AssetsGrowthChart />
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