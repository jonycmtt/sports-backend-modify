import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';

export const noDataFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.locals.data === null || res.locals.data.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
    return;
  }
  next();
};
