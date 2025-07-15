import { NextFunction, Request, Response } from "express";
import { apiResponse, catchAsync } from "../../../common/helpers";
import ContactModel from "../model";
import ErrorAPI from "../../../common/ErrorAPI";

class ContactController {
  create = catchAsync(
    async (req: Request, res: Response) => {
      const { name, email, phone, comment } = req.body;
      // TODO: validate and save to db
      const contactDocument = new ContactModel({
        name,
        email,
        phone,
        comment,
      });

      await contactDocument.save();

      return apiResponse(res, 201, "Contact form submited successfully", {
        message: "Thank you for your message. We will contact you soon.",
        contact: contactDocument,
      });
    }
  );

  read = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const contacts = await ContactModel.find({});
    if (contacts.length === 0)
      return next(ErrorAPI.notFound("No contacts found"));

    return apiResponse(res, 200, "All contacts fetched successfully", {
      contacts,
    });
  });

  readOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const contact = await ContactModel.findById(id);
      if (!contact) return next(ErrorAPI.notFound("No contact found"));

      return apiResponse(res, 200, "Contact fetched successfully", {
        contact,
      });
    }
  );

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { body: data } = req;
      const updatedContact = await ContactModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedContact) return next(ErrorAPI.notFound("No contact found"));

      return apiResponse(res, 200, "Contact updated successfully", {
        contact: updatedContact,
      });
    }
  );

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const deletedContact = await ContactModel.findByIdAndDelete(id);
      if (!deletedContact) return next(ErrorAPI.notFound("No contact found"));

      return apiResponse(res, 204, "Contact deleted successfully", {
        contact: deletedContact, // no data will return (in case 204 status code)
      });
    }
  );
}

export default new ContactController();
