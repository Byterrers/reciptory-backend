import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  Res,
  HttpStatus
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { extname } from 'path';

import * as crypto from 'crypto';

@Controller('utils')
export class UtilsController {
  constructor() {}

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './assets/images/avatars',
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(20).toString('hex');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        }
      })
    })
  )
  uploadAvatar(@UploadedFile() file, @Res() res) {
    const path = file.path.replace(`assets\\images\\avatars\\`, '');
    return res
      .status(HttpStatus.OK)
      .json(`http://localhost:3000/api/utils/avatars/${path}`);
  }

  @Post('upload/recipe')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './assets/images/recipes',
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(20).toString('hex');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        }
      })
    })
  )
  uploadImage(@UploadedFile() file, @Res() res) {
    const path = file.path.replace(`assets\\images\\recipes\\`, '');
    return res
      .status(HttpStatus.OK)
      .json(`http://localhost:3000/api/utils/recipics/${path}`);
  }

  @Get('avatars/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: './assets/images/avatars' });
  }

  @Get('recipics/:fileId')
  async serveRecipic(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: './assets/images/recipes' });
  }
}
