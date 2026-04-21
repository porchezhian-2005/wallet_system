import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrkey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }
    async validate(payload: any){
        try{
            if(!payload){
                throw new UnauthorizedException('Invalid token payload');
            }
            return payload;
        }
        catch(error){
            throw new UnauthorizedException('token validation failed')
        }
    }
}