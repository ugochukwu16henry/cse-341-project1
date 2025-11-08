module.exports = (mongoose) => {
  const contactSchema = mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      email: String,
      favoriteColor: String,
      birthday: String,
    },
    { timestamps: true }
  );

  const Contact = mongoose.model("contact", contactSchema);
  return Contact;
};
