import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendContactEmail(
    firstName: string,
    lastName: string,
    email: string,
    subject: string,
    message: string,
  ) {
    const name = `${firstName} ${lastName}`;
    await this.mailerService.sendMail({
      subject: subject,
      from: `"${name} via Golf Cochem Kontaktformular" <${email}>`,
      template: "./contact",
      context: {
        name: name,
        subject: subject,
        message: message,
      },
    });
  }
}
