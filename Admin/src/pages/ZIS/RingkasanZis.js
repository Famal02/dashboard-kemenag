
import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, Row } from "reactstrap";
import Chart from "react-apexcharts";
import axios from 'axios';
import { GET_PENERIMAAN_PROVINSI, GET_PENYALURAN_PROVINSI } from "../../helpers/url_helper";

const RingkasanZisComponent = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [yearData, setYearData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const sourceCategories = ["Zakat Maal", "Zakat Fitrah", "Infaq", "Lainnya"];
    const asnafCategories = [
        "Fakir", "Miskin", "Amil", "Muallaf",
        "Riqab", "Gharimin", "Fisabilillah", "Ibnu Sabil"
    ];

    useEffect(() => {
        setRefreshKey(prev => prev + 1);
        const fetchData = async () => {
            try {
                setLoading(true);
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

            } catch (err) { console.error(err); setLoading(false); }
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
        chart: { type: 'pie', height: 380 }, // TIPE PIE
        legend: { show: true, position: 'right', fontSize: '13px', width: 140 },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + "%",
            style: { fontSize: '11px', fontWeight: 'bold' },
            dropShadow: { enabled: false }
        },
        // Hapus konfigurasi Donut
        plotOptions: {
            pie: {
                customScale: 1.0,
                offsetX: 0
            }
        },
        colors: ['#34c38f', '#f1b44c', '#556ee6', '#f46a6a', '#e74c3c', '#e67e22', '#1abc9c', '#9b59b6'],
        stroke: { show: true, width: 2, colors: ['#fff'] },
        tooltip: { y: { formatter: (val) => "Rp " + val.toLocaleString('id-ID') } }
    };

    if (loading) return <div>Loading...</div>;

    const StatCard = ({ title, value, icon, color }) => (
        <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderBottom: `4px solid ${color === 'success' ? '#34c38f' : color === 'primary' ? '#556ee6' : '#f1b44c'}` }}>
                <CardBody className="p-4">
                    <div className="d-flex justify-content-between">
                        <div>
                            <p className="text-muted text-uppercase fw-bold font-size-12">{title}</p>
                            <h4 className="fw-bold mb-0">{value}</h4>
                        </div>
                        <div className={`avatar-sm`}>
                            <span className={`avatar-title rounded bg-${color} bg-opacity-10 text-${color} font-size-24`}>
                                <i className={icon}></i>
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );

    return (
        <React.Fragment>
            <Row className="mb-4">
                <Col><h4 className="fw-bold">Dashboard Nasional ZIS</h4></Col>
            </Row>

            {yearData && (
                <>
                    <Row>
                        <StatCard title="Total Terkumpul" value={formatCurrency(yearData.totalTerkumpul)} icon="bx bx-trending-up" color="success" />
                        <StatCard title="Total Tersalurkan" value={formatCurrency(yearData.totalTersalurkan)} icon="bx bx-check-shield" color="primary" />
                        <StatCard title="Sisa Dana" value={formatCurrency(yearData.sisaDana)} icon="bx bx-wallet" color="warning" />
                    </Row>

                    <Row className="mb-4">
                        <Col lg={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <CardBody>
                                    <h6 className="mb-4 fw-bold">Sumber Dana (Pie Chart)</h6>
                                    <div style={{ minHeight: 380 }}>
                                        <Chart
                                            options={{ ...chartOptions, labels: sourceCategories }}
                                            series={yearData.sourceSeries}
                                            type="pie" // Tipe Pie
                                            height={380}
                                            key={`chart-recv-pie-${refreshKey}`}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <CardBody>
                                    <h6 className="mb-4 fw-bold">Penyaluran Asnaf (Pie Chart)</h6>
                                    <div style={{ minHeight: 380 }}>
                                        <Chart
                                            options={{ ...chartOptions, labels: asnafCategories }}
                                            series={yearData.distributionSeries}
                                            type="pie" // Tipe Pie
                                            height={380}
                                            key={`chart-dist-pie-${refreshKey}`}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </React.Fragment>
    );
};

export default RingkasanZisComponent;
