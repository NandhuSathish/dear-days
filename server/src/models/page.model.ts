import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { elementSchema, type IElementSubdocument } from './element.schema.js';

/**
 * Mongoose page document interface.
 */
export interface IPageDocument extends Document {
  journalId: Types.ObjectId;
  title?: string;
  sortOrder: number;
  width: number;
  height: number;
  backgroundColor: string;
  elements: IElementSubdocument[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose page model interface.
 */
export type IPageModel = Model<IPageDocument>;

const pageSchema = new Schema<IPageDocument>(
  {
    journalId: {
      type: Schema.Types.ObjectId,
      ref: 'Journal',
      required: [true, 'Journal ID is required'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 600,
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    elements: {
      type: [elementSchema],
      default: [],
    },
  },
  {
    timestamps: true,
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

const Page = mongoose.model<IPageDocument, IPageModel>('Page', pageSchema);

export default Page;
