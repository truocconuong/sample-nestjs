import { OmitType } from '@nestjs/mapped-types';

import { CreateDto } from './create.dto';

export class UpdateDto extends OmitType(CreateDto, ['order_id', 'pos_id', 'username', 'password', 'client_id', 'client_secret','outlet_id']) { }
