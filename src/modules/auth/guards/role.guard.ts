import { ExecutionContext, CanActivate, Inject, forwardRef, mixin} from '@nestjs/common';
import { UserService } from "src/modules/user/providers/user.service"

export const RoleGuard = (roles: Array<string>) => {
    class RoleGuardMixing implements CanActivate {
    constructor(    
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {

    }
        async canActivate(context: ExecutionContext){
            const request = context.switchToHttp().getRequest();
            const user = request.user;      
            const userDetail = await this.userService.findById(user.id);
            const role = await this.userService.findRole({id: userDetail!.role_id});
            return roles.includes(role!.title)
        }  
    }
    const guard = mixin(RoleGuardMixing);
    return guard;
}