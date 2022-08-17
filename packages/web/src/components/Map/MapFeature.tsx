import React from 'react';
import classNames from 'classnames';

import { IMapFeature } from './IMapFeature';

import './mapFeature.css';

interface MapFeatureProps {
  feature: IMapFeature;
  onFeatureSelect: (id: string) => void;
  onFeatureNameChange: (id: string, name: string) => void;
}

export default function MapFeature({ feature, onFeatureSelect, onFeatureNameChange }: MapFeatureProps) {

  function handleFeatureFocus(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    onFeatureSelect(feature.id);
  }
  function handleFeatureNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    onFeatureNameChange(feature.id, e.currentTarget.value);
  }

  return (
    <li
      key={feature.id}
      className={classNames('map-feature', { selected: feature.selected })}
    >
      <input
        value={feature.name}
        onChange={handleFeatureNameChange}
        onFocus={handleFeatureFocus}
      />
    </li>
  )
}
