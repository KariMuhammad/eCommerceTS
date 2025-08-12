import { NextFunction, Request, Response } from "express";

/**
 * @param req 
 * @param res 
 * @param next 
 * @route /api/products/:productId/reviews
 * inject productId param which exist in req.params into req.body if exist
 * if not exist so the endpoint is /api/reviews get all reviews
 */

export function setProductIdToBodyIfExist(req: Request, res: Response, next: NextFunction) {
    if (!req.params.productId) return next();

    req.body.product = req.params.productId;

    next();
}