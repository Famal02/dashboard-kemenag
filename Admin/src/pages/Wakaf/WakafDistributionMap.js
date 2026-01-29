import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, CardBody, Input, Badge, Table, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import Vectormap from "../../pages/Maps/Vectormap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { get } from "../../helpers/api_helper";
import { GET_WAKAF_MAP_DATA, GET_WAKAF_DETAILS } from "../../helpers/url_helper";

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

// --- MOCK DATA FOR MAP KEYS ONLY (To map API response to Map IDs) ---
const PROVINCE_KEYS = {
    "ID-AC": "Aceh", "ID-SU": "Sumatera Utara", "ID-SB": "Sumatera Barat", "ID-RI": "Riau", "ID-JA": "Jambi",
    "ID-SS": "Sumatera Selatan", "ID-BE": "Bengkulu", "ID-LA": "Lampung", "ID-BB": "Kep. Bangka Belitung", "ID-KR": "Kepulauan Riau",
    "ID-JK": "DKI Jakarta", "ID-JB": "Jawa Barat", "ID-JT": "Jawa Tengah", "ID-YO": "DI Yogyakarta", "ID-JI": "Jawa Timur", "ID-BT": "Banten",
    "ID-BA": "Bali", "ID-NB": "Nusa Tenggara Barat", "ID-NT": "Nusa Tenggara Timur", "ID-KB": "Kalimantan Barat",
    "ID-KT": "Kalimantan Tengah", "ID-KS": "Kalimantan Selatan", "ID-KI": "Kalimantan Timur", "ID-KU": "Kalimantan Utara",
    "ID-SA": "Sulawesi Utara", "ID-ST": "Sulawesi Tengah", "ID-SN": "Sulawesi Selatan", "ID-SG": "Sulawesi Tenggara",
    "ID-GO": "Gorontalo", "ID-SR": "Sulawesi Barat", "ID-MA": "Maluku", "ID-MU": "Maluku Utara", "ID-PB": "Papua Barat",
    "ID-PA": "Papua"
};

