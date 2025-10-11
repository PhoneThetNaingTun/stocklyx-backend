import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MeasurementUnitDeleteManyDto {
  @IsArray({ message: 'measurementUnitIds must be an array' })
  @ArrayNotEmpty({ message: 'measurementUnitIds cannot be empty' })
  @IsString({ each: true, message: 'Each measurementUnitId must be a string' })
  @IsNotEmpty({ each: true, message: 'measurementUnitId cannot be empty' })
  measurementUnitIds: string[];
}
