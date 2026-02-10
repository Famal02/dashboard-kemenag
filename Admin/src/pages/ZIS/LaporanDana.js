import React from 'react';
import PetaSebaranZis from './PetaSebaranZis';

const LaporanDana = () => {
    document.title = "Laporan Dana | ZIS";

    return (
        <div className="kemenag-page">
            <div className="kemenag-container">
                {/* <h1>Laporan Dana</h1> */}
                <PetaSebaranZis />
            </div>
        </div>
    );
};

export default LaporanDana;
