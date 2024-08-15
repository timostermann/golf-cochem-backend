import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import * as csurf from "csurf";
import * as cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, (err) => {
      if (err) {
        return next(err);
      }
      csurf({ cookie: true })(req, res, next);
    });
  }
}
