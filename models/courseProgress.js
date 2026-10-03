import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },

  isCompleted: {
    type: Boolean,
    default: false,
  },

  watchTime: {
    type: Number,
    default: 0,
    // in seconds
  },

  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lectureProgress: [lectureProgressSchema],

    lastAccessed: {
      type: Date,
      default: Date.now,
    },
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

//calculate course completion
rseProgressSchema.pre("save", function (next) {
  if (this.lectureProgress.length === 0) {
    this.completedPercentage = 0;
    return next();
  }

  const completedLectures = this.lectureProgress.filter(
    (lecture) => lecture.isCompleted,
  ).length;

  this.completedPercentage = Number(
    ((completedLectures / this.lectureProgress.length) * 100).toFixed(1),
  );

  next();
});

//update last accessed
courseProgressSchema.methods.updateLastAccessed = function () {
  this.lastAccessed = Date.now();
  return this.save({ ValidateBeforeSave: false });
};

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;