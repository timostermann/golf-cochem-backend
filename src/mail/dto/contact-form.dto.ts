import type { TransformFnParams } from "class-transformer";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
} from "class-validator";
import * as sanitizeHtml from "sanitize-html";

export class ContactFormDto {
  @IsNotEmpty()
  @IsString()
  @Transform((params: TransformFnParams) =>
    sanitizeHtml(params.value)
      .replace(/https?:\/\//g, "")
      .replace(/www\./g, ""),
  )
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Transform((params: TransformFnParams) =>
    sanitizeHtml(params.value)
      .replace(/https?:\/\//g, "")
      .replace(/www\./g, ""),
  )
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @Transform((params: TransformFnParams) =>
    sanitizeHtml(params.value)
      .replace(/https?:\/\//g, "")
      .replace(/www\./g, ""),
  )
  message: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform((params: TransformFnParams) => params.value === "true")
  acceptTerms: boolean;

  @IsOptional()
  @IsString()
  request?: string;
}
