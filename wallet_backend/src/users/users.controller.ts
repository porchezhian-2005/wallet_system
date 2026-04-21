import { Controller, Get, Req, UseGuards, NotFoundException} from '@nestjs/common';
import { jwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { UsersService } from './users.service';


@Controller('/users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @UseGuards(jwtAuthGuard)
    @Get('/profile')
    async getprofile(@Req() req){
        const user = await this.usersService.findById(req.user.sub);
        if(!user){
            throw new NotFoundException('User not founded')
        }
        return {
            role: user.role,
            email: user.email,
            referralcode: user.referralCode
        }
    }
}
