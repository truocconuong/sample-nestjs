import { Body, Controller, Post, UseInterceptors, NotFoundException, Get, DefaultValuePipe, ParseIntPipe, Query, UseGuards, Param, Patch} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserService } from 'src/modules/user/providers';
import { ROLE_ADMIN_TITLE, ROLE_USER_TITLE } from 'src/common/constants/index'; 
import { AuthService } from '../providers';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { SubscripionsService } from '../../subscriptions/providers';
import { OrdersService } from '../../orders/providers';
import { UpdateUserDto } from '../../user/dto/update-user.dto';

@Controller('admin/auth')
export class AdminController {
    constructor(private userService: UserService, private authService: AuthService, private subscripionsService: SubscripionsService, private orderService: OrdersService) { }

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

    @Get('order')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getAllOrder(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ){
      limit = limit > 100 ? 100 : limit;
      return this.orderService.getAll({
        page,
        limit,
      });
    }

    @Get('user')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getAllUser(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
      ){
        const role = await this.userService.findRole({title: ROLE_USER_TITLE})
        limit = limit > 100 ? 100 : limit;
        return this.userService.getAll({
          page,
          limit,
        },role!.id);
    }

    @Get('user/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getUserDetail(@Param('id') id: string){
        const UserDetail = await this.userService.findUserDetail(id)
        return UserDetail
    }

    @Patch('user/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    public async updateUserDetail(@Param('id')id: string, @Body() body: UpdateUserDto){
        const user = await this.userService.findById(id)
        if(!user){
            throw new NotFoundException('User Not Found!')
        }
        return await this.userService.update(id, body)
    }

    @Get('subscription/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getSubscriptionDetail(@Param('id') id: string){
        const subscription = await this.subscripionsService.findById(id)
        return subscription
    }  

}