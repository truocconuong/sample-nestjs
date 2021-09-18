import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PromocodesModel } from 'src/entity/promocodes';
import { Repository } from 'typeorm';

@Injectable()
export class PromocodesService {
    constructor(
        @InjectRepository(PromocodesModel)
        private repository: Repository<PromocodesModel>
    ) { }

    public async findDetailPromocodesByName(name: string): Promise<PromocodesModel | undefined> {
        const promocode = await this.repository.findOne({
            name
        })
        return promocode
    }

    public async getAll(options: IPaginationOptions) {
        return this.paginate(options)
    }

    async paginate(options: IPaginationOptions) {
        const queryBuilder = await this.repository
            .createQueryBuilder('promocodes')
        return await paginate<PromocodesModel>(queryBuilder, options)
    }

    async create(data: any) {
        return this.repository.save(data)
    }

    async remove(id: string) {
        const promocode = await this.repository.findOne({
            id
        })
        if (!promocode) {
            throw new HttpException('Not exists', HttpStatus.NOT_FOUND)
        }
        return this.repository.remove(promocode)
    }


}
