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
  import { UserService } from './user.service';
  import { AuthGuard } from '../shared/auth-guard';
  import { LoginUserDto, RegisterUserDto } from './dto';
  import { userInfo } from 'os';
  import { ChangePasswordDto } from 'src/shared';
  
  @ApiUseTags('User Management')
  @Controller('api/v1/user')
  export class UserController {
    private logger = new Logger('User Controller');
    constructor(private readonly userService: UserService) {}
    @ApiBearerAuth()
    @UseGuards(new AuthGuard())
    @Get('getUser')
    getUser(@Req() req) {
      this.logger.verbose(`User Retrieved `);
      console.log(req);
      return this.userService.getUser(req);
    }
  
    @Post('loginUser') //api to login User
    login(@Body() loginDto: LoginUserDto) {
      return this.userService.login(loginDto);
    }
  
    @Post('registerUser') //api to register User to be removed in production
    register(@Body() registerDto: RegisterUserDto): Promise<any> {
      return this.userService.register(registerDto);
    }
  
    @ApiBearerAuth()
    @UseGuards(new AuthGuard())
    @Put('ChangeUserPassword') //api to change the password of the User
    changePassword(@Req() req, @Body() data: ChangePasswordDto) {
      return this.userService.changePassword(req.user, data);
    }
  }
  