import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Col, Row, Table, Button, Modal, ModalHeader, ModalBody, Input } from "reactstrap";
// Keep Leaflet Only for Modal Detail
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import VectorMap
import VectormapZis from "../Maps/VectormapZis";
import { idnMerc } from "@react-jvectormap/indonesia";

import { GET_WAKAF_TANAH_DATA } from "../../helpers/url_helper";
import axios from "axios";

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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

const WakafDistributionMap = () => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedProvince, setSelectedProvince] = useState(null); // Province Code (e.g., ID-AC)
    const [selectedProvinceName, setSelectedProvinceName] = useState(null); // Province Name (e.g., Aceh)

    // Data States
    const [tableData, setTableData] = useState([]); // Raw List Data
    const [mapData, setMapData] = useState({}); // { "ID-AC": 1500, ... } (Count for Coloring)
    const [fullData, setFullData] = useState({}); // { "ID-AC": { count: 1500, totalArea: 50000, name: "Aceh" } }

    const fullDataRef = useRef({}); // Ref for tooltip access

    // Modal State
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // API State
    const [totalApiCount, setTotalApiCount] = useState(0);
    const [loadingMap, setLoadingMap] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Filter & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        } catch (e) {
            console.error("Error building map mapping:", e);
        }
    }, []);

    // Update Ref
    useEffect(() => {
        fullDataRef.current = fullData;
    }, [fullData]);

    // --- FETCH & PROCESS MAP DATA ---
    useEffect(() => {
        const fetchMapData = async () => {
            // Wait for mapping
            if (Object.keys(nameToCodeMap).length === 0) return;

            setLoadingMap(true);
            try {
                const response = await axios.get(GET_WAKAF_TANAH_DATA, {
                    headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" },
                    params: { limit: 50000 }
                });

                const items = response.data?.data?.items || [];
                const total = response.data?.data?.total || response.data?.total || items.length;
                console.log('Wakaf API Loaded:', items.length);

                setTotalApiCount(total);
                setTableData(items);

                // --- AGGREGATE PER PROVINCE ---
                const processedMapData = {};
                const processedFullData = {};

                items.forEach(item => {
                    const provName = item.provinsi_nama;
                    if (!provName) return;

                    const norm = normalizeName(provName);
                    const code = nameToCodeMap[norm] || nameToCodeMap[provName.toLowerCase()];

                    if (code) {
                        if (!processedFullData[code]) {
                            processedFullData[code] = {
                                code: code,
                                name: codeToNameMap[code] || provName, // Prefer Map Name
                                originalName: provName, // Keep original for table filtering fallback
                                count: 0,
                                totalArea: 0
                            };
                        }

                        // Parse Area
                        const area = parseFloat(item.tanah_luas) || 0;
                        processedFullData[code].count += 1;
                        processedFullData[code].totalArea += area;

                        // Map Value (Coloring by Count of Assets)
                        processedMapData[code] = processedFullData[code].count;
                    }
                });

                setMapData(processedMapData);
                setFullData(processedFullData);

            } catch (error) {
                console.error("Gagal mengambil data wakaf:", error);
            } finally {
                setLoadingMap(false);
            }
        };

        fetchMapData();
    }, [selectedYear, nameToCodeMap]); // Re-run when mapping is ready

    // --- SCROLL TO TABLE ---
    const detailSectionRef = useRef(null);
    useEffect(() => {
        if (selectedProvince && detailSectionRef.current) {
            const element = detailSectionRef.current;
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedProvince]);

    // --- HANDLERS ---
    const handleRegionClick = (e, code) => {
        setSelectedProvince(code);
        // Find name for filter
        const data = fullDataRef.current[code];
        if (data) {
            setSelectedProvinceName(data.originalName || data.name);
        } else {
            // Fallback if data missing but region clicked (unlikely with this logic)
            setSelectedProvinceName(codeToNameMap[code]);
        }
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setSelectedProvince(null);
        setSelectedProvinceName(null);
        setCurrentPage(1);
    };

    const handleViewLocation = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

    // --- FILTERED TABLE DATA ---
    const filteredTableData = tableData.filter(item => {
        let match = true;
        // Filter by Province Name (Matches what we aggregated)
        if (selectedProvinceName) {
            // We compare normalized to handle slight variations
            const itemNorm = normalizeName(item.provinsi_nama);
            const selectedNorm = normalizeName(selectedProvinceName);
            // Also check actual code if possible, but item doesn't have code directly. 
            // Name matching is safest given we derived code from name.
            if (itemNorm !== selectedNorm && !item.provinsi_nama.toLowerCase().includes(selectedProvinceName.toLowerCase())) {
                match = false;
            }
        }

        if (match && searchQuery) {
            const query = searchQuery.toLowerCase();
            const text = ((item.nazhir_nama || "") + " " + (item.kabupaten_nama || "") + " " + (item.provinsi_nama || "") + " " + (item.peruntukan_keterangan || "")).toLowerCase();
            if (!text.includes(query)) match = false;
        }
        return match;
    });

    return (
        <React.Fragment>
            {/* --- MAP SECTION --- */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm rounded-3">
                        <CardBody>
                            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                                <div>
                                    <h4 className="card-title mb-1">Sebaran Aset Wakaf Tanah di Indonesia</h4>
                                    <p className="text-muted mb-0 font-size-13">
                                        Data real-time dari server. Klik provinsi untuk detail.
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold text-muted font-size-13">Tahun:</span>
                                    <Input
                                        type="select"
                                        className="form-select-sm"
                                        style={{ width: '100px', fontWeight: 'bold' }}
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        disabled
                                    >
                                        <option value="2025">2025</option>
                                    </Input>
                                </div>
                            </div>

                            <Row>
                                <Col lg={9}>
                                    <div style={{ height: '500px', width: '100%', position: 'relative', background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
                                        {loadingMap ? (
                                            <div className="d-flex justify-content-center align-items-center h-100">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <VectormapZis
                                                key={selectedYear + JSON.stringify(mapData)}
                                                value={mapData}
                                                width="100%"
                                                colorScale={["#e6fffa", "#0f4833"]} // Green Theme
                                                selectedRegions={selectedProvince ? [selectedProvince] : []}
                                                onRegionClick={handleRegionClick}
                                                onRegionTipShow={(e, label, code) => {
                                                    const data = fullDataRef.current[code];
                                                    let details = "<br><hr style='margin:5px 0; border-top:1px solid #fff'>";
                                                    if (data) {
                                                        details += `<b>Total Aset: ${data.count.toLocaleString()}</b><br>`;
                                                        details += `<small>Luas: ${data.totalArea.toLocaleString()} m²</small>`;
                                                    } else {
                                                        details += `<i>Belum ada data</i>`;
                                                    }
                                                    label.html(`
                                                        <div style="text-align:left;">
                                                            <h6 style="margin:0; font-size:14px;">${label.html()}</h6>
                                                            ${details}
                                                        </div>
                                                    `);
                                                }}
                                            />
                                        )}

                                        {/* Simple Legend */}
                                        <div className="bg-white p-2 shadow-sm rounded" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 5, fontSize: '11px', border: '1px solid #eee' }}>
                                            <div className="d-flex align-items-center mb-1"><span style={{ width: 10, height: 10, background: '#e6fffa', border: '1px solid #ccc', marginRight: 5 }}></span> Sedikit</div>
                                            <div className="d-flex align-items-center"><span style={{ width: 10, height: 10, background: '#0f4833', marginRight: 5 }}></span> Banyak</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <Card className="bg-light bg-opacity-50 border-0 h-100">
                                        <CardBody>
                                            <h5 className="font-size-14 text-uppercase text-muted">Statistik Nasional {selectedYear}</h5>
                                            <hr />
                                            <div className="mb-4">
                                                <h6 className="font-size-13">Total Aset Tanah</h6>
                                                <h3 className="fw-bold font-size-22 text-primary">
                                                    {totalApiCount > 0 ? totalApiCount.toLocaleString() : tableData.length.toLocaleString()} Titik
                                                </h3>
                                                <small className="text-muted">Terdata di SIWAK</small>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="font-size-13">Status Data</h6>
                                                <h4 className="fw-bold font-size-16 text-success">
                                                    <i className="bx bx-check-circle me-1"></i> Terkoneksi API
                                                </h4>
                                                <small className="text-muted">Realtime</small>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* --- DETAIL DATA TABLE --- */}
            <Row className="mb-4 fade-in-animation" ref={detailSectionRef}>
                <Col xs={12}>
                    <Card className="border-0 shadow-sm rounded-3">
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div>
                                    <h4 className="card-title mb-1 text-primary">
                                        <i className="bx bx-list-ul me-2"></i>
                                        Daftar Aset Wakaf {selectedProvinceName ? (" - " + selectedProvinceName) : ""}
                                    </h4>
                                    <p className="text-muted mb-0">
                                        Menampilkan {filteredTableData.length} data {selectedProvinceName ? '(Difilter)' : ''}
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Cari Nazhir / Lokasi..."
                                        className="rounded-pill border-1"
                                        style={{ width: '350px' }}
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                    {selectedProvince && (
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={handleResetFilter}
                                            className="rounded-pill"
                                        >
                                            <i className="bx bx-x me-1"></i> Reset Filter
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="table-responsive">
                                <Table hover className="align-middle table-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>No</th>
                                            <th>Nazhir</th>
                                            <th>Lokasi</th>
                                            <th>Luas (m²)</th>
                                            <th>Manfaat</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTableData
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '50px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>
                                                        <h6 className="font-size-13 mb-0 text-truncate" style={{ maxWidth: 200 }} title={item.nazhir_nama}>
                                                            {item.nazhir_nama}
                                                        </h6>
                                                    </td>
                                                    <td>{item.kabupaten_nama || item.provinsi_nama}</td>
                                                    <td>{item.tanah_luas}</td>
                                                    <td>
                                                        <div className="text-truncate" style={{ maxWidth: '250px' }} title={item.peruntukan_keterangan}>
                                                            {item.peruntukan_keterangan || "-"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            color="primary"
                                                            size="sm"
                                                            className="btn-rounded"
                                                            onClick={() => {
                                                                // Convert to modal item format
                                                                const modalItem = {
                                                                    loc: (item.kabupaten_nama || "") + ", " + (item.provinsi_nama || ""),
                                                                    area: item.tanah_luas + " m²",
                                                                    wakif: item.wakif_nama || "-",
                                                                    nazhir: item.nazhir_nama,
                                                                    benefit: item.peruntukan_keterangan,
                                                                    lat: parseFloat(item.latitudes),
                                                                    lng: parseFloat(item.longitudes)
                                                                };
                                                                handleViewLocation(modalItem);
                                                            }}
                                                        >
                                                            <i className="bx bx-map-alt me-1"></i> Lihat
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {filteredTableData.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <div className="text-muted">Tidak ada data ditemukan</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {/* PAGINATION */}
                            {filteredTableData.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="text-muted font-size-13">
                                        Halaman <b>{currentPage}</b> dari <b>{Math.ceil(filteredTableData.length / itemsPerPage)}</b>
                                    </span>
                                    <ul className="pagination pagination-rounded mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''} `}>
                                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                                <i className="mdi mdi-chevron-left" />
                                            </button>
                                        </li>
                                        <li className={`page-item ${currentPage >= Math.ceil(filteredTableData.length / itemsPerPage) ? 'disabled' : ''} `}>
                                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTableData.length / itemsPerPage)))}>
                                                <i className="mdi mdi-chevron-right" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* --- LOCATION MODAL --- */}
            <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} size="lg" centered>
                <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
                    Detail Aset Wakaf
                </ModalHeader>
                <ModalBody>
                    {modalData && (
                        <Row>
                            <Col md={5}>
                                <div className="mb-3 border-bottom pb-2">
                                    <h6 className="font-size-11 text-muted text-uppercase mb-1">Lokasi</h6>
                                    <p className="fw-bold mb-0 text-dark">{modalData.loc}</p>
                                </div>
                                <div className="mb-3 border-bottom pb-2">
                                    <h6 className="font-size-11 text-muted text-uppercase mb-1">Luas Tanah</h6>
                                    <p className="fw-bold mb-0 text-dark">{modalData.area}</p>
                                </div>
                                <div className="mb-3 border-bottom pb-2">
                                    <h6 className="font-size-11 text-muted text-uppercase mb-1">Nazhir (Pengelola)</h6>
                                    <p className="fw-bold mb-0 text-dark">{modalData.nazhir}</p>
                                </div>
                                <div className="mb-3">
                                    <h6 className="font-size-11 text-muted text-uppercase mb-1">Peruntukan</h6>
                                    <span className="badge bg-success bg-opacity-10 text-success p-2" style={{ whiteSpace: 'normal', textAlign: 'left' }}>
                                        {modalData.benefit || "Tidak disebutkan"}
                                    </span>
                                </div>
                            </Col>
                            <Col md={7}>
                                <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                    {(!isNaN(modalData.lat) && !isNaN(modalData.lng) && modalData.lat !== 0) ? (
                                        <MapContainer
                                            center={[modalData.lat, modalData.lng]}
                                            zoom={15}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; OpenStreetMap'
                                            />
                                            <Marker position={[modalData.lat, modalData.lng]}>
                                                <Popup>
                                                    Point Location
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center h-100 bg-light text-muted">
                                            <div className="text-center">
                                                <i className="bx bx-map-off font-size-24 mb-2"></i><br />
                                                Koordinat tidak tersedia
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default WakafDistributionMap;
