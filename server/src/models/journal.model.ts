import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Mongoose journal document interface.
 */
export interface IJournalDocument extends Document {
  title: string;
  description?: string;
  coverImageUrl?: string;
  ownerId: Types.ObjectId;
  pageIds: Types.ObjectId[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose journal model interface.
 */
export type IJournalModel = Model<IJournalDocument>;

const journalSchema = new Schema<IJournalDocument>(
  {
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true,
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    coverImageUrl: {
      type: String,
      default: undefined,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },
    pageIds: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
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

const Journal = mongoose.model<IJournalDocument, IJournalModel>('Journal', journalSchema);

export default Journal;
