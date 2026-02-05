import PropTypes from 'prop-types';
import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import "./jquery-jvectormap.scss";
import { idnMerc } from "@react-jvectormap/indonesia";

const VectormapZis = props => {
    const mapRef = React.useRef(null);

    const data = props.value || {};

    return (
        <div style={{ width: props.width, height: 500 }}>
            <VectorMap
                map={idnMerc}
                backgroundColor="transparent"
                containerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                regionStyle={{
                    initial: {
                        fill: "#e9e9ef",
                        "fill-opacity": 1,
                        stroke: "none",
                        "stroke-width": 0,
                        "stroke-opacity": 0,
                    },
                    hover: {
                        "fill-opacity": 0.8,
                        cursor: "pointer",
                    },
                    selected: {
                        fill: "#2938bc",
                    },
                }}
                series={{
                    regions: [{
                        values: data,
                        scale: props.colorScale || ["#C8EEFF", "#0071a4"],
                        normalizeFunction: 'polynomial'
                    }]
                }}
                containerClassName="map"
                onRegionTipShow={props.onRegionTipShow}
                onRegionClick={props.onRegionClick}
                selectedRegions={props.selectedRegions}
            />
        </div>
    )
}

VectormapZis.propTypes = {
    colorScale: PropTypes.array,
    value: PropTypes.any,
    width: PropTypes.any,
    onRegionTipShow: PropTypes.func
}

export default VectormapZis;
