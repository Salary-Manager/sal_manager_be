import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiModelProperty({ example: null })
  @IsString()
  email: string;

  @ApiModelProperty({ example: null })
  @IsString()
  password: string;
}
