import { Eusers } from './../../app/users/users.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  async (data, ctx: ExecutionContext): Promise<any> => {
    return 1;
    // TODO
    const req: Request = ctx.switchToHttp().getRequest();
    let user;
    if (req.headers.user) {
      user = JSON.parse(decodeURIComponent(<string>req.headers.user));
    }
    return user.user;
  },
);
