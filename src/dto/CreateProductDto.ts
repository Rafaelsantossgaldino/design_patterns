import { IsNotEmpty, Length } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @Length(3, 255)
  name: string

  @IsNotEmpty()
  @Length(3, 255)
  description: string

  @IsNotEmpty()
  weight: number
}