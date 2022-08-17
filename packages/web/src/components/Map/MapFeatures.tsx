import React from 'react';

import { IMapFeature } from './IMapFeature';
import MapFeature from './MapFeature';

interface MapFeaturesProps {
  features: IMapFeature[];
  onFeatureSelect: (id: string) => void
  onFeatureNameChange: (id: string, name: string) => void
}

export default function MapFeatures({ features, onFeatureSelect, onFeatureNameChange }: MapFeaturesProps) {
  return (
    <ul>
      {
        features.map((feature, i) =>
          <MapFeature
            key={i}
            feature={feature}
            onFeatureSelect={onFeatureSelect}
            onFeatureNameChange={onFeatureNameChange}
          />
        )
      }
    </ul>
  )
}
