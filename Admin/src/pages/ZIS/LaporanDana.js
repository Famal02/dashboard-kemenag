import React from 'react';
import { Container } from 'reactstrap';
import ZisDistributionMap from './ZisDistributionMap';

const LaporanDana = () => {
    document.title = "Laporan Dana | ZIS";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* <h1>Laporan Dana</h1> */}
                    <ZisDistributionMap />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LaporanDana;
