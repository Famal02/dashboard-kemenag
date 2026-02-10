
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";
import PetaIndonesia from "../ZIS/PetaIndonesia";
import ReactApexChart from "react-apexcharts";
import dataRumahIbadah from "../../assets/data/dataRumahIbadah.json";
import { idnMerc } from "@react-jvectormap/indonesia";
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

    if (!data) return null;

    // Filtered Data for Table
    const filteredProvinces = selectedProvinceCode
        ? data.provinces.filter(p => p.code === selectedProvinceCode)
        : data.provinces;

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
                        <Card className="stats-card fade-in-animation">
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <p className="text-muted fw-medium">Total Rumah Ibadah</p>
                                        <h4 className="mb-0">{data?.total?.toLocaleString() || "0"}</h4>
                                        <small className="text-muted">Unit {religion} Terdata</small>
                                    </div>
                                    <div className="flex-shrink-0 align-self-center">
                                        <div className="mini-stat-icon">
                                            <i className="bx bx-home-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="stats-card fade-in-animation" style={{ animationDelay: '0.1s' }}>
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <p className="text-muted fw-medium">Provinsi Terbanyak</p>
                                        <h4 className="mb-0">{data?.maxProv?.count?.toLocaleString() || "0"}</h4>
                                        <small className="text-muted">{data?.maxProv?.name || "-"}</small>
                                    </div>
                                    <div className="flex-shrink-0 align-self-center">
                                        <div className="mini-stat-icon">
                                            <i className="bx bx-trending-up"></i>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="stats-card fade-in-animation" style={{ animationDelay: '0.2s' }}>
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <p className="text-muted fw-medium">Provinsi Paling Sedikit</p>
                                        <h4 className="mb-0">{data?.minProv?.count?.toLocaleString() || "0"}</h4>
                                        <small className="text-muted">{data?.minProv?.name || "-"}</small>
                                    </div>
                                    <div className="flex-shrink-0 align-self-center">
                                        <div className="mini-stat-icon">
                                            <i className="bx bx-trending-down"></i>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {/* Map Section */}
                    <Col lg={8}>
                        <Card className="map-card">
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title">Sebaran Geografis</h4>
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
                                                details = `<br/><i style='color:#f0eee9; opacity:0.7'>Belum ada data</i>`;
                                            }

                                            label.html(`
                                                <div style="text-align:left; padding:4px;">
                                                    <h6 style="margin:0; font-size:14px; color:#f0eee9; font-weight:600;">${label.html()}</h6>
                                                    ${details}
                                                </div>
                                            `);
                                        }}
                                        colorScale={["#f0eee9", "#375673"]}
                                    />

                                    {/* Legend */}
                                    <div className="map-legend">
                                        <div className="map-legend-item">
                                            <span className="map-legend-color" style={{ background: '#f0eee9' }}></span>
                                            Sedikit
                                        </div>
                                        <div className="map-legend-item">
                                            <span className="map-legend-color" style={{ background: '#375673' }}></span>
                                            Banyak
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Table Section */}
                    <Col lg={4}>
                        <Card className="table-card">
                            <CardBody>
                                <h4 className="card-title mb-4">
                                    {selectedProvinceCode ? "Detail Provinsi" : "Peringkat Provinsi"}
                                </h4>
                                <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    <Table className="table-nowrap mb-0">
                                        <thead className="sticky-top">
                                            <tr>
                                                <th>#</th>
                                                <th>Provinsi</th>
                                                <th className="text-end">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProvinces && filteredProvinces.length > 0 ? filteredProvinces.map((prov, idx) => (
                                                <tr key={idx} className={prov?.code === selectedProvinceCode ? "table-active" : ""}>
                                                    <td style={{ width: '40px' }}>{idx + 1}</td>
                                                    <td>
                                                        <h6 className="text-truncate mb-1" style={{ maxWidth: '150px' }} title={prov?.name || ''}>
                                                            {prov?.name || '-'}
                                                        </h6>
                                                    </td>
                                                    <td className="text-end fw-bold">{prov?.count?.toLocaleString() || '0'}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center text-muted py-4">
                                                        Data tidak ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DataRumahIbadah;
