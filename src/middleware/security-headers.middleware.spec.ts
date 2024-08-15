import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Request, Response } from "express";

import { SecurityHeadersMiddleware } from "./security-headers.middleware";

describe("SecurityHeadersMiddleware", () => {
  let securityHeadersMiddleware: SecurityHeadersMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityHeadersMiddleware],
    }).compile();

    securityHeadersMiddleware = module.get<SecurityHeadersMiddleware>(
      SecurityHeadersMiddleware,
    );
  });

  it("should be defined", () => {
    expect(securityHeadersMiddleware).toBeDefined();
  });

  it("should set security headers", () => {
    const mockReq = {} as Request;
    const mockRes = {
      setHeader: jest.fn(),
    } as Partial<Response> as Response;
    const mockNext = jest.fn();

    securityHeadersMiddleware.use(mockReq, mockRes, mockNext);

    expect(mockRes.setHeader).toHaveBeenCalledWith(
      "X-Content-Type-Options",
      "nosniff",
    );
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
    expect(mockNext).toHaveBeenCalled();
  });
});
