import {
  Controller,
  Logger,
  UseGuards,
  Get,
  Req,
  Body,
  Put,
} from '@nestjs/common';
import {
  ApiServiceUnavailableResponse,
  ApiUseTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/shared/auth-guard';
import { ChangePasswordDto } from 'src/shared';

@ApiUseTags('Auth Management')
@Controller('api/v1/auth')
export class AuthController {
  private logger = new Logger('Auth Controller');
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @Get('user') //api to get the details of the user logged
  getUser(@Req() req) {
    this.logger.verbose(`User Retrieved `);
    return this.authService.getUser(req);
  }

  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @Put('change-password') //api to change the password of any user
  changepass(@Req() req, @Body() changepassdto: ChangePasswordDto) {
    this.logger.verbose('password of the user changed');
    return this.authService.changePass(req.user, changepassdto);
  }
}
