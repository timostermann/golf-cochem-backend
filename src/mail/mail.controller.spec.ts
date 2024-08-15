import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import type { ContactFormDto } from "./dto/contact-form.dto";

describe("MailController", () => {
  let controller: MailController;
  let mailService: MailService;

  const mockMailService = {
    sendContactEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<MailController>(MailController);
    mailService = module.get<MailService>(MailService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should throw BadRequestException if acceptTerms is false", async () => {
    const contactFormDto: ContactFormDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Test Subject",
      message: "Test Message",
      acceptTerms: false,
    };

    await expect(controller.submitContactForm(contactFormDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should call sendContactEmail and return success message if form is valid", async () => {
    const contactFormDto: ContactFormDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Test Subject",
      message: "Test Message",
      acceptTerms: true,
    };

    const result = await controller.submitContactForm(contactFormDto);

    expect(mailService.sendContactEmail).toHaveBeenCalledWith(
      contactFormDto.firstName,
      contactFormDto.lastName,
      contactFormDto.email,
      contactFormDto.subject,
      contactFormDto.message,
    );

    expect(result).toEqual({ message: "Contact form submitted successfully" });
  });
});
