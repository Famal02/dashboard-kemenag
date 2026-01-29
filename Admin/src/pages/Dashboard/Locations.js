import React from 'react';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { VectorMap } from "react-jvectormap";
import "../Maps/jquery-jvectormap.scss";

const Locations = (props) => {
    const map = React.createRef(null);
    return (
        <React.Fragment>
            <Col xl={4}>
                <Card>
                    <CardBody>
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <h5 className="card-title me-2">Sebaran Lokasi</h5>
                            <div className="ms-auto">
                                {/* <UncontrolledDropdown>
                                    <DropdownToggle className="text-reset" to="#" tag="a">
                                        <span className="text-muted font-size-12">Sort By:</span> <span className="fw-medium">World<i className="mdi mdi-chevron-down ms-1"></i></span>
                                    </DropdownToggle>

                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem to="#">USA</DropdownItem>
                                        <DropdownItem to="#">Russia</DropdownItem>
                                        <DropdownItem to="#">Australia</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown> */}
                            </div>
                        </div>

                        <div id="sales-by-locations" data-colors='["#5156be"]' style={{ height: "245px" }}>
                            <div style={{ width: props.width, height: 480 }}>
                                <VectorMap
                                    map={"world_mill"}
                                    backgroundColor="transparent"

                                    // --- 1. SETTING ZOOM KHUSUS PULAU JAWA ---
                                    focusOn={{
                                        x: 0.8,    // Koordinat X (Geser ke kanan sedikit untuk pas di Indo)
                                        y: 0.65,    // Koordinat Y (Geser ke bawah sedikit untuk pas di Jawa)
                                        scale: 20,  // Zoom level BESAR (supaya fokus hanya ke pulau Jawa)
                                        animate: true
                                    }}

                                    // --- 2. MARKER KHUSUS JAKARTA, JABAR, JATIM ---
                                    markers={[
                                        { latLng: [-6.2088, 106.8456], name: "DKI Jakarta" },
                                        { latLng: [-6.9175, 107.6191], name: "Bandung (Jawa Barat)" },
                                        { latLng: [-7.2575, 112.7521], name: "Surabaya (Jawa Timur)" }
                                    ]}

                                    // --- PENGATURAN LAIN TETAP SAMA ---
                                    normalizeFunction='polynomial'
                                    hoverOpacity={0.7}
                                    hoverColor={false}
                                    ref={map}
                                    containerStyle={{
                                        width: "100%",
                                        height: "50%",
                                    }}
                                    regionStyle={{
                                        initial: {
                                            fill: "#e9e9ef",
                                            "fill-opacity": 0.9,
                                            stroke: "#fff",
                                            "stroke-width": 7,
                                            "stroke-opacity": 0.4,
                                        },
                                        hover: {
                                            'stroke': '#fff',
                                            'fill-opacity': 1,
                                            'stroke-width': 1.5,
                                            cursor: "pointer",
                                        },
                                        selected: {
                                            fill: "#2938bc",
                                        },
                                        selectedHover: {},
                                    }}
                                    containerClassName="map"
                                    // map={"world_mill"}
                                    // backgroundColor="transparent"


                                    
                                    // normalizeFunction='polynomial'
                                    // hoverOpacity={0.7}
                                    // hoverColor={false}
                                    // ref={map}
                                    // containerStyle={{
                                    //     width: "100%",
                                    //     height: "50%",
                                    // }}
                                    // regionStyle={{
                                    //     initial: {
                                    //         fill: "#e9e9ef",x
                                    //         'fill-opacity': 0.9,
                                    //         stroke: "#fff",
                                    //         "stroke-width": 7,
                                    //         "stroke-opacity": 0.4,
                                    //     },
                                    //     hover: {
                                    //         'stroke': '#fff',
                                    //         'fill-opacity': 1,
                                    //         'stroke-width': 1.5,
                                    //         cursor: "pointer",
                                    //     },
                                    //     selected: {
                                    //         fill: "#2938bc", //what colour clicked country will be
                                    //     },
                                    //     selectedHover: {},
                                    // }}
                                    // containerClassName="map"
                                />
                            </div>
                        </div>

                        <div className="px-2 py-2">
                            <p className="mb-1">Jakarta <span className="float-end">80%</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
                                </div>
                            </div>

                            <p className="mt-3 mb-1">Jawa Timur <span className="float-end">61%</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "55%" }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="55">
                                </div>
                            </div>

                            <p className="mt-3 mb-1">Jawa Barat <span className="float-end">85%</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "85%" }} aria-valuenow="85" aria-valuemin="0" aria-valuemax="85">
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default Locations;