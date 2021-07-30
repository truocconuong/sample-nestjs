import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountModel } from 'src/entity/bank-account';
import { BeneficiaryModel } from 'src/entity/beneficiary';
import { BusinessInterestModel } from 'src/entity/business_interest';
import { ExecutorModel } from 'src/entity/executor';
import { InsurancePolicyModel } from 'src/entity/insurance_policy';
import { InvestmentModel } from 'src/entity/investment';
import { PropertyModel } from 'src/entity/property';
import { UserModel } from 'src/entity/user';
import { ValuablesModel } from 'src/entity/valuables';
import { AuthModule } from '../auth/auth.module';
import { BlackListModel } from 'src/entity/black_list';
import { RoleModel } from 'src/entity/role';
import { PdfModule } from 'src/shared/pdf/pdf.module';
import * as controllers from './controllers';
import * as providers from './providers';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      ExecutorModel,
      BeneficiaryModel,
      PropertyModel,
      BankAccountModel,
      InsurancePolicyModel,
      InvestmentModel,
      BusinessInterestModel,
      ValuablesModel,
      BlackListModel,
      RoleModel,
    ]), 
    MulterModule.register({
      dest: 'public/upload-pdf',
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => PdfModule)
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class UserModule { }
