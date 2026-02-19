import React, { useEffect, useState } from 'react';
import { Col, Card, CardBody, Row, Table } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import PetaSebaranWakaf from "./PetaSebaranWakaf";
import axios from "axios";
import { GET_WAKAF_TANAH_DATA } from "../../helpers/url_helper";
import SkeletonLoader from "../../components/Common/SkeletonLoader"; // Import Skeleton

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    if (value == null) return "Rp 0";
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(1) + " M";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(1) + " Jt";
    return "Rp " + value.toLocaleString('id-ID');
};

const formatNumber = (value) => value ? value.toLocaleString('id-ID') : "0";

// --- CHART COMPONENTS WITH DETAILS ---

const ChartWithDetails = ({ title, options, series, labels, colors, totalValue, unit = "Rp", chartType = "donut", isLoading }) => {
    let total = 0;
    let seriesData = [];

    // Safely extract data series
    if (chartType === "bar") {
        if (series && series.length > 0 && series[0].data) {
            seriesData = series[0].data;
            // For Assets Growth, the last bar usually represents the current/total state
            total = seriesData.length > 0 ? seriesData[seriesData.length - 1] : 0;
        } else {
            seriesData = [];
            total = 0;
        }
    } else {
        // Pie/Donut
        if (series && Array.isArray(series)) {
            seriesData = series;
            total = seriesData.reduce((a, b) => a + b, 0);
        } else {
            seriesData = [];
            total = 0;
        }
    }

    if (isLoading) {
        return <SkeletonLoader type="chart" height={360} />;
    }

    return (
        <Card className="kemenag-card kemenag-hover-card">
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

                                if (seriesData[index] !== undefined) {
                                    value = seriesData[index];
                                    if (total > 0 && chartType !== "bar") {
                                        percent = ((value / total) * 100).toFixed(1);
                                    }
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

const AssetsByPurposeChart = ({ data, isLoading }) => {
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

    const colors = ['#375673', '#d5cd94', '#f46a6a', '#34c38f', '#50a5f1'];

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
            isLoading={isLoading}
        />
    );
};

const AssetsGrowthChart = ({ years, startYear = 2020, data = [], isLoading }) => {
    // If no real data passed, use static (fallback) or empty
    const defaultData = [0, 0, 0, 0, 0, 0];
    // Dynamic Years based on data
    const displayYears = years && years.length > 0 ? years : ['2020', '2021', '2022', '2023', '2024', '2025'];
    const displayData = data && data.length > 0 ? data : defaultData;

    const color = '#34c38f';

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: displayYears,
            labels: { show: false }
        },
        yaxis: { show: false },
        grid: { show: false },
        colors: [color],
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => val + " Ribu Aset" } }
    };

    return (
        <ChartWithDetails
            title={`Pertumbuhan Aset Wakaf Tanah `}
            options={options}
            series={[{ name: 'Aset Tanah', data: displayData }]}
            labels={displayYears}
            colors={displayYears.map(() => color)}
            chartType="bar"
            unit="Aset"
            totalValue={`${displayData.reduce((a, b) => a + b, 0).toLocaleString()} Aset`}
            isLoading={isLoading}
        />
    );
};


// --- STAT CARDS ---

const StatCard = ({ title, value, icon, color, isLoading }) => {
    return (
        <Col xl={4} md={6}>
            <Card className="card-h-100 shadow-lg kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', border: 'none', borderLeft: '6px solid #d5cd94', borderRadius: '8px' }}>
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
                            <CountUp end={value} duration={2} separator="." />
                        )}
                    </h4>
                </CardBody>
            </Card>
        </Col>
    );
};

