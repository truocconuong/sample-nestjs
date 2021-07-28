import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { MasterDataModel } from 'src/entity/master_data';
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
}
