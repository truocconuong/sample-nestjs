import { Body, Controller, Get, NotFoundException, Post, UseGuards, UseInterceptors, Req, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { UserService } from 'src/modules/user/providers';
import { OtpService } from 'src/shared/otp/otp.service';
import { GetUser } from '../decorators/get-user.decorators';
import { ActionTypeSendOtp, SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthService } from '../providers';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SendOtpConfirmDto } from '../dto/send-otp-confirm.dto';
import { VerifyOtpUserUpdateDto } from '../dto/verify-otp-user-update.dto';
import { EmailService } from 'src/shared/email/email.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private otpService: OtpService, private authService: AuthService, private emailService: EmailService) { }

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async getProfile(@GetUser() user: UserModel): Promise<UserModel | undefined> {
        let totalAssets = 0;
        const profileUser = await this.userService.getProfileUser(user.id);
        const yourLegacy: any = {
            email: profileUser?.email,
            full_legal_name: profileUser?.full_legal_name,
            will_pdf_link: profileUser?.will_pdf_link,
            will_registry: profileUser?.will_registry
        };

        if (profileUser?.insurance_policies) {
            const total = _.sum(_.map(profileUser?.insurance_policies, insurance => insurance.current_value))
            if (_.isNumber(total)) {
                totalAssets += total
            }
            yourLegacy.insurance_policies = {
                total: _.isNumber(total) ? total : 0,
                data: profileUser.insurance_policies
            }
        }

        if (profileUser?.investments) {
            const total = _.sum(_.map(profileUser?.investments, investment => investment.current_market_value))
            if (_.isNumber(total)) {
                totalAssets += total
            }
            yourLegacy.investments = {
                total: _.isNumber(total) ? total : 0,
                data: profileUser.investments
            }
        }

        if (profileUser?.properties) {
            const total = _.sum(_.map(profileUser?.properties, property => property.outstanding_loan_amount))
            if (_.isNumber(total)) {
                totalAssets += total
            }
            yourLegacy.properties = {
                total: _.isNumber(total) ? total : 0,
                data: profileUser.properties
            }
        }

        if (profileUser?.bank_accounts) {
            const total = _.sum(_.map(profileUser?.bank_accounts, bankAccount => bankAccount.current_balance))
            if (_.isNumber(total)) {
                totalAssets += total
            }
            yourLegacy.bank_accounts = {
                total: _.isNumber(total) ? total : 0,
                data: profileUser.bank_accounts
            }
        }

        if (profileUser?.business_interests) {
            const total = _.sum(_.map(profileUser?.business_interests, businessInterest => businessInterest.estimated_current_market_value))
            if (_.isNumber(total)) {
                totalAssets += total
            }
            yourLegacy.business_interests = {
                total: _.isNumber(total) ? total : 0,
                data: profileUser.business_interests
            }
        }

        if (profileUser?.beneficiaries) {
            yourLegacy.beneficiaries = {
                data: profileUser.beneficiaries
            }
        }

        if (profileUser?.executors) {
            yourLegacy.executors = {
                data: profileUser.executors
            }
        }

        if (profileUser?.valuables) {
            yourLegacy.valuables = {
                data: profileUser.valuables
            }
        }


        yourLegacy.totalAssets = totalAssets;
        return yourLegacy
    }


    @Post('send-otp')
    @UseInterceptors(TransformInterceptor)
    public async sendOtpEmail(@Body() body: SendOtpDto): Promise<boolean> {
        const { email, type } = body;
        if (type === ActionTypeSendOtp.SIGNUP) {
            const user = await this.userService.findOne({ email: email });
            if (user) {
                throw new NotFoundException('This email already exists!')
            }
        }
        const generateToken = this.otpService.generateTokenByEmail(email);
        console.log('send otp', generateToken.token, email)
        this.emailService.sendEmailOtp(email, generateToken.token)
        return true
    }

    @Post('send-otp-confirm')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async sendOtpEmailConfirm(@Body() body: SendOtpConfirmDto): Promise<boolean> {
        const { email } = body;
        const generateToken = this.otpService.generateTokenByEmail(email);

        if (generateToken.token) {
            this.emailService.sendEmailOtp(email, generateToken.token)
        }

        return true
    }

    @Post('verify-otp-user-update-email')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async verifyOtpEmailUserUpdate(@GetUser() user: UserModel, @Body() body: VerifyOtpUserUpdateDto): Promise<boolean> {
        const { email, otp } = body;
        const isValid = this.otpService.checkValidToken(user.otp, email)
        if (!isValid) {
            throw new HttpException('Otp expired', HttpStatus.UNAUTHORIZED);
        }
        const checkEmailExists = await this.userService.checkEmailExists(user.id, email)

        if (checkEmailExists) {
            throw new HttpException('Email update did exists by system', HttpStatus.CONFLICT);
        }

        await this.userService.update(user.id, {
            otp,
            email,
            is_verify: true
        })
        return true
    }



    @Post('verify-otp')
    @UseInterceptors(TransformInterceptor)
    public async verifyOtpEmail(@Body() body: VerifyOtpDto): Promise<{ access_token: string }> {
        const { email, otp } = body;
        const user = await this.userService.findOne({ email: email });
        if (!user) {
            throw new NotFoundException('Email cannot exists')
        }
        // if (user.otp !== otp) {
        //     throw new NotFoundException('Otp cannot exists');
        // }
        console.log(otp, email, 'verify otp')
        const isValid = this.otpService.checkValidToken(otp, email)
        if (!isValid) {
            throw new HttpException('Otp expired', HttpStatus.UNAUTHORIZED);
        }

        await this.userService.update(user.id, {
            is_verify: true
        })
        const token = this.authService.signJwt(user)
        return token
    }

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async logOut(@Req() request: Request) {
        const jwt = await request.headers.authorization;
        await this.userService.createBlackList(jwt!)
        return true
    }

}