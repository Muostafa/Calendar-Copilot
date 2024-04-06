import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGO_URL);

mongoose.Promise = global.Promise;

const tutorSchema = new Schema({
  name: { type: String, required: true , unique:true},
  availability: [
    {
      dayOfWeek: { type: String},
      timeSlots: [
        {
          from: { type: String },
          to: { type: String },
        },
      ],
    },
  ],
});

const Tutor = mongoose.models.Tutor || mongoose.model("Tutor", tutorSchema);
export default Tutor;
