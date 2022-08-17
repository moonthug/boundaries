import { BBox, GeoJsonTypes, Polygon } from 'geojson';


export interface IMapFeature  {
  id: string;
  name: string;
  selected: boolean;
  contents: string;

  // Calculated
  area: number;

  // GeoJSON
  geometry: Polygon;
  type: GeoJsonTypes;
  bbox?: BBox | undefined;
}
