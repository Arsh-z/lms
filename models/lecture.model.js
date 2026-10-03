import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
    {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500
    },

//*  
// COURSE
    
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // =========================
    // INSTRUCTOR
    // =========================

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


//videourl

    videoUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: [true, 'Public ID is required for video management']
    },

   
    duration: {
      type: Number,
      default: 0,
    },

    
    // THUMBNAIL
    
    thumbnail: {
      type: String,
      default: "",
    },

    thumbnailPublicId: {
      type: String,
      default: "",
    },

   
    // LECTURE ORDER
    

    lectureNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    // =========================
    // FREE / PAID
    // =========================

    isFree: {
      type: Boolean,
      default: false,
    },

    // =========================
    // RESOURCES
    // =========================

    resources: [
      {
        title: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },
      },
    ],

    // =========================
    // NOTES
    // =========================

    notes: {
      type: String,
      default: "",
    },

    // =========================
    // STATUS
    // =========================

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // =========================
    // PREVIEW
    // =========================

    isPreview: {
      type: Boolean,
      default: false,
        },
    
    order: {
        type: Boolean,
        required: [true,'lecture order is required']
        
    },

    // =========================
    // STATS
    // =========================

    views: {
      type: Number,
      default: 0,
    },

    // =========================
    // TIMESTAMPS
    // =========================
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

// =========================
// VIRTUALS
// =========================

// Duration in minutes
lectureSchema.virtual("durationInMinutes").get(function () {
  return Number((this.duration / 60).toFixed(1));
});

// =========================
// PRE SAVE
// =========================

lectureSchema.pre("save", function (next) {
  // Automatically set publishedAt
  if (this.isModified("isPublished")) {
    if (this.isPublished && !this.publishedAt) {
      this.publishedAt = new Date();
    }

    if (!this.isPublished) {
      this.publishedAt = null;
    }
  }

  next();
});

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
