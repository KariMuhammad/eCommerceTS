import fs from "fs";

import { randomUUID } from "crypto";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { mkdir } from "fs";
import multer, { Multer } from "multer";
import sharp from "sharp";
import ErrorAPI from "./ErrorAPI";
import config from "../../config";
import {
  destroyFileFromCloudinary,
  handleStorageByCloudinary,
  // handleStorageForMemoryStorage,
} from "./helpers";
import { UploadApiResponse } from "cloudinary";
// import { uploadIntoCloudinary } from "./helpers";

type FileField = {
  [key: string]: number;
};

enum storageType {
  MEMORY = "memory",
  DISK = "disk",
}

class Storage {
  private type: storageType;
  private storage: multer.StorageEngine;
  public upload: Multer;

  static destination = `${config.root}/static/public/uploads`;

  /**
   * @description by default you have full-control how to use multer
   * @param storageEngine
   */
  constructor(storageEngine: multer.StorageEngine) {
    console.log("Storage Engine", storageEngine);

    this.storage = storageEngine;
    this.upload = multer({
      storage: this.storage,
      fileFilter: this.filterFiles,
    });
  }

  static memoryStorage() {
    const storage = new Storage(multer.memoryStorage());
    storage.type = storageType.MEMORY; // set type to memory of class instance
    return storage;
  }

  static diskStorage() {
    console.log("Disk Storage");

    const storage = new Storage(
      multer.diskStorage({
        destination: (request, file, callback) => {
          if (!fs.existsSync(Storage.destination))
            mkdir(Storage.destination, (err) => {
              if (err) throw ErrorAPI.internal(err.message);

              callback(null, this.destination);
            });

          callback(null, this.destination);
        },

        filename: (request, file, callback) => {
          const fileName = this.generateFileName(file).concat(
            this.generateFileExt(file)
          );

          callback(null, fileName);
        },
      })
    );
    storage.type = storageType.DISK;

    console.log("Storage Built");
    return storage;
  }

  static generateFileName(file: Express.Multer.File) {
    const filename = (file.filename || file.originalname).split(".")[0]; // without ext
    return `${filename}-${Date.now()}-${randomUUID()}`;
  }

  static generateFileExt(file: Express.Multer.File, ext = undefined) {
    const extFile = file.mimetype.split("/")[1];
    return `.${ext || extFile}`;
  }

  removeImagesFromStorage(filesPaths: string[]) {
    if (this.type === storageType.DISK) {
      filesPaths.forEach((path) => {
        const fullpath = `${Storage.destination}/${path}`;
  
        if (fs.existsSync(fullpath))
          fs.unlink(fullpath, (err) => {
            if (err) throw ErrorAPI.internal(err.message);
          });
      });
    }

    if (this.type === storageType.MEMORY) {
      filesPaths.forEach((filePath) => destroyFileFromCloudinary(filePath))
    }
  }

  static moveFileBySharp({
    file,
    destination,
    size = [100, 100],
  }: {
    file: Express.Multer.File;
    destination: string;
    size?: [number, number];
  }) {
    sharp(file.buffer)
      .resize(size[0], size[1])
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(destination);
  }

  /**
   * @description is can be usefull before validation, to check if images is set to body or not
   * @param fileFields
   * @returns
   */

  // TODO: Add Uploading into Cloudinary

  /**
   * @description atomic method
   * @param fileFields
   * @returns
   */
  prepareUploadFiles = (fileFields: multer.Field[]): RequestHandler => {
    // console.log("Fields", fileFields);

    return async (req: Request, _res: Response, next: NextFunction) => {
      // console.log("User", req.user);
      // console.log("Request Files", req.files);

      if (!req.files || Object.values(req.files).length === 0) return next();

      const promisfyOperations = fileFields.map((field) => {
        const { name, maxCount } = field;

        const fileCount = maxCount;
        const files: Express.Multer.File[] = req.files[name];

        // console.log("Files", files);

        /**
         * @description if storage is memory, then we need to move files to disk (by sharp package)
         * @description if storage is disk, then we don't need to move files (already in disk)
         */
        if (this.type === storageType.MEMORY) {
          // Local Upload
          // handleStorageForMemoryStorage(files);
          // Remote Upload
          return handleStorageByCloudinary(files).then(
            (result: UploadApiResponse[]) => {
              // console.log("_Res", res);
              // console.log("_files", files);
              console.log("Result", result);

              if (fileCount)
                req.body[field.name] =
                  field.maxCount !== 1
                    ? result.map((f) => ({
                      url: f.secure_url,
                      public_id: `${f.public_id}.${f.format}`
                    }))
                    : [`${result[0].public_id}.${result[0].format}`];

              console.log("Request Body", req.body);
            }
          );
        }

        /**
         * console.log("Field Name", field.name);
         * console.log("File Count", fileCount);
         * console.log("Files", req.files);
         * console.log("File", req.files[field.name]);
         */

        // just store location in request body (in case we use our disk as storage)
        // but if we want to upload images into cloudinary, we need more than location
        
        // console.log("Request Body", req.body);
        // console.log("Files", files);

        if (this.type === storageType.DISK) {
          if (fileCount)
            req.body[field.name] =
              field.maxCount !== 1
                ? files.map((f) => f.filename)
                : files[0].filename;
        }
      });

      await Promise.all(promisfyOperations)
        .then(() => next())
        .catch((err) => next(err));
    };
  };

  /**
   * @description convert { images: 2 } -> to -> [ {name: "images", maxCount: 2 } ]
   * @param fields - { images: 2 } : { nameField: maxCount }
   */
  getFileFields(fields: FileField) {
    const fileFieldsAsNeededForMulter = Object.keys(fields).map(
      (fieldName) => ({ name: fieldName, maxCount: fields[fieldName] })
    );

    return fileFieldsAsNeededForMulter;
  }

  /**
   * @description Make a Strict Layer for Images to be only specific mimetype
   * @param req
   * @param file
   * @param callback
   * @returns
   */
  filterFiles(req: Request, file: Express.Multer.File, callback) {
    const { mimetype, size } = file;

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/avif"];
    const allowedSize = 1024 * 1024 * 2;

    if (!allowedMimeTypes.includes(mimetype))
      return callback(ErrorAPI.badRequest("Invalid file type"));
    if (size > allowedSize)
      return callback(ErrorAPI.badRequest("File size is too large"));

    return callback(null, true);
  }
}

export default Storage;

/**
 * cloudinary.v2.api
  .delete_resources(['digitic-blog-images/node3-1733068401308-afb57713-ae75-468e-ac20-473c9304a9e5.png', 'digitic-blog-images/node3-1733066787647-8f85dab0-7bb9-46ba-829f-9c72a09f8726.png', 'digitic-blog-images/node3-1733066638096-db566151-3308-4d22-9355-6869f6107ab7.png', 'digitic-blog-images/node3-1733066471911-24541b88-0ee6-4852-b581-024eb3ebf127.png', 'digitic-blog-images/node3-1733066412792-de46b0ee-3bf8-4e51-9256-325e9bb30d0b.png', 'digitic-blog-images/node3-1733065418260-cfa17a14-b36b-4506-9e0e-0aa45514fd81.png', 'digitic-blog-images/node3-1733064587818-64034409-fd57-4d5e-a6b7-508396145798.png'], 
    { type: 'upload', resource_type: 'image' })
  .then(console.log);
 */
