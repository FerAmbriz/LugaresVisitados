import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import './App.css';

function MapView({ user, onLogout }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

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
      center: [-99.186, 19.332],
      zoom: 14,
      maxZoom: 19,
    });

    mapRef.current.on('load', () => {
      mapRef.current.addSource('cu-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [-99.186, 19.332] },
              properties: { title: 'Ciudad Universitaria' },
            },
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [-99.18, 19.34] },
              properties: { title: 'Otro Punto' },
            },
          ],
        },
      });

      mapRef.current.addLayer({
        id: 'cu-layer',
        type: 'circle',
        source: 'cu-point',
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF5722',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      mapRef.current.on('click', 'cu-layer', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates.slice();
          const title = feature.properties.title;

          new maplibregl.Popup({ closeButton: false, closeOnClick: false, anchor: 'top' })
            .setLngLat(coordinates)
            .setHTML(
              `<div style="background:#333; color:#fff; padding:5px 10px; border-radius:4px; font-size:12px;">
                ${title}
              </div>`
            )
            .addTo(mapRef.current);
        }
      });

      mapRef.current.on('mouseenter', 'cu-layer', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });

      mapRef.current.on('mouseleave', 'cu-layer', () => {
        mapRef.current.getCanvas().style.cursor = '';
        document.querySelectorAll('.mapboxgl-popup').forEach((p) => p.remove());
      });
    });

    return () => mapRef.current?.remove();
  }, []);

  return (
    <>
      <div className="top-bar">
        <span>Bienvenido, {user}</span>
        <button className="logout-button" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </>
  );
}

export default MapView;
