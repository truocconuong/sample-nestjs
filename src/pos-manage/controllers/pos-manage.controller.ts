import { Body, Controller, Post, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthenticateClientGuard } from 'src/auth';
import { PocManageModel } from 'src/entity/pos-manage';
import { CreateDto } from '../dto';
import { CrudService } from '../providers';
import _ from 'lodash'

@Controller('pos')
export class CrudController {
  constructor(private crud: CrudService) { }

  @Get()
  @UseGuards(AuthenticateClientGuard)
  public async getAll(): Promise<PocManageModel[]> {
    const result = await this.crud.findAll();
    if (!result) {
      throw new NotFoundException('NotFoundData');
    }
    return result;
  }

  @Post()
  public async create(@Body() body: CreateDto): Promise<{ result: {} }> {
    const { outlet_id, pos_id } = body;
    const checkOutletAndPosExists = await this.crud.checkOutletIdAndPosIdExists(outlet_id, pos_id)
    let result = {};
    if (!checkOutletAndPosExists) {
      result = await this.crud.create(body);
    } else {
      result = await this.crud.update(checkOutletAndPosExists.id, _.pick(body, ['username', 'password', 'client_id', 'client_secret', 'is_auto']))
    }
    return { result: result };
  }

  // @Put(':id')
  // public async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateDto): Promise<{ success: boolean }> {
  //   await this.crud.update(id, body);
  //   return { success: true };
  // }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Get('validate')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async checkValidate() {
    return {
      successed: true,
    };
  }
}