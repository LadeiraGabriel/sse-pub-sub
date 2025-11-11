import { IsNotEmpty, IsString } from 'class-validator';

export class ReportProgressDTO {
  @IsNotEmpty()
  @IsString()
  reportId: string;
}
