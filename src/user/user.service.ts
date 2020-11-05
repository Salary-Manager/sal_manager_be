import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from 'src/shared';

@Injectable()
export class UserService {
  private logger = new Logger('user service');
  constructor(
    @InjectRepository(UserRepository)
    private readonly UserRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getUser(req: any): Promise<any> {
    const { email } = req.user;
    const user = await this.UserRepository.findOne({ email });

    if (user) {
      this.logger.verbose(`user Logged In ${user.name}`);
      const { ...result } = user;
      delete result.password;
      delete result.id;
      let finalresult = { ...result, type: 'user' };
      return {
        success: true,
        message: 'Success',
        data: finalresult,
      };
    }
    throw new UnauthorizedException();
  }

  async validateUser(admissoinId: string, password: string): Promise<any> {
    try {
      const user = await this.UserRepository.findOne({
        email: admissoinId,
      });
      console.log(user);
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return user;
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

  async login(data: LoginUserDto) {
    const user = await this.validateUser(data.email, data.password);
    if (user) {
      const { email } = user;
      const payload = { email, type: 'user' };
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
      const user = await this.UserRepository.findOne({ email: data.email });
      if (!user) {
        data.password = await bcrypt.hash(data.password, 10);
        data.status = 'ACTIVE';

        const registerUser = await this.UserRepository.save(data);
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
    const found = await this.UserRepository.findOne({ email });
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
      await this.UserRepository.save(found);
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
