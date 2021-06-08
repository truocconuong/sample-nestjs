import { Body, Controller, Post, InternalServerErrorException, Get, NotFoundException, Put, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthenticateClientGuard } from 'src/auth';
import { PocManageModel } from 'src/entity/pos-manage';
import { CreateDto, UpdateDto } from '../dto';
import { CrudService } from '../providers';

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
  public async create(@Body() body: CreateDto): Promise<{ id: number }> {
    const result = await this.crud.create(body);
    if (!result.id) {
      throw new InternalServerErrorException('NotCreatedData');
    }

    return { id: result.id };
  }

  @Put(':id')
  public async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateDto): Promise<{ success: boolean }> {
    await this.crud.update(id, body);
    return { success: true };
  }

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