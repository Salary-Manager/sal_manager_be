import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @ApiModelProperty({ example: null })
  @IsEmail()
  readonly email: string;
}
