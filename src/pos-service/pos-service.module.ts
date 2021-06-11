import { Module } from '@nestjs/common';
import { PocManageModule } from 'src/pos-manage';
import { PosController } from './controllers/pos.controller';
import {PosService} from './providers/pos.service';

@Module({
  imports: [PocManageModule],
  controllers: [PosController],
  providers: [PosService],
})
export class PosServiceModule {}
