import { Request, Response } from "express";
import ErrorAPI from "../../../common/ErrorAPI";
import UserRepository from "../repository";
import { apiResponse, catchAsync } from "../../../common/helpers";

class UserController {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  read = async (req: Request, res: Response, next) => {
    try {
      const data = await this.userRepository.read({ _id: { $nin: req.user.id } });
      // req.headersDistinct
      return res.status(200).json({ data });
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  };

  readOne = async (req: Request, res: Response, next) => {
    const { params } = req;
    try {
      const data = await this.userRepository.readOne({ _id: params.id });

      return res.status(200).json({ data });
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  };

  update = async (req: Request, res: Response, next) => {
    const { params, body } = req;

    try {
      const updatedData = await this.userRepository.update(
        { _id: params.id },
        body
      );

      return res.status(200).json({
        data: updatedData,
      });
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  };

  delete = async (req: Request, res: Response, next) => {
    const { params } = req;

    try {
      const data = await this.userRepository.delete({ _id: params.id });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  };

  create = async (req: Request, res: Response, next) => {
    const { body } = req;

    try {
      const data = await this.userRepository.create(body);

      return res.status(201).json({
        data,
      });
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  };

  block = async (req: Request, res: Response, next) => {
    const { id } = req.params;
    const currentUser = req.user;

    try {
      const targetUser = await this.userRepository.readOne({ _id: id });

      if (targetUser.id === currentUser.id)
        next(ErrorAPI.badRequest("You cannot block yourself!"));

      targetUser.status = false;
      await await targetUser.save();
      return apiResponse(
        res,
        200,
        `You blocked the user <${currentUser.first_name}>`
      );
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  unblock = async (req: Request, res: Response, next) => {
    const { id } = req.params;
    const currentUser = req.user;
    try {
      const targetUser = await this.userRepository.readOne({ _id: id });

      if (targetUser.id === currentUser.id)
        return next(ErrorAPI.badRequest("You cannot unblock yourself!"));

      targetUser.status = true;
      targetUser.save();

      return apiResponse(
        res,
        200,
        `You unblocked the user <${currentUser.first_name}>`
      );
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  changeAddress = catchAsync(async (req: Request, res: Response) => {
    const { address, addressId } = req.body;
    // const { id: addressId } = req.params;

    const user = await this.userRepository.change({
      selector: { _id: req.user.id, "addresses._id": addressId },
      data: {},
      update: { $set: { "addresses.$": { address } } },
    });

    console.log("User", user);

    return apiResponse(res, 200, "Address is changed successfully", {
      addresses: user.addresses,
    });
  });

  addAddress = catchAsync(async (req: Request, res: Response) => {
    const { address } = req.body;

    const user = await this.userRepository.change({
      selector: { _id: req.user.id },
      data: {},
      update: { $push: { addresses: { address } } },
    });

    return apiResponse(res, 200, "Address is added successfully", {
      addresses: user.addresses,
    });
  });

  // Business Logics
}

export default new UserController();