const WakafDistributionMap = () => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // API State
    const [mapData, setMapData] = useState({});
    const [loadingMap, setLoadingMap] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // --- FETCH MAP DATA ---
    useEffect(() => {
        const fetchMapData = async () => {
            setLoadingMap(true);
            try {
                // Call API: /api/wakaf/distribution?year=2025
                const response = await get(`${GET_WAKAF_MAP_DATA}?year=${selectedYear}`);
                setMapData(response.data || {});
            } catch (error) {
                console.error("Gagal mengambil data peta:", error);
                // Fallback / Silent fail for now
                setMapData({});
            } finally {
                setLoadingMap(false);
            }
        };

        fetchMapData();
    }, [selectedYear]);

    // --- AUTO SCROLL TO DETAIL ---
    const detailSectionRef = useRef(null);

    useEffect(() => {
        if (selectedProvince && detailSectionRef.current) {
            setTimeout(() => {
                // Scroll agar title pas di bawah header (asumsi header ~70px)
                const yOffset = -70;
                const element = detailSectionRef.current;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 100);
        }
    }, [selectedProvince]);

    // Handlers
    const handleRegionClick = async (e, code) => {
        const name = PROVINCE_KEYS[code] || code;
        const count = mapData[code] || 0;

        // 1. Set Header langsung (optimistic UI)
        setSelectedProvince({ code, name, count });
        setTableData([]); // Reset table
        setLoadingDetail(true);

        // 2. Fetch Detail Data API
        try {
            // Call API: /api/wakaf/details/ID-JB?year=2025
            const response = await get(`${GET_WAKAF_DETAILS}/${code}?year=${selectedYear}`);
            setTableData(response.data || []);
        } catch (error) {
            console.error("Gagal mengambil detail provinsi:", error);
            setTableData([]); // Empty on error
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleRegionTipShow = (e, label, code) => {
        const count = mapData[code] || 0;
        label.html(`${label.html()} <br> Aset Wakaf: ${count} Unit`);
    };

    const handleViewLocation = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

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
                                        onChange={(e) => {
                                            setSelectedYear(e.target.value);
                                            setSelectedProvince(null);
                                        }}
                                    >
                                        {[2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </Input>
                                </div>
                            </div>

                            <Row>
                                <Col lg={9}>
                                    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                                        {loadingMap && (
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                                                Loading Peta...
                                            </div>
                                        )}
                                        <Vectormap
                                            value={mapData}
                                            width="100%"
                                            color="#34c38f" // Green Theme
                                            onRegionClick={handleRegionClick}
                                            onRegionTipShow={handleRegionTipShow}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center mt-3 gap-3 justify-content-center">
                                        <div className="d-flex align-items-center font-size-12">
                                            <span style={{ width: 12, height: 12, backgroundColor: '#c5eadd', marginRight: 5, borderRadius: 2 }}></span>
                                            Sedikit
                                        </div>
                                        <div className="d-flex align-items-center font-size-12">
                                            <span style={{ width: 12, height: 12, backgroundColor: '#34c38f', marginRight: 5, borderRadius: 2 }}></span>
                                            Menengah
                                        </div>
                                        <div className="d-flex align-items-center font-size-12">
                                            <span style={{ width: 12, height: 12, backgroundColor: '#0f4833', marginRight: 5, borderRadius: 2 }}></span>
                                            Banyak
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
                                                    {(Object.values(mapData).reduce((a, b) => a + b, 0)).toLocaleString()} Unit
                                                </h3>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="font-size-13">Status Data</h6>
                                                <h4 className="fw-bold font-size-16">
                                                    {loadingMap ? "Memuat..." : "Terkoneksi API"}
                                                </h4>
                                                <small className="text-muted">Realtime</small>
                                            </div>
                                            <div className="alert alert-info font-size-12 mb-0">
                                                <i className="bx bx-info-circle me-1"></i>
                                                Arahkan kursor ke peta untuk melihat detail per provinsi.
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* --- DETAIL PROVINCE SECTION (Shows on Click) --- */}
            {selectedProvince && (
                <Row className="mb-4 fade-in-animation" ref={detailSectionRef}>
                    <Col xs={12}>
                        <Card className="border-0 shadow-sm rounded-3">
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                    <div>
                                        <h4 className="card-title mb-1 text-primary">
                                            <i className="bx bx-map-pin me-2"></i>
                                            Detail Aset Wakaf Tanah: {selectedProvince.name}
                                        </h4>
                                        <p className="text-muted mb-0">Tahun {selectedYear} • {selectedProvince.count} Aset Terdata</p>
                                    </div>
                                    <Button
                                        color="light"
                                        size="sm"
                                        onClick={() => setSelectedProvince(null)}
                                        className="rounded-pill"
                                    >
                                        <i className="bx bx-x me-1"></i> Tutup Detail
                                    </Button>
                                </div>

                                <Row className="mb-4">
                                    <Col md={12}>
                                        <h5 className="font-size-14 mb-3 fw-bold">Daftar Aset Wakaf</h5>
                                        {loadingDetail ? (
                                            <div className="text-center p-4">Loading Data Detail...</div>
                                        ) : (
                                            <div className="table-responsive">
                                                <Table hover className="align-middle table-nowrap mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Lokasi</th>
                                                            <th>Luas</th>
                                                            <th>Wakif</th>
                                                            <th>Nazhir</th>
                                                            <th>Manfaat</th>
                                                            <th>Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.length > 0 ? tableData.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <h6 className="font-size-13 mb-0 text-truncate" style={{ maxWidth: 200 }} title={item.loc}>{item.loc}</h6>
                                                                </td>
                                                                <td>{item.area}</td>
                                                                <td>{item.wakif}</td>
                                                                <td>{item.nazhir}</td>
                                                                <td>
                                                                    <Badge color="primary" className="bg-opacity-25 text-primary">
                                                                        {item.benefit}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        color="primary"
                                                                        size="sm"
                                                                        className="btn-rounded"
                                                                        onClick={() => handleViewLocation(item)}
                                                                    >
                                                                        <i className="bx bx-map-alt me-1"></i> Lihat Lokasi
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )) : (
                                                            <tr>
                                                                <td colSpan="6" className="text-center py-4">
                                                                    Tidak ada data aset untuk provinsi ini.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* --- LOCATION MODAL --- */}
            <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} size="lg" centered>
                <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
                    Lokasi Aset Wakaf
                </ModalHeader>
                <ModalBody>
                    {modalData && (
                        <Row>
                            <Col md={4}>
                                <div className="mb-3">
                                    <h6 className="font-size-12 text-muted text-uppercase">Lokasi</h6>
                                    <p className="fw-bold">{modalData.loc}</p>
                                </div>
                                <div className="mb-3">
                                    <h6 className="font-size-12 text-muted text-uppercase">Luas</h6>
                                    <p className="fw-bold">{modalData.area}</p>
                                </div>
                                <div className="mb-3">
                                    <h6 className="font-size-12 text-muted text-uppercase">Peruntukan</h6>
                                    <p>{modalData.benefit}</p>
                                </div>
                                <div>
                                    <h6 className="font-size-12 text-muted text-uppercase">Pengelola</h6>
                                    <p className="mb-0">{modalData.nazhir}</p>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div style={{ height: '350px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <MapContainer
                                        center={[modalData.lat || -6.2, modalData.lng || 106.8]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[modalData.lat || -6.2, modalData.lng || 106.8]}>
                                            <Popup>
                                                <b>Aset Wakaf</b><br />{modalData.loc}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
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
