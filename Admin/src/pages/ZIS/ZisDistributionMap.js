import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input } from "reactstrap";
import VectormapZis from "../Maps/VectormapZis";
import axios from 'axios';
import { GET_PENERIMAAN_PROVINSI, GET_PENYALURAN_PROVINSI } from "../../helpers/url_helper";
// Import the map definition to read it directly
import { idnMerc } from "@react-jvectormap/indonesia";

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

// --- HELPER: FORMAT CURRENCY ---
const formatCurrency = (value) => {
    if (!value) return "Rp 0";
    if (value >= 1000000000000) return "Rp " + (value / 1000000000000).toFixed(2).replace('.', ',') + " T";
    if (value >= 1000000000) return "Rp " + (value / 1000000000).toFixed(2).replace('.', ',') + " M";
    if (value >= 1000000) return "Rp " + (value / 1000000).toFixed(2).replace('.', ',') + " Jt";
    return "Rp " + value.toLocaleString('id-ID');
};

const ZisDistributionMap = () => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [activeTab, setActiveTab] = useState("collection"); // 'collection' | 'distribution'

    const [mapData, setMapData] = useState({}); // Values for map coloring (in Billions)
    const [fullData, setFullData] = useState({}); // Full objects for tooltips
    const fullDataRef = React.useRef({}); // REF TO STORE LATEST DATA FOR TOOLTIP CALLBACK
    const [loading, setLoading] = useState(true);

    const [rawPenerimaan, setRawPenerimaan] = useState([]);
    const [rawPenyaluran, setRawPenyaluran] = useState([]);

    // --- DYNAMIC MAPPING STATE ---
    const [nameToCodeMap, setNameToCodeMap] = useState({});

    // --- 1. BUILD DYNAMIC MAPPING FROM MAP DEFINITION ---
    useEffect(() => {
        try {
            // idnMerc structure usually has paths: { "CODE": { name: "Name" }, ... }
            // Some versions might have content.paths or just paths.
            const paths = idnMerc.paths || idnMerc.content?.paths || {};
            const mapping = {};

            console.log("🗺️ Reading Map Definition:", Object.keys(paths).length, "regions found.");

            Object.entries(paths).forEach(([code, details]) => {
                const mapName = details.name; // e.g., "Jawa Tengah"
                if (mapName) {
                    // Create normalized keys for robust matching
                    mapping[normalizeName(mapName)] = code;
                    // Also keep exact lower case
                    mapping[mapName.toLowerCase()] = code;
                }
            });
            console.log("🗺️ Dynamic Map Keys Generated:", mapping);
            setNameToCodeMap(mapping);
        } catch (e) {
            console.error("Error building map mapping:", e);
        }
    }, []);

    // Update Ref whenever fullData changes
    useEffect(() => {
        fullDataRef.current = fullData;
    }, [fullData]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [resRecv, resDist] = await Promise.all([
                    axios.get(GET_PENERIMAAN_PROVINSI, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } }),
                    axios.get(GET_PENYALURAN_PROVINSI, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } })
                ]);

                setRawPenerimaan(resRecv.data?.data?.items || resRecv.data?.data || []);
                setRawPenyaluran(resDist.data?.data?.items || resDist.data?.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching ZIS Map data:", err);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // --- PROCESS DATA ---
    useEffect(() => {
        // Wait for mapping to be ready
        if (Object.keys(nameToCodeMap).length === 0) return;

        const processedMapData = {};
        const processedFullData = {};

        const getCodeFromApiName = (apiName) => {
            if (!apiName) return null;
            const norm = normalizeName(apiName);
            return nameToCodeMap[norm] || nameToCodeMap[apiName.toLowerCase()];
        };

        // 1. Process Penerimaan
        rawPenerimaan.forEach(item => {
            const code = getCodeFromApiName(item.provinsi);

            // Debug if mapping fails for a known province like "Jambi"
            if (!code && item.provinsi) {
                // console.log("Failed to map API province:", item.provinsi, "Normalized:", normalizeName(item.provinsi));
            }

            if (code) {
                const total = (item.total_zakat_perorangan || 0) + (item.total_zakat_badan || 0) + (item.zakat_fitrah || 0) + (item.total_infak_penyaluran || 0);
                if (!processedFullData[code]) processedFullData[code] = {};
                processedFullData[code].penerimaan = { ...item, totalValue: total };

                if (activeTab === 'collection') {
                    processedMapData[code] = total / 1000000000;
                }
            }
        });

        // 2. Process Penyaluran
        rawPenyaluran.forEach(item => {
            const code = getCodeFromApiName(item.provinsi);

            if (code) {
                const total =
                    (item.total_asnaf_fakir || 0) + (item.total_asnaf_miskin || 0) +
                    (item.total_asnaf_amil || 0) + (item.total_asnaf_muallaf || 0) +
                    (item.total_asnaf_fisabilillah || 0) + (item.total_asnaf_ibnusabil || 0) +
                    (item.total_asnaf_gharimin || 0) + (item.total_asnaf_riqab || 0);

                if (!processedFullData[code]) processedFullData[code] = {};
                processedFullData[code].penyaluran = { ...item, totalValue: total };

                if (activeTab === 'distribution') {
                    processedMapData[code] = total / 1000000000;
                }
            }
        });

        console.log("Final Data for Map:", processedFullData);
        setMapData(processedMapData);
        setFullData(processedFullData);

    }, [activeTab, rawPenerimaan, rawPenyaluran, nameToCodeMap]);


    const [selectedRegion, setSelectedRegion] = useState(null);

    // --- TABLE HIGHLIGHT HELPER ---
    const rowRef = React.useRef({});

    // Scroll to table row when map clicked
    useEffect(() => {
        if (selectedRegion && rowRef.current[selectedRegion]) {
            rowRef.current[selectedRegion].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedRegion]);

    return (
        <React.Fragment>
            {/* Main Card */}
            <Card className="border-0 shadow-sm rounded-3">
                <CardBody className="p-4" style={{ minHeight: '600px', position: 'relative' }}>

                    {/* Header Controls */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ zIndex: 10, position: 'relative' }}>
                        <div className="d-flex gap-2">
                            <Button
                                color={activeTab === 'collection' ? "success" : "outline-success"}
                                className={`px-4 rounded-pill fw-bold ${activeTab === 'collection' ? "text-white" : ""}`}
                                onClick={() => setActiveTab('collection')}
                            >
                                Pengumpulan
                            </Button>
                            <Button
                                color={activeTab === 'distribution' ? "warning" : "outline-warning"}
                                className={`px-4 rounded-pill fw-bold ${activeTab === 'distribution' ? "text-white" : ""}`}
                                onClick={() => setActiveTab('distribution')}
                            >
                                Penyaluran
                            </Button>
                        </div>

                        <div className="text-center flex-grow-1 d-none d-md-block">
                            <h5 className="mb-0 fw-bold">Peta Sebaran {activeTab === 'collection' ? 'Penerimaan' : 'Penyaluran'} ZIS</h5>
                            <small className="text-muted text-uppercase">Data Real-time Kemenag RI</small>
                        </div>
                    </div>

                    {/* Data Availability Alert */}
                    <div className="alert alert-warning py-2 mb-3 font-size-13 text-center">
                        <i className="mdi mdi-information me-2"></i>
                        Data tersedia untuk (Code): {Object.keys(fullData).length > 0 ? Object.keys(fullData).join(", ") : "Memuat..."}
                    </div>

                    {/* Map Area */}
                    <div style={{ height: '550px', width: '100%', position: 'relative', background: '#f8f9fa', borderRadius: '8px' }}>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <VectormapZis
                                key={activeTab + JSON.stringify(mapData)} // Force re-render when data/tab changes
                                value={mapData}
                                width="100%"
                                colorScale={activeTab === 'collection' ? ["#e6fffa", "#0f4833"] : ["#fff8e6", "#e69500"]}
                                selectedRegions={selectedRegion ? [selectedRegion] : []}
                                onRegionClick={(e, code) => {
                                    setSelectedRegion(code);
                                }}
                                onRegionTipShow={(e, label, code) => {
                                    // Custom Tooltip Data - accessing via REF to avoid stale closure
                                    const dataMap = fullDataRef.current;
                                    const data = dataMap[code];
                                    const mode = activeTab === 'collection' ? 'penerimaan' : 'penyaluran';
                                    const item = data ? data[mode] : null;

                                    let details = "<br><hr style='margin:5px 0; border-top:1px solid #fff'>";
                                    if (item) {
                                        details += `<b>Total: ${formatCurrency(item.totalValue)}</b><br>`;
                                        if (mode === 'penerimaan') {
                                            details += `<small>Zakat Maal: ${formatCurrency(item.total_zakat_perorangan + item.total_zakat_badan)}</small><br>`;
                                            details += `<small>Infaq: ${formatCurrency(item.total_infak_penyaluran)}</small>`;
                                        } else {
                                            details += `<small>Fakir/Miskin: ${formatCurrency((item.total_asnaf_fakir || 0) + (item.total_asnaf_miskin || 0))}</small><br>`;
                                            details += `<small>Fisabilillah: ${formatCurrency(item.total_asnaf_fisabilillah)}</small>`;
                                        }
                                    } else {
                                        // DEBUG INFO
                                        // const keys = Object.keys(dataMap);
                                        // const keysStr = keys.slice(0, 5).join(",") + (keys.length > 5 ? "..." : "");
                                        details += `<i>Data NULL</i><br>`;
                                        // details += `<span style="font-size:10px; color:#ffcccc">Debug: This Code(${code}) vs Keys: ${keysStr}</span>`;
                                    }

                                    label.html(`
                                        <div style="text-align:left;">
                                            <h6 style="margin:0; font-size:14px;">${label.html()} (${code})</h6>
                                            ${details}
                                        </div>
                                    `);
                                }}
                            />
                        )}

                        {/* Legend */}
                        <div className="bg-white p-3 shadow-sm rounded" style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 5, width: '200px', border: '1px solid #eee' }}>
                            <h6 className="font-size-12 fw-bold mb-2">Legenda (Miliar Rp)</h6>
                            {[
                                { label: '< 1 M', color: activeTab === 'collection' ? '#e6fffa' : '#fff8e6' },
                                { label: '1 - 10 M', color: activeTab === 'collection' ? '#b2f5ea' : '#ffe8b3' },
                                { label: '10 - 50 M', color: activeTab === 'collection' ? '#81e6d9' : '#ffd580' },
                                { label: '50 - 100 M', color: activeTab === 'collection' ? '#4fd1c5' : '#ffc14d' },
                                { label: '100 - 500 M', color: activeTab === 'collection' ? '#38b2ac' : '#ffa91a' },
                                { label: '> 500 M', color: activeTab === 'collection' ? '#319795' : '#e69500' },
                            ].map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center mb-1">
                                    <span style={{ width: '15px', height: '15px', backgroundColor: item.color, marginRight: '8px', border: '1px solid #ddd' }}></span>
                                    <span className="font-size-11">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* --- TABLE SECTION --- */}
                    <div className="mt-5">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="mb-0 fw-bold">Rincian Data Per Provinsi</h5>
                            {selectedRegion && (
                                <Button size="sm" color="outline-secondary" onClick={() => setSelectedRegion(null)}>
                                    Reset Filter
                                </Button>
                            )}
                            <Button size="sm" color="light" onClick={() => {
                                const element = document.getElementById("table-detail-zis");
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                <i className="bx bx-table me-1"></i> Lihat Tabel
                            </Button>
                        </div>

                        <div className="table-responsive" id="table-detail-zis">
                            <table className="table table-bordered table-striped table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }} className="text-center">No</th>
                                        <th>Provinsi</th>
                                        <th className="text-end text-success">Total Pengumpulan</th>
                                        <th className="text-end text-warning">Total Penyaluran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        // Merge Data for Table & Apply Filter if Selected
                                        const processed = {};
                                        const init = (name, code) => {
                                            if (!processed[name]) processed[name] = { name, code, recv: 0, dist: 0 };
                                        };

                                        const getCode = (name) => {
                                            if (!name) return null;
                                            const norm = normalizeName(name);
                                            return nameToCodeMap[norm] || nameToCodeMap[name.toLowerCase()];
                                        };

                                        rawPenerimaan.forEach(item => {
                                            if (item.provinsi) {
                                                const name = item.provinsi.trim();
                                                init(name, getCode(name));
                                                processed[name].recv = (item.total_zakat_perorangan || 0) + (item.total_zakat_badan || 0) + (item.zakat_fitrah || 0) + (item.total_infak_penyaluran || 0);
                                            }
                                        });

                                        rawPenyaluran.forEach(item => {
                                            if (item.provinsi) {
                                                const name = item.provinsi.trim();
                                                init(name, getCode(name));
                                                const total = (item.total_asnaf_fakir || 0) + (item.total_asnaf_miskin || 0) +
                                                    (item.total_asnaf_amil || 0) + (item.total_asnaf_muallaf || 0) +
                                                    (item.total_asnaf_fisabilillah || 0) + (item.total_asnaf_ibnusabil || 0) +
                                                    (item.total_asnaf_gharimin || 0) + (item.total_asnaf_riqab || 0);
                                                processed[name].dist = total;
                                            }
                                        });

                                        let sorted = Object.values(processed).sort((a, b) => b.recv - a.recv);

                                        if (sorted.length === 0) {
                                            return <tr><td colSpan="4" className="text-center">Tidak ada data.</td></tr>;
                                        }

                                        return sorted.map((row, idx) => {
                                            const isSelected = selectedRegion && row.code === selectedRegion;
                                            // Ref callback
                                            const setRef = (el) => {
                                                if (row.code) rowRef.current[row.code] = el;
                                            };

                                            return (
                                                <tr
                                                    key={idx}
                                                    ref={setRef}
                                                    className={isSelected ? "table-active border-primary border-2" : ""}
                                                    style={isSelected ? { backgroundColor: '#e6fffa' } : {}}
                                                >
                                                    <td className="text-center">{idx + 1}</td>
                                                    <td className="fw-medium">
                                                        {row.name}
                                                        {isSelected && <i className="bx bx-check-circle text-success ms-2"></i>}
                                                    </td>
                                                    <td className="text-end">{formatCurrency(row.recv)}</td>
                                                    <td className="text-end">{formatCurrency(row.dist)}</td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </CardBody>
            </Card>
        </React.Fragment >
    );
};

export default ZisDistributionMap;

