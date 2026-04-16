import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true, nullable: true})
    referralCode: string;

    @Column({ nullable: true })
    referredByUserId: string;

    @CreateDateColumn()
    createdDateAt: Date;

    @UpdateDateColumn()
    updatedDataAt: Date;
}

