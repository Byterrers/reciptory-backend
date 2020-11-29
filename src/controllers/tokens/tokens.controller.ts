import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';

// Services.
import { TokensService } from './tokens.service';

// Entities.
import { TokenDto } from './dto/token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  async createValidToken(@Body() createTokenDto: TokenDto, @Res() res) {
    const { token } = createTokenDto;
    const newValidToken = await this.tokensService.insertValidToken(token);
    return res.status(HttpStatus.OK).json(newValidToken);
  }

  @Post()
  async createExpiredToken(@Body() createTokenDto: TokenDto, @Res() res) {
    const { token } = createTokenDto;
    const newExpiredToken = await this.tokensService.insertExpiredToken(token);
    return res.status(HttpStatus.OK).json(newExpiredToken);
  }

  @Delete(':id')
  async deleteValidToken(@Param('validToken') validToken, @Res() res) {
    await this.tokensService.deleteValidToken(validToken);
    return res.status(HttpStatus.OK).json(null);
  }
}
