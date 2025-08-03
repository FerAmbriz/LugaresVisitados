import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import './App.css';

function MapView({ user, onLogout }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
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
      const features = [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-99.186, 19.332] },
          properties: {
            title: 'Ciudad Universitaria',
            description: 'Este es el campus principal de la UNAM.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Ciudad_Universitaria_UNAM.jpg',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-99.18, 19.34] },
          properties: {
            title: 'Otro Punto',
            description: 'Descripción del otro punto.',
            image: 'https://via.placeholder.com/300x150.png?text=Otro+Punto',
          },
        },
      ];

      mapRef.current.addSource('cu-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
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

      mapRef.current.addLayer({
        id: 'cu-labels',
        type: 'symbol',
        source: 'cu-point',
        layout: {
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 14,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      });

      // Click en capa de círculos
      mapRef.current.on('click', 'cu-layer', (e) => {
        console.log('CLICK en cu-layer');
        const feature = e.features?.[0];
        if (feature && feature.properties) {
          console.log('Feature properties:', feature.properties);
          setSelectedFeature(feature.properties);
        }
      });

      // Opcional: click en etiquetas también
      mapRef.current.on('click', 'cu-labels', (e) => {
        console.log('CLICK en cu-labels');
        const feature = e.features?.[0];
        if (feature && feature.properties) {
          setSelectedFeature(feature.properties);
        }
      });

      mapRef.current.on('mouseenter', 'cu-layer', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });

      mapRef.current.on('mouseleave', 'cu-layer', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });

      // Debug: click en cualquier parte del mapa
      mapRef.current.on('click', (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ['cu-layer'],
        });
        console.log('Features en click general:', features);
      });
    });

    return () => mapRef.current?.remove();
  }, []);

  return (
    <div className="map-wrapper">
      <div className="top-bar">
        <span>Bienvenido, {user}</span>
        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="map-container" ref={mapContainer} />

      <div className="info-panel">
        {selectedFeature ? (
          <>
            <h2>{selectedFeature.title}</h2>
            <img src={selectedFeature.image} alt={selectedFeature.title} />
            <p>{selectedFeature.description}</p>
          </>
        ) : (
          <p>Haz clic en un punto del mapa para ver la información.</p>
        )}
      </div>

    </div>
  );
}

export default MapView;