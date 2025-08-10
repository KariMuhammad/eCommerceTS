import { Request, Response, NextFunction } from "express";
import {
  apiResponse,
  catchAsync,
  // uploadIntoCloudinary,
} from "../../../common/helpers";
import BlogRepository from "../repository/blog.repository";
import ErrorAPI from "../../../common/ErrorAPI";

class BlogController {
  private blogRepository: BlogRepository;
  constructor() {
    this.blogRepository = new BlogRepository();
  }

  create = catchAsync(async (req: Request, res: Response) => {
    // const cloudinaryLink = await uploadIntoCloudinary(req.files["image"][0]);
    // sincie i am using memoryStorage, no Path provided as property, so use `upload_stream`
    // otherwise, if you used diskStorage, you can use `upload` method and provide the path of the file

    // console.log("Req Files", req.files);
    // console.log("Body Image", req.body.image);
    // console.log("Cloudinary Link", cloudinaryLink);

    const newBlog = await this.blogRepository.create({
      ...req.body,
      author: req.user.id,
    });
    return apiResponse(res, 201, "New blog is created!", newBlog);
  });

  read = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { data: blogs, pagination } =
      await this.blogRepository.readWithQueryFeatures({}, req);
    if (!blogs.length) return next(ErrorAPI.notFound("No blogs up till now"));

    return apiResponse(res, 200, "All blogs fetched successfully", {
      blogs,
      pagination,
    });
  });

  readOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const blog = await this.blogRepository.readOne({ _id: id });
      if (!blog) return next(ErrorAPI.notFound("No blog with this id!"));

      return apiResponse(res, 200, "The blog fetched Successfully!", blog);
    }
  );

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const updatedBlog = await this.blogRepository.update(
        { _id: id },
        req.body
      );

      if (!updatedBlog) return next(ErrorAPI.notFound("No blog with this id!"));

      return apiResponse(res, 200, "The blog updated Successfully!", updatedBlog);
    }
  );

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const blog = await this.blogRepository.delete({ _id: id });
      if (!blog) return next(ErrorAPI.notFound("No blog exist with this id!"));

      return apiResponse(res, 204, "The blog is deleted Successfully!");
    }
  );

  like = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;

    const blog = await this.blogRepository.readOne({ _id: id });
    if (blog.likes.includes(user.id))
      return next(ErrorAPI.badRequest("You already liked this blog!"));

    await blog.updateOne({
      $push: { likes: user.id },
      $pull: { dislikes: user.id },
    });

    return apiResponse(res, 200, "You liked this blog", { liked: true });
  });

  dislike = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const user = req.user;

      const blog = await this.blogRepository.readOne({ _id: id });
      if (blog.dislikes.includes(user.id))
        return next(ErrorAPI.badRequest("You already dislikes this blog!"));

      await blog.updateOne({
        $push: { dislikes: user.id },
        $pull: { likes: user.id },
      });

      return apiResponse(res, 200, "You disliked this blog", { liked: false });
    }
  );
}

export default new BlogController();
