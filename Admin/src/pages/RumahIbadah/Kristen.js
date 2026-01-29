import React from 'react';
import WorshipShared from './WorshipShared';

const KristenPage = () => {
    document.title = "Data Rumah Ibadah (Kristen) | Dashboard Nasional";
    return <WorshipShared religionName="Kristen" color="#556ee6" />;
}

export default KristenPage;