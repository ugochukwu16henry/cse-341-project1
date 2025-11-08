module.exports = (mongoose) => {
  const Temple = mongoose.model(
    "contacts",
    mongoose.Schema(
      {
        temple_id: Number,
        name: String,
        location: String,
        dedicated: String,
        additionalInfo: Boolean,
      },
      { timestamps: true }
    )
  );

  return contacts;
};
