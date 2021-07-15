import { Body, Controller, Post, UseInterceptors, NotFoundException, Get, DefaultValuePipe, ParseIntPipe, Query, UseGuards} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserService } from 'src/modules/user/providers';
import { ROLE_ADMIN_TITLE } from 'src/common/constants/index'; 
import { AuthService } from '../providers';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { SubscripionsService } from '../../subscriptions/providers';

@Controller('admin/auth')
export class AdminController {
    constructor(private userService: UserService, private authService: AuthService, private subscripionsService: SubscripionsService) { }

    @Post('sign-up')
    @UseInterceptors(TransformInterceptor)
    public async signUp(@Body() body: any){
        const role = await this.userService.findRole({title: ROLE_ADMIN_TITLE})
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
    public async signIn(@Body() body: any){
        const user = await this.userService.findOne({
            email : body.email
        },{
            select :['password', 'id', 'email', 'otp']
        })
        if(!user){
            throw new NotFoundException('Email incorrect')
        }
        const isMatch = await bcrypt.compare(body.password, user!.password);
        if(!isMatch){
            throw new NotFoundException('Password incorrect')
        }
        const token = this.authService.signJwt(user)
        return token
    }


    @Get('subscription')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async index(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ){
      limit = limit > 100 ? 100 : limit;
      return this.subscripionsService.getAll({
        page,
        limit,
      });
    }
}