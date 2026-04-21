import { Injectable, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { logindto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configservice: ConfigService,
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

    async login(Logindto: logindto){
        const user = await this.usersService.findByEmail(Logindto.email);

        if(!user){
           throw new UnauthorizedException('Invalid credentials') 
        }

        const passwordisValid = await bcrypt.compare(
            Logindto.password,
            user.password,
        )

        if(!passwordisValid){
            throw new UnauthorizedException('Invalid password')
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        const accessToken = this.jwtService.sign(payload);
        const refreshToken =  this.jwtService.sign({sub: user.id},
            {
                secret: this.configservice.get('JWT_REFRESH_SECRET'),
                
                expiresIn: this.configservice.get('JWT_REFRESH_EXPIRATION'),
                
            }
            
        );

        await this.usersService.updateRefreshToken(
            user.id,
            refreshToken,
        );

        return{
            message:    "Login successfully",
            accessToken:  accessToken,
            refreshToken: refreshToken,
        };
        
    }
}
