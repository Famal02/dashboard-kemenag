
import React from 'react';
import { VectorMap } from "@react-jvectormap/core";
import { idnMerc } from "@react-jvectormap/indonesia";
import PropTypes from 'prop-types';

const PetaIndonesia = ({ value, width, color, onRegionClick, onRegionTipShow, colorScale, selectedRegions }) => {
    return (
        <div style={{ width: width, height: 500 }}>
            <VectorMap
                map={idnMerc}
                backgroundColor="transparent"
                containerStyle={{
                    width: '100%',
                    height: '100%'
                }}
                zoomOnScroll={false}
                regionsSelectable={true}
                regionsSelectableOne={true}
                series={{
                    regions: [{
                        values: value || {},
                        scale: colorScale || ['#f0eee9', '#375673'], // Cloud Dancer to Blue Fusion
                        normalizeFunction: 'polynomial',
                        attribute: 'fill',
                    }]
                }}
                regionStyle={{
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: '#fff',
                        "stroke-width": 0.5,
                        "stroke-opacity": 1
                    },
                    hover: {
                        "fill-opacity": 1,
                        cursor: 'pointer',
                        stroke: '#d5cd94', // Golden Mist
                        "stroke-width": 2
                    },
                    selected: {
                        fill: '#375673' // Blue Fusion
                    },
                    selectedHover: {
                        "fill-opacity": 1
                    }
                }}
                onRegionClick={(e, code) => {
                    console.log("=== VectorMap onRegionClick FIRED ===");
                    console.log("Code:", code);
                    if (onRegionClick) {
                        console.log("Calling parent handler");
                        onRegionClick(e, code);
                    } else {
                        console.warn("No onRegionClick handler provided!");
                    }
                }}
                onRegionTipShow={(e, label, code) => {
                    console.log("=== VectorMap onRegionTipShow FIRED ===");
                    console.log("Code:", code);
                    if (onRegionTipShow) {
                        onRegionTipShow(e, label, code);
                    } else {
                        console.warn("No onRegionTipShow handler provided!");
                    }
                }}
                selectedRegions={selectedRegions || []}
            />
        </div>
    );
};

PetaIndonesia.propTypes = {
    value: PropTypes.any,
    width: PropTypes.any,
    color: PropTypes.any,
    onRegionClick: PropTypes.func,
    onRegionTipShow: PropTypes.func,
    colorScale: PropTypes.array,
    selectedRegions: PropTypes.array
};

export default PetaIndonesia;
