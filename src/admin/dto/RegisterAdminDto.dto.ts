import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsIn,
  IsNumber,
} from 'class-validator';

export class RegisterAdminDto {

  @ApiModelProperty({ example: null })
  @IsString()
  name: string;

  @ApiModelProperty({ example: null })
  @IsString()
  email: string;
  
  @ApiModelProperty({ example: null })
  @IsString()
  @IsIn(['Male', 'Female'])
  gender: string;

  @ApiModelProperty({ example: null })
  @IsString()
  @MinLength(7)
  @MaxLength(49)
  // @Matches(/^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[!@#$%^&*]).{7,}$/, { message: 'Password too Weak' })
  password: string;

  @ApiModelProperty({ example: null })
  @IsString()
  confirm: string;
}
