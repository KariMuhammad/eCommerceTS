import slugify from "slugify";
import CategorySchema from "./schema";
import CategoryModel from ".";
import config from "../../../../config";

CategorySchema.post("init", function () {
  if (this.image) {
    this.image = `${config.cloudinary.resource_link}/${this.image}`
  }
})

CategorySchema.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }

  next();
});

CategorySchema.pre("findOneAndUpdate", function (next) {
  const updated = this.getUpdate();

  if (updated["$set"]["name"]) {
    this.setUpdate({
      ...updated,
      slug: slugify(updated["$set"]["name"], { lower: true }),
    });
  }

  next();
});

// CategorySchema.path("name").validate({
//   validator: async function (value) {
//     console.log("Path", value, "This", this);

//     const isNameExist = await CategoryModel.countDocuments({
//       name: { $eq: value },
//     });

//     if (isNameExist) return false;

//     return true;
//   },

//   message: "Category name already exists!",
// });
