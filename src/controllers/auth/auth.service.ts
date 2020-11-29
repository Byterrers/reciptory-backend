import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';

// JWT.
import { JwtService } from '@nestjs/jwt';

// Mongoose.
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities.
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/auth.index';
import { IAuth } from './interfaces/auth.interface';
import { IJWTPayload } from './jwt-payload.interface';

// BCrypt.
import * as bcrypt from 'bcryptjs';

// Outsider services.
import { UsersInfoService } from '../users-info/users-info.service';
import { UsersInventoryService } from '../users-inventory/users-inventory.service';
import { UsersTimelineService } from '../users-timeline/users-timeline.service';
import { RecipesBookService } from '../recipesBook/recipesBook.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly userModel: Model<IAuth>,
    private readonly jwtService: JwtService,
    private readonly usersInfoService: UsersInfoService,
    private readonly usersInventoryService: UsersInventoryService,
    private readonly usersTimelineService: UsersTimelineService,
    private readonly recipesBookService: RecipesBookService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    await this.validateUserByEmail(email);

    const newUser = new this.userModel({
      email,
      password: await bcrypt.hash(password, 10)
    });

    const registedUser = await newUser.save();

    await this.usersInfoService.insertUsersInfo(
      registedUser._id,
      email.substr(0, email.indexOf('@')),
      '',
      '',
      '',
      '',
      `https://api.adorable.io/avatars/300/${email.substr(
        0,
        email.indexOf('@')
      )}@adorable.pngCopy`,
      [],
      [],
      [],
      [],
      []
    );

    await this.usersInventoryService.insertUsersInventory(
      registedUser._id,
      [],
      [],
      [],
      []
    );

    await this.recipesBookService.insertRecipesBook(
      'My Recipes Book',
      [],
      registedUser._id,
      true
    );

    await this.usersTimelineService.insertUsersTimeline(registedUser._id, []);

    const response = this.login({ email, password });

    return response;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: IJWTPayload = {
      sub: user.id,
      email: user.email
    };

    // tslint:disable-next-line: variable-name
    const access_token = this.jwtService.sign(payload);

    return {
      access_token
    };
  }

  // Utilities.

  async validateUserByEmail(email: string): Promise<boolean> {
    let user;

    try {
      user = await this.userModel
        .findOne({ email: new RegExp(email, 'i') })
        .exec();
    } catch (e) {
      throw new ConflictException('E-mail already exists');
    }

    if (user) {
      throw new ConflictException('E-mail already exists');
    }

    return true;
  }

  async findUserByEmail(email: string) {
    let user;

    try {
      user = await this.userModel.findOne({ email }).exec();
    } catch (e) {
      throw new NotFoundException('Wrong credentials.');
    }

    if (!user) {
      throw new NotFoundException('Wrong credentials.');
    }

    return {
      id: user._id.toHexString(),
      email: user.email,
      password: user.password
    };
  }
}
