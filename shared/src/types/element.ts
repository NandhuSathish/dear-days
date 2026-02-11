/**
 * Discriminator for canvas element types.
 */
export type ElementType = 'text' | 'image' | 'shape' | 'sticker' | 'drawing';

/**
 * Base properties shared by all canvas elements.
 * Mirrors Konva node attributes for direct mapping.
 */
export interface IBaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  zIndex: number;
  draggable: boolean;
  locked: boolean;
}

/**
 * Rich text element with font customization.
 */
export interface ITextElement extends IBaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

/**
 * Image/photo element with optional cropping and filters.
 */
export interface IImageElement extends IBaseElement {
  type: 'image';
  src: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  filters: string[];
}

/**
 * Geometric shape element.
 */
export interface IShapeElement extends IBaseElement {
  type: 'shape';
  shapeType: 'rect' | 'circle' | 'line' | 'star' | 'ellipse';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

/**
 * Pre-made sticker element.
 */
export interface IStickerElement extends IBaseElement {
  type: 'sticker';
  stickerId: string;
  src: string;
}

/**
 * Freehand drawing element with point data.
 */
export interface IDrawingElement extends IBaseElement {
  type: 'drawing';
  points: number[];
  stroke: string;
  strokeWidth: number;
  tension: number;
}

/**
 * Discriminated union of all canvas element types.
 * Use the `type` field to narrow in TypeScript.
 */
export type IElement =
  | ITextElement
  | IImageElement
  | IShapeElement
  | IStickerElement
  | IDrawingElement;
