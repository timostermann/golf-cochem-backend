import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { MailerService } from "@nestjs-modules/mailer";

import { MailService } from "./mail.service";

describe("MailService", () => {
  let service: MailService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call sendMail with correct parameters", async () => {
    const firstName = "John";
    const lastName = "Doe";
    const email = "john.doe@example.com";
    const subject = "Test Subject";
    const message = "Test Message";

    await service.sendContactEmail(
      firstName,
      lastName,
      email,
      subject,
      message,
    );

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      subject: subject,
      from: `"John Doe via Golf Cochem Kontaktformular" <${email}>`,
      template: "./contact",
      context: {
        name: "John Doe",
        subject: subject,
        message: message,
      },
    });
  });
});
