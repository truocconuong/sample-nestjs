import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateNested } from "class-validator";

export class InformationDto {
  @IsEmail()
  @Length(1, 255)
  @IsOptional()

  public email!: string;

  @IsString()
  @IsOptional()

  public full_legal_name!: string;

  @IsString()
  @IsOptional()

  @Length(1, 255)
  public nric!: string;


  @IsString()
  @IsOptional()
  @Length(1, 6)
  public postal_code!: string

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public address_line_1!: string


  @IsString()
  @IsOptional()
  @Length(1, 255)
  public address_line_2!: string

  @IsString()
  @IsOptional()
  @Length(1, 20)
  public unit_number!: string
}

export class ExecutorDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  public full_legal_name!: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public relationship_id!: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 45)
  public email!: string;

  @IsString()
  @IsOptional()
  @Length(1, 45)
  public nric!: string;

  @IsBoolean()
  @IsOptional()
  @Length(1, 45)
  public type!: string;

  @IsBoolean()
  @IsOptional()
  public is_delete!: boolean;
}

export class BeneficiaryDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  public full_legal_name!: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public relationship_id!: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 255)
  public email!: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public nric!: string;

  @IsNumber()
  @IsOptional()
  public percent!: number;

  @IsBoolean()
  @IsOptional()
  public is_delete!: boolean;
}


export class PropertyDto {
  @IsString()
  @IsOptional()
  @Length(1, 45)
  country!: string;

  @IsBoolean()
  @IsOptional()
  is_solely!: boolean;

  @IsBoolean()
  @IsOptional()
  is_joint!: boolean;

  @IsString()
  @IsOptional()
  postal_code!: string;

  @IsString()
  @IsOptional()
  address_line_1!: string;

  @IsString()
  @IsOptional()
  address_line_2!: string;

  @IsString()
  @IsOptional()
  unit_number!: string;

  @IsNumber()
  @IsOptional()
  tenure!: number;

  @IsString()
  @IsOptional()
  current_bank_loan_id!: string;

  @IsString()
  @IsOptional()
  joint_name!: string;

  @IsString()
  @IsOptional()
  joint_contact!: string;

  @IsString()
  @IsOptional()
  loan_start_date!: Date;

  @IsString()
  @IsOptional()
  loan_end_date!: Date;

  @IsNumber()
  @IsOptional()
  year_loan_taken!: number;

  @IsNumber()
  @IsOptional()
  interest_rate!: number;

  @IsNumber()
  @IsOptional()
  outstanding_loan_amount!: number;

  @IsBoolean()
  @IsOptional()
  is_delete!: boolean;

}


export class BankAccountDto {
  @IsString()
  @IsOptional()
  bank_id!: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  account_no!: string;

  @IsBoolean()
  @IsOptional()
  is_solely!: boolean;

  @IsBoolean()
  @IsOptional()
  is_joint!: boolean;

  @IsNumber()
  @IsOptional()
  current_balance!: number;

  @IsString()
  @IsOptional()
  account_holder!: string;

  @IsBoolean()
  @IsOptional()
  is_delete!: boolean;
}


export class InsurancePoliciesDto {
  @IsString()
  @IsOptional()
  beneficiary_id!: string


  @IsString()
  @IsOptional()
  insurance_company!: string

  @IsBoolean()
  @IsOptional()
  is_non_nomivated!: boolean;

  @IsBoolean()
  @IsOptional()
  is_nominated!: boolean;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  policy_name!: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  beneficiary_name!: string;

  @IsString()
  @Length(1, 45)
  @IsOptional()
  policy_no!: string;

  @IsNumber()
  @IsOptional()
  current_value!: number;

  @IsNumber()
  @IsOptional()
  converage!: number;

  @IsBoolean()
  @IsOptional()
  is_delete!: boolean;
}

export class InvestmentsDto {
  @IsString()
  @IsOptional()
  type_id!: string;

  @IsString()
  @IsOptional()
  financial_institutions!: string;

  @IsString()
  @IsOptional()
  account_no!: string;

  @IsNumber()
  @IsOptional()
  capital_outlay!: number;

  @IsNumber()
  @IsOptional()
  current_market_value!: number;

  @IsBoolean()
  @IsOptional()
  is_delete!: boolean;
}


export class BusinessInterestsDto {
  @IsString()
  @IsOptional()
  company_name!: string;

  @IsString()
  @IsOptional()
  company_uen!: string;

  @IsString()
  @IsOptional()
  position!: string;

  @IsNumber()
  @IsOptional()
  estimated_current_market_value!: number;

  @IsNumber()
  @IsOptional()
  percentage_share!: number;

  @IsBoolean()
  @IsOptional()
  is_delete!: boolean;
}

export class ValuablesDto {
  @IsString()
  @IsOptional()
  type_id!: string;

  @IsString()
  @IsOptional()
  brand!: string;

  @IsString()
  @IsOptional()
  model!: string;

  @IsString()
  @IsOptional()
  serial_no!: string;

  @IsString()
  @IsOptional()
  plate_no!: string;

  @IsString()
  @IsOptional()
  country_name!: string;

  @IsString()
  @IsOptional()
  address_line_1!: string;

  @IsString()
  @IsOptional()
  address_line_2!: string;

  @IsString()
  @IsOptional()
  postal_code!: string;

  @IsString()
  @IsOptional()
  pet_name!: string;

  @IsString()
  @IsOptional()
  pet_breed!: string;

  @IsString()
  @IsOptional()
  pet_registration_number!: string;

  @IsString()
  @IsOptional()
  safe_box_detail!: string;

  @IsBoolean()
  @IsOptional()
  is_delete!: boolean;
}



export class CreateUserGuestDto {
  @IsEmail()
  @Length(1, 255)
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public full_legal_name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  public nric!: string;


  @IsString()
  @IsOptional()
  @Length(1, 6)
  public postal_code!: string

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public address_line_1!: string


  @IsString()
  @IsOptional()
  @Length(1, 255)
  public address_line_2!: string

  @IsString()
  @IsOptional()
  @Length(1, 20)
  public unit_number!: string

  //  done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExecutorDto)
  public executors!: ExecutorDto[]

  // done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BeneficiaryDto)
  public beneficiaries!: BeneficiaryDto[]

  //done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  public properties!: PropertyDto[]

  //done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDto)
  public bank_accounts!: BankAccountDto[]

  // done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsurancePoliciesDto)
  public insurance_policies!: InsurancePoliciesDto[]

  //done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvestmentsDto)
  public investments!: InvestmentsDto[]

  //done
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessInterestsDto)
  public business_interests!: BusinessInterestsDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValuablesDto)
  public valuables!: ValuablesDto[]
}
