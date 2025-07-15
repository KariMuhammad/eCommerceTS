import slugify from "slugify";
import BlogCategorySchema from "./schema";
import config from "../../../../config";

// Before Every Validate (create, update)
BlogCategorySchema.pre("validate", function() {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
})


// After Retreive Records from Database
BlogCategorySchema.post("init", function() {
    if (this.image) {
        this.image = `${config.cloudinary.resource_link}/${this.image}`
    }
})