import { UploadApiResponse, v2 } from "cloudinary";

import { NextFunction, Request, RequestHandler, Response } from "express";
import fs from "fs";
import path from "path";
import config from "../../config";
import ErrorAPI from "./ErrorAPI";
import Storage from "./Storage";

export const serveStaticFiles = (folder): string =>
  path.join(`${config.root}/static/${folder}`);

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => next(ErrorAPI.internal(error.message)));
  };
};

export const apiResponse = (
  res: Response,
  status: number,
  message: string,
  data = null
) => {
  return res.status(status).json({
    message,
    data,
  });
};

export const apiErrorResponse = (
  res: Response,
  status: number,
  message: string,
  error = null
) => {
  return res.status(status).json({
    message,
    error,
  });
};

export const customMessage =
  (message: string) =>
  (value: string, { path }: { path: string }) => {
    return message.replace("{VALUE}", value).replace("{PATH}", path);
  };

/**
 * @returns Promise<[secure_url, url, ...]> as Result of Upload Stream
 */
export const uploadIntoCloudinary = (() => {
  v2.config(config.cloudinary);
  return async (file: Express.Multer.File) => {
    /**
     * console.log("Cloudinary File", file);
     * console.log("File Path", file.path);
     */

    // ``, ${Storage.destination}/${file.filename}
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: "digitic-blog-images", public_id: file.filename },
          (error, result) => {
            if (error) {
              return reject(ErrorAPI.internal(error.message));
            }

            console.log("Result", [result.secure_url, result.url]);
            file.filename = result.secure_url;

            return resolve(result);
          }
        )
        .end(file.buffer);
    });
  };
})(); // IIFE

/** [1]
 * @description if storage's kind of `memory` then it will generate `filename` + `ext` for each file
 * and check if destination exists so move file to existing destination by `sharp`, if not exist, create destination by `fs`.
 *
 * @param files: Uploaded files
 */
export const handleStorageForMemoryStorage = (files: Express.Multer.File[]) => {
  files.forEach((file) => {
    const filename = Storage.generateFileName(file).concat(
      Storage.generateFileExt(file)
    );

    if (!fs.existsSync(Storage.destination))
      fs.mkdirSync(Storage.destination, { recursive: true });

    const destination = `${Storage.destination}/${filename}`;
    file["filename"] = filename;
    Storage.moveFileBySharp({ file, destination });
    // OR just use
    // uploadIntoCloudinary(f);
  });
};

/**
 * [2]
 * @param files
 * @returns
 */
export const handleStorageByCloudinary = async (
  files: Express.Multer.File[]
) => {
  const promisfyUploadingOperation = files.map((file: Express.Multer.File) => {
    return uploadIntoCloudinary(file);
  });

  return await Promise.all(promisfyUploadingOperation)
    .then((result: UploadApiResponse[]) => {
      console.log("All files uploaded successfully to cloudinary");
      console.log("RESULT", result);

      return result;
    })
    .catch((error) => {
      console.error("Error occurred while uploading to cloudinary", error);
    });
};

export const destroyFileFromCloudinary = (filePublicId: string) => {
  return v2.uploader
    .destroy(filePublicId, { type: "upload" })
    .then((result) => {
      console.log("deletion successful to cloudinary", result);
      return result;
    })
    .catch((error) => {
      console.error("Error occurred while deleting from cloudinary", error);
    });
};
