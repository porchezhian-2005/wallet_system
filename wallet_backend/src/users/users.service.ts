import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>) {
        return this.userRepository.save(userData)
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({
            where: { email },
        });

    }
    async findByreferralCode(referralCode: string) {
        return this.userRepository.findOne({
            where: { referralCode },
        });
    }

    async updateRefreshToken(
        userId: string,
        refreshToken: string,
    ) {
        await this.userRepository.update(userId, {
            refreshToken,
        });
    }

    async findById(id: string){
        return this.userRepository.findOne({
            where:{id},
        })
    }

}


