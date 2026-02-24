import React from 'react';
import RingkasanZis from './RingkasanZis';

const ZisPage = () => {
    document.title = "ZIS | Zakat Nasional";

    return (
        <div className="kemenag-page">
            <div className="kemenag-container">
                <RingkasanZis />
            </div>
        </div>
    );
}

export default ZisPage;
