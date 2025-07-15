import { apiResponse, catchAsync } from "../../../common/helpers";
import ColorRepository from "../repository";

export default class ColorController {
  private readonly colorRepository: ColorRepository;

  constructor() {
    this.colorRepository = new ColorRepository();
  }

  create = catchAsync(async (request, response, next) => {
    const { body: data } = request;

    try {
      const color = await this.colorRepository.create(data);
      return apiResponse(response, 201, "Color created successfully", color);
    } catch (error) {
      throw new Error("Could not create color : " + error.message);
    }
  });
  read = catchAsync(async (request, response, next) => {
    const colors = await this.colorRepository.readWithQueryFeatures(
      {},
      request
    );
    return apiResponse(
      response,
      200,
      "All colors fetched successfully",
      colors
    );
  });

  readOne = catchAsync(async (request, response, next) => {
    const {
      params: { id },
    } = request;
    const color = await this.colorRepository.readOne({ _id: id });
    return apiResponse(response, 200, "Color fetched successfully", color);
  });

  update = catchAsync(async (request, response, next) => {});
  delete = catchAsync(async (request, response, next) => {});
}
