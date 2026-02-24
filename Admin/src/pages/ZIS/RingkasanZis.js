
import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, Row } from "reactstrap";
import Chart from "react-apexcharts";
import axios from 'axios';
import { GET_ZAKAT_PENERIMAAN_BS, GET_ZAKAT_PENYALURAN_TAHUN, GET_ZAKAT_PENYALURAN_BIDANG, GET_ZAKAT_PENERIMAAN_PROVINSI } from "../../helpers/url_helper";
import SkeletonLoader from "../../components/Common/SkeletonLoader"; // Import Skeleton


// --- HELPER CHART COMPONENT (DASHBOARD STYLE) ---
const ChartWithDetails = ({ title, options, series, labels, colors, isLoading }) => {
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
                                labels: labels || [],
                                legend: { show: false },
                            }}
                            series={series}
                            type="pie"
                            height={280}
                        />
                    </Col>
                    <Col xl={7}>
                        <div className={`mt-4 mt-xl-0${(labels || []).length > 6 ? ' chart-legend-scroll' : ''}`} style={(labels || []).length > 6 ? { maxHeight: '320px', overflowY: 'auto' } : {}}>
                            {(labels || []).map((label, index) => {
                                const value = series[index] || 0;
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                const color = colors[index % colors.length];

                                // Format Value
                                let displayValue = "Rp 0";
                                if (value >= 1e12) displayValue = "Rp " + (value / 1e12).toFixed(2).replace('.', ',') + " T";
                                else if (value >= 1e9) displayValue = "Rp " + (value / 1e9).toFixed(2).replace('.', ',') + " M";
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

// --- HELPER COMPONENT FOR BAR TRENDS ---
const TrendChartWithDetails = ({ title, seriesName, seriesData, labels, color, isLoading }) => {
    if (isLoading) {
        return (
            <Card className="h-100 shadow-sm border-0 kemenag-hover-card">
                <CardBody><SkeletonLoader type="chart" height={320} /></CardBody>
            </Card>
        );
    }

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '35%' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: labels, labels: { style: { colors: '#74788d', fontWeight: 600 } } },
        yaxis: {
            labels: {
                formatter: (val) => {
                    if (val >= 1e12) return (val / 1e12).toFixed(1) + " T";
                    if (val >= 1e9) return (val / 1e9).toFixed(1) + " M";
                    if (val >= 1e6) return (val / 1e6).toFixed(1) + " Jt";
                    return val.toFixed(0);
                },
                style: { colors: '#74788d', fontSize: '10px' }
            }
        },
        grid: { borderColor: '#f1f1f1', strokeDashArray: 4 },
        fill: { opacity: 1 },
        colors: [color],
        tooltip: { y: { formatter: (val) => "Rp " + val.toLocaleString('id-ID') } }
    };

    return (
        <Card className="h-100 shadow-sm border-0 kemenag-hover-card" style={title.includes('Penerimaan') ? { border: '1px solid #e1d882' } : {}}>
            <CardBody>
                <h5 className="card-title fw-bold mb-5" style={{ color: '#375673' }}>{title}</h5>
                <Row className="align-items-center">
                    <Col xl={6} className="pe-xl-0">
                        <Chart
                            options={options}
                            series={[{ name: seriesName, data: seriesData }]}
                            type="bar"
                            height={260}
                        />
                    </Col>
                    <Col xl={6}>
                        <div className="ps-xl-3 border-start">
                            {(labels || []).map((label, index) => {
                                const value = seriesData[index] || 0;
                                let displayValue = "Rp 0";
                                if (value >= 1e12) displayValue = "Rp " + (value / 1e12).toFixed(2).replace('.', ',') + " T";
                                else if (value >= 1e9) displayValue = "Rp " + (value / 1e9).toFixed(2).replace('.', ',') + " M";
                                else if (value >= 1e6) displayValue = "Rp " + (value / 1e6).toFixed(2).replace('.', ',') + " Jt";
                                else displayValue = "Rp " + value.toLocaleString('id-ID');

                                return (
                                    <div className="d-flex align-items-center py-2 border-bottom" key={index}>
                                        <div className="flex-grow-1 d-flex align-items-center">
                                            <span className="rounded-circle me-3 flex-shrink-0" style={{ width: '8px', height: '8px', backgroundColor: color }}></span>
                                            <span className="text-muted font-size-13 fw-bold mb-0">{label}</span>
                                        </div>
                                        <div className="text-end flex-shrink-0 ms-2">
                                            <h6 className="mb-0 font-size-13 fw-bold" style={{ color: '#333' }}>{displayValue}</h6>
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

    const sourceCategories = ["Zakat Maal Perorangan", "Zakat Maal Badan", "Zakat Fitrah", "Infak Penyaluran", "Infak Terikat", "Infak Tidak Terikat", "Infak Operasional", "CSR", "DSKL", "Fidyah", "Kurban"];

    const [selectedYear, setSelectedYear] = useState("");
    const [availableYears, setAvailableYears] = useState([]);

    const [trendData, setTrendData] = useState({
        penerimaan: [],
        penyaluran: [],
        labels: [],
        loading: true
    });

    const [error, setError] = useState(null);

    // --- FETCH TRENDS ONLY ONCE (dengan cache) ---
    useEffect(() => {
        const CACHE_KEY = 'zis_trends_cache';
        const CACHE_TTL = 30 * 60 * 1000; // 30 menit

        const processTrends = (itemsRecv, itemsDist) => {
            const calcC = (item) => {
                if (!item) return 0;
                return (item.total_zakat_perorangan || 0) + (item.total_zakat_badan || 0) + (item.zakat_fitrah || 0) + (item.total_infak_penyaluran || 0) + (item.total_kurban || 0) + (item.total_csr || 0) + (item.total_dskl || 0) + (item.total_ist || 0);
            };
            const calcD = (item) => {
                if (!item) return 0;
                return (item.total_asnaf_fakir || 0) + (item.total_asnaf_miskin || 0) + (item.total_asnaf_amil || 0) + (item.total_asnaf_muallaf || 0) + (item.total_asnaf_riqab || 0) + (item.total_asnaf_gharimin || 0) + (item.total_asnaf_fisabilillah || 0) + (item.total_asnaf_ibnusabil || 0) + (item.total_infak_penyaluran || 0) + (item.total_kurban || 0);
            };

            const dynamicYears = [...new Set([
                ...itemsRecv.map(i => parseInt(i.tahun, 10)),
                ...itemsDist.map(i => parseInt(i.tahun, 10))
            ])].filter(y => !isNaN(y)).sort((a, b) => a - b);

            const p = dynamicYears.map(y => { const match = itemsRecv.find(i => parseInt(i.tahun, 10) === y); return calcC(match); });
            const s = dynamicYears.map(y => { const match = itemsDist.find(i => parseInt(i.tahun, 10) === y); return calcD(match); });
            const labelsStr = dynamicYears.map(y => y.toString());

            setTrendData({ penerimaan: p, penyaluran: s, labels: labelsStr, loading: false });
            setAvailableYears([...dynamicYears].sort((a, b) => b - a).map(y => y.toString()));
        };

        const fetchTrends = async () => {
            // Cek cache
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { recv, dist, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_TTL && recv && dist) {
                        processTrends(recv, dist);
                        return;
                    }
                }
            } catch (e) { /* fetch fresh */ }

            try {
                const ts = new Date().getTime();
                const headers = { "x-api-key": "prod-2cf350c4-cc0f-494a-af78-5685349627a7" };

                const [resRecv, resDist] = await Promise.all([
                    axios.get(`${GET_ZAKAT_PENERIMAAN_BS}?limit=100&_=${ts}`, { headers }),
                    axios.get(`${GET_ZAKAT_PENYALURAN_TAHUN}?limit=100&_=${ts}`, { headers })
                ]);

                const itemsRecv = resRecv.data?.data?.items || resRecv.data?.data || [];
                const itemsDist = resDist.data?.data?.items || resDist.data?.data || [];

                // Simpan ke cache
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ recv: itemsRecv, dist: itemsDist, timestamp: Date.now() })); } catch (e) { }

                processTrends(itemsRecv, itemsDist);
            } catch (err) {
                console.error("Failed loading trends", err);
                setTrendData(prev => ({ ...prev, loading: false }));
            }
        };
        fetchTrends();
    }, []);

    // --- FETCH MAIN STATS (AFFECTED BY YEAR FILTER, dengan cache) ---
    useEffect(() => {
        const CACHE_KEY = 'zis_stats_cache';
        const CACHE_TTL = 30 * 60 * 1000; // 30 menit

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let rawRecv, rawDist, rawProv, rawBidang;

                // Cek cache dulu
                try {
                    const cached = sessionStorage.getItem(CACHE_KEY);
                    if (cached) {
                        const { data, timestamp } = JSON.parse(cached);
                        if (Date.now() - timestamp < CACHE_TTL && data) {
                            rawRecv = data.recv;
                            rawDist = data.dist;
                            rawProv = data.prov;
                            rawBidang = data.bidang;
                        }
                    }
                } catch (e) { /* fetch fresh */ }

                // Fetch dari API jika tidak ada cache
                if (!rawRecv) {
                    const ts = new Date().getTime();
                    const headers = { "x-api-key": "prod-2cf350c4-cc0f-494a-af78-5685349627a7" };

                    const [resRecv, resDist, resProv, resBidang] = await Promise.all([
                        axios.get(`${GET_ZAKAT_PENERIMAAN_BS}?limit=100&_=${ts}`, { headers }),
                        axios.get(`${GET_ZAKAT_PENYALURAN_TAHUN}?limit=100&_=${ts}`, { headers }),
                        axios.get(`${GET_ZAKAT_PENERIMAAN_PROVINSI}?limit=100&_=${ts}`, { headers }),
                        axios.get(`${GET_ZAKAT_PENYALURAN_BIDANG}?limit=100&_=${ts}`, { headers })
                    ]);

                    rawRecv = resRecv.data?.data?.items || resRecv.data?.data || [];
                    rawDist = resDist.data?.data?.items || resDist.data?.data || [];
                    rawProv = resProv.data?.data?.items || resProv.data?.data || [];
                    rawBidang = resBidang.data?.data?.items || resBidang.data?.data || [];

                    // Simpan ke cache
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: { recv: rawRecv, dist: rawDist, prov: rawProv, bidang: rawBidang }, timestamp: Date.now() })); } catch (e) { }
                }

                // Filter lokal berdasarkan tahun
                let itemsRecv = [...rawRecv];
                let itemsDist = [...rawDist];
                let itemsProv = [...rawProv];
                let itemsBidang = [...rawBidang];

                if (selectedYear) {
                    const sy = parseInt(selectedYear, 10);
                    itemsRecv = itemsRecv.filter(item => parseInt(item.tahun, 10) === sy);
                    itemsDist = itemsDist.filter(item => parseInt(item.tahun, 10) === sy);
                    itemsBidang = itemsBidang.filter(item => parseInt(item.tahun, 10) === sy);
                }

                const sourceTotals = {
                    zmPerorangan: 0,
                    zmBadan: 0,
                    zakatFitrah: 0,
                    infakPenyaluran: 0,
                    infakTerikat: 0,
                    infakTidakTerikat: 0,
                    infakOperasional: 0,
                    csr: 0,
                    dskl: 0,
                    fidyah: 0,
                    kurban: 0
                };
                itemsRecv.forEach(item => {
                    sourceTotals.zmPerorangan += (item.total_zm_perorangan || 0) + (item.total_zakat_perorangan || 0);
                    sourceTotals.zmBadan += (item.total_zm_badan || 0) + (item.total_zakat_badan || 0);
                    sourceTotals.zakatFitrah += (item.total_fitrah || item.zakat_fitrah || 0);
                    sourceTotals.infakPenyaluran += (item.total_infak_penyaluran || 0);
                    sourceTotals.infakTerikat += (item.total_ist || 0);
                    sourceTotals.infakTidakTerikat += (item.total_istt || 0);
                    sourceTotals.infakOperasional += (item.total_is_ops || 0);
                    sourceTotals.csr += (item.total_csr || 0);
                    sourceTotals.dskl += (item.total_dskl || 0);
                    sourceTotals.fidyah += (item.total_fidyah || 0);
                    sourceTotals.kurban += (item.total_kurban || 0);
                });
                const totalTerkumpul = Object.values(sourceTotals).reduce((a, b) => a + b, 0);

                const bidangTotals = { pendidikan: 0, kesehatan: 0, ekonomi: 0, dakwah: 0, kemanusiaan: 0 };
                itemsBidang.forEach(item => {
                    bidangTotals.pendidikan += (item.total_bidang_pendidikan || 0);
                    bidangTotals.kesehatan += (item.total_bidang_kesehatan || 0);
                    bidangTotals.ekonomi += (item.total_bidang_ekonomi || 0);
                    bidangTotals.dakwah += (item.total_bidang_dakwah || 0);
                    bidangTotals.kemanusiaan += (item.total_bidang_kemanusiaan || 0);
                });

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

                // Add non-asnaf distributions directly to total
                let addDist = 0;
                itemsDist.forEach(item => addDist += (item.total_infak_penyaluran || 0) + (item.total_ist || 0) + (item.total_kurban || 0));

                const totalTersalurkan = Object.values(asnafTotals).reduce((a, b) => a + b, 0) + addDist;

                const uniqueProvincesCode = new Set();
                itemsProv.forEach(p => uniqueProvincesCode.add(p.provinsi || p.nama_provinsi));
                const totalProvinsiCount = uniqueProvincesCode.size;

                const sortedBidang = [
                    { label: "Pendidikan", value: bidangTotals.pendidikan },
                    { label: "Kesehatan", value: bidangTotals.kesehatan },
                    { label: "Ekonomi", value: bidangTotals.ekonomi },
                    { label: "Dakwah", value: bidangTotals.dakwah },
                    { label: "Kemanusiaan", value: bidangTotals.kemanusiaan }
                ].sort((a, b) => b.value - a.value);

                const sortedAsnaf = [
                    { label: "Fakir", value: asnafTotals.fakir },
                    { label: "Miskin", value: asnafTotals.miskin },
                    { label: "Amil", value: asnafTotals.amil },
                    { label: "Muallaf", value: asnafTotals.muallaf },
                    { label: "Riqab", value: asnafTotals.riqab },
                    { label: "Gharimin", value: asnafTotals.gharimin },
                    { label: "Fisabilillah", value: asnafTotals.fisabilillah },
                    { label: "Ibnu Sabil", value: asnafTotals.ibnusabil }
                ].filter(a => a.value > 0).sort((a, b) => b.value - a.value);

                // --- Rincian Penerimaan (dari penerimaan-on-bs) ---
                const aggRecv = {};
                itemsRecv.forEach(item => {
                    Object.keys(item).forEach(k => {
                        if (typeof item[k] === 'number' && k !== 'tahun') aggRecv[k] = (aggRecv[k] || 0) + item[k];
                    });
                });
                const rincianPenerimaanCfg = [
                    { key: "total_zm_perorangan", label: "Zakat Mal (Perorangan)" },
                    { key: "total_zm_badan", label: "Zakat Mal (Badan/Entitas)" },
                    { key: "total_fitrah", label: "Zakat Fitrah" },
                    { key: "total_infak_penyaluran", label: "Infak & Sedekah (Penyaluran)" },
                    { key: "total_is_ops", label: "Infak & Sedekah (Operasional)" },
                    { key: "total_ist", label: "Infaq Sedekah Terikat (IST)" },
                    { key: "total_istt", label: "Infaq Sedekah Tidak Terikat (ISTT)" },
                    { key: "total_fidyah", label: "Fidyah" },
                    { key: "total_kurban", label: "Dana Kurban" },
                    { key: "total_csr", label: "Dana CSR" },
                    { key: "total_dskl", label: "Dana Sosial Keagamaan Lainnya" }
                ];
                const sortedRincianRecv = rincianPenerimaanCfg
                    .map(c => ({ label: c.label, value: aggRecv[c.key] || 0 }))
                    .filter(d => d.value > 0)
                    .sort((a, b) => b.value - a.value);

                // --- Rincian Penyaluran (dari penyaluran_per_tahun) ---
                const aggDist = {};
                itemsDist.forEach(item => {
                    Object.keys(item).forEach(k => {
                        if (typeof item[k] === 'number' && k !== 'tahun') aggDist[k] = (aggDist[k] || 0) + item[k];
                    });
                });
                const rincianPenyaluranCfg = [
                    { key: "total_asnaf_amil", label: "Asnaf Amil" },
                    { key: "total_asnaf_fakir", label: "Asnaf Fakir" },
                    { key: "total_asnaf_fisabilillah", label: "Asnaf Fisabilillah" },
                    { key: "total_asnaf_gharimin", label: "Asnaf Gharimin" },
                    { key: "total_asnaf_ibnusabil", label: "Asnaf Ibnu Sabil" },
                    { key: "total_asnaf_miskin", label: "Asnaf Miskin" },
                    { key: "total_asnaf_muallaf", label: "Asnaf Muallaf" },
                    { key: "total_asnaf_riqab", label: "Asnaf Riqab" },
                    { key: "total_zakat_fitrah", label: "Zakat Fitrah" },
                    { key: "total_infak_amil", label: "Infak (Porsi Amil)" },
                    { key: "total_infak_penyaluran", label: "Infak (Penyaluran)" },
                    { key: "total_ist", label: "Infaq Sedekah Terikat (IST)" },
                    { key: "total_istt", label: "Infaq Sedekah Tidak Terikat (ISTT)" },
                    { key: "total_kurban", label: "Dana Kurban" },
                    { key: "total_csr", label: "Dana CSR" },
                    { key: "total_dskl", label: "Dana Sosial Keagamaan Lainnya" }
                ];
                const sortedRincianDist = rincianPenyaluranCfg
                    .map(c => ({ label: c.label, value: aggDist[c.key] || 0 }))
                    .filter(d => d.value > 0)
                    .sort((a, b) => b.value - a.value);

                setYearData({
                    totalTerkumpul,
                    totalTersalurkan,
                    totalProvinsi: totalProvinsiCount > 0 ? totalProvinsiCount : 0,
                    sourceSeries: Object.values(sourceTotals),
                    distributionSeries: sortedAsnaf.map(d => d.value),
                    distributionLabels: sortedAsnaf.map(d => d.label),
                    rincianPenerimaan: sortedRincianRecv,
                    rincianPenyaluran: sortedRincianDist
                });
                setLoading(false);

            } catch (err) {
                console.error("Error fetching ZIS data:", err);
                setYearData({
                    totalTerkumpul: 0,
                    totalTersalurkan: 0,
                    totalProvinsi: 0,
                    sourceSeries: [0, 0, 0, 0, 0, 0, 0, 0],
                    distributionSeries: [0, 0, 0, 0, 0],
                    distributionLabels: ["Pendidikan", "Kesehatan", "Ekonomi", "Dakwah", "Kemanusiaan"]
                });
                setError("Gagal memuat data. Silakan coba lagi.");
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedYear]);

    const formatCurrency = (val) => {
        if (!val) return "Rp 0";
        if (val >= 1e12) return "Rp " + (val / 1e12).toFixed(2).replace('.', ',') + " T";
        if (val >= 1e9) return "Rp " + (val / 1e9).toFixed(2).replace('.', ',') + " M";
        return "Rp " + val.toLocaleString('id-ID');
    };

    const sourceColors = ['#375673', '#d5cd94', '#556ee6', '#f1b44c', '#50a5f1', '#f46a6a', '#e83e8c', '#34c38f', '#fd625e', '#20c997', '#ffc107', '#8e44ad'];

    // --- CHART OPTIONS: PIE CHART ---
    const chartOptions = {
        chart: { type: 'pie', height: 380 },
        legend: { show: false },
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
        colors: sourceColors,
        stroke: { show: true, width: 2, colors: ['#fff'] },
        tooltip: {
            y: {
                formatter: (val) => "Rp " + val.toLocaleString('id-ID')
            }
        }
    };

    const StatCard = ({ title, value, icon, color, isLoading }) => {
        return (
            <Col lg={4} md={6} className="mb-4">
                <Card className="h-100 border-0 kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', borderRadius: '8px', boxShadow: '-6px 6px 0px #d5cd94' }}>
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
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="kemenag-title">Dashboard Nasional ZIS</h4>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-muted font-size-13">Tahun:</span>
                    <select
                        className="form-select kemenag-select shadow-sm"
                        style={{ width: '150px', borderColor: '#d5cd94', color: '#888' }}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Semua Tahun</option>
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Jika Loading ATAU data belum ada, tampilkan Skeleton / Layout */}
            {loading || !yearData ? (
                <>
                    <Row>
                        <StatCard title="Total Penerimaan" isLoading={true} icon="bx bx-trending-up" color="success" />
                        <StatCard title="Total Penyaluran" isLoading={true} icon="bx bx-check-shield" color="primary" />
                        <StatCard title="Total Provinsi" isLoading={true} icon="bx bx-map-alt" color="warning" />
                    </Row>
                    <Row className="mb-4">
                        <Col lg={6}>
                            <ChartWithDetails title="Dana ZIS-DSKL" isLoading={true} />
                        </Col>
                        <Col lg={6}>
                            <ChartWithDetails title="Dana Asnaf" isLoading={true} />
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Row>
                        <StatCard title="Total Penerimaan" value={formatCurrency(yearData.totalTerkumpul)} icon="bx bx-trending-up" color="success" />
                        <StatCard title="Total Penyaluran" value={formatCurrency(yearData.totalTersalurkan)} icon="bx bx-check-shield" color="primary" />
                        <StatCard title="Total Provinsi" value={yearData.totalProvinsi ? `${yearData.totalProvinsi} Provinsi` : "0 Provinsi"} icon="bx bx-map-alt" color="warning" />
                    </Row>

                    <Row className="mb-4">
                        <Col lg={6}>
                            <ChartWithDetails
                                title="Dana ZIS-DSKL"
                                options={chartOptions}
                                series={yearData.sourceSeries}
                                labels={sourceCategories}
                                colors={chartOptions.colors}
                            />
                        </Col>
                        <Col lg={6}>
                            <ChartWithDetails
                                title="Dana Asnaf"
                                options={chartOptions}
                                series={yearData.distributionSeries}
                                labels={yearData.distributionLabels}
                                colors={chartOptions.colors}
                            />
                        </Col>
                    </Row>

                    {/* --- TREN TAHUNAN --- */}
                    <Row className="mb-4 g-3">
                        <Col lg={6}>
                            <TrendChartWithDetails
                                title="Tren Penerimaan Zakat (Per Tahun)"
                                seriesName="Penerimaan"
                                seriesData={trendData.penerimaan}
                                labels={trendData.labels}
                                color="#375673"
                                isLoading={trendData.loading}
                            />
                        </Col>
                        <Col lg={6}>
                            <TrendChartWithDetails
                                title="Tren Penyaluran Zakat (Per Tahun)"
                                seriesName="Penyaluran"
                                seriesData={trendData.penyaluran}
                                labels={trendData.labels}
                                color="#375673"
                                isLoading={trendData.loading}
                            />
                        </Col>
                    </Row>

                    {/* --- RINCIAN PENERIMAAN & PENYALURAN --- */}
                    {yearData.rincianPenerimaan && yearData.rincianPenyaluran && (
                        <Row className="mb-4 g-3">
                            <Col lg={6}>
                                <ChartWithDetails
                                    title="Rincian Penerimaan"
                                    options={{ ...chartOptions, colors: ['#34c38f', '#375673', '#f46a6a', '#50a5f1', '#f1b44c', '#74788d', '#e83e8c', '#2ab57d', '#fd625e', '#ffc107', '#20c997'] }}
                                    series={yearData.rincianPenerimaan.map(d => d.value)}
                                    labels={yearData.rincianPenerimaan.map(d => d.label)}
                                    colors={['#34c38f', '#375673', '#f46a6a', '#50a5f1', '#f1b44c', '#74788d', '#e83e8c', '#2ab57d', '#fd625e', '#ffc107', '#20c997']}
                                />
                            </Col>
                            <Col lg={6}>
                                <ChartWithDetails
                                    title="Rincian Penyaluran"
                                    options={{ ...chartOptions, colors: ['#34c38f', '#375673', '#f46a6a', '#50a5f1', '#f1b44c', '#74788d', '#e83e8c', '#2ab57d', '#fd625e', '#ffc107', '#20c997', '#556ee6', '#d5cd94', '#5b73e8', '#c0392b', '#8e44ad'] }}
                                    series={yearData.rincianPenyaluran.map(d => d.value)}
                                    labels={yearData.rincianPenyaluran.map(d => d.label)}
                                    colors={['#34c38f', '#375673', '#f46a6a', '#50a5f1', '#f1b44c', '#74788d', '#e83e8c', '#2ab57d', '#fd625e', '#ffc107', '#20c997', '#556ee6', '#d5cd94', '#5b73e8', '#c0392b', '#8e44ad']}
                                />
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </React.Fragment>
    );
};

export default RingkasanZisComponent;
