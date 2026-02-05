import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WakafMapWidget = ({ data }) => {
    // Center default Indonesia
    const center = [-2.5489, 118.0149];
    const safeData = data && Array.isArray(data) ? data : [];

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                {safeData.map((item, idx) => {
                    const lat = parseFloat(item.latitudes);
                    const lng = parseFloat(item.longitudes);
                    // Validasi koordinat
                    if (isNaN(lat) || isNaN(lng)) return null;

                    return (
                        <Marker key={idx} position={[lat, lng]}>
                            <Popup>
                                <h6 className="mb-1">{item.nazhir_nama || "Tanah Wakaf"}</h6>
                                <p className="mb-0 font-size-12">
                                    <b>Luas:</b> {item.luas_tanah || "-"} m²<br />
                                    <b>Lokasi:</b> {item.kabupaten_nama || "-"}
                                </p>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default WakafMapWidget;
