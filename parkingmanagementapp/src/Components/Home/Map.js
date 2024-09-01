import "./css/Map.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Icon, divIcon, point } from "leaflet";
import { useEffect, useState } from "react";
import MySpinner from "../Common/Spiner";

// create custom icon
const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl: require("./icons/image.png"),
  iconSize: [38, 38], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};
const CenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};
// markers


const MapView = ({ latitude, longitude, lat, long, popUp }) => {
  // // Convert latitude and longitude into an array
  // const [location, setLocation] = useState([latitude, longitude]);

  // // Update location when latitude or longitude changes
  // useEffect(() => {
  //   if (latitude !== null && longitude !== null) {
  //     setLocation([latitude, longitude]);
  //   }
  // }, [latitude, longitude]);

  // if (latitude === null || longitude === null) {
  //   return <MySpinner animation="grow" size="sm" />;
  // }

  return (
    latitude &&
    longitude && (
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterMap center={[latitude, longitude]} />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>{popUp}</Popup>
        </Marker>
        {lat && long && (
          <>
            <CenterMap center={[lat, long]} />
            <Marker position={[lat, long]} icon={customIcon}>
              <Popup>Destination</Popup>
            </Marker>
            <Polyline
              positions={[
                [latitude, longitude],
                [lat, long],
              ]}
              color="red"
              weight={10}
            />
          </>
        )}
      </MapContainer>
    )
  );
};

export default MapView;