// --- PROVINCE TABLE COMPONENT ---
const ProvinceTable = ({ data, isLoading }) => {
    const totalWakaf = data.reduce((sum, item) => sum + item.count, 0);

    const formatArea = (area) => {
        if (area >= 10000) return (area / 10000).toFixed(2) + ' Ha';
        return area.toFixed(2) + ' m²';
    };

    return (
        <Card className="kemenag-table-card kemenag-card-interactive">
            <CardBody>
                <h5 className="card-title mb-4">Top 10 Provinsi - Wakaf Terbanyak</h5>
                {isLoading ? (
                    <SkeletonLoader type="table-rows" count={5} />
                ) : (
                    <div className="kemenag-table-responsive">
                        <Table className="kemenag-table-clean align-middle table-nowrap mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Provinsi</th>
                                    <th className="text-end">Jumlah Wakaf</th>
                                    <th className="text-end">Total Luas</th>
                                    <th className="text-end" style={{ width: '100px' }}>Persentase</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    const percentage = totalWakaf > 0 ? ((item.count / totalWakaf) * 100).toFixed(1) : 0;
                                    return (
                                        <tr key={index}>
                                            <td className="kemenag-col-no">{index + 1}</td>
                                            <td>
                                                <span className="kemenag-col-bold">{item.name}</span>
                                            </td>
                                            <td className="text-end">
                                                <span className="badge bg-soft-primary text-primary font-size-12 px-2 py-1">
                                                    {item.count.toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                            <td className="text-end text-muted font-size-13">
                                                {formatArea(item.totalArea)}
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <span className="me-2 font-size-13">{percentage}%</span>
                                                    <div className="progress" style={{ width: '60px', height: '6px' }}>
                                                        <div
                                                            className="progress-bar bg-primary"
                                                            role="progressbar"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};


// --- MAIN PAGE WAKAF ---

const WakafPage = () => {
    document.title = "Dashboard Wakaf | Zakat Nasional";

    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState("all");
    const [availableYears, setAvailableYears] = useState([]);

    const [allItems, setAllItems] = useState([]); // Store all data once
    const [stats, setStats] = useState({ wakif: 0, tanah: 0, nazhir: 0 });
    const [purposeData, setPurposeData] = useState([]);
    const [growthData, setGrowthData] = useState({ years: [], counts: [] });
    const [provinceData, setProvinceData] = useState([]);

    // --- 1. FETCH DATA ONCE ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(GET_WAKAF_TANAH_DATA, {
                    headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" },
                    params: { limit: 20000 }
                });
                const items = response.data?.data?.items || [];
                const currentYear = new Date().getFullYear();

                // Encode Year Data Once
                items.forEach(item => {
                    let itemYear = null;
                    if (item.permohonan_kode && item.permohonan_kode.length >= 4) {
                        const y = parseInt(item.permohonan_kode.substring(0, 4));
                        if (y > 1900 && y <= currentYear + 1) itemYear = y;
                    }
                    if (!itemYear && item.tanggal_sertifikat) {
                        const d = new Date(item.tanggal_sertifikat);
                        if (!isNaN(d.getFullYear())) itemYear = d.getFullYear();
                    }
                    if (itemYear) item._year = itemYear;
                });

                // Extract Available Years
                const yearsSet = new Set(items.map(i => i._year).filter(Boolean));
                const newAvailableYears = Array.from(yearsSet).sort((a, b) => b - a);
                setAvailableYears(newAvailableYears);
                setAllItems(items); // Store raw data
                setLoading(false);

            } catch (error) {
                console.error("Error fetching wakaf data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- 2. FILTER & CALCULATE STATS LOCALLY ---
    useEffect(() => {
        if (allItems.length === 0 && loading) return; // Wait for fetch

        // Filter
        let filteredItems = allItems;
        if (selectedYear !== "all") {
            filteredItems = allItems.filter(item => String(item._year) === String(selectedYear));
        }

        // 1. Process Stats
        const uniqueWakif = new Set();
        const uniqueNazhir = new Set();
        filteredItems.forEach(item => {
            if (item.wakif_nama) uniqueWakif.add(item.wakif_nama);
            if (item.nazhir_nama) uniqueNazhir.add(item.nazhir_nama);
        });

        setStats({
            tanah: filteredItems.length,
            wakif: uniqueWakif.size,
            nazhir: uniqueNazhir.size
        });

        // 2. Process Purpose
        let counts = { ibadah: 0, pendidikan: 0, sosial: 0, makam: 0, lainnya: 0 };
        filteredItems.forEach(item => {
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

        // 3. Process Growth (Only relevant if "all" or showing trend within year context)
        let yearCounts = {};
        filteredItems.forEach(item => {
            if (item._year) {
                yearCounts[item._year] = (yearCounts[item._year] || 0) + 1;
            }
        });
        const sortedYears = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
        if (sortedYears.length > 0) {
            setGrowthData({
                years: sortedYears.map(String),
                counts: sortedYears.map(y => yearCounts[y])
            });
        } else {
            setGrowthData({ years: [], counts: [] });
        }

        // 4. Process Province Table
        const provinceAgg = {};
        filteredItems.forEach(item => {
            const prov = item.provinsi_nama || 'Tidak Diketahui';
            if (!provinceAgg[prov]) {
                provinceAgg[prov] = { count: 0, totalArea: 0 };
            }
            provinceAgg[prov].count += 1;
            const area = parseFloat(item.tanah_luas) || 0;
            provinceAgg[prov].totalArea += area;
        });
        const provinceArray = Object.keys(provinceAgg).map(name => ({
            name,
            count: provinceAgg[name].count,
            totalArea: provinceAgg[name].totalArea
        })).sort((a, b) => b.count - a.count).slice(0, 10);
        setProvinceData(provinceArray);

    }, [selectedYear, allItems, loading]);

    const statCards = [
        { title: "Jumlah Wakif", value: stats.wakif, icon: "bx bx-user", color: "primary" },
        { title: "Lokasi Tanah", value: stats.tanah, icon: "bx bx-map", color: "success" },
        { title: "Nazhir Sertif", value: stats.nazhir, icon: "bx bx-certification", color: "warning" }
    ];

    return (
        <div className="kemenag-page">
            <div className="kemenag-container">

                {/* Header */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between">
                            <div>
                                <h4 className="kemenag-title">Dashboard Wakaf Nasional</h4>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-muted font-size-13">Tahun:</span>
                                <select
                                    className="form-select kemenag-select shadow-sm"
                                    style={{ width: '150px', borderColor: '#d5cd94', color: '#888' }}
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="all">Semua Tahun</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
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
                        <AssetsByPurposeChart data={purposeData} isLoading={loading} />
                    </Col>
                    <Col xl={6}>
                        {growthData.years.length > 0 ? (
                            <AssetsGrowthChart years={growthData.years} data={growthData.counts} isLoading={loading} />
                        ) : (
                            <AssetsGrowthChart years={['No Data']} data={[0]} isLoading={loading} />
                        )}
                    </Col>
                </Row>

                {/* Section Table Summary */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <ProvinceTable data={provinceData} isLoading={loading} />
                    </Col>
                </Row>

                {/* Section Sebaran Aset Wakaf (Peta Interaktif) */}
                <PetaSebaranWakaf globalFilterYear={selectedYear} allData={allItems} isLoading={loading} />

            </div>
        </div>
    );
}

export default WakafPage;