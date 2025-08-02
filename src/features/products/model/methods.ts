import { destroyFileFromCloudinary } from "../../../common/helpers";
import ProductSchema from "./schema";

ProductSchema.methods.updateAverageRatings = async function () {
  const ratings = this.ratings;
  const ratingsCount = ratings.length;
  let totalStars = 0;

  ratings.forEach((rating) => {
    totalStars += rating.stars;
  });

  this.averageRatings = totalStars / ratingsCount;
};

ProductSchema.methods.destroyImages = async function () {
  const promisfyOperations = this.images.map((image) => {
    const fileNameImage = image.public_id.split(".")[0]; ///[digitic-blog-images/hsbcza9japfnvjrhkibb].png

    console.log("Filename: " + fileNameImage);
    return destroyFileFromCloudinary(fileNameImage);
  });

  await Promise.all(promisfyOperations)
    .then((result) => {
      console.log("All images deleted successfully", result);
    })
    .catch((error) => {
      console.error("Error deleting images", error);
      throw new Error("Error deleting images");
    });
};
