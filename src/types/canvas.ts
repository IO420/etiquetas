export interface BaseLayer {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  url: string;
  name: string;
  aspectRatio: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  label?: string;
  fontFamily: string;
  fontUrl?: string;
  fontSize: number;
  color: string;
}

export type PlacedLayer = ImageLayer | TextLayer;