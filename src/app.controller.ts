import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller()
export class AppController {
  @Get("csrf-token")
  getCsrfToken(@Req() req: Request): { csrfToken: string } {
    return { csrfToken: req.csrfToken() };
  }
}
