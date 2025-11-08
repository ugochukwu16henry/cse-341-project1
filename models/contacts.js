module.exports = (mongoose) => {
  const contactSchema = mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true, //  Required for assignment
        trim: true,
      },
      lastName: {
        type: String,
        required: true, // 👈Required for assignment
        trim: true,
      },
      email: {
        type: String,
        required: true, // 👈 Required for assignment
        trim: true,
      },
      favoriteColor: {
        type: String,
        required: true, // 👈 Required for assignment
        trim: true,
      },
      // Assuming birthday is stored as an ISO 8601 string (e.g., "1990-01-01")
      birthday: {
        type: String,
        required: true, // 👈 Required for assignment
        trim: true,
      },
    },
    { timestamps: true } // Keeps track of creation and update times
  );

  // Set 'id' as the virtual field for '_id' for better compatibility if needed
  contactSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  // Ensure virtuals are included when converting to JSON
  contactSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id; // Remove the internal MongoDB ID from the output
      return ret;
    },
  });

  const Contact = mongoose.model("contact", contactSchema);
  return Contact;
};
