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
import RingkasanZis from './RingkasanZis'; // <-- Menggunakan komponen khusus ZIS
import PetaSebaranZis from './PetaSebaranZis'; // <-- Import Peta Sebaran

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
        <div className="kemenag-page">
            <div className="kemenag-container">
                {/* Render Breadcrumbs */}
                {/* <Breadcrumbs title="Informasi" breadcrumbItem="ZIS (Zakat, Infaq, Sedekah)" /> */}

                {/* Bagian Utama (Pie Chart & Tabel Zakat) */}
                {/* Bagian Utama (Pie Chart & Tabel Zakat) */}
                {/* <WalletBalance /> */}
                <RingkasanZis />


                {/* Bagian Bawah (Section Market Overview & Locations) */}
                <Row>
                    {/* Market Overview Removed */}
                </Row>

                {/* Bagian Peta Sebaran (Diletakkan di paling bawah) */}
                <Row className="mt-4">
                    <PetaSebaranZis />
                </Row>
            </div>
        </div>
    );
}

export default ZisPage;
