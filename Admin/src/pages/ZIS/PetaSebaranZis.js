
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Row, Col, Table, Input, Button } from "reactstrap";
// Import Vector Map
import PetaIndonesia from "./PetaIndonesia";
import axios from 'axios';
import { GET_PENERIMAAN_PROVINSI, GET_PENYALURAN_PROVINSI } from "../../helpers/url_helper";
import { idnMerc } from "@react-jvectormap/indonesia";
import SkeletonLoader from "../../components/Common/SkeletonLoader";

// --- MAPPING HELPERS ---
const STATIC_ALIASES = {
    "aceh": "ID-AC", "nanggroe aceh darussalam": "ID-AC", "nad": "ID-AC", "sumatera utara": "ID-SU", "sumut": "ID-SU",
    "sumatera barat": "ID-SB", "sumbar": "ID-SB", "riau": "ID-RI", "kepulauan riau": "ID-KR", "jambi": "ID-JA",
    "sumatera selatan": "ID-SS", "sumsel": "ID-SS", "bengkulu": "ID-BE", "lampung": "ID-LA", "kepulauan bangka belitung": "ID-BB", "babel": "ID-BB",
    "dki jakarta": "ID-JK", "jakarta": "ID-JK", "jawa barat": "ID-JB", "jabar": "ID-JB", "jawa tengah": "ID-JT", "jateng": "ID-JT",
    "di yogyakarta": "ID-YO", "diy": "ID-YO", "jogja": "ID-YO", "jawa timur": "ID-JI", "jatim": "ID-JI", "banten": "ID-BT", "bali": "ID-BA",
    "nusa tenggara barat": "ID-NB", "ntb": "ID-NB", "nusa tenggara timur": "ID-NT", "ntt": "ID-NT", "kalimantan barat": "ID-KB", "kalbar": "ID-KB",
    "kalimantan tengah": "ID-KT", "kalteng": "ID-KT", "kalimantan selatan": "ID-KS", "kalsel": "ID-KS", "kalimantan timur": "ID-KI", "kaltim": "ID-KI",
    "kalimantan utara": "ID-KU", "kaltara": "ID-KU", "sulawesi utara": "ID-SA", "sulut": "ID-SA", "sulawesi tengah": "ID-ST", "sulteng": "ID-ST",
    "sulawesi selatan": "ID-SG", "sulsel": "ID-SG", "sulawesi tenggara": "ID-SE", "sultra": "ID-SE", "gorontalo": "ID-GO", "sulawesi barat": "ID-SR",
    "sulbar": "ID-SR", "maluku": "ID-MA", "maluku utara": "ID-MU", "malut": "ID-MU", "papua barat": "ID-PB", "pabar": "ID-PB", "papua": "ID-PA",
    "papua selatan": "ID-PA", "papua tengah": "ID-PA", "papua pegunungan": "ID-PA", "papua barat daya": "ID-PB"
};

const normalizeName = (name) => {
    if (!name) return "";
    return name.toString().toLowerCase().replace("provinsi", "").replace("daerah istimewa", "").replace("d.i.", "").replace("kepulauan", "").trim();
};

const PetaSebaranZis = () => {
    const [activeTab, setActiveTab] = useState("collection");
    const [loading, setLoading] = useState(true);
    const [mapValues, setMapValues] = useState({});
    const [tableData, setTableData] = useState([]);

    // Original Full Data for Stats
    const [statsData, setStatsData] = useState({ collTotal: 0, distTotal: 0 });

    const [nameToCodeMap, setNameToCodeMap] = useState({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedRegionName, setSelectedRegionName] = useState(null);
    const fullDataRef = useRef({});
    const sectionRef = useRef(null);

    // Filter & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const map = { ...STATIC_ALIASES };
        try {
            const paths = idnMerc.paths || idnMerc.content?.paths || {};
            Object.entries(paths).forEach(([code, details]) => {
                map[normalizeName(details.name)] = code;
                map[details.name.toLowerCase()] = code;
            });
            setNameToCodeMap(map);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const ts = new Date().getTime();
                const [resRecv, resDist] = await Promise.all([
                    axios.get(`${GET_PENERIMAAN_PROVINSI}?_=${ts}`, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } }),
                    axios.get(`${GET_PENYALURAN_PROVINSI}?_=${ts}`, { headers: { "x-api-key": "prod-b533376f-f659-42c3-af49-92b03d468cf1" } })
                ]);

                const recItems = resRecv.data?.data?.items || [];
                const distItems = resDist.data?.data?.items || [];

                const combined = {};
                const nextFullData = {};

                const getCode = (name) => {
                    if (!name) return null;
                    return nameToCodeMap[normalizeName(name)] || nameToCodeMap[name.toLowerCase()];
                };

                let totalC = 0;
                let totalD = 0;

                recItems.forEach(item => {
                    const name = item.provinsi || item.nama_provinsi;
                    const code = getCode(name);
                    const val = item.total_penerimaan || (item.total_zakat_perorangan || 0) + (item.total_zakat_badan || 0) + (item.zakat_fitrah || 0) + (item.total_infak_penyaluran || 0);
                    if (!combined[name]) combined[name] = { name, code, coll: 0, dist: 0 };
                    combined[name].coll = val;
                    totalC += val;
                    if (code) {
                        if (!nextFullData[code]) nextFullData[code] = { name, coll: 0, dist: 0 };
                        nextFullData[code].coll = val;
                    }
                });

                distItems.forEach(item => {
                    const name = item.provinsi || item.nama_provinsi;
                    const code = getCode(name);
                    const val = item.total_penyaluran || (item.total_asnaf_fakir || 0) + (item.total_asnaf_miskin || 0) + (item.total_asnaf_amil || 0);
                    if (!combined[name]) combined[name] = { name, code, coll: 0, dist: 0 };
                    combined[name].dist = val;
                    totalD += val;
                    if (code) {
                        if (!nextFullData[code]) nextFullData[code] = { name, coll: 0, dist: 0 };
                        nextFullData[code].dist = val;
                    }
                });

                const finalTable = Object.values(combined);

                // --- SORTING DINAMIS BERDASARKAN TAB ---
                if (activeTab === 'collection') finalTable.sort((a, b) => b.coll - a.coll);
                else finalTable.sort((a, b) => b.dist - a.dist);

                setTableData(finalTable);
                setStatsData({ collTotal: totalC, distTotal: totalD });
                fullDataRef.current = nextFullData;

                // --- STRICT MAP COLORING ---
                const nextMapVals = {};
                Object.keys(nextFullData).forEach(code => {
                    const val = activeTab === 'collection' ? nextFullData[code].coll : nextFullData[code].dist;
                    if (val > 0) nextMapVals[code] = val / 1000000000;
                });
                setMapValues(nextMapVals);
                setLoading(false);

            } catch (e) { console.error(e); setLoading(false); }
        };
        if (Object.keys(nameToCodeMap).length > 0) fetchData();
    }, [activeTab, nameToCodeMap]);

    useEffect(() => {
        if (selectedRegion && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedRegion]);

    const handleRegionClick = (e, code) => {
        setSelectedRegion(code);
        const d = fullDataRef.current[code];
        if (d) setSelectedRegionName(d.name);
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setSelectedRegion(null);
        setSelectedRegionName(null);
        setCurrentPage(1);
    };

    const formatCurrency = (val) => {
        if (!val) return "Rp 0";
        if (val >= 1e12) return "Rp " + (val / 1e12).toFixed(2).replace('.', ',') + " T";
        if (val >= 1e9) return "Rp " + (val / 1e9).toFixed(2).replace('.', ',') + " M";
        if (val >= 1e6) return "Rp " + (val / 1e6).toFixed(2).replace('.', ',') + " Jt";
        return "Rp " + val.toLocaleString('id-ID');
    };

    const filteredData = tableData.filter(item => {
        let match = true;
        if (selectedRegion && item.code !== selectedRegion) match = false;
        if (searchQuery) {
            if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) match = false;
        }
        return match;
    });

    // --- COLORS (KEMENAG) ---
    const ACTIVE_COLOR = "#375673";
    const DIST_COLOR = "#c0392b";

    return (
        <React.Fragment>
            <style>{`
                .kemenag-btn-tab {
                    border: 1px solid #ced4da; padding: 6px 20px; font-weight: 600; font-size: 13px;
                    background: white; color: #d5cd94; transition: all 0.3s;
                }
                .kemenag-btn-tab.active-coll {
                    background: ${ACTIVE_COLOR} !important; color: #d5cd94 !important; border-color: ${ACTIVE_COLOR} !important;
                }
                .kemenag-btn-tab.active-dist {
                    background: ${DIST_COLOR} !important; color: #d5cd94 !important; border-color: ${DIST_COLOR} !important;
                }
                .kemenag-header-title { color: #375673 !important; font-weight: 700; transition: color 0.3s; }
             `}</style>

            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="kemenag-card kemenag-hover-card">
                        <CardBody>
                            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                                <div>
                                    <h4 className="mb-1 kemenag-header-title" style={{ fontSize: 20 }}>Peta Sebaran {activeTab === 'collection' ? 'Penerimaan' : 'Penyaluran'} ZIS</h4>
                                </div>
                                <div className="btn-group">
                                    <button
                                        className={`kemenag-btn-tab ${activeTab === 'collection' ? 'active-coll' : ''}`}
                                        onClick={() => setActiveTab('collection')}
                                        style={{ borderRadius: '20px 0 0 20px' }}
                                    >Pengumpulan</button>
                                    <button
                                        className={`kemenag-btn-tab ${activeTab === 'distribution' ? 'active-dist' : ''}`}
                                        onClick={() => setActiveTab('distribution')}
                                        style={{ borderRadius: '0 20px 20px 0' }}
                                    >Penyaluran</button>
                                </div>
                            </div>

                            <Row>
                                <Col lg={9}>
                                    {loading ? (
                                        <SkeletonLoader type="map" height="500px" />
                                    ) : (
                                        <div style={{ height: '500px', width: '100%', position: 'relative', background: activeTab === 'collection' ? '#e0f2f1' : '#ffebee', borderRadius: '8px', overflow: 'hidden', transition: 'background 0.5s' }}>
                                            <PetaIndonesia
                                                value={mapValues}
                                                onRegionClick={handleRegionClick}
                                                selectedRegions={selectedRegion ? [selectedRegion] : []}
                                                colorScale={activeTab === 'collection' ? ["#e0f2f1", ACTIVE_COLOR] : ["#ffebee", DIST_COLOR]}
                                                onRegionTipShow={(e, label, code) => {
                                                    const d = fullDataRef.current[code];
                                                    if (d) {
                                                        label.html(`
                                                            <div style="color: #d5cd94; text-align: left;">
                                                                <b style="font-size: 14px;">${d.name}</b><br/>
                                                                <span style="font-size: 12px;">In: ${formatCurrency(d.coll)}</span><br/>
                                                                <span style="font-size: 12px;">Out: ${formatCurrency(d.dist)}</span>
                                                            </div>
                                                        `);
                                                    }
                                                }}
                                            />
                                            <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(255,255,255,0.95)', padding: '8px 12px', borderRadius: 8, fontSize: 11, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                <div className="d-flex align-items-center mb-1">
                                                    <div style={{ width: 12, height: 12, background: activeTab === 'collection' ? '#e0f2f1' : '#ffebee', marginRight: 6, borderRadius: 2, border: '1px solid #ddd' }}></div>
                                                    <small className="me-3" style={{ color: '#d5cd94' }}>Ada Data</small>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div style={{ width: 12, height: 12, background: '#d1d1d1', marginRight: 6, borderRadius: 2 }}></div>
                                                    <small style={{ color: '#d5cd94' }}>Tidak Ada (0)</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Col>
                                <Col lg={3}>
                                    <Card className="h-100 border bg-light shadow-none kemenag-hover-card-border-left" style={{ borderLeft: `5px solid ${activeTab === 'collection' ? ACTIVE_COLOR : DIST_COLOR} !important` }}>
                                        <CardBody>
                                            <h5 className="font-size-13 text-uppercase mb-3" style={{ letterSpacing: 1, color: '#375673' }}>Statistik Nasional</h5>
                                            <hr className="my-3" />
                                            <div className="mb-4">
                                                <h6 className="font-size-12" style={{ color: '#375673' }}>Total {activeTab === 'collection' ? 'Penerimaan' : 'Penyaluran'}</h6>
                                                <h3 className="fw-bold font-size-20 mb-0" style={{ color: '#375673' }}>
                                                    {formatCurrency(activeTab === 'collection' ? statsData.collTotal : statsData.distTotal)}
                                                </h3>
                                            </div>
                                            <div>
                                                <h6 className="font-size-12" style={{ color: '#375673' }}>Wilayah Terdata</h6>
                                                <h4 className="fw-bold font-size-18 mb-0" style={{ color: ' #375673' }}>{tableData.length} Provinsi</h4>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <div ref={sectionRef}>
                <Row className="mb-4">
                    <Col xs={12}>
                        <Card className="kemenag-table-card kemenag-card-interactive">
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                    <div>
                                        <h4 className="card-title mb-1 kemenag-header-title" style={{ fontSize: 18 }}>
                                            <i className="bx bx-list-ul me-2"></i>
                                            Rincian {activeTab === 'collection' ? 'Penerimaan' : 'Penyaluran'} {selectedRegionName ? ` - ${selectedRegionName}` : ""}
                                        </h4>
                                        <p className="text-muted mb-0 font-size-13">
                                            Menampilkan {filteredData.length} data {selectedRegion ? '(Difilter)' : ''}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Cari Provinsi..."
                                            className="form-control-sm"
                                            style={{ width: '250px', borderRadius: 20 }}
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        />
                                        {selectedRegion && (
                                            <button onClick={handleResetFilter} className="btn btn-sm btn-light rounded-pill border">
                                                <i className="bx bx-x me-1"></i> Reset
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="py-4">
                                        <SkeletonLoader type="table-rows" count={5} />
                                    </div>
                                ) : (
                                    <div className="kemenag-table-responsive">
                                        <Table className="kemenag-table-clean align-middle table-nowrap mb-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 50 }}>No</th>
                                                    <th>Provinsi</th>
                                                    {/* CONDITIONAL HEADER */}
                                                    {activeTab === 'collection' && <th className="text-end">Total Pengumpulan</th>}
                                                    {activeTab === 'distribution' && <th className="text-end">Total Penyaluran</th>}
                                                    <th className="text-end" style={{ width: '150px' }}>Persentase</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData
                                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                    .map((row, idx) => {
                                                        const realIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                                                        const total = activeTab === 'collection' ? statsData.collTotal : statsData.distTotal;
                                                        const val = activeTab === 'collection' ? row.coll : row.dist;
                                                        const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                                                        const color = activeTab === 'collection' ? "#34c38f" : "#f1b44c"; // Green vs Warning

                                                        return (
                                                            <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => handleRegionClick(null, row.code)}>
                                                                <td className="kemenag-col-no">{realIdx}</td>
                                                                <td>
                                                                    <span className="kemenag-col-bold">{row.name}</span>
                                                                </td>

                                                                {/* CONDITIONAL BODY */}
                                                                {activeTab === 'collection' && (
                                                                    <td className="text-end">
                                                                        <span className="badge bg-soft-primary text-primary font-size-12 px-2 py-1">
                                                                            {formatCurrency(row.coll)}
                                                                        </span>
                                                                    </td>
                                                                )}
                                                                {activeTab === 'distribution' && (
                                                                    <td className="text-end">
                                                                        <span className="badge bg-soft-warning text-warning font-size-12 px-2 py-1">
                                                                            {formatCurrency(row.dist)}
                                                                        </span>
                                                                    </td>
                                                                )}

                                                                <td className="text-end">
                                                                    <div className="d-flex align-items-center justify-content-end">
                                                                        <span className="me-2 font-size-13">{percentage}%</span>
                                                                        <div className="progress" style={{ width: '60px', height: '6px' }}>
                                                                            <div
                                                                                className="progress-bar"
                                                                                role="progressbar"
                                                                                style={{ width: `${percentage}%`, backgroundColor: color }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                {filteredData.length === 0 && <tr><td colSpan="4" className="text-center py-4">Tidak ada data</td></tr>}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                {filteredData.length > 0 && (
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="text-muted font-size-13">
                                            Halaman <b>{currentPage}</b> dari <b>{Math.ceil(filteredData.length / itemsPerPage)}</b>
                                        </span>
                                        <ul className="pagination pagination-rounded mb-0 pagination-sm">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><i className="bx bx-chevron-left"></i></button>
                                            </li>
                                            <li className={`page-item ${currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}><i className="bx bx-chevron-right"></i></button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default PetaSebaranZis;
