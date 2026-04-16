import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor (
        private readonly usersService: UsersService,
    ){}

    private generateReferralCode(): string{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let referralCode = '';

        for (let i=0; i<8; i++){
            referralCode += characters.charAt(
                Math.random()*characters.length
            );

        }
        return referralCode;
    }
    async register(registerDto: RegisterDto){

        const existingUser = await this.usersService.findByEmail(registerDto.email);

        if(existingUser){
            throw new BadRequestException('Email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        let referralCode: string;
        let referralCodeExists: User | null;
        do{
            referralCode = this.generateReferralCode();
            referralCodeExists = await this.usersService.findByreferralCode(referralCode);

        }
        while(referralCodeExists);
       
        registerDto.password = hashedPassword;

        const {password, ...safeUser} = await this.usersService.create({
            ...registerDto,
            password: hashedPassword, referralCode});

        return {
            message: 'Register done successfully',
            data: safeUser,
        };
    } 
}
