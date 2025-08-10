import slugify from "slugify";
import ProductSchema from "./schema";
import ProductModel from ".";
import config from "../../../../config";

ProductSchema.post("init", function () {

  this.images = this.images.map(function (img) {
    return { url: `${config.cloudinary.resource_link}/${img.public_id}`, public_id: img.public_id };
  });

  console.log("images", this.images);
});

ProductSchema.pre("validate", function (next) {
  console.log("Validation on ProductSchema")

  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }

  // if (this.isModified("images")) {
  //   Storage.removeImagesFromStorage(this.images);
  // }

  next();
});

ProductSchema.pre("findOneAndUpdate", async function (next) {
  console.log("pre update hook");

  const update = this.getUpdate();
  const docToUpdate = await this.model.findOne(this.getQuery());

  console.log("Update", update)
  console.log("Document to Update", docToUpdate);


  if (update && update["$set"] && update["$set"]["name"]) {
    update["$set"]["slug"] = slugify(update["$set"]["name"], {
      lower: true,
    });
  }

  next();
});

ProductSchema.path("name").validate({
  validator: async function (value: string) {
    const nameCount = await ProductModel.countDocuments({
      name: value,
    });
    return !nameCount;
  },
  message: "Product name already exists",
});
