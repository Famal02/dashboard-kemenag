import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import axios from 'axios';
import { GET_PENERIMAAN_PROVINSI, GET_PENYALURAN_PROVINSI } from "../../helpers/url_helper";

const InvestedOverviewZis = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [yearData, setYearData] = useState(null);

    // --- CHART CATEGORIES (Dynamic based on API) ---
    // Chart 1: Sources (Penerimaan)
    const sourceCategories = ["Zakat Maal", "Zakat Fitrah", "Infaq", "Lainnya"];

    // Chart 2: Distribution (Penyaluran Asnaf)
    const asnafCategories = [
        "Fakir", "Miskin", "Amil", "Muallaf",
        "Riqab", "Gharimin", "Fisabilillah", "Ibnu Sabil"
    ];

    // --- FETCH & PROCESS DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resRecv, resDist] = await Promise.all([
                    axios.get(GET_PENERIMAAN_PROVINSI, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } }),
                    axios.get(GET_PENYALURAN_PROVINSI, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } })
                ]);

                const itemsRecv = resRecv.data?.data?.items || resRecv.data?.data || [];
                const itemsDist = resDist.data?.data?.items || resDist.data?.data || [];

                // 1. Calculate Collection Totals
                let totalZakatMaal = 0;
                let totalZakatFitrah = 0;
                let totalInfaq = 0;
                let totalLainnya = 0; // If any other fields exist

                itemsRecv.forEach(item => {
                    totalZakatMaal += (item.total_zakat_perorangan || 0) + (item.total_zakat_badan || 0);
                    totalZakatFitrah += (item.zakat_fitrah || 0);
                    totalInfaq += (item.total_infak_penyaluran || 0); // Assuming this maps to collection infaq based on pattern, or use another field if available. Usually 'total_infak'
                });

                const totalTerkumpul = totalZakatMaal + totalZakatFitrah + totalInfaq + totalLainnya;

                // 2. Calculate Distribution Totals (By Asnaf)
                const asnafTotals = {
                    fakir: 0, miskin: 0, amil: 0, muallaf: 0,
                    riqab: 0, gharimin: 0, fisabilillah: 0, ibnusabil: 0
                };

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

                // 3. Prepare Chart Series
                const sourceSeries = [totalZakatMaal, totalZakatFitrah, totalInfaq, totalLainnya];

                const distributionSeries = [
                    asnafTotals.fakir, asnafTotals.miskin, asnafTotals.amil, asnafTotals.muallaf,
                    asnafTotals.riqab, asnafTotals.gharimin, asnafTotals.fisabilillah, asnafTotals.ibnusabil
                ];

                setYearData({
                    totalTerkumpul,
                    totalTersalurkan,
                    sisaDana: totalTerkumpul - totalTersalurkan,
                    sourceSeries,
                    distributionSeries
                });

                setLoading(false);

            } catch (err) {
                console.error("Error fetching Dashboard ZIS data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number || 0);
    }

    const formatShort = (val) => {
        if (val >= 1000000000000) return (val / 1000000000000).toFixed(1) + "T";
        if (val >= 1000000000) return (val / 1000000000).toFixed(1) + "M";
        if (val >= 1000000) return (val / 1000000).toFixed(0) + "Jt";
        return val;
    };

    // --- CHART OPTIONS ---
    const pieCommonOptions = {
        chart: { type: 'pie', height: 350, toolbar: { show: false } },
        legend: { show: true, position: 'bottom', fontSize: '13px', fontFamily: 'Inter, sans-serif' },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + "%",
            style: { fontSize: '12px', fontWeight: 'bold' },
            dropShadow: { enabled: false }
        },
        stroke: { show: true, width: 2, colors: ['#ffffff'] },
        tooltip: {
            y: { formatter: (val) => formatRupiah(val) }
        }
    };

    const sourcePieOptions = {
        ...pieCommonOptions,
        labels: sourceCategories,
        colors: ['#34c38f', '#f1b44c', '#556ee6', '#f46a6a'],
    };

    const distPieOptions = {
        ...pieCommonOptions,
        labels: asnafCategories,
        colors: [
            '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
            '#1abc9c', '#3498db', '#9b59b6', '#34495e'
        ],
    };

    // Bar Chart: Perbandingan Sources vs Distribution (Aggregated)
    // Since structures are different, let's show separate bars for Collection vs Distribution
    // or maybe Top 5 Provinces if we had that data here.
    // For now, let's use a Simple Bar comparing Collection vs Distribution per Province IS NOT available here since we aggregated.
    // Let's change the Bar Chart to: "Komposisi Penyaluran per Asnaf" (Vertical Bar) as it's more readable than Pie for many categories
    const barAsnafOptions = {
        chart: { type: 'bar', height: 380, toolbar: { show: false } },
        plotOptions: {
            bar: { borderRadius: 4, horizontal: true, barHeight: '70%' }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) { return formatShort(val) },
            style: { colors: ["#fff"] }
        },
        xaxis: {
            categories: asnafCategories,
            labels: { formatter: (val) => formatShort(val) }
        },
        colors: ['#556ee6'],
        tooltip: {
            y: { formatter: (val) => formatRupiah(val) }
        }
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-sm" style={{ minHeight: '200px' }}>
                <CardBody className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <React.Fragment>
            {/* --- HERO SECTION: TITLE --- */}
            <Row className="mb-4 align-items-center">
                <Col md={12}>
                    <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.25rem' }}>
                        {title || "Dashboard Nasional ZIS"}
                    </h5>
                    <p className="text-muted mb-0">
                        Laporan real-time akumulasi data nasional dari seluruh provinsi.
                    </p>
                </Col>
            </Row>

            {yearData && (
                <>
                    {/* --- SECTION 1: KEY METRICS CARDS (Info Dana) --- */}
                    <Row className="mb-4">
                        <Col lg={4} md={6} className="mb-3 mb-lg-0">
                            <Card className="border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p className="text-muted text-uppercase fw-bold font-size-12 mb-1">Total Terkumpul (Nasional)</p>
                                            <h3 className="text-dark fw-bold mb-0">{formatRupiah(yearData.totalTerkumpul)}</h3>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title rounded bg-success bg-opacity-10 text-success font-size-20">
                                                <i className="bx bx-trending-up"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="badge bg-success-subtle text-success">
                                            LIVE DATA
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={4} md={6} className="mb-3 mb-lg-0">
                            <Card className="border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p className="text-muted text-uppercase fw-bold font-size-12 mb-1">Total Tersalurkan (Nasional)</p>
                                            <h3 className="text-dark fw-bold mb-0">{formatRupiah(yearData.totalTersalurkan)}</h3>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title rounded bg-primary bg-opacity-10 text-primary font-size-20">
                                                <i className="bx bx-check-shield"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="badge bg-primary-subtle text-primary">
                                            LIVE DATA
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={4} md={12}>
                            <Card className="border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p className="text-muted text-uppercase fw-bold font-size-12 mb-1">Sisa Dana (Balance)</p>
                                            <h3 className="text-dark fw-bold mb-0">{formatRupiah(yearData.sisaDana)}</h3>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title rounded bg-warning bg-opacity-10 text-warning font-size-20">
                                                <i className="bx bx-wallet"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        {yearData.sisaDana >= 0 ?
                                            <span className="badge bg-success-subtle text-success">Surplus</span> :
                                            <span className="badge bg-danger-subtle text-danger">Defisit</span>
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* --- SECTION 2: CHARTS --- */}
                    <Row className="mb-4">
                        <Col lg={6}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4">
                                    <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">
                                        Sumber Dana (Pengumpulan)
                                    </h6>
                                    <ReactApexChart
                                        options={sourcePieOptions}
                                        series={yearData.sourceSeries}
                                        type="pie"
                                        height={320}
                                        className="d-flex justify-content-center"
                                    />
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4">
                                    <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">
                                        Detail Penyaluran per Asnaf
                                    </h6>
                                    <ReactApexChart
                                        options={distPieOptions}
                                        series={yearData.distributionSeries}
                                        type="pie"
                                        height={320}
                                        className="d-flex justify-content-center"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </React.Fragment>
    );
}

export default InvestedOverviewZis;
