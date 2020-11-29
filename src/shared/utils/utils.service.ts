import { Injectable, Post } from '@nestjs/common';

// JWT.
import * as jwt from 'jwt-decode';

@Injectable()
export class UtilsService {
  constructor() {}

  extractUserIdFromToken(authorization: string) {
    // return jwt(authorization.slice(7, authorization.length)).sub;
  }
}
