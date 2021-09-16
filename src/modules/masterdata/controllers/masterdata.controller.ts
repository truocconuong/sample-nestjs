import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash'
import { LIMIT_SUBSCRIPTIONS } from 'src/common/constants';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { MasterDataModel } from 'src/entity/master_data';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { QueryMasterData } from '../dto/all-master-data.dto';
// import { UserLoggerExceptionsFilter } from '../exceptions/user.exceptions';
import { MasterdataService } from '../providers/masterdata.service';
@Controller('masterdata')
export class MasterdataController {
    constructor(private MasterdataService: MasterdataService) { }
    @Get()
    @UseInterceptors(TransformInterceptor)
    public async getAll(@Query() query : QueryMasterData): Promise<MasterDataModel[]> {
        const result = await this.MasterdataService.findAll(query);
        return result;
    }


    
    @Get('list')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async index(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(LIMIT_SUBSCRIPTIONS), ParseIntPipe) limit: number = LIMIT_SUBSCRIPTIONS,
    ){
      limit = limit > 100 ? 100 : limit;
      return this.MasterdataService.getAll({
        page,
        limit,
      });
    }

    @Post()
    public async addMassterData(@Body() body : any): Promise<any> {
        const result = await this.MasterdataService.create(body);
        return result;
    }
}
