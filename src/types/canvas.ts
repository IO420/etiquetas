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
  flipX?: boolean;
  flipY?: boolean;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  label?: string;
  fontFamily: string;
  fileName: string;
  fontUrl?: string;
  fontSize: number;
  color: string;
}

export interface RectangleLayer extends BaseLayer {
  type: "rectangle";
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
  dashPattern?: string;
}

export type PlacedLayer = ImageLayer | TextLayer | RectangleLayer;