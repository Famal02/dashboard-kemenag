import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Button, Input } from "reactstrap";
import VectormapZis from "../Maps/VectormapZis";

const ZisDistributionMap = () => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [activeTab, setActiveTab] = useState("collection"); // 'collection' (Pengumpulan) or 'distribution' (Penyaluran)
    const [mapData, setMapData] = useState({});

    // Mock Data Generator
    const generateData = (type) => {
        const provinces = [
            "ID-AC", "ID-SU", "ID-SB", "ID-RI", "ID-JA", "ID-SS", "ID-BE", "ID-LA", "ID-BB", "ID-KR",
            "ID-JK", "ID-JB", "ID-JT", "ID-YO", "ID-JI", "ID-BT", "ID-BA", "ID-NB", "ID-NT", "ID-KB",
            "ID-KT", "ID-KS", "ID-KI", "ID-KU", "ID-SA", "ID-ST", "ID-SN", "ID-SG", "ID-GO", "ID-SR",
            "ID-MA", "ID-MU", "ID-PB", "ID-PA"
        ];
        const data = {};
        provinces.forEach(code => {
            // Random values: Collection tends to be higher, Distribution slightly lower or varying
            const base = type === 'collection' ? 500 : 300;
            data[code] = Math.floor(Math.random() * base) + 50;
        });
        return data;
    };

    useEffect(() => {
        // Refresh data when tab or year changes
        setMapData(generateData(activeTab));
    }, [activeTab, selectedYear]);

    return (
        <React.Fragment>
            <Col xl={12}>
                <Card className="border-0 shadow-sm rounded-3">
                    <CardBody className="p-4" style={{ minHeight: '600px', position: 'relative' }}>
                        {/* Header Section */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ zIndex: 10, position: 'relative' }}>
                            {/* Left: Buttons */}
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

                            {/* Center: Title (Absolute Center if possible, otherwise just flow) */}
                            <div className="text-center flex-grow-1 d-none d-md-block">
                                <h5 className="mb-0 fw-bold">Sebaran {activeTab === 'collection' ? 'Pengumpulan' : 'Penyaluran'} ZIS-DSKL</h5>
                                <small className="text-muted">(Tahun {selectedYear})</small>
                            </div>

                            {/* Right: Year Selector */}
                            <div style={{ width: '100px' }}>
                                <Input
                                    type="select"
                                    className="form-select-sm fw-bold border-success text-success"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {[2025, 2024, 2023, 2022].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </Input>
                            </div>
                        </div>

                        {/* Mobile Title (visible only on small screens) */}
                        <div className="d-block d-md-none text-center mb-3">
                            <h5 className="mb-0 fw-bold">Sebaran {activeTab === 'collection' ? 'Pengumpulan' : 'Penyaluran'} ZIS-DSKL</h5>
                            <small className="text-muted">(Tahun {selectedYear})</small>
                        </div>

                        {/* Map Container */}
                        <div style={{ height: '550px', width: '100%', position: 'relative', background: '#f8f9fa', borderRadius: '8px' }}>
                            <VectormapZis
                                value={mapData}
                                width="100%"
                                colorScale={activeTab === 'collection' ? ["#e6fffa", "#0f4833"] : ["#fff8e6", "#e69500"]}
                                onRegionTipShow={(e, label, code) => {
                                    label.html(`${label.html()} <br> <b>${activeTab === 'collection' ? 'Terkumpul' : 'Disalurkan'}:</b> ${mapData[code]} Miliar`);
                                }}
                            />

                            {/* Floating Legend */}
                            <div
                                className="bg-white p-3 shadow-sm rounded"
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    zIndex: 5,
                                    width: '180px',
                                    border: '1px solid #eee'
                                }}
                            >
                                <h6 className="font-size-12 fw-bold mb-2">Legend (Miliar)</h6>
                                {[
                                    { label: '0 - 100', color: activeTab === 'collection' ? '#e6fffa' : '#fff8e6' },
                                    { label: '101 - 200', color: activeTab === 'collection' ? '#b2f5ea' : '#ffe8b3' },
                                    { label: '201 - 300', color: activeTab === 'collection' ? '#81e6d9' : '#ffd580' },
                                    { label: '301 - 400', color: activeTab === 'collection' ? '#4fd1c5' : '#ffc14d' },
                                    { label: '401 - 500', color: activeTab === 'collection' ? '#38b2ac' : '#ffa91a' },
                                    { label: '> 500', color: activeTab === 'collection' ? '#319795' : '#e69500' },
                                ].map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center mb-1">
                                        <span style={{
                                            width: '15px',
                                            height: '15px',
                                            backgroundColor: item.color,
                                            marginRight: '8px',
                                            border: '1px solid #ddd'
                                        }}></span>
                                        <span className="font-size-11">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default ZisDistributionMap;
