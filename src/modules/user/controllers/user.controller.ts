import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { CreateUserGuestDto } from '../dto/create-user.dto';
import { UserLoggerExceptionsFilter } from '../exceptions/user.exceptions';
import { UserService } from '../providers/user.service';
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get()
    @UseInterceptors(TransformInterceptor)
    @UseFilters(UserLoggerExceptionsFilter)
    public async getAll(): Promise<UserModel[]> {
        const result = await this.userService.findAll();
        return result;
    }

    @Get(':id')
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
        const { email, full_legal_name, nric, postal_code, address_line_1, address_line_2, unit_number, executors, beneficiaries, properties, bank_accounts, insurance_policies, business_interests, valuables } = body;
        // use store beneficiary
        const beneficiaryStore: {
            id: string,
            full_legal_name: string
        }[] = [];
        const checkEmailExists = await this.userService.findByEmail(email);
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

        return user
    }

    // @Patch()
    // @UseInterceptors(TransformInterceptor)
    // public async update(@Body() body: UpdateUserDto): Promise<UserModel> {
    //     try {
    //         const result = await this.userService.create(body);
    //         return result;
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // @Delete()
    // @UseInterceptors(TransformInterceptor)
    // public async destroy(@Param('id') id: string): Promise<boolean> {
    //     try {
    //         const result = await this.userService.remove(id);
    //         if (!result) {
    //             throw new NotFoundException('Not found !')
    //         }
    //         return true;
    //     } catch (error) {
    //         throw error
    //     }
    // }


}
