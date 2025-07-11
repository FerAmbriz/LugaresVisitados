import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function MapView({ user }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center: [-99.15, 19.39],
      zoom: 12,
      maxZoom: 19,
    });

    mapRef.current.on('load', () => {
      const geojsonData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-99.186, 19.332] },
            properties: { title: 'Ciudad Universitaria' },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-99.1332, 19.4326] },
            properties: { title: 'Zócalo CDMX' },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-99.1617, 19.3467] },
            properties: { title: 'Coyoacán' },
          },
        ],
      };

      mapRef.current.addSource('points-source', {
        type: 'geojson',
        data: geojsonData,
      });

      mapRef.current.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-source',
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF5722',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      mapRef.current.on('click', 'points-layer', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates.slice();
          const title = feature.properties.title;

          if (popupRef.current) popupRef.current.remove();

          popupRef.current = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: false,
            anchor: 'top',
          })
            .setLngLat(coordinates)
            .setHTML(
              `<div style="background:#333; color:#fff; padding:5px 10px; border-radius:4px; font-size:12px;">
                ${title}
              </div>`
            )
            .addTo(mapRef.current);
        }
      });

      mapRef.current.on('mouseenter', 'points-layer', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });

      mapRef.current.on('mouseleave', 'points-layer', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div className="welcome">Bienvenido, {user} 👋</div>
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </>
  );
}

export default MapView;
