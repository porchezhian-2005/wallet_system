import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor (
        private readonly usersService: UsersService,
    ){}
    async register(registerDto: RegisterDto){

        const existingUser = await this.usersService.findByEmail(registerDto.email);

        if(existingUser){
            throw new BadRequestException('Email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
       
        registerDto.password = hashedPassword;

        const {password, ...safeUser} = await this.usersService.create({
            ...registerDto,
            password: hashedPassword});

        return {
            message: 'Register done successfully',
            data: safeUser,
        };
    } 
}
