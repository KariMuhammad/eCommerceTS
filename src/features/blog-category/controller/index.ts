import { NextFunction, Request, Response } from "express";
import BlogCategoryRepository from "../repository";
import { apiResponse, catchAsync } from "../../../common/helpers";
import ErrorAPI from "../../../common/ErrorAPI";

class BlogCategoryController {
    private readonly blogCategoryRepository: BlogCategoryRepository;

    constructor() {
        this.blogCategoryRepository = new BlogCategoryRepository();
    }

    read = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.blogCategoryRepository.read({});
            if (data.length === 0) throw ErrorAPI.notFound("blog categories are empty.")
            return apiResponse(res, 200, "Successfully fetched blog categories", data);
        } catch (error) {
            if (error instanceof ErrorAPI) return next(error);

            console.log(error);
            return next(ErrorAPI.internal(error.message));
        }
    })

    readOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const record = await this.blogCategoryRepository.readOne({ _id: id });
            if (!record) throw ErrorAPI.notFound("Blog Category is not exist!");

            return apiResponse(res, 200, "Successfully fetched single blog category", record);
        } catch (error) {
            if (error instanceof ErrorAPI) return next(error);

            return next(ErrorAPI.internal(error.message));
        }
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req;

            const data = await this.blogCategoryRepository.create(body)
            return apiResponse(res, 201, "Blog Category created!", data);
        } catch (error) {
            return next(ErrorAPI.internal(error.message))
        }
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.blogCategoryRepository.delete({ _id: id });
            return apiResponse(res, 204, "Blog Category deleted!");
        } catch (error) {
            return next(ErrorAPI.internal(error.message))
        }
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;

            console.log("Body", data)

            const newData = await this.blogCategoryRepository.update({ _id: id }, data);
            return apiResponse(res, 200, "Blog Category is updated", newData);
        } catch (error) {
            return next(ErrorAPI.internal(error.message));
        }
    })
}

const blogCategoryController = new BlogCategoryController();

export default blogCategoryController;