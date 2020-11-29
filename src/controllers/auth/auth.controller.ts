import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  Res,
  Headers,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { AuthService } from './auth.service';

// Entities.
import { RegisterDto, LoginDto } from './dto/auth.index';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @UseGuards(AuthGuard('jwt'))
    @Post('register')
    async register(@Res() res, @Body() registerDto: RegisterDto) {
      const registeredUser = await this.authService.register(registerDto);
      return res.status(HttpStatus.OK).json(registeredUser);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Post('login')
    async login(@Res() res, @Body() loginDto: LoginDto) {
      const loggedUser = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json(loggedUser);
    }
}
