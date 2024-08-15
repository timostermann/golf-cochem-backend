import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Request } from "express";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(appController).toBeDefined();
  });

  it("should return csrf token", () => {
    const mockRequest = {
      csrfToken: jest.fn().mockReturnValue("mockCsrfToken"),
    } as Partial<Request> as Request;

    const result = appController.getCsrfToken(mockRequest);
    expect(result).toEqual({ csrfToken: "mockCsrfToken" });
    expect(mockRequest.csrfToken).toHaveBeenCalled();
  });
});
