import { Body, Controller, Post, UseInterceptors} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserService } from 'src/modules/user/providers';
import { ROLE_ADMIN_TITLE } from 'src/common/constants/index'; 
@Controller('admin/auth')
export class AdminController {
    constructor(private userService: UserService) { }

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


}