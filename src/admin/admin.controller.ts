import {
  Controller,
  Logger,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/shared/auth-guard';
import { LoginAdminDto, RegisterAdminDto } from './dto';
import { ChangePasswordDto } from 'src/shared';

//Admin Controller controls the admin module apis

@ApiUseTags('Admin Management')
@Controller('api/v1/admin')
export class AdminController {
  private logger = new Logger('Admin Controller');
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @Get('admin') // api to get the details of the admin
  getUser(@Req() req) {
    this.logger.verbose(`User Retrieved `);
    console.log(req);
    return this.adminService.getUser(req);
  }

  @Post('loginAdmin') // api to login the admin
  login(@Body() loginDto: LoginAdminDto) {
    return this.adminService.login(loginDto);
  }

  @Post('registerAdmin') //api to register the admin (optional to be removed in production just for registering in development process)
  register(@Body() registerDto: RegisterAdminDto): Promise<any> {
    return this.adminService.register(registerDto);
  }

  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @Put('ChangeAdminPassword') //api to change the password of the admin
  changePassword(@Req() req, @Body() data: ChangePasswordDto) {
    return this.adminService.changePassword(req.user, data);
  }
}
