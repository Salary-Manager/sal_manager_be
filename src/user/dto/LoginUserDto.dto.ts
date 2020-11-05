import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiModelProperty({ example: null })
  email: string;

  @ApiModelProperty({ example: null })
  @IsString()
  password: string;
}
