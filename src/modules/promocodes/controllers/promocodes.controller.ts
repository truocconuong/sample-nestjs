import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { PromocodesModel } from 'src/entity/promocodes';
import { PromocodesService } from '../providers';

@Controller('promocodes')
export class PromocodesController {
    constructor(private promocodesService: PromocodesService) { }
    @Get()
    @UseInterceptors(TransformInterceptor)
    public async getDetailPromocodes(@Query() query: any): Promise<PromocodesModel | undefined> {
        const result = await this.promocodesService.findDetailPromocodesByName(query.name);
        return result;
    }
}
