import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromocodesModel } from 'src/entity/promocodes';
import { Repository } from 'typeorm';

@Injectable()
export class PromocodesService {
    constructor(
        @InjectRepository(PromocodesModel)
        private repository: Repository<PromocodesModel>
    ) { }

    public async findDetailPromocodesByName(name: string): Promise<PromocodesModel | undefined> {
        if (!name) {
            throw new NotFoundException('Not found')
        }

        const promocode = await this.repository.findOne({
            name
        })

        if (!promocode) {
            throw new NotFoundException('Not found')
        }
        return promocode
    }
}
