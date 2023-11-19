import { useEffect, useState } from "react";
import { MapContainer, CircleMarker, TileLayer, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

export const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const maxBounds = [[-90, -180], [90, 180]]; // Set the vertical bounds, [-90, -180] to [90, 180]

  useEffect(() => {
    fetchEarthquakeData();
    const interval = setInterval(fetchEarthquakeData, 1000000); // Fetch data every 16 mins
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const fetchEarthquakeData = async () => {
    try {
      const response = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      const data = await response.json();

      const markers = data.features.map((feature) => {
        const { id, properties, geometry } = feature;
        const { mag, place, time } = properties;
        const { coordinates } = geometry;

        return {
          id,
          position: [coordinates[1], coordinates[0]],
          magnitude: mag,
          location: place,
          time: new Date(time),
          radius: getCircleRadius(mag),
          fillColor: getCircleColor(mag),
          onClick: () => handleMarkerClick(mag),
          onMouseOver: () => handleMarkerHover(mag),
          onMouseOut: () => handleMarkerHover(null),
        };
      });

      setMarkers(markers);
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
    }
  };

  const handleMarkerClick = (magnitude) => {
    console.log(`Clicked marker with magnitude ${magnitude}`);
  };

  const handleMarkerHover = (magnitude) => {
    console.log(`Hovered over marker with magnitude ${magnitude}`);
  };

  const getCircleRadius = (magnitude) => {
    if (magnitude >= 0 && magnitude <= 3) {
      return 5;
    } else if (magnitude > 3 && magnitude <= 6) {
      return 10;
    } else if (magnitude > 6 && magnitude <= 10) {
      return 15;
    }
  };

  const getCircleColor = (magnitude) => {
    if (magnitude >= 0 && magnitude <= 3) {
      const shade = Math.round((magnitude / 3) * 155) + 100;
      return `rgba(0, ${shade}, 0, 1)`;
    } else if (magnitude > 3 && magnitude <= 6) {
      const shade = Math.round(((magnitude - 3) / 3) * 155) + 100;
      return `rgba(${shade}, ${shade}, 0, 1)`;
    } else if (magnitude > 6 && magnitude <= 10) {
      const shade = Math.round(((magnitude - 6) / 4) * 155) + 100;
      return `rgba(255, ${shade}, ${shade}, 1)`;
    }
  };

  return (
    <MapContainer
      center={[0, 0]}
      attributionControl={false}
      zoom={3}
      minZoom={2}
      maxZoom={10}
      maxBounds={maxBounds}
      maxBoundsViscosity={3.0}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={marker.position}
          radius={marker.radius}
          pathOptions={{ fillColor: marker.fillColor, color: "transparent" }}
          eventHandlers={{
            click: marker.onClick,
            mouseover: marker.onMouseOver,
            mouseout: marker.onMouseOut,
          }}
        >
          <Popup>
            <div>
              <strong>Magnitude:</strong> {marker.magnitude}
            </div>
            <div>
              <strong>Location:</strong> {marker.location}
            </div>
            <div>
              <strong>Date:</strong> {marker.time.toLocaleString()}
            </div>
          </Popup>
          <Tooltip direction="top" opacity={1}>
            <div>
              <strong>Magnitude:</strong> {marker.magnitude}
            </div>
            <div>
              <strong>Location:</strong> {marker.location}
            </div>
            <div>
              <strong>Date:</strong> {marker.time.toLocaleString()}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};
