import PropTypes from 'prop-types';
import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import "./jquery-jvectormap.scss";

// Import Indonesia map specifically
// The @react-jvectormap/indonesia package exports 'idnMerc' (Mercator projection)
import { idnMerc } from "@react-jvectormap/indonesia";

const Vectormap = props => {
  const mapRef = React.useRef(null);

  // If props.value is providing data (object), we should use it for coloring or visualization.
  // But currently Vectormap component was written to take 'value' as map name.
  // We need to support both or specific generic usage.
  // Let's assume for WorshipShared we want Indonesia map always.

  // However, this component might be used by other pages expecting the old behavior.
  // Let's modify it to robustly handle the map input.

  // Checking if props.value is a string (map name) or object (data).
  const isMapName = typeof props.value === 'string';
  const data = isMapName ? {} : props.value;
  const mapConfig = isMapName ? props.value : idnMerc;

  if (!mapConfig) {
    console.error("Map configuration not found. Check if @react-jvectormap/indonesia is installed and imported correctly.");
    return <div className="text-center text-danger p-5">Map Data Missing</div>;
  }

  return (
    <div style={{ width: props.width, height: 500 }}>
      <VectorMap
        map={mapConfig}
        backgroundColor="transparent"
        ref={mapRef}
        containerStyle={{
          width: "100%",
          height: "100%",

        }}
        regionStyle={{
          initial: {
            fill: "#e9e9ef", // Default gray
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
            values: data, // Province data { "ID-AC": 100, ... }
            scale: [props.color || "#C8EEFF", "#0071a4"], // Light to Dark gradient based on prop color
            normalizeFunction: 'polynomial'
          }]
        }}
        containerClassName="map"
        onRegionClick={props.onRegionClick}
        onRegionTipShow={props.onRegionTipShow}
      />
    </div>
  )
}

Vectormap.propTypes = {
  color: PropTypes.string,
  value: PropTypes.any,
  width: PropTypes.any
}

export default Vectormap;
