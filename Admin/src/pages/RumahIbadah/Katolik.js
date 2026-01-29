import React from 'react';
import WorshipShared from './WorshipShared';

const KatolikPage = () => {
    document.title = "Data Rumah Ibadah (Katolik) | Dashboard Nasional";
    return <WorshipShared religionName="Katolik" color="#6f42c1" />;
}

export default KatolikPage;