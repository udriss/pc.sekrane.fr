import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  title: String,
  pdfUrl: String,
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  activities: [ActivitySchema],
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);