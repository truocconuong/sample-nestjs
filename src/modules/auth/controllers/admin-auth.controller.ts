import { Body, Controller, Post, UseInterceptors, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserService } from 'src/modules/user/providers';
import { ROLE_ADMIN_TITLE } from 'src/common/constants/index';
import { AuthService } from '../providers';
import { SignUpAdminDto } from '../dto/sign-up-admin.dto';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('admin/auth')
export class AdminController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Post('sign-up')
    @UseInterceptors(TransformInterceptor)
    public async signUp(@Body() body: SignUpAdminDto) {
        console.log('clgt')
        const { email } = body;

        const checkUserExist = await this.userService.findByEmail(email);
        if (checkUserExist) {
            throw new HttpException('Email exists', HttpStatus.CONFLICT)
        }

        const role = await this.userService.findRole({ title: ROLE_ADMIN_TITLE })
        const hashPassword = await bcrypt.hash(body.password, Number(process.env.SALT_NUMBER))
        const information = {
            email: body.email,
            password: hashPassword,
            role_id: role!.id,
            full_legal_name: body.name
        }
        const user = await this.userService.create(information);
        return user
    }

    @Post('sign-in')
    @UseInterceptors(TransformInterceptor)
    public async signIn(@Body() body: SignInDto) {
        const user = await this.userService.findOne({
            email: body.email
        }, {
            select: ['password', 'id', 'email', 'otp']
        })
        if (!user) {
            throw new NotFoundException('Email incorrect')
        }
        const isMatch = await bcrypt.compare(body.password, user!.password);
        if (!isMatch) {
            throw new NotFoundException('Password incorrect')
        }
        const token = this.authService.signJwt(user)
        return token
    }
}