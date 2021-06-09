import { Module } from '@nestjs/common';
import { PosController } from './controllers/pos.controller';
import {PosService} from './providers/pos.service';

@Module({
  controllers: [PosController],

  providers: [PosService],
})
export class PosServiceModule {}
