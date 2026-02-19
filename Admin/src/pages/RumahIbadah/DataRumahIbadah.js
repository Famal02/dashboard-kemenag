
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Table, Input } from "reactstrap";
import PetaIndonesia from "../ZIS/PetaIndonesia";
import ReactApexChart from "react-apexcharts";
import dataRumahIbadah from "../../assets/data/dataRumahIbadah.json";
import { idnMerc } from "@react-jvectormap/indonesia";
import SkeletonLoader from "../../components/Common/SkeletonLoader"; // Import Skeleton
import "./DataRumahIbadah.css";

// --- NORMALIZATION HELPER ---
const normalizeName = (name) => {
    if (!name) return "";
    return name.toString().toLowerCase()
        .replace("provinsi", "")
        .replace("di ", "")
        .replace("dka ", "")
        .replace("kepulauan", "")
        .trim();
};

// Map Religion Name from Prop to JSON Key
const religionKeyMap = {
    "Islam": "masjid",
    "Kristen": "gereja_kristen",
    "Katolik": "gereja_katolik",
    "Hindu": "pura",
    "Buddha": "vihara",
    "Khonghucu": "klenteng"
};

const DataRumahIbadah = ({ religion, color }) => {
    const [data, setData] = useState(null);
    const [mapValues, setMapValues] = useState({});
    const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);

    // --- TABLE STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtered Data for Table
    const filteredProvinces = React.useMemo(() => {
        const res = data?.provinces ? [...data.provinces] : [];
        let filtered = res;

        if (selectedProvinceCode) {
            filtered = filtered.filter(p => p.code === selectedProvinceCode);
        }

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            filtered = filtered.filter(p => (p.name || "").toLowerCase().includes(lower));
        }

        // Sort by count descending by default
        return filtered.sort((a, b) => b.count - a.count);
    }, [data, selectedProvinceCode, searchQuery]);

    // Handle Search Change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Use ref for accessing data in callbacks (like Wakaf implementation)
    const fullDataRef = useRef({});

    // --- DYNAMIC MAPPING STATE ---
    const [nameToCodeMap, setNameToCodeMap] = useState({});
    const [codeToNameMap, setCodeToNameMap] = useState({}); // Reverse map for filtering

    // --- 1. BUILD DYNAMIC MAPPING FROM MAP DEFINITION ---
    useEffect(() => {
        try {
            const paths = idnMerc.paths || idnMerc.content?.paths || {};
            const mapping = {};
            const reverseMapping = {};

            Object.entries(paths).forEach(([code, details]) => {
                const mapName = details.name;
                if (mapName) {
                    mapping[normalizeName(mapName)] = code;
                    mapping[mapName.toLowerCase()] = code;

                    reverseMapping[code] = mapName;
                }
            });
            setNameToCodeMap(mapping);
            setCodeToNameMap(reverseMapping);

            console.log("=== Dynamic Mapping Built ===");
            console.log("Sample nameToCodeMap:", Object.entries(mapping).slice(0, 5));
        } catch (e) {
            console.error("Error building map mapping:", e);
        }
    }, []);

    useEffect(() => {
        // Wait for mapping to be ready
        if (Object.keys(nameToCodeMap).length === 0) {
            console.log("Waiting for nameToCodeMap...");
            return;
        }

        const key = religionKeyMap[religion];
        if (!key) return;

        console.log("=== useEffect: Processing data for religion:", religion, "key:", key);

        // Process data from JSON
        let totalCount = 0;

        // 1. Map & Aggregate
        const provincesData = dataRumahIbadah.map(item => {
            const count = item[key] || 0;
            totalCount += count;

            const provName = item.provinsi;
            const norm = normalizeName(provName);
            const code = nameToCodeMap[norm] || nameToCodeMap[provName.toLowerCase()];

            return {
                name: item.provinsi,
                code: code || "ID-XX",
                count: count
            };
        });

        console.log("provincesData sample (first 3):", provincesData.slice(0, 3));

        // 2. Sort descending by count
        provincesData.sort((a, b) => b.count - a.count);

        // 3. Find Max & Min
        const maxProv = provincesData.length > 0 ? provincesData[0] : { name: '-', count: 0 };
        const minProv = provincesData.length > 0 ? provincesData[provincesData.length - 1] : { name: '-', count: 0 };

        // 4. Prepare Map Values and Full Data Ref
        const mValues = {};
        const fullDataMap = {};

        provincesData.forEach(p => {
            if (p.code !== "ID-XX") {
                mValues[p.code] = p.count;
                fullDataMap[p.code] = {
                    code: p.code,
                    name: p.name,
                    count: p.count
                };
            }
        });

        console.log("mValues keys:", Object.keys(mValues));
        console.log("mValues sample:", Object.entries(mValues).slice(0, 3));
        console.log("fullDataMap keys:", Object.keys(fullDataMap));
        console.log("fullDataMap sample:", Object.entries(fullDataMap).slice(0, 3));

        setMapValues(mValues);
        fullDataRef.current = fullDataMap; // Store in ref for callback access

        setData({
            total: totalCount,
            maxProv,
            minProv,
            provinces: provincesData
        });

        console.log("=== Data set complete ===");

    }, [religion, nameToCodeMap]);

    // --- HANDLERS (defined outside render like in Wakaf) ---
    const handleRegionClick = (e, code) => {
        console.log("=== DataRumahIbadah handleRegionClick ===");
        console.log("Clicked code:", code);
        console.log("Available province codes:", data?.provinces.map(p => p.code));
        setSelectedProvinceCode(code);
    };

    const handleResetFilter = () => {
        console.log("=== Reset filter ===");
        setSelectedProvinceCode(null);
    };


    // --- LOADING STATE WITH SKELETON ---
    if (!data) {
        return (
            <div className="rumah-ibadah-page">
                <div className="rumah-ibadah-container">
                    {/* Header Skeleton */}
                    <Row className="mb-4">
                        <Col xs={12}>
                            <div className="d-flex align-items-center justify-content-between">
                                <SkeletonLoader type="text" width="200px" height="30px" />
                                <SkeletonLoader type="text" width="150px" height="20px" />
                            </div>
                        </Col>
                    </Row>

                    {/* Summary Cards Skeleton */}
                    <Row className="mb-4">
                        {[1, 2, 3].map((item) => (
                            <Col md={4} key={item}>
                                <Card className="stats-card kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', border: 'none', borderLeft: '6px solid #d5cd94', borderRadius: '8px' }}>
                                    <CardBody className="p-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-grow-1">
                                                <SkeletonLoader type="text" width="100px" />
                                                <div className="mt-2">
                                                    <SkeletonLoader type="text" width="60%" height="25px" />
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 align-self-center">
                                                <SkeletonLoader type="circle" width="40px" height="40px" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Map Skeleton */}
                    <Row>
                        <Col lg={12}>
                            <Card className="map-card kemenag-hover-card">
                                <CardBody>
                                    <div className="mb-4">
                                        <SkeletonLoader type="text" width="200px" />
                                    </div>
                                    <SkeletonLoader type="map" height="500px" />
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Table Skeleton */}
                        <Col lg={12} className="mt-4">
                            <Card className="kemenag-table-card kemenag-hover-card">
                                <CardBody>
                                    <div className="mb-4 d-flex justify-content-between">
                                        <SkeletonLoader type="text" width="200px" />
                                        <SkeletonLoader type="text" width="250px" />
                                    </div>
                                    <SkeletonLoader type="table-rows" count={5} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    return (
        <div className="rumah-ibadah-page">
            <div className="rumah-ibadah-container">
                {/* Page Title */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="rumah-ibadah-title">Data Rumah Ibadah: {religion}</h4>
                            <ol className="breadcrumb rumah-ibadah-breadcrumb">
                                <li className="breadcrumb-item">Rumah Ibadah</li>
                                <li className="breadcrumb-item active">{religion}</li>
                            </ol>
                        </div>
                    </Col>
                </Row>

                {/* Summary Cards */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="stats-card fade-in-animation kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', border: 'none', borderLeft: '6px solid #d5cd94', borderRadius: '8px' }}>
                            <CardBody className="p-3">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="flex-grow-1">
                                        <p className="fw-bold mb-0 text-uppercase font-size-11" style={{ color: '#d5cd94', opacity: 0.8, letterSpacing: '0.5px' }}>Total Rumah Ibadah</p>
                                        <h4 className="mb-0 fw-bold mt-1" style={{ color: '#d5cd94', fontSize: '22px' }}>{data?.total?.toLocaleString() || "0"}</h4>
                                        <small style={{ color: '#d5cd94', opacity: 0.7 }}>Unit {religion} Terdata</small>
                                    </div>
                                    <div className="flex-shrink-0 align-self-center">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-transparent text-primary font-size-18">
                                                <i className="bx bx-home-alt" style={{ color: '#556ee6' }}></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="stats-card fade-in-animation kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', border: 'none', borderLeft: '6px solid #d5cd94', borderRadius: '8px', animationDelay: '0.1s' }}>
                            <CardBody className="p-3">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="flex-grow-1">
                                        <p className="fw-bold mb-0 text-uppercase font-size-11" style={{ color: '#d5cd94', opacity: 0.8, letterSpacing: '0.5px' }}>Provinsi Terbanyak</p>
                                        <h4 className="mb-0 fw-bold mt-1" style={{ color: '#d5cd94', fontSize: '22px' }}>{data?.maxProv?.count?.toLocaleString() || "0"}</h4>
                                        <small style={{ color: '#d5cd94', opacity: 0.7 }}>{data?.maxProv?.name || "-"}</small>
                                    </div>
                                    <div className="flex-shrink-0 align-self-center">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-transparent text-success font-size-18">
                                                <i className="bx bx-trending-up" style={{ color: '#34c38f' }}></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="stats-card fade-in-animation kemenag-hover-card" style={{ backgroundColor: '#1c3e5e', border: 'none', borderLeft: '6px solid #d5cd94', borderRadius: '8px', animationDelay: '0.2s' }}>
                            <CardBody className="p-3">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="flex-grow-1">
                                        <p className="fw-bold mb-0 text-uppercase font-size-11" style={{ color: '#d5cd94', opacity: 0.8, letterSpacing: '0.5px' }}>Provinsi Paling Sedikit</p>
                                        <h4 className="mb-0 fw-bold mt-1" style={{ color: '#d5cd94', fontSize: '22px' }}>{data?.minProv?.count?.toLocaleString() || "0"}</h4>
                                        <small style={{ color: '#d5cd94', opacity: 0.7 }}>{data?.minProv?.name || "-"}</small>
                                    </div>
                                    <div className="flex-shrink-0 align-self-center">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-transparent text-danger font-size-18">
                                                <i className="bx bx-trending-down" style={{ color: '#f46a6a' }}></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {/* Map Section */}
                    <Col lg={12}>
                        <Card className="map-card kemenag-hover-card">
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title" style={{ color: '#d5cd94' }}>Sebaran Geografis</h4>
                                    {selectedProvinceCode && (
                                        <button
                                            className="reset-filter-btn"
                                            onClick={handleResetFilter}
                                        >
                                            <i className="bx bx-x me-1"></i> Reset Filter
                                        </button>
                                    )}
                                </div>
                                <div className="map-container" style={{ height: '500px' }}>
                                    <PetaIndonesia
                                        key={religion + JSON.stringify(mapValues)}
                                        value={mapValues}
                                        width="100%"
                                        selectedRegions={selectedProvinceCode ? [selectedProvinceCode] : []}
                                        onRegionClick={handleRegionClick}
                                        onRegionTipShow={(e, label, code) => {
                                            const data = fullDataRef.current[code];
                                            const count = mapValues[code];

                                            let details = "";
                                            if (data) {
                                                details = `<br/><hr style='margin:8px 0; border-top:1px solid rgba(255,255,255,0.3)'><b style='color:#d5cd94'>Total: ${data.count.toLocaleString()}</b>`;
                                            } else if (count !== undefined) {
                                                details = `<br/><hr style='margin:8px 0; border-top:1px solid rgba(255,255,255,0.3)'><b style='color:#d5cd94'>Total: ${count.toLocaleString()}</b>`;
                                            } else {
                                                details = `<br/><i style='color:#d5cd94; opacity:0.7'>Belum ada data</i>`;
                                            }

                                            label.html(`
                                                <div style="text-align:left; padding:4px;">
                                                    <h6 style="margin:0; font-size:14px; color:#d5cd94; font-weight:600;">${label.html()}</h6>
                                                    ${details}
                                                </div>
                                            `);
                                        }}
                                        colorScale={["#f0eee9", "#375673"]}
                                    />

                                    {/* Legend */}
                                    <div className="map-legend">
                                        <div className="map-legend-item" style={{ color: '#d5cd94' }}>
                                            <span className="map-legend-color" style={{ background: '#f0eee9' }}></span>
                                            Sedikit
                                        </div>
                                        <div className="map-legend-item" style={{ color: '#d5cd94' }}>
                                            <span className="map-legend-color" style={{ background: '#375673' }}></span>
                                            Banyak
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Table Section */}
                    <Col lg={12} className="mt-4">
                        <Card className="kemenag-table-card kemenag-hover-card">
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title">Rincian Rumah Ibadah</h4>
                                    <div className="d-flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Cari Provinsi..."
                                            className="form-control-sm"
                                            style={{ width: '250px', borderRadius: 20 }}
                                            value={searchQuery}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </div>
                                <div className="kemenag-table-responsive">
                                    <Table className="kemenag-table-clean table-hover align-middle table-nowrap mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '50px' }}>No</th>
                                                <th>Provinsi</th>
                                                <th className="text-end">Jumlah</th>
                                                <th className="text-end" style={{ width: '200px' }}>Persentase</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProvinces && filteredProvinces.length > 0 ?
                                                filteredProvinces
                                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                    .map((prov, idx) => {
                                                        const realIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                                                        const percentage = data?.total > 0 ? ((prov.count / data.total) * 100).toFixed(1) : 0;
                                                        return (
                                                            <tr key={idx} className={prov?.code === selectedProvinceCode ? "table-active" : ""}>
                                                                <td className="kemenag-col-no">{realIdx}</td>
                                                                <td>
                                                                    <span className="kemenag-col-bold">{prov?.name || '-'}</span>
                                                                </td>
                                                                <td className="text-end fw-bold">{prov?.count?.toLocaleString() || '0'}</td>
                                                                <td className="text-end">
                                                                    <div className="d-flex align-items-center justify-content-end">
                                                                        <span className="me-2 font-size-13">{percentage}%</span>
                                                                        <div className="progress" style={{ width: '60px', height: '6px' }}>
                                                                            <div
                                                                                className="progress-bar"
                                                                                role="progressbar"
                                                                                style={{ width: `${percentage}%`, backgroundColor: '#34c38f' }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center text-muted py-4">
                                                            Data tidak ditemukan
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </Table>
                                </div>
                                {/* PAGINATION */}
                                {filteredProvinces.length > 0 && (
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="text-muted font-size-13">
                                            Halaman <b>{currentPage}</b> dari <b>{Math.ceil(filteredProvinces.length / itemsPerPage)}</b>
                                        </span>
                                        <ul className="pagination pagination-rounded mb-0 pagination-sm">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><i className="bx bx-chevron-left"></i></button>
                                            </li>
                                            <li className={`page-item ${currentPage >= Math.ceil(filteredProvinces.length / itemsPerPage) ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredProvinces.length / itemsPerPage), p + 1))}><i className="bx bx-chevron-right"></i></button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DataRumahIbadah;
