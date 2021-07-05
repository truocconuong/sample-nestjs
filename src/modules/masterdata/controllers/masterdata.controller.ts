import { Controller, Get, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { MasterDataModel } from 'src/entity/master_data';
// import { UserLoggerExceptionsFilter } from '../exceptions/user.exceptions';
import { MasterdataService } from '../providers/masterdata.service';
@Controller('masterdata')
export class MasterdataController {
    constructor(private MasterdataService: MasterdataService) { }
    @Get()
    @UseInterceptors(TransformInterceptor)
    // @UseFilters(UserLoggerExceptionsFilter)
    public async getAll(): Promise<MasterDataModel[]> {
        const result = await this.MasterdataService.findAll();
        return result;
    }
}
