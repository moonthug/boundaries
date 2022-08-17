import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as Turf from '@turf/turf';

import { ExportToCsv } from 'export-to-csv';

import { IMapFeature } from './IMapFeature';
import MapFeatures from './MapFeatures';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpY2tzIiwiYSI6ImNsNnhhdHVtMTA3N20zZHAxZ2M3MXp0YjcifQ.jsmP4xv9toaq6WSGxTTJDg';

export type FeatureChangeHandler = (id: string, key: string, value: string) => void;

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
    map.current.on('draw.update', handleMapUpdate);


    map.current.addControl(draw.current);
  });

  // Custom methods
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

  // Map Event Handlers
  function handleMapDrawSelectionChange(e: MapboxDraw.DrawSelectionChangeEvent) {
    setMapFeatures((mapFeatures) => {
      return mapFeatures.map(mapFeature => {
        return { ...mapFeature, selected: !!e.features.find(feature => feature.id === mapFeature.id)}
      })
    });
  }

  function handleMapDrawCreate(e: MapboxDraw.DrawCreateEvent) {
    const newFeature = e.features[e.features.length - 1];

    const newMapFeature = {
      area: Turf.area(newFeature.geometry),
      name: 'field_' + Math.floor(Math.random() * 10000),
      selected: true,
      ...newFeature
    };
    setMapFeatures((mapFeatures) => [ ...mapFeatures, newMapFeature ]);
  }

  function handleMapUpdate(e: MapboxDraw.DrawUpdateEvent) {
    e.features.forEach((feature) => {
      const area = Turf.area(feature.geometry);

      updateMapFeatureById(feature.id, { area });
    });
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

  // UI Event Handlers
  function handleFeatureChange(id: string, key: keyof IMapFeature, value: string) {
    const update = { [key]: value }
    updateMapFeatureById(id, update);
  }

  function handleFeatureSelect(id: string) {
    updateMapFeatureById(id, { selected: true }, { selected: false });
    draw.current.changeMode('simple_select', { featureIds: [id] });
  }

  function handleSaveClick(e) {
    // @TODO - Add API Integration
    debugger;
    console.log('Call API', mapFeatures);
  }

  function handleDownloadCSVClick(e) {
    e.preventDefault();

    const mapFeaturesData = mapFeatures.map((mapFeature) => {
      const { name, contents, area, geometry: { coordinates } } = mapFeature;

      return { name, contents, area, coordinates };
    })

    csvExporter.generateCsv(mapFeaturesData);
  }

  return (
    <div id={'map'}>
      <div ref={mapContainer} className={'map-container'} />

      <button onClick={handleSaveClick}>Save</button>
      <button onClick={handleDownloadCSVClick}>Download CSV</button>

      { !mapFeatures.length
        ? <p>Please add a field to the map</p>
        : <MapFeatures
            features={ mapFeatures }
            onFeatureSelect={ handleFeatureSelect }
            onFeatureChange={ handleFeatureChange }
          />
      }
    </div>
  );
}
