import mongoose from 'mongoose';

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      maxlength: [100, 'Lead name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    serviceInterested: {
      type: String,
      required: [true, 'Service interested is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
      index: true,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search functionality
leadSchema.index({ name: 'text', email: 'text', phone: 'text', company: 'text' });
// Compound index for status and createdAt sorting
leadSchema.index({ status: 1, createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
