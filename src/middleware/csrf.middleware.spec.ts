import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Request, Response } from "express";
import * as cookieParser from "cookie-parser";
import * as csurf from "csurf";

import { CsrfMiddleware } from "./csrf.middleware";

jest.mock("cookie-parser");
jest.mock("csurf");

const mockCookieParser = cookieParser as unknown as jest.Mock;
const mockCsurf = csurf as unknown as jest.Mock;

describe("CsrfMiddleware", () => {
  let csrfMiddleware: CsrfMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsrfMiddleware],
    }).compile();

    csrfMiddleware = module.get<CsrfMiddleware>(CsrfMiddleware);
  });

  it("should be defined", () => {
    expect(csrfMiddleware).toBeDefined();
  });

  it("should apply cookie-parser and csurf middleware", () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();

    const mockCookieParserImpl = jest
      .fn()
      .mockImplementation((req, res, next) => next());
    mockCookieParser.mockReturnValue(mockCookieParserImpl);

    const mockCsurfImpl = jest
      .fn()
      .mockImplementation((req, res, next) => next());
    mockCsurf.mockReturnValue(mockCsurfImpl);

    csrfMiddleware.use(mockReq, mockRes, mockNext);

    expect(mockCookieParser).toHaveBeenCalled();
    expect(mockCookieParserImpl).toHaveBeenCalledWith(
      mockReq,
      mockRes,
      expect.any(Function),
    );
    expect(mockCsurf).toHaveBeenCalledWith({ cookie: true });
    expect(mockCsurfImpl).toHaveBeenCalledWith(
      mockReq,
      mockRes,
      expect.any(Function),
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle errors in cookie-parser", () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();

    const mockError = new Error("cookie-parser error");
    const mockCookieParserImpl = jest
      .fn()
      .mockImplementation((req, res, next) => next(mockError));
    mockCookieParser.mockReturnValue(mockCookieParserImpl);

    csrfMiddleware.use(mockReq, mockRes, mockNext);

    expect(mockCookieParser).toHaveBeenCalled();
    expect(mockCookieParserImpl).toHaveBeenCalledWith(
      mockReq,
      mockRes,
      expect.any(Function),
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
