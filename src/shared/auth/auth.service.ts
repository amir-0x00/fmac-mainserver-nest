import { Eusers_group } from './../../app/users_group/users_group.entity';
import { HttpException } from './../exceptions/http.exception';
import { db } from 'src/utils/database/database';
import { Eusers } from './../../app/users/users.entity';
import { loginDTO } from './auth.dto';
import { Injectable, HttpStatus } from '@nestjs/common';

export interface findByLogin_return {
  user?: Eusers;
  group?: Eusers_group;
}

@Injectable()
export class AuthService {
  async findByLogin(userDTO: loginDTO) {
    const { user_name, password } = userDTO,
      result: findByLogin_return = {};
    result.user = await db.es_slc<Eusers>('users').w({ user_name, password }).one();

    if (!result.user.i) {
      throw new HttpException({ msg: 'اسم المستخدم او كلمة المرور غير صحيحة' }, HttpStatus.UNAUTHORIZED);
    }

    result.group = await db.es_slc<Eusers_group>('users_group').w({ i: result.user.i }).one();
    return result;
  }
}
