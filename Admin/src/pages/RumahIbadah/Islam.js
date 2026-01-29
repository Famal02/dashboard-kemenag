import React from 'react';
import WorshipShared from './WorshipShared';

const IslamPage = () => {
    document.title = "Data Rumah Ibadah (Islam) | Dashboard Nasional";
    return <WorshipShared religionName="Islam" color="#34c38f" />;
}

export default IslamPage;