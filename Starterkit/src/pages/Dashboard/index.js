import React from 'react';

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
    Container
} from "reactstrap";

const Dashboard = () => {

    //meta title
    document.title = "Dashboard | Minia - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard" />

                </Container>
            </div>
        </React.Fragment>
    );
}

export default Dashboard;