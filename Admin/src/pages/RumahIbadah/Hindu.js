import React from 'react';
import WorshipShared from './WorshipShared';

const HinduPage = () => {
    document.title = "Data Rumah Ibadah (Hindu) | Dashboard Nasional";
    return <WorshipShared religionName="Hindu" color="#f46a6a" />;
}

export default HinduPage;