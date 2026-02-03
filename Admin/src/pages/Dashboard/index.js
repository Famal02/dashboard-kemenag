import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getDashboardKemenagData } from '../../store/actions';
import { Col, Card, CardBody, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";

// --- IMPORT COMPONENTS ---
import WakafDistributionMap from "../Wakaf/WakafDistributionMap"; // Re-use Map from Wakaf

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(1) + " M";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(1) + " Jt";
    return "Rp " + value.toLocaleString('id-ID');
};

const formatNumber = (value) => value.toLocaleString('id-ID');

// --- CHART COMPONENT WRAPPER (Sama seperti Wakaf Page) ---
const ChartWithDetails = ({ title, options, series, labels, colors, totalValue, unit = "Rp", chartType = "donut" }) => {
    let total = 0;
    let seriesData = [];

    if (chartType === "bar") {
        seriesData = series[0].data;
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
                                let percent = 0;

                                if (chartType === "bar") {
                                    value = seriesData[index];
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
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

// --- SPECIFIC CHART DATA (DUMMY FOR DASHBOARD UTAMA) ---

const ZisDistributionChart = () => {
    const labels = ['Zakat Fitrah', 'Zakat Maal', 'Infaq', 'Sedekah', 'DSKL'];
    const series = [45, 120, 80, 60, 20]; // Data dummy dalam Milyar
    const colors = ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1'];

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
            y: { formatter: (val) => formatCurrency(val * 1000000000) }
        }
    };

    return (
        <ChartWithDetails
            title="Komposisi Penerimaan ZIS"
            options={options}
            series={series}
            labels={labels}
            colors={colors}
            chartType="pie"
            unit="Milyar"
        />
    );
};

const WakafOverviewChart = () => {
    const labels = ['Wakaf Uang', 'Wakaf Melalui Uang', 'Wakaf Tidak Bergerak'];
    const series = [30, 45, 150]; // Data dummy dalam Milyar
    const colors = ['#f1b44c', '#34c38f', '#556ee6'];

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
            y: { formatter: (val) => formatCurrency(val * 1000000000) }
        }
    };

    return (
        <ChartWithDetails
            title="Overview Aset Wakaf"
            options={options}
            series={series}
            labels={labels}
            colors={colors}
            chartType="pie"
            unit="Milyar"
        />
    );
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon, color, unit = "" }) => (
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
                    {unit} <CountUp end={value} duration={2} separator="." />
                </h4>
            </CardBody>
        </Card>
    </Col>
);

const Dashboard = () => {
    document.title = "Dashboard Utama | Kemenag RI";

    const dispatch = useDispatch();

    const { dashboardKemenagData } = useSelector(state => ({
        dashboardKemenagData: state.dashboard.dashboardKemenagData
    }));

    useEffect(() => {
        dispatch(getDashboardKemenagData());
    }, [dispatch]);

    // Data Stats Utama (Bisa ambil dari Redux nanti)
    const stats = [
        { title: "Total Penerimaan ZIS", value: 125000000000, icon: "bx bx-money", color: "success", isCurrency: true },
        { title: "Total Aset Wakaf", value: 450000000000, icon: "bx bx-building", color: "primary", isCurrency: true },
        { title: "Total Rumah Ibadah", value: 740000, icon: "bx bx-home-heart", color: "danger", isCurrency: false },
        { title: "Lembaga Zakat", value: 650, icon: "bx bxs-institution", color: "warning", isCurrency: false },
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
                                    <h4 className="mb-1 font-size-18 fw-bold text-dark">Dashboard Eksekutif Kemenag</h4>
                                    <p className="text-muted mb-0 font-size-13">Ringkasan data Zakat, Wakaf, dan Layanan Keagamaan Nasional</p>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-soft-primary text-primary font-size-12 p-2">
                                        Update: Realtime
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Stats Row */}
                    <Row className="g-3 mb-4">
                        {stats.map((stat, idx) => (
                            <StatCard
                                key={idx}
                                title={stat.title}
                                value={stat.isCurrency ? stat.value / 1000000000 : stat.value} // Value simplified for display
                                unit={stat.isCurrency ? "Rp " : ""}
                                icon={stat.icon}
                                color={stat.color}
                            />
                        ))}
                    </Row>

                    {/* Charts Row */}
                    <Row className="g-3 mb-4">
                        <Col xl={6}>
                            <ZisDistributionChart />
                        </Col>
                        <Col xl={6}>
                            <WakafOverviewChart />
                        </Col>
                    </Row>

                    {/* Map Section */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm rounded-3">
                                <CardBody>
                                    <h5 className="card-title mb-3">Peta Sebaran Potensi Nasional</h5>
                                    <WakafDistributionMap />
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