import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { UserService } from 'src/modules/user/providers';
import { OtpService } from 'src/shared/otp/otp.service';
import { GetUser } from '../decorators/get-user.decorators';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthService } from '../providers';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private otpService: OtpService, private authService: AuthService) { }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async getProfile(@GetUser() user: UserModel): Promise<UserModel | undefined> {
       return user
    }

    @Post('send-otp')
    @UseInterceptors(TransformInterceptor)
    public async sendOtpEmail(@Body() body: SendOtpDto): Promise<boolean> {
        const { email } = body;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Email cannot exists')
        }
        const generateToken = this.otpService.generateTokenByEmail(email);
        // update token to user
        await this.userService.update(user.id, {
            otp: generateToken.token as string
        })
        return true
    }


    @Post('verify-otp')
    @UseInterceptors(TransformInterceptor)
    public async verifyOtpEmail(@Body() body: VerifyOtpDto): Promise<{ access_token: string }> {
        const { email, otp } = body;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Email cannot exists')
        }
        if (user.otp !== otp) {
            throw new NotFoundException('Otp cannot exists');
        }

        const isValid = this.otpService.checkValidToken(user.otp, email)
        if (!isValid) {
            throw new HttpException('Otp expired', HttpStatus.UNAUTHORIZED);
        }

        await this.userService.update(user.id, {
            is_verify: true
        })
        const token = this.authService.signJwt(user)
        return token
    }

}