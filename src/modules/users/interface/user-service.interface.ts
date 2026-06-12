import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { UserEntity } from './user.interface';

export interface IUserService {
    create(data: CreateUserDto): Promise<UserEntity>;
    findOne(id: number): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    update(id: number, data: UpdateUserDto): Promise<UserEntity>;
    remove(id: number): Promise<{ message: string }>;
}