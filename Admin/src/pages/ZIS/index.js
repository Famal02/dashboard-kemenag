import React from 'react';
import ReactApexChart from "react-apexcharts";

// Import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
    Card,
    CardBody,
    Col,
    Container,
    Row
} from "reactstrap";

import CountUp from "react-countup";

/** Import Components dari folder Dashboard */
import { WidgetsData } from "../../common/data/dashboard";
import InvestedOverviewZis from './InvestedOverviewZis'; // <-- Menggunakan komponen khusus ZIS
import MarketOverview from '../Dashboard/MarketOverview';   // <-- Import dari Dashboard
// import Locations from '../Dashboard/Locations';             // <-- Import dari Dashboard (Disabled to fix Map Conflict)
import ZisDistributionMap from './ZisDistributionMap'; // <-- Import Peta Sebaran

// Opsi Chart Kecil (Sparkline)
const options = {
    chart: { height: 50, type: "line", toolbar: { show: false }, sparkline: { enabled: true } },
    colors: ["#5156be"],
    stroke: { curve: "smooth", width: 2 },
    xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } },
    yaxis: { labels: { show: false } },
    tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function (seriesName) { return ""; } } }, marker: { show: false } },
};

const ZisPage = () => {
    // Ubah Judul Halaman
    document.title = "ZIS | Zakat Nasional";

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="custom-container">
                    {/* Render Breadcrumbs */}
                    {/* <Breadcrumbs title="Informasi" breadcrumbItem="ZIS (Zakat, Infaq, Sedekah)" /> */}

                    {/* Bagian Utama (Pie Chart & Tabel Zakat) */}
                    {/* Bagian Utama (Pie Chart & Tabel Zakat) */}
                    {/* <WalletBalance /> */}
                    <InvestedOverviewZis />


                    {/* Bagian Bawah (Section Market Overview & Locations) */}
                    <Row>
                        <MarketOverview width={12} />
                        {/* <Locations /> */}
                    </Row>

                    {/* Bagian Peta Sebaran (Diletakkan di paling bawah) */}
                    <Row className="mt-4">
                        <ZisDistributionMap />
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ZisPage;
