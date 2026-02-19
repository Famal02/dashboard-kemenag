
import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, Row } from "reactstrap";
import Chart from "react-apexcharts";
import axios from 'axios';
import { GET_PENERIMAAN_PROVINSI, GET_PENYALURAN_PROVINSI } from "../../helpers/url_helper";
import SkeletonLoader from "../../components/Common/SkeletonLoader"; // Import Skeleton

// --- HELPER CHART COMPONENT (DASHBOARD STYLE) ---
const ChartWithDetails = ({ title, options, series, labels, colors, unit = "Rp", isLoading }) => {
    // Hitung total untuk persentase
    const total = series ? series.reduce((a, b) => a + (b || 0), 0) : 0;

    if (isLoading) {
        return <SkeletonLoader type="chart" height={380} />;
    }

    return (
        <Card className="h-100 shadow-sm border-0 kemenag-hover-card">
            <CardBody>
                <h5 className="card-title mb-4 fw-bold">{title}</h5>
                <Row className="align-items-center">
                    <Col xl={5} className="d-flex justify-content-center">
                        <Chart
                            options={{
                                ...options,
                                legend: { show: false }, // Hide default legend
                            }}
                            series={series}
                            type="pie"
                            height={280}
                        />
                    </Col>
                    <Col xl={7}>
                        <div className="mt-4 mt-xl-0">
                            {labels.map((label, index) => {
                                const value = series[index] || 0;
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                const color = colors[index % colors.length];

                                // Format Value
                                let displayValue = "Rp 0";
                                if (value >= 1e12) displayValue = "Rp " + (value / 1e12).toFixed(2).replace('.', ',') + " Triliun";
                                else if (value >= 1e9) displayValue = "Rp " + (value / 1e9).toFixed(2).replace('.', ',') + " Miliar";
                                else displayValue = "Rp " + value.toLocaleString('id-ID');

                                return (
                                    <div className="d-flex align-items-center border-bottom py-2" key={index}>
                                        <div className="flex-grow-1 d-flex align-items-center" style={{ overflow: 'hidden' }}>
                                            <span className="rounded-circle me-2 flex-shrink-0" style={{ width: '10px', height: '10px', backgroundColor: color }}></span>
                                            <span className="text-muted font-size-12 mb-0 text-truncate" title={label}>{label}</span>
                                        </div>
                                        <div className="text-end flex-shrink-0 ms-2">
                                            <h6 className="mb-0 font-size-13">{displayValue}</h6>
                                            <small className="text-muted font-size-11">({percent}%)</small>
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

const RingkasanZisComponent = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [yearData, setYearData] = useState(null);

    const sourceCategories = ["Zakat Maal", "Zakat Fitrah", "Infaq", "Lainnya"];
    const asnafCategories = [
        "Fakir", "Miskin", "Amil", "Muallaf",
        "Riqab", "Gharimin", "Fisabilillah", "Ibnu Sabil"
    ];

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const ts = new Date().getTime();
                const [resRecv, resDist] = await Promise.all([
                    axios.get(`${GET_PENERIMAAN_PROVINSI}?_=${ts}`, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } }),
                    axios.get(`${GET_PENYALURAN_PROVINSI}?_=${ts}`, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } })
                ]);

                const itemsRecv = resRecv.data?.data?.items || resRecv.data?.data || [];
                const itemsDist = resDist.data?.data?.items || resDist.data?.data || [];

                let totalZakatMaal = 0, totalZakatFitrah = 0, totalInfaq = 0, totalLainnya = 0;
                itemsRecv.forEach(item => {
                    totalZakatMaal += (item.total_zakat_perorangan || 0) + (item.total_zakat_badan || 0);
                    totalZakatFitrah += (item.zakat_fitrah || 0);
                    totalInfaq += (item.total_infak_penyaluran || 0);
                });
                const totalTerkumpul = totalZakatMaal + totalZakatFitrah + totalInfaq + totalLainnya;

                const asnafTotals = { fakir: 0, miskin: 0, amil: 0, muallaf: 0, riqab: 0, gharimin: 0, fisabilillah: 0, ibnusabil: 0 };
                itemsDist.forEach(item => {
                    asnafTotals.fakir += (item.total_asnaf_fakir || 0);
                    asnafTotals.miskin += (item.total_asnaf_miskin || 0);
                    asnafTotals.amil += (item.total_asnaf_amil || 0);
                    asnafTotals.muallaf += (item.total_asnaf_muallaf || 0);
                    asnafTotals.riqab += (item.total_asnaf_riqab || 0);
                    asnafTotals.gharimin += (item.total_asnaf_gharimin || 0);
                    asnafTotals.fisabilillah += (item.total_asnaf_fisabilillah || 0);
                    asnafTotals.ibnusabil += (item.total_asnaf_ibnusabil || 0);
                });
                const totalTersalurkan = Object.values(asnafTotals).reduce((a, b) => a + b, 0);

                setYearData({
                    totalTerkumpul,
                    totalTersalurkan,
                    sisaDana: totalTerkumpul - totalTersalurkan,
                    sourceSeries: [totalZakatMaal, totalZakatFitrah, totalInfaq, totalLainnya],
                    distributionSeries: Object.values(asnafTotals)
                });
                setLoading(false);

            } catch (err) {
                console.error("Error fetching ZIS data:", err);
                // Set default data on error so loading stops
                setYearData({
                    totalTerkumpul: 0,
                    totalTersalurkan: 0,
                    sisaDana: 0,
                    sourceSeries: [0, 0, 0, 0],
                    distributionSeries: [0, 0, 0, 0, 0, 0, 0, 0]
                });
                setError("Gagal memuat data. Silakan coba lagi.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (val) => {
        if (!val) return "Rp 0";
        if (val >= 1e12) return "Rp " + (val / 1e12).toFixed(2).replace('.', ',') + " Triliun";
        if (val >= 1e9) return "Rp " + (val / 1e9).toFixed(2).replace('.', ',') + " Miliar";
        return "Rp " + val.toLocaleString('id-ID');
    };

    // --- CHART OPTIONS: PIE CHART ---
    const chartOptions = {
        chart: { type: 'pie', height: 380 },
        legend: { show: true, position: 'right', fontSize: '13px', width: 140 },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + "%",
            style: { fontSize: '11px', fontWeight: 'bold' },
            dropShadow: { enabled: false }
        },
        plotOptions: {
            pie: {
                customScale: 1.0,
                offsetX: 0
            }
        },
        colors: ['#375673', '#d5cd94', '#556ee6', '#f1b44c', '#50a5f1', '#f46a6a', '#34c38f', '#9b59b6'],
        stroke: { show: true, width: 2, colors: ['#fff'] },
        tooltip: { y: { formatter: (val) => "Rp " + val.toLocaleString('id-ID') } }
    };

    const StatCard = ({ title, value, icon, color, isLoading }) => {
        return (
            <Col lg={4} md={6} className="mb-4">
                <Card className="h-100 shadow-lg border-0 kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', borderLeft: '6px solid #d5cd94', borderRadius: '8px' }}>
                    <CardBody className="p-3">
                        <div className="d-flex align-items-center mb-3">
                            <div className={`avatar-xs me-2`}>
                                <span className={`avatar-title rounded-circle bg-transparent text-${color} font-size-18`}>
                                    <i className={icon}></i>
                                </span>
                            </div>
                            <h6 className="font-size-11 mb-0 text-uppercase fw-bold" style={{ color: '#d5cd94', opacity: 0.8, letterSpacing: '0.5px' }}>{title}</h6>
                        </div>
                        <h4 className="mt-0 mb-0 fw-bold" style={{ color: '#d5cd94', fontSize: '22px' }}>
                            {isLoading ? (
                                <SkeletonLoader type="text" width="60%" />
                            ) : (
                                value
                            )}
                        </h4>
                    </CardBody>
                </Card>
            </Col>
        );
    };

    return (
        <React.Fragment>
            <Row className="mb-4">
                <Col><h4 className="fw-bold">Dashboard Nasional ZIS</h4></Col>
            </Row>

            {/* Jika Loading ATAU data belum ada, tampilkan Skeleton / Layout */}
            {loading || !yearData ? (
                <>
                    <Row>
                        <StatCard title="Total Terkumpul" isLoading={true} icon="bx bx-trending-up" color="success" />
                        <StatCard title="Total Tersalurkan" isLoading={true} icon="bx bx-check-shield" color="primary" />
                        <StatCard title="Sisa Dana" isLoading={true} icon="bx bx-wallet" color="warning" />
                    </Row>
                    <Row className="mb-4">
                        <Col lg={6}>
                            <ChartWithDetails title="Sumber Dana" isLoading={true} />
                        </Col>
                        <Col lg={6}>
                            <ChartWithDetails title="Penyaluran Asnaf" isLoading={true} />
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Row>
                        <StatCard title="Total Terkumpul" value={formatCurrency(yearData.totalTerkumpul)} icon="bx bx-trending-up" color="success" />
                        <StatCard title="Total Tersalurkan" value={formatCurrency(yearData.totalTersalurkan)} icon="bx bx-check-shield" color="primary" />
                        <StatCard title="Sisa Dana" value={formatCurrency(yearData.sisaDana)} icon="bx bx-wallet" color="warning" />
                    </Row>

                    <Row className="mb-4">
                        <Col lg={6}>
                            <ChartWithDetails
                                title="Sumber Dana"
                                options={chartOptions}
                                series={yearData.sourceSeries}
                                labels={sourceCategories}
                                colors={chartOptions.colors}
                            />
                        </Col>
                        <Col lg={6}>
                            <ChartWithDetails
                                title="Penyaluran Asnaf"
                                options={chartOptions}
                                series={yearData.distributionSeries}
                                labels={asnafCategories}
                                colors={chartOptions.colors}
                            />
                        </Col>
                    </Row>
                </>
            )}
        </React.Fragment>
    );
};

export default RingkasanZisComponent;
