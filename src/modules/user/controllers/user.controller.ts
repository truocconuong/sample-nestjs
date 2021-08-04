import { Body, Controller, Get, NotFoundException, HttpException, HttpStatus, Param, Patch, Post, UseFilters, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorators';
import { CreateUserGuestDto, ExecutorDto, BeneficiaryDto, PropertyDto, BusinessInterestsDto, InvestmentsDto, ValuablesDto, BankAccountDto, InsurancePoliciesDto, InformationDto, BenefitciaryPercent } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserLoggerExceptionsFilter } from '../exceptions/user.exceptions';
import { UserService } from '../providers/user.service';
import { PdfService } from 'src/shared/pdf/pdf.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../../../common/file-upload.utils'
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private pdfService: PdfService) { }


    @Patch('beneficiary/percent')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateAllPercentBeneficiaries(@Body() body: BenefitciaryPercent[], @GetUser() user: UserModel): Promise<boolean> {
        const items = body;
        for (const item of items) {
            const beneficiary = await this.userService.findBeneficiary(item.id)
            if (beneficiary && beneficiary.user_id === user.id) {
                await this.userService.updateBeneficiary(beneficiary.id, {
                    percent: item.percent
                })
            }
        }
        return true
    }


    @Get()
    @ApiExcludeEndpoint()
    @UseInterceptors(TransformInterceptor)
    @UseFilters(UserLoggerExceptionsFilter)
    public async getAll(): Promise<UserModel[]> {
        const result = await this.userService.findAll();
        return result;
    }

    @Get(':id')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async getUserById(@Param('id') id: string): Promise<UserModel> {
        try {
            const result = await this.userService.findById(id);
            if (!result) {
                throw new NotFoundException('Not found !')
            }
            return result;
        } catch (error) {
            throw error
        }
    }

    @Post('guest')
    @UseInterceptors(TransformInterceptor)
    public async create(@Body() body: CreateUserGuestDto): Promise<UserModel | undefined> {
        const { email, full_legal_name, nric, postal_code, address_line_1, address_line_2, unit_number, executors, beneficiaries, properties, bank_accounts, insurance_policies, business_interests, valuables, investments } = body;
        // use store beneficiary
        const beneficiaryStore: {
            id: string,
            full_legal_name: string
        }[] = [];
        const checkEmailExists = await this.userService.findOne({ email: email });
        if (checkEmailExists) {
            throw new HttpException('Conflict', HttpStatus.FORBIDDEN);
        }
        const information = {
            email,
            nric,
            postal_code,
            address_line_1: address_line_1 ? address_line_1 : '',
            address_line_2: address_line_2 ? address_line_2 : '',
            unit_number: unit_number,
            full_legal_name,
            role_id: '4fb6acb5-e22c-4c2e-b7a1-fde533a80324'
        }
        // create user
        const user = await this.userService.create(information)

        //create executors 
        if (!_.isEmpty(executors)) {
            _.forEach(executors, async executor => {
                const dataExecutor = {
                    user_id: user.id,
                    ...executor
                }
                await this.userService.createExecutor(dataExecutor)
                return executor
            })
        }

        //create beneficiaries
        if (!_.isEmpty(beneficiaries)) {
            for (const beneficiary of beneficiaries) {
                const dataBeneficiary = {
                    user_id: user.id,
                    ...beneficiary
                }
                const benefitciary = await this.userService.createBeneficiary(dataBeneficiary)
                beneficiaryStore.push({
                    id: benefitciary.id,
                    full_legal_name: benefitciary.full_legal_name as string
                })
            }
        }

        if (!_.isEmpty(properties)) {
            _.forEach(properties, async property => {
                const dataProperty = {
                    user_id: user.id,
                    ...property
                }
                await this.userService.createProperty(dataProperty)
            })
        }


        if (!_.isEmpty(bank_accounts)) {
            _.forEach(bank_accounts, async bank_account => {
                const dataBankAccount = {
                    user_id: user.id,
                    ...bank_account
                }
                await this.userService.createBankAccount(dataBankAccount)
            })
        }

        if (!_.isEmpty(insurance_policies)) {
            for (const insurance_policy of insurance_policies) {
                const beneficiary_name = insurance_policy.beneficiary_name
                if (beneficiary_name) {
                    const getIdBeneficiaryByStore = _.find(beneficiaryStore, beneficiary => beneficiary.full_legal_name === beneficiary_name);
                    if (getIdBeneficiaryByStore) {
                        insurance_policy.beneficiary_id = getIdBeneficiaryByStore.id;
                    }
                }
                const dataInsurancePolicies = {
                    user_id: user.id,
                    ...insurance_policy
                }
                await this.userService.createInsurancePolicy(dataInsurancePolicies)
            }
        }


        if (!_.isEmpty(valuables)) {
            _.forEach(valuables, async valuable => {
                const dataValueble = {
                    user_id: user.id,
                    ...valuable
                }
                await this.userService.createValuables(dataValueble)
            })
        }

        if (!_.isEmpty(business_interests)) {
            _.forEach(business_interests, async business_interest => {
                const dataBusinessInterest = {
                    user_id: user.id,
                    ...business_interest
                }
                await this.userService.createBusinessInterest(dataBusinessInterest)
            })
        }

        if (!_.isEmpty(investments)) {
            _.forEach(investments, async investment => {
                const dataInvestment = {
                    user_id: user.id,
                    ...investment
                }
                await this.userService.createInvestment(dataInvestment)
            })
        }
        this.pdfService.createPdf(body, user.id)
        return user
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async update(@Body() body: UpdateUserDto, @GetUser() user: UserModel): Promise<boolean> {
        await this.userService.update(user.id, body)
        return true
    }

    @Patch('executor/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateExecutor(@Param('id') id: string, @Body() body: ExecutorDto, @GetUser() user: UserModel): Promise<boolean> {
        const executor = await this.userService.findExecutor(id)
        if (!executor) {
            throw new NotFoundException('Executor Not Found!')
        }
        if (executor!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateExecutor(id, body)
        return true
    }

    @Post('executor')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createExecutor(@Body() body: ExecutorDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const executor = await this.userService.createExecutor(dataCreate)
        return executor
    }

    @Patch('property/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateProperty(@Param('id') id: string, @Body() body: PropertyDto, @GetUser() user: UserModel): Promise<boolean> {
        const executor = await this.userService.findProperty(id)
        if (!executor) {
            throw new NotFoundException('Property Not Found!')
        }
        if (executor!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateProperty(id, body)

        return true
    }

    @Post('property')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createProperty(@Body() body: PropertyDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const property = await this.userService.createProperty(dataCreate)
        return property
    }

    @Patch('beneficiary/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateBeneficiary(@Param('id') id: string, @Body() body: BeneficiaryDto, @GetUser() user: UserModel): Promise<boolean> {
        const beneficiary = await this.userService.findBeneficiary(id)
        if (!beneficiary) {
            throw new NotFoundException('Beneficiary Not Found!')
        }
        if (beneficiary!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateBeneficiary(id, body)
        return true
    }

    @Post('beneficiary')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createBeneficiary(@Body() body: BeneficiaryDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const beneficiary = await this.userService.createBeneficiary(dataCreate)
        return beneficiary
    }

    @Patch('business-interests/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateBusinessInterests(@Param('id') id: string, @Body() body: BusinessInterestsDto, @GetUser() user: UserModel): Promise<boolean> {
        const businessInterests = await this.userService.findBusinessInterests(id)
        if (!businessInterests) {
            throw new NotFoundException('Business Interests Not Found!')
        }
        if (businessInterests!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateBusinessInterests(id, body)
        return true
    }

    @Post('business-interests')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createBusinessInterests(@Body() body: BusinessInterestsDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const businessInterests = await this.userService.createBeneficiary(dataCreate)
        return businessInterests
    }

    @Patch('investment/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateInvestment(@Param('id') id: string, @Body() body: InvestmentsDto, @GetUser() user: UserModel): Promise<boolean> {
        const investment = await this.userService.findInvestment(id)
        if (!investment) {
            throw new NotFoundException('investment Not Found!')
        }
        if (investment!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateInvestment(id, body)
        return true
    }

    @Post('investment')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createInvestment(@Body() body: InvestmentsDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const investment = await this.userService.createInvestment(dataCreate)
        return investment
    }

    @Patch('valuables/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateValuables(@Param('id') id: string, @Body() body: ValuablesDto, @GetUser() user: UserModel): Promise<boolean> {
        const valuables = await this.userService.findValuables(id)
        if (!valuables) {
            throw new NotFoundException('Valuables Not Found!')
        }
        if (valuables!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateValuables(id, body)
        return true
    }

    @Post('valuables')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createValuables(@Body() body: ValuablesDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const valuables = await this.userService.createValuables(dataCreate)
        return valuables
    }

    @Patch('bank-account/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateBankAccount(@Param('id') id: string, @Body() body: BankAccountDto, @GetUser() user: UserModel): Promise<boolean> {
        const bankAccount = await this.userService.findBankAccount(id)
        if (!bankAccount) {
            throw new NotFoundException('Bank Account Not Found!')
        }
        if (bankAccount!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateBankAccount(id, body)
        return true
    }

    @Post('bank-account')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createBankAccount(@Body() body: BankAccountDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const bankAccount = await this.userService.createBankAccount(dataCreate)
        return bankAccount
    }


    @Patch('insurance-policy/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateInsurancePolicies(@Param('id') id: string, @Body() body: InsurancePoliciesDto, @GetUser() user: UserModel): Promise<boolean> {
        const insurancePolicy = await this.userService.findInsurancePolicy(id)
        if (!insurancePolicy) {
            throw new NotFoundException('Insurance Policy Not Found!')
        }
        if (insurancePolicy!.user_id !== user.id) {
            throw new NotFoundException('User unauthorized!')
        }
        await this.userService.updateInsurancePolicy(id, body)
        return true
    }


    @Post('insurance-policy')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async createInsurancePolicy(@Body() body: InsurancePoliciesDto, @GetUser() user: UserModel) {
        const dataCreate = { ...body, user_id: user.id }
        const insurancePolicy = await this.userService.createInsurancePolicy(dataCreate)
        return insurancePolicy
    }

    @Patch('information/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @UseInterceptors(TransformInterceptor)
    public async updateInformation(@Param('id') id: string, @Body() body: InformationDto): Promise<boolean> {
        const information = await this.userService.findById(id)
        if (!information) {
            throw new NotFoundException('Insurance Policy Not Found!')
        }
        await this.userService.update(id, body)
        return true
    }

    @Get('detail/categories')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    async getUserDetail(@GetUser() user: UserModel) {
        const userDetail = await this.userService.findUserCategoriesDetail(user.id)
        return userDetail
    }

    @Post('upload-pdf')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: 'public/upload-pdf',
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
        limits: { fileSize: 3145728 }
    }))
    async uploadPdf(@UploadedFile() file: any, @GetUser() user: UserModel) {
        await this.userService.update(user.id, { pdf_upload_url: file.path.slice(6) })
        throw new HttpException('done', HttpStatus.ACCEPTED);
    }

}
