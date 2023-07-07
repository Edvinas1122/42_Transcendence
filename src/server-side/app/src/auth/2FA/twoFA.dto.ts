import { IsNotEmpty, IsString } from "class-validator";

export class TwoFACodeDto {
    code: string;
  }

export class TwoFATempCodeDto {
  code: string;
}