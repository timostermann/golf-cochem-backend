import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

import { MailService } from "./mail.service";
import { ContactFormDto } from "./dto/contact-form.dto";

@Controller("contact")
@UseGuards(ThrottlerGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitContactForm(@Body() contactFormDto: ContactFormDto) {
    const { firstName, lastName, email, subject, message, request } =
      contactFormDto;

    if (request) {
      throw new BadRequestException();
    }

    if (!contactFormDto.acceptTerms) {
      throw new BadRequestException("You must accept the terms and conditions");
    }

    await this.mailService.sendContactEmail(
      firstName,
      lastName,
      email,
      subject,
      message,
    );
    return { message: "Contact form submitted successfully" };
  }
}
