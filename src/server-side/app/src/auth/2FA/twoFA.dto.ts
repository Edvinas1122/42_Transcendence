import { IsNotEmpty, IsString } from "class-validator";

export class TwoFACodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;
    tempCode: string;
  }

export class TwoFATempCodeDto {
  code: string;
}