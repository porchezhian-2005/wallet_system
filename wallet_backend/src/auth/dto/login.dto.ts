import { IsEmail, IsNotEmpty } from "class-validator";

export class logindto{

    @IsEmail()
    email:string;

    @IsNotEmpty()
    password:string;
}