import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { getMarketoverview } from '../../store/actions';
import OverviewCharts from './OverviewCharts';
import { createSelector } from 'reselect';

const MarketOverview = ({ isFullWidth, width }) => {

    const dispatch = useDispatch();

    const [state, setState] = useState("ALL");

    const marketData = createSelector(

        (state) => state.dashboard,
        (state) => ({
            Marketoverview: state.Marketoverview,
        })
    );
    // Inside your component
    const { Marketoverview } = useSelector(marketData);

    const onChangeHandle = (data) => {
        setState(data);
        dispatch(getMarketoverview(data));
    };

    useEffect(() => {
        dispatch(getMarketoverview(state));
    }, [state]);

    useEffect(() => {
        dispatch(getMarketoverview("All"));
    }, [dispatch]);

    return (
        <React.Fragment>
            <Col xl={width || (isFullWidth ? 12 : 8)}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                    <CardBody className="p-4">
                        <div className="d-flex flex-wrap align-items-center mb-4 border-bottom pb-3">
                            {isFullWidth ? (
                                <>
                                    <div className="d-none d-md-block flex-grow-0" style={{ width: '150px' }}></div> {/* Spacer to balance layout */}
                                    <div className="text-center flex-grow-1">
                                        <h5 className="card-title mb-0 fw-bold text-dark">Pengumpulan & Penyaluran Zakat</h5>
                                    </div>
                                </>
                            ) : (
                                <h5 className="card-title me-2">Pengumpulan & Penyaluran Zakat</h5>
                            )}

                            <div className={isFullWidth ? "ms-0 ms-md-auto" : "ms-auto"}>
                                <div>
                                    <button type="button" className="btn btn-soft-primary btn-sm rounded-pill" onClick={() => onChangeHandle("ALL")}>
                                        ALL
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm rounded-pill" onClick={() => onChangeHandle("1M")}>
                                        1M
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm rounded-pill" onClick={() => onChangeHandle("6M")}>
                                        6M
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm rounded-pill" onClick={() => onChangeHandle("1Y")}>
                                        1Y
                                    </button>{" "}
                                </div>
                            </div>
                        </div>

                        <Row className="align-items-center">
                            <Col xl={isFullWidth ? 12 : 8}>
                                <div>
                                    <div id="Pengumpulan & Penyaluran Zakat" className="apex-charts">
                                        <OverviewCharts
                                            Marketoverview={Marketoverview.invoices} />
                                    </div>
                                </div>
                            </Col>
                            {!isFullWidth && (
                                <Col xl={4}>
                                    <div className="px-2 py-2">

                                        {/* Item 1 */}
                                        <p className="mb-1">Coinmarketcap <span className="float-end text-success">+ 2.5%</span></p>
                                        <div className="progress mt-2" style={{ height: "6px" }}>
                                            <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>

                                        {/* Item 2 */}
                                        <p className="mt-3 mb-1">Binance <span className="float-end text-success">+ 8.3%</span></p>
                                        <div className="progress mt-2" style={{ height: "6px" }}>
                                            <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: "83%" }} aria-valuenow="83" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>

                                        {/* Item 3 */}
                                        <p className="mt-3 mb-1">Coinbase <span className="float-end text-danger">- 3.6%</span></p>
                                        <div className="progress mt-2" style={{ height: "6px" }}>
                                            <div className="progress-bar progress-bar-striped bg-danger" role="progressbar" style={{ width: "36%" }} aria-valuenow="36" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>

                                        {/* Item 4 */}
                                        <p className="mt-3 mb-1">Yobit <span className="float-end text-success">+ 7.1%</span></p>
                                        <div className="progress mt-2" style={{ height: "6px" }}>
                                            <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: "71%" }} aria-valuenow="71" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>

                                        {/* Item 5 */}
                                        <p className="mt-3 mb-1">Bitfinex <span className="float-end text-danger">- 0.9%</span></p>
                                        <div className="progress mt-2" style={{ height: "6px" }}>
                                            <div className="progress-bar progress-bar-striped bg-danger" role="progressbar" style={{ width: "10%" }} aria-valuenow="9" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>

                                        <div className="mt-4 pt-2">
                                            <Link to="/invoices-list" className="btn btn-primary w-100 btn-sm rounded-pill">
                                                Lihat Semua Saldo <i className="mdi mdi-arrow-right ms-1"></i>
                                            </Link>
                                        </div>

                                    </div>
                                </Col>
                            )}
                        </Row>
                    </CardBody>

                </Card>

            </Col>
        </React.Fragment>
    );
}

export default MarketOverview;