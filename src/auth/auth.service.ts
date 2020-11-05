import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordDto } from 'src/shared';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private logger = new Logger('Admin Service');
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  async getUser(req: any): Promise<any> {
    const type = req.user.type;
    console.log(type);
    if (type === 'user') {
      return this.userService.getUser(req);
    } else if (type === 'admin') {
      return this.adminService.getUser(req);
    }
    throw new UnauthorizedException();
  }

  async changePass(user: any, data: ChangePasswordDto): Promise<any> {
    const type = user.type;
    if (type === 'user') {
      return this.userService.changePassword(user, data);
    } else if (type === 'admin') {
      return this.adminService.changePassword(user, data);
    }
  }
}
