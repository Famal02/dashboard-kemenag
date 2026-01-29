import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts"; // Import ReactApexChart langsung

const InvestedOverview = () => {
    // State untuk filter bulan (contoh fungsionalitas UI saja)
    const [selectedMonth, setSelectedMonth] = useState("AP");

    // Data Dummy Zakat
    const zakatData = {
        totalTerkumpul: 150000000, // Rp 150 Juta
        totalTersalurkan: 120000000, // Rp 120 Juta
        sisaDana: 30000000, // Rp 30 Juta
    };

    // Helper currency format IDR
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    }

    // --- KONFIGURASI PIE CHART ---
    const options = {
        chart: {
            type: 'pie',
            height: 400, // Tinggi chart disesuaikan
        },
        labels: ['Tersalurkan', 'Sisa Dana'], // Label untuk legenda dan tooltip
        colors: ['#34c38f', '#f46a6a'], // Warna: Hijau (Tersalurkan), Merah (Sisa)
        legend: {
            show: true,
            position: 'bottom',
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(1) + "%"; // Menampilkan persentase di dalam slice pie
            },
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return formatRupiah(value); // Tooltip menampilkan nilai Rupiah
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    // Series untuk Pie Chart (Menggunakan nilai asli agar tooltip benar)
    const series = [zakatData.totalTersalurkan, zakatData.sisaDana];

    const onChangeMonth = (value) => {
        setSelectedMonth(value);
        console.log("Bulan dipilih:", value);
    };

    return (
        <React.Fragment>
            <Col xl={12}>
                <Card className="card-h-100">
                    <CardBody>
                        <div className="d-flex flex-wrap align-items-center mb-3">
                            <h5 className="card-title me-2">Penyaluran Zakat</h5>
                            <div className="ms-auto">
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedMonth}
                                    onChange={(e) => onChangeMonth(e.target.value)}
                                >
                                    <option value="AP">April</option>
                                    <option value="MA">Maret</option>
                                    <option value="FE">Februari</option>
                                    <option value="JA">Januari</option>
                                    <option value="DE">Desember</option>
                                </select>
                            </div>
                        </div>

                        <Row className="align-items-center">
                            <div className="col-xl-5 col-sm-6">
                                <div id="invested-overview" className="apex-charts">
                                    {/* RENDER PIE CHART DI SINI */}
                                    <ReactApexChart
                                        options={options}
                                        series={series}
                                        type="pie"
                                        height={280}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-7 col-sm-6 align-self-center">
                                <div className="mt-4 mt-sm-0">
                                    <div className="p-3 bg-light bg-opacity-10 rounded">
                                        <p className="mb-2 text-muted text-uppercase font-size-11">Total Dana Terkumpul</p>
                                        <h4>{formatRupiah(zakatData.totalTerkumpul)}</h4>
                                        <p className="text-muted mb-0">
                                            + Rp 12.000.000 ( 10% ) <i className="mdi mdi-arrow-up ms-1 text-success"></i>
                                            <span className="font-size-11 ms-2">Bulan ini</span>
                                        </p>
                                    </div>

                                    <Row className="g-0 mt-3 align-items-center">
                                        <Col xs={6}>
                                            <div className="p-3">
                                                <p className="mb-2 text-muted text-uppercase font-size-11">Total Tersalurkan</p>
                                                <h5 className="fw-medium mb-0">{formatRupiah(zakatData.totalTersalurkan)}</h5>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="p-3 border-start">
                                                <p className="mb-2 text-muted text-uppercase font-size-11">Sisa Dana</p>
                                                <h5 className="fw-medium mb-0">{formatRupiah(zakatData.sisaDana)}</h5>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="mt-3">
                                        <Link to="/Informasi-ZIS" className="btn btn-primary btn-sm w-md">
                                            Lihat Detail <i className="mdi mdi-arrow-right ms-1"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            </Col>

            
        </React.Fragment>
    );
}

export default InvestedOverview;