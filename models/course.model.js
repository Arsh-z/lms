import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    
    title: {
      type: String,
      required: [true,'Course title is required'],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Short description shown in course cards
    shorttitle: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // =========================
    // INSTRUCTOR
    // =========================

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // COURSE CATEGORY
    // =========================

    category: {
      type: String,
      required: [true,"Course category is required"],
      trim: true,
    },

    level: {
      type: String,
        enum: {
            values: ["beginner", "intermediate", "advanced"],
            message: 'Please select a valiud coursr level'
        },
      default: "beginner",
    },

    language: {
      type: String,
      default: "English",
      trim: true,
    },

    // =========================
    // COURSE MEDIA
    // =========================

    thumbnail: {
        type: String,
        required:true,
      
    },

    previewVideo: {
      type: String,
      default: "",
    },

    // =========================
    // COURSE CONTENT
    // =========================

    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],

    lessonsCount: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      default: 0,
      // duration in minutes
    },

    // =========================
    // REQUIREMENTS
    // =========================

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    // =========================
    // WHAT STUDENT WILL LEARN
    // =========================

    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],

    
    // PRICING

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    currency: {
      type: String,
      default: "INR",
    },

    
    // ENROLLED STUDENTS
   
 
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    totalStudents: {
      type: Number,
      default: 0,
    },

   
    // COURSE STATUS
   

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
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

    
    // RATING


    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    
    // CERTIFICATE
    

    certificateAvailable: {
      type: Boolean,
      default: false,
    },

   
    // SEO
    

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    
    // TIMESTAMPS
   

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject:{virtuals:true},
  },
);


// VIRTUAL FIELDS

courseSchema.virtual("averageRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) {
    return 0;
  }

  const total = this.ratings.reduce((sum, rating) => sum + rating, 0);

  return Number((total / this.ratings.length).toFixed(1));
});

courseSchema.pre("save", function (next) {
    if (this.lectures) {
        this.totalLectures = this.lectures.length;
    }
    
    next()
});


courseSchema.virtual("totalEnrolledStudents").get(function () {
  return this.enrolledStudents?.length ?? 0;
});

courseSchema.virtual("totalChapters").get(function () {
  return this.chapters?.length ?? 0;
});

// Include virtuals in JSON response
courseSchema.set("toJSON", {
  virtuals: true,
});

courseSchema.set("toObject", {
  virtuals: true,
});



export default Course = mongoose.model("Course",courseSchema)

