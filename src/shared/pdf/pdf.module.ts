import { Module, forwardRef } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { UserModule } from 'src/modules/user/user.module';
import { MasterdataModule } from 'src/modules/masterdata/masterdata.module'
@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => MasterdataModule),
    ],
    providers: [PdfService],
    exports: [PdfService],
})
export class PdfModule { }
