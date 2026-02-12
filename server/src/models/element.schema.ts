import { Schema, Types } from 'mongoose';
import type { ElementType } from '@dear-days/shared';

/**
 * Mongoose subdocument interface for canvas elements.
 */
export interface IElementSubdocument {
  _id: Types.ObjectId;
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
  /* Text fields */
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  /* Image / Sticker fields */
  src?: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  filters?: string[];
  /* Shape fields */
  shapeType?: 'rect' | 'circle' | 'line' | 'star' | 'ellipse';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /* Sticker fields */
  stickerId?: string;
  /* Drawing fields */
  points?: number[];
  tension?: number;
}

/**
 * Mongoose subdocument schema for canvas elements.
 * Embedded inside Page — not a standalone collection.
 */
export const elementSchema = new Schema<IElementSubdocument>(
  {
    /* ── Base fields ── */
    type: {
      type: String,
      required: true,
      enum: ['text', 'image', 'shape', 'sticker', 'drawing'],
    },
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    width: { type: Number, required: true, default: 100 },
    height: { type: Number, required: true, default: 100 },
    rotation: { type: Number, default: 0 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    opacity: { type: Number, default: 1, min: 0, max: 1 },
    zIndex: { type: Number, default: 0 },
    draggable: { type: Boolean, default: true },
    locked: { type: Boolean, default: false },

    /* ── Text fields ── */
    text: { type: String },
    fontSize: { type: Number },
    fontFamily: { type: String },
    fontColor: { type: String },
    fontWeight: { type: String },
    fontStyle: { type: String },
    textAlign: { type: String, enum: ['left', 'center', 'right'] },
    lineHeight: { type: Number },

    /* ── Image / Sticker fields ── */
    src: { type: String },
    cropX: { type: Number },
    cropY: { type: Number },
    cropWidth: { type: Number },
    cropHeight: { type: Number },
    filters: { type: [String], default: undefined },

    /* ── Shape fields ── */
    shapeType: { type: String, enum: ['rect', 'circle', 'line', 'star', 'ellipse'] },
    fill: { type: String },
    stroke: { type: String },
    strokeWidth: { type: Number },

    /* ── Sticker fields ── */
    stickerId: { type: String },

    /* ── Drawing fields ── */
    points: { type: [Number], default: undefined },
    tension: { type: Number },
  },
  {
    _id: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = (ret._id as object).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
