import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserService } from 'src/modules/user/providers';

@Controller('admin/auth')
export class AdminController {
    constructor(private userService: UserService) { }

    @Post('sign-up')
    @UseInterceptors(TransformInterceptor)
    public async signUp(@Body() body: any){
        const role = await this.userService.findRole({title: 'admin'})
        const saltOrRounds = 10;
        const hashPassword = await bcrypt.hash(body.password, saltOrRounds)
        const information = {
            email: body.email,
            password: hashPassword,
            role_id: role!.id 
        }
        const user = await this.userService.create(information);
        return user
    }
    
}