import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginAdminDto } from './dto';
import { ChangePasswordDto } from 'src/shared';

@Injectable()
export class AdminService {
  private logger = new Logger('Admin Service');
  constructor(
    @InjectRepository(AdminRepository)
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}
  async getUser(req: any): Promise<any> {
    const { email } = req.user;
    const admin = await this.adminRepository.findOne({ email });

    if (admin) {
      this.logger.verbose(`admin Logged In ${admin.name}`);
      const { ...result } = admin;
      delete result.password;
      delete result.id;
      let finalresult = { ...result, type: 'admin' };
      return {
        success: true,
        message: 'Success',
        data: finalresult,
      };
    }
    throw new UnauthorizedException();
  }
  //validate admin checks whether the credentials are present in the database
  async validateadmin(email: string, password: string): Promise<any> {
    try {
      const admin = await this.adminRepository.findOne({ email: email });

      if (admin) {
        console.log(admin, 'hello');
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          return admin;
        } else {
          return null;
        }
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'Something went wrong..! Login failed.',
      };
    }
  }
  async login(data: LoginAdminDto) {
    const admin = await this.validateadmin(data.email, data.password);
    if (admin) {
      const { email } = admin;
      const payload = { email, type: 'admin' };
      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException({
        detail: 'invalid username or password',
      });
    }
  }
  async register(data: any): Promise<any> {
    try {
      if (data.password !== data.confirm) {
        return {
          success: false,
          message: 'Error',
          data: {
            confirm: 'Password and confirm password must be same.',
          },
        };
      }
      const user = await this.adminRepository.findOne({ email: data.email });
      if (!user) {
        data.password = await bcrypt.hash(data.password, 10);
        data.status = 'ACTIVE';

        const registerUser = await this.adminRepository.save(data);
        const { ...result } = registerUser;
        delete result.password;
        delete result.confirm;
        return {
          success: true,
          message: 'Success',
          data: result,
        };
      }
      return {
        success: false,
        message: 'Error',
        data: {
          uniqueId: 'User already exist, please login.',
        },
      };
    } catch (e) {
      global.console.log('err', e);
      return {
        success: false,
        message: 'Something went wrong..! Registration failed.',
      };
    }
  }

  async changePassword(user: any, data: ChangePasswordDto): Promise<any> {
    const email = user.email;
    const found = await this.adminRepository.findOne({ email });
    const match = await bcrypt.compare(data.currentPassword, found.password);
    if (!match) {
      return {
        success: false,
        message: 'Error',
        data: {
          confirmPassword: 'Current Password is incorrect',
        },
      };
    }
    if (data.password === data.confirm) {
      found.password = await bcrypt.hash(data.password, 10);
      await this.adminRepository.save(found);
      return {
        success: true,
        message: 'Success',
      };
    }
    return {
      success: false,
      message: 'Error',
      data: {
        confirmPassword: 'Password and confirm Password must be same',
      },
    };
  }
}
