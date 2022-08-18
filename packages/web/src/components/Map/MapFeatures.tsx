import React from 'react';
import { m2ToAcres, m2ToKm2 } from '../../utils/math';

import { IMapFeature } from './IMapFeature';
import { FeatureChangeHandler } from './Map';
import MapFeature from './MapFeature';

interface MapFeaturesProps {
  features: IMapFeature[];
  onFeatureSelect: (id: string) => void
  onFeatureChange: FeatureChangeHandler
}

export default function MapFeatures({ features, onFeatureSelect, onFeatureChange }: MapFeaturesProps) {
  const totalArea = features.reduce((value, feature) => value + feature.area, 0);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Contents</th>
          <th>Area</th>
        </tr>
      </thead>
      <tbody>
        {
          features.map((feature, i) =>
            <MapFeature
              key={i}
              feature={feature}
              onFeatureSelect={onFeatureSelect}
              onFeatureChange={onFeatureChange}
            />
          )
        }
      </tbody>
      <tfoot>
        <tr>
          <td>Total Area: { m2ToKm2(totalArea) } km2 ({ m2ToAcres(totalArea)} Acres)</td>
        </tr>
      </tfoot>
    </table>
  )
}
