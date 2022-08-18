import React from 'react';
import classNames from 'classnames';
import { m2ToAcres } from '../../utils/math';

import { IMapFeature } from './IMapFeature';
import { FeatureChangeHandler } from './Map';

import './mapFeature.css';

interface MapFeatureProps {
  feature: IMapFeature;
  onFeatureSelect: (id: string) => void;
  onFeatureChange: FeatureChangeHandler
}

export default function MapFeature({ feature, onFeatureSelect, onFeatureChange }: MapFeatureProps) {

  function handleFeatureFocus(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    onFeatureSelect(feature.id);
  }
  function createFeatureChangeHandler(type: keyof IMapFeature) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      onFeatureChange(feature.id, type, e.currentTarget.value);
    }
  }

  return (
    <tr
      key={feature.id}
      className={classNames('map-feature', { selected: feature.selected })}
    >
      <td>
        <input
          value={feature.name}
          onChange={createFeatureChangeHandler('name')}
          onFocus={handleFeatureFocus}
        />
      </td>

      <td>
        <select
          value={feature.contents}
          onChange={createFeatureChangeHandler('contents')}
          onFocus={handleFeatureFocus}
        >
          <option>None</option>
          <option>Pasture</option>
          <option>Wheat</option>
          <option>Barley</option>
          <option>Oats</option>
          <option>Field Beans</option>
        </select>
      </td>

      <td>{feature.area.toFixed(2)} m2 ({ m2ToAcres(feature.area)} Acres)</td>
    </tr>
  )
}
