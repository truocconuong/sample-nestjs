import { IsString } from "class-validator";
import { UserModel } from "src/entity/user";

export class CreateUserDto implements Omit<UserModel, 'id' | 'updated_at' | 'created_at'> {
  @IsString()
  public email!: string;
}
