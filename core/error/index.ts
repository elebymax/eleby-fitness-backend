import {ResponseFormat, ResponseError} from "./type";
import AppError from "./AppError";
import BadRequestError from "./BadRequestError";
import UnauthorizedError from "./UnauthorizedError";
import ForbiddenError from "./ForbiddenError";
import NotFoundError from "./NotFoundError";

export default async (ctx: any, next: any) => {
  try {
    await next();
  } catch (err) {

    if (err instanceof AppError) {
      const responseError: ResponseError = {
        code: err.code,
        message: err.message
      };

      const responseBuilder: ResponseFormat = {
        success: false,
        message: '內部程式錯誤',
        data: {},
        error: responseError
      };

      ctx.status = 500;
      ctx.body = responseBuilder;
    }

    if (err instanceof BadRequestError) {
      const responseError: ResponseError = {
        code: err.code,
        message: err.message
      };

      const responseBuilder: ResponseFormat = {
        success: false,
        message: '資料欄位或內容錯誤',
        data: {},
        error: responseError
      };

      ctx.status = 400;
      ctx.body = responseBuilder;
    }

    if (err instanceof UnauthorizedError) {
      const responseError: ResponseError = {
        code: err.code,
        message: err.message
      };

      const responseBuilder: ResponseFormat = {
        success: false,
        message: '沒有權限的操作',
        data: {},
        error: responseError
      };

      ctx.status = 401;
      ctx.body = responseBuilder;
    }

    if (err instanceof ForbiddenError) {
      const responseError: ResponseError = {
        code: err.code,
        message: err.message
      };

      const responseBuilder: ResponseFormat = {
        success: false,
        message: '拒絕執行的操作',
        data: {},
        error: responseError
      };

      ctx.status = 403;
      ctx.body = responseBuilder;
    }

    if (err instanceof NotFoundError) {
      const responseError: ResponseError = {
        code: err.code,
        message: err.message
      };

      const responseBuilder: ResponseFormat = {
        success: false,
        message: '請求失敗',
        data: {},
        error: responseError
      };

      ctx.status = 404;
      ctx.body = responseBuilder;
    }
  }
}
