import React, { useMemo, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Button, Table, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const WakafProvinceDetail = () => {
    const { provinceCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // State received from navigation (uploaded data)
    const { provinceName, year, data } = location.state || {}; // data is array of items for this province

    // Mock Data Generator if no data passed (Direct Access fallback)
    const fallbackData = useMemo(() => {
        if (data && data.length > 0) return data;

        // Generate Dummy
        return Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            loc: `Kab. ${provinceName || provinceCode} Pusat, Kec. Raya ${i + 1}`,
            area: `${Math.floor(Math.random() * 5000) + 500} m²`,
            wakif: `H. Fulan ${String.fromCharCode(65 + i)}`,
            nazhir: `Yayasan Amanah Lokal`,
            benefit: "Sarana Ibadah",
            lat: -6.2000 + (Math.random() - 0.5),
            lng: 106.8166 + (Math.random() - 0.5)
        }));
    }, [data, provinceName, provinceCode]);

    const displayData = data || fallbackData;

    // Stats
    const totalArea = displayData.reduce((acc, curr) => acc + (parseInt(curr.area) || 0), 0);
    const totalAsset = displayData.length;

    // Modal
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewLocation = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Detail Wilayah" breadcrumbItem={provinceName || provinceCode} />

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button color="light" onClick={() => navigate(-1)} className="rounded-pill">
                            <i className="bx bx-arrow-back me-1"></i> Kembali ke Peta
                        </Button>
                        <span className="badge bg-primary font-size-14 p-2">Tahun Data: {year || "2025"}</span>
                    </div>

                    <Row>
                        <Col xl={12}>
                            <Card className="border-0 shadow-sm rounded-3">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="avatar-md bg-soft-primary rounded-circle text-primary text-center pt-2 me-3">
                                            <i className="bx bx-map font-size-24"></i>
                                        </div>
                                        <div>
                                            <h4 className="card-title mb-1">Provinsi {provinceName || provinceCode}</h4>
                                            <p className="text-muted mb-0">Total {totalAsset} Aset Wakaf Terdata</p>
                                        </div>
                                    </div>

                                    <Row className="mb-4">
                                        <Col md={3}>
                                            <Card className="bg-light border-0 mb-3">
                                                <CardBody className="p-3">
                                                    <h6 className="text-muted text-uppercase font-size-12">Total Aset</h6>
                                                    <h3 className="mb-0 fw-bold">{totalAsset} <span className="font-size-14 font-weight-normal text-muted">Unit</span></h3>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md={3}>
                                            <Card className="bg-light border-0 mb-3">
                                                <CardBody className="p-3">
                                                    <h6 className="text-muted text-uppercase font-size-12">Estimasi Luas</h6>
                                                    <h3 className="mb-0 fw-bold">{totalArea > 0 ? totalArea.toLocaleString() : "12.500"} <span className="font-size-14 font-weight-normal text-muted">m²</span></h3>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <h5 className="font-size-15 mb-3">Daftar Aset Wakaf Tanah</h5>
                                    <div className="table-responsive">
                                        <Table hover className="align-middle table-nowrap mb-0 table-check">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>No</th>
                                                    <th>Lokasi Aset</th>
                                                    <th>Luas</th>
                                                    <th>Wakif</th>
                                                    <th>Nazhir</th>
                                                    <th>Peruntukan</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <h6 className="font-size-13 mb-0 text-truncate" style={{ maxWidth: 250 }} title={item.loc}>{item.loc}</h6>
                                                        </td>
                                                        <td>{item.area}</td>
                                                        <td>{item.wakif}</td>
                                                        <td>{item.nazhir}</td>
                                                        <td>
                                                            <Badge color="info" className="bg-opacity-10 text-info font-size-12">{item.benefit}</Badge>
                                                        </td>
                                                        <td>
                                                            <Button color="primary" size="sm" className="btn-rounded" onClick={() => handleViewLocation(item)}>
                                                                <i className="bx bx-map-alt me-1"></i> Lihat Peta
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {displayData.length === 0 && (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-4 text-muted">Belum ada data detail untuk wilayah ini.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

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
                                    <h6 className="font-size-12 text-muted text-uppercase">Nazhir</h6>
                                    <p className="fw-bold">{modalData.nazhir}</p>
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
                                            attribution='&copy; OpenStreetMap contributors'
                                        />
                                        <Marker position={[modalData.lat || -6.2, modalData.lng || 106.8]}>
                                            <Popup>{modalData.loc}</Popup>
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

export default WakafProvinceDetail;
