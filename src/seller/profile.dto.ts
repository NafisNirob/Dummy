import { IsNotEmpty } from "class-validator";

export class SellerDTO {
  
    @IsNotEmpty()
    photoPath: string;
  }