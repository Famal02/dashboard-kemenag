import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Col, Row, Table, Modal, ModalHeader, ModalBody, Input } from "reactstrap";
// Keep Leaflet Only for Modal Detail
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import VectorMap
import PetaIndonesia from "../ZIS/PetaIndonesia";
import { idnMerc } from "@react-jvectormap/indonesia";


import SkeletonLoader from "../../components/Common/SkeletonLoader";

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

const PetaSebaranWakaf = ({ globalFilterYear, allData = [], isLoading = false }) => {
    const selectedYear = globalFilterYear !== undefined ? globalFilterYear : "all";
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

    // --- PROCESS DATA FROM PROPS ---
    useEffect(() => {
        // Wait for mapping or data
        if (Object.keys(nameToCodeMap).length === 0 || isLoading) return;

        // If no data yet
        if (!allData || allData.length === 0) {
            setTableData([]);
            setMapData({});
            setFullData({});
            return;
        }

        // --- 1. APPLY YEAR FILTER ---
        let filteredItems = allData;
        if (selectedYear !== "all") {
            filteredItems = allData.filter(item => String(item._year) === String(selectedYear));
        }

        // --- 2. UPDATE STATES (Table) ---
        setTableData(filteredItems);

        // --- 3. AGGREGATE MAP DATA (Using Filtered Items) ---
        const processedMapData = {};
        const processedFullData = {};

        filteredItems.forEach(item => {
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

    }, [selectedYear, nameToCodeMap, allData, isLoading]);

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

    // --- FILTERED TABLE DATA (OPTIMIZED) ---
    const filteredTableData = React.useMemo(() => {
        return tableData.filter(item => {
            let match = true;
            // Filter by Province Name
            if (selectedProvinceName) {
                const itemNorm = normalizeName(item.provinsi_nama);
                const selectedNorm = normalizeName(selectedProvinceName);
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
    }, [tableData, selectedProvinceName, searchQuery]);

    return (
        <>
            {/* --- MAP SECTION --- */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="kemenag-table-card kemenag-card-interactive">
                        <CardBody>
                            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                                <div>
                                    <h4 className="kemenag-title" style={{ color: '#375673' }}>Sebaran Aset Wakaf Tanah di Indonesia</h4>
                                    <p className="text-muted mb-0">
                                        Menampilkan data {selectedYear === "all" ? "Semua Tahun" : `Tahun ${selectedYear}`}
                                    </p>
                                </div>

                            </div>

                            <Row>
                                <Col lg={9}>
                                    <div style={{ height: '500px', width: '100%', position: 'relative', background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
                                        {isLoading ? (
                                            <SkeletonLoader type="map" height="500px" />
                                        ) : (
                                            <PetaIndonesia
                                                key={selectedYear + JSON.stringify(mapData)}
                                                value={mapData}
                                                width="100%"
                                                colorScale={["#f0eee9", "#375673"]} // Kemenag Theme
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

                                        {/* Legend */}
                                        <div className="kemenag-map-legend">
                                            <div className="kemenag-map-legend-item" style={{ color: '#d5cd94' }}>
                                                <span className="kemenag-map-legend-color" style={{ background: '#f0eee9' }}></span>
                                                Sedikit
                                            </div>
                                            <div className="kemenag-map-legend-item" style={{ color: '#d5cd94' }}>
                                                <span className="kemenag-map-legend-color" style={{ background: '#375673' }}></span>
                                                Banyak
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <Card className="kemenag-stats-card">
                                        <CardBody>
                                            <h5 className="font-size-14 text-uppercase mb-3" style={{ color: '#375673' }}>Statistik Data Nasional</h5>
                                            <hr />
                                            <div className="mb-4">
                                                <h6 className="font-size-13" style={{ color: '#375673' }}>Total Aset Tanah</h6>
                                                <h3 className="fw-bold font-size-22" style={{ color: '#375673' }}>
                                                    {tableData.length.toLocaleString()} Titik
                                                </h3>
                                                <small style={{ color: '#375673' }}>Terdata di SIWAK</small>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="font-size-13" style={{ color: '#375673' }}>Status Data</h6>
                                                <h4 className="fw-bold font-size-16" style={{ color: '#375673' }}>
                                                    <i className="bx bx-check-circle me-1" style={{ color: '#375673' }}></i> Realtime
                                                </h4>
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
            <div ref={detailSectionRef}>
                <Row className="mb-4 fade-in-animation">
                    <Col xs={12}>
                        <Card className="kemenag-table-card kemenag-card-interactive">
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
                                            className="kemenag-search-input"
                                            style={{ width: '350px' }}
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        {selectedProvince && (
                                            <button
                                                onClick={handleResetFilter}
                                                className="kemenag-btn-secondary"
                                            >
                                                <i className="bx bx-x me-1"></i> Reset Filter
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="py-4">
                                        <SkeletonLoader type="table-rows" count={5} />
                                    </div>
                                ) : (
                                    <div className="kemenag-table-responsive">
                                        <Table className="kemenag-table-clean align-middle table-nowrap mb-0">
                                            <thead>
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
                                                            <td style={{ width: '50px' }} className="kemenag-col-no">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                            <td>
                                                                <span className="kemenag-col-bold d-block text-truncate" style={{ maxWidth: 200 }} title={item.nazhir_nama}>
                                                                    {item.nazhir_nama}
                                                                </span>
                                                            </td>
                                                            <td>{item.kabupaten_nama || item.provinsi_nama}</td>
                                                            <td>{item.tanah_luas}</td>
                                                            <td>
                                                                <div className="text-truncate" style={{ maxWidth: '250px' }} title={item.peruntukan_keterangan}>
                                                                    {item.peruntukan_keterangan || "-"}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn-action-view"
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
                                                                    <i className="bx bx-show font-size-16"></i> Detail
                                                                </button>
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
                                )}

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
            </div>

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
        </>
    );
};

export default PetaSebaranWakaf;
