import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";

const InvestedOverviewZis = ({ title }) => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [yearData, setYearData] = useState(null);

    // Kategori Dana Utama
    const categories = ["Zakat", "Infaq", "DSKL", "Fidyah", "Qurban"];

    // Kategori Breakdown Detail
    const breakdownCategories = [
        "Infaq", "Qurban", "DSKL", "Zakat Maal",
        "Asnaf Fakir", "Asnaf Miskin", "Asnaf Amil",
        "Asnaf Muallaf", "Asnaf Riqab", "Asnaf Gharimin",
        "Asnaf Fisabilillah", "Asnaf Ibnu Sabil", "Zakat Fitrah"
    ];

    // Data Dummy
    const database = {
        "2022": {
            values: [
                [50000000, 45000000], [30000000, 25000000], [20000000, 15000000],
                [10000000, 10000000], [110000000, 110000000]
            ],
            breakdownValues: [15, 25, 10, 20, 5, 5, 2, 2, 2, 2, 5, 2, 5]
        },
        "2023": {
            values: [
                [60000000, 50000000], [35000000, 30000000], [25000000, 20000000],
                [12000000, 11000000], [130000000, 130000000]
            ],
            breakdownValues: [18, 22, 12, 18, 5, 6, 2, 3, 2, 2, 5, 2, 3]
        },
        "2024": {
            values: [
                [75000000, 60000000], [42000000, 35000000], [30000000, 25000000],
                [15000000, 14000000], [150000000, 150000000]
            ],
            breakdownValues: [20, 20, 10, 15, 6, 8, 3, 3, 2, 2, 6, 2, 3]
        },
        "2025": {
            values: [
                [90000000, 70000000], [55000000, 40000000], [40000000, 30000000],
                [18000000, 15000000], [175000000, 175000000]
            ],
            breakdownValues: [22, 18, 8, 12, 8, 10, 4, 3, 2, 2, 6, 2, 3]
        }
    };

    const calculateTotals = (year) => {
        const data = database[year];
        let totalTerkumpul = 0;
        let totalTersalurkan = 0;

        const terkumpulPerCat = [];
        const tersalurkanPerCat = [];

        data.values.forEach(([terkumpul, tersalurkan]) => {
            totalTerkumpul += terkumpul;
            totalTersalurkan += tersalurkan;
            terkumpulPerCat.push(terkumpul);
            tersalurkanPerCat.push(tersalurkan);
        });

        return {
            totalTerkumpul,
            totalTersalurkan,
            sisaDana: totalTerkumpul - totalTersalurkan,
            terkumpulPerCat,
            tersalurkanPerCat,
            breakdownValues: data.breakdownValues
        };
    };

    useEffect(() => {
        if (database[selectedYear]) {
            setYearData(calculateTotals(selectedYear));
        }
    }, [selectedYear]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number || 0);
    }

    // --- CHART OPTIONS ---

    const pieCommonOptions = {
        chart: { type: 'pie', height: 350, toolbar: { show: false } },
        legend: { show: true, position: 'bottom', fontSize: '13px', fontFamily: 'Inter, sans-serif' },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(0) + "%",
            style: { fontSize: '12px', fontWeight: 'bold' },
            dropShadow: { enabled: false }
        },
        stroke: { show: true, width: 2, colors: ['#ffffff'] }, // Outline putih biar bersih
        tooltip: {
            y: { formatter: (val) => typeof val === 'number' ? val + "%" : val } // Fallback simple
        }
    };

    const mainPieOptions = {
        ...pieCommonOptions,
        labels: categories,
        colors: ['#34c38f', '#556ee6', '#f46a6a', '#f1b44c', '#50a5f1'],
        tooltip: { y: { formatter: (val) => formatRupiah(val) } } // Tooltip rupiah untuk pie utama
    };

    const breakdownPieOptions = {
        ...pieCommonOptions,
        labels: breakdownCategories,
        colors: [
            '#34c38f', '#556ee6', '#f46a6a', '#50a5f1', '#f1b44c',
            '#74788d', '#343a40', '#e83e8c', '#6f42c1', '#20c997',
            '#ffc107', '#fd7e14', '#0dcaf0'
        ],
        tooltip: { y: { formatter: (val) => val + "% Share" } }
    };

    const barOptions = {
        chart: {
            type: 'bar',
            height: 380,
            toolbar: { show: false },
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4, // Modern rounded bars
                dataLabels: {
                    position: 'top', // Labels on top
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                if (val >= 1000000000) return (val / 1000000000).toFixed(1) + "M";
                if (val >= 1000000) return (val / 1000000).toFixed(0) + "Jt";
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '11px',
                colors: ["#304758"]
            }
        },
        stroke: { show: true, width: 3, colors: ['transparent'] },
        xaxis: {
            categories: categories,
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            title: { text: 'Nominal (Rupiah)', style: { fontWeight: 500 } },
            labels: { formatter: (val) => val / 1000000 + " Jt" }
        },
        fill: { opacity: 1 },
        colors: ['#34c38f', '#f46a6a'], // Konsisten Hijau & Merah
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 4
        },
        legend: { position: 'top', horizontalAlign: 'right' },
        tooltip: {
            y: { formatter: (val) => formatRupiah(val) }
        }
    };

    return (
        <React.Fragment>
            {/* --- HERO SECTION: TITLE & FILTER --- */}
            <Row className="mb-4 align-items-center">
                <Col md={8}>
                    <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.25rem' }}>
                        {title || "Penyaluran Zakat & Dana Lainnya"}
                    </h5>
                    <p className="text-muted mb-0">
                        Laporan kinerja keuangan & distribusi ZISAS (Zakat, Infaq, Sedekah, & Amal Sosial)
                    </p>
                </Col>
                <Col md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
                    <div className="d-flex align-items-center bg-white shadow-sm rounded-pill px-3 py-2 border">
                        <span className="text-muted font-size-13 me-2 fw-medium">Periode:</span>
                        <select
                            className="form-select form-select-sm border-0 bg-transparent shadow-none py-0 fw-bold text-primary"
                            style={{ width: 'auto', cursor: 'pointer' }}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {Object.keys(database).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
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
                                            <p className="text-muted text-uppercase fw-bold font-size-12 mb-1">Total Terkumpul</p>
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
                                            <i className="mdi mdi-arrow-up me-1"></i> +12%
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
                                            <p className="text-muted text-uppercase fw-bold font-size-12 mb-1">Total Tersalurkan</p>
                                            <h3 className="text-dark fw-bold mb-0">{formatRupiah(yearData.totalTersalurkan)}</h3>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title rounded bg-primary bg-opacity-10 text-primary font-size-20">
                                                <i className="bx bx-check-shield"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="badge bg-success-subtle text-success">
                                            <i className="mdi mdi-arrow-up me-1"></i> Optimal
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
                                        <span className="badge bg-warning-subtle text-warning">
                                            Dana Cadangan
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* --- SECTION 2: PIE CHARTS (Side-by-Side Rapi) --- */}
                    <Row className="mb-4">
                        <Col lg={6}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4">
                                    <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">
                                        Komposisi Dana Utama
                                    </h6>
                                    <ReactApexChart
                                        options={mainPieOptions}
                                        series={yearData.terkumpulPerCat}
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
                                        Breakdown Penerima Manfaat (Asnaf)
                                    </h6>
                                    <ReactApexChart
                                        options={breakdownPieOptions}
                                        series={yearData.breakdownValues}
                                        type="pie"
                                        height={320}
                                        className="d-flex justify-content-center"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* --- SECTION 3: FULL WIDTH BAR CHART --- */}
                    <Row>
                        <Col xs={12}>
                            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                                <CardBody className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <h6 className="fw-bold text-dark mb-0">
                                            Perbandingan Perolehan vs Penyaluran per Kategori
                                        </h6>
                                        <div className="text-muted font-size-12">
                                            <i className="bx bx-info-circle me-1"></i> Data dalam Rupiah
                                        </div>
                                    </div>
                                    <ReactApexChart
                                        options={barOptions}
                                        series={[
                                            { name: 'Terkumpul', data: yearData.terkumpulPerCat },
                                            { name: 'Tersalurkan', data: yearData.tersalurkanPerCat }
                                        ]}
                                        type="bar"
                                        height={400}
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
