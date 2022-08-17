import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { ExportToCsv } from 'export-to-csv';

import { IMapFeature } from './IMapFeature';
import MapFeatures from './MapFeatures';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpY2tzIiwiYSI6ImNsNnhhdHVtMTA3N20zZHAxZ2M3MXp0YjcifQ.jsmP4xv9toaq6WSGxTTJDg';


export default function Map() {
  const csvExporter = new ExportToCsv({ useKeysAsHeaders: true });

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map>(null);
  const draw = useRef<MapboxDraw>(null);

  const [mapFeatures, setMapFeatures] = useState<IMapFeature[]>([]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-0.788529, 52.859603],
      zoom: 15
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    map.current.on('draw.selectionchange', handleMapDrawSelectionChange);
    map.current.on('draw.create', handleMapDrawCreate);
    map.current.on('draw.delete', handleMapDrawDelete);
    // map.current.on('draw.update', handleMapDrawWrite);


    map.current.addControl(draw.current);
  });

  function updateMapFeatureById(id: string, update: Partial<IMapFeature>, reset: Partial<IMapFeature> = {}) {
    setMapFeatures((mapFeatures) => {
      return mapFeatures.map(mapFeature => {
        if (mapFeature.id === id) {
          return { ...mapFeature, ...update };
        }

        return { ...mapFeature, ...reset };
      })
    });
  }

  function handleMapDrawSelectionChange(e: MapboxDraw.DrawSelectionChangeEvent) {
    setMapFeatures((mapFeatures) => {
      return mapFeatures.map(mapFeature => {
        return { ...mapFeature, selected: !!e.features.find(feature => feature.id === mapFeature.id)}
      })
    });
  }

  function handleMapDrawCreate(e: MapboxDraw.DrawCreateEvent) {
    const newMapFeature = {
      name: 'field_' + Math.floor(Math.random() * 10000),
      selected: true,
      ...e.features[e.features.length - 1]
    };
    setMapFeatures((mapFeatures) => [ ...mapFeatures, newMapFeature ]);
  }

  function handleMapDrawDelete(e: MapboxDraw.DrawDeleteEvent) {
    setMapFeatures((mapFeatures) => {
      return [
        ...mapFeatures
          .filter((mapFeature) =>
            !e.features.find((feature) => feature.id === mapFeature.id)
          )
      ];
    });
  }

  function handleFeatureNameChange(id: string, name: string) {
    updateMapFeatureById(id, { name })
  }

  function handleFeatureSelect(id: string) {
    updateMapFeatureById(id, { selected: true }, { selected: false });

    console.log('select: ', id);
    draw.current.changeMode('simple_select', { featureIds: [id] });
  }

  function handleSaveClick(e) {
    // @TODO - Add API Integration
    debugger;
  }

  function handleDownloadCSVClick(e) {
    e.preventDefault();

    const mapFeaturesData = mapFeatures.map((mapFeature) => {
      const { name, geometry: { coordinates } } = mapFeature;

      return { name, coordinates };
    })

    csvExporter.generateCsv(mapFeaturesData);
  }

  return (
    <div id={'map'}>
      <div ref={mapContainer} className={'map-container'} />

      <button onClick={handleSaveClick}>Save</button>
      <button onClick={handleDownloadCSVClick}>Download CSV</button>

      <MapFeatures
        features={mapFeatures}
        onFeatureSelect={handleFeatureSelect}
        onFeatureNameChange={handleFeatureNameChange}
      />
    </div>
  );
}
