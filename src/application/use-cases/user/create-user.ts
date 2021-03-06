import { UserExistsError } from '~/application/errors/user-exists-error';
import { CreateUserRepository } from '~/application/ports/repositories/create-user-repository';
import { FindUserByEmailRepository } from '~/application/ports/repositories/find-user-by-email-repository';
import { PasswordHashing } from '~/application/ports/security/password-hashing';
import { CreateUserRequestWithPasswordString } from '~/application/ports/user/create-user-request-model';
import { CreateUserUseCase } from '~/application/ports/user/create-user-use-case';
import { User } from '~/domain/user/user';

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly passwordHashing: PasswordHashing,
  ) {}

  async create(userData: CreateUserRequestWithPasswordString): Promise<User> {
    const userExists = await this.findUserByEmailRepository.findByEmail(
      userData.email,
    );

    if (userExists) {
      throw new UserExistsError('User already created');
    }

    const password_hash = await this.passwordHashing.hash(userData.password);
    const userWithPasswordHash = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password_hash,
    };
    const user = await this.createUserRepository.create(userWithPasswordHash);
    return user;
  }
}
