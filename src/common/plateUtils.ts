import { type PlateType } from '../@enums/PlateType';
import { type Plate } from '../@types/Plate';
import { type PlateDimensions } from '../@types/PlateDimensions';
import { type Well } from '../@types/Well';
import { getWellColumn, getWellCount, getWellRow } from './wellUtils';

const getRowLabel = (row: number): string => {
  let label = '';
  let n = row;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
};

export const constructPlate = (dimensions: PlateDimensions, type: PlateType, wellNames?: string[]): Plate => {
  const wellCount = getWellCount(dimensions);
  const wells: Well[] = [];
  for (let index = 0; index < wellCount; index++) {
    // Safe: index is within [0, wellCount), so row/column are always defined.
    const row = getWellRow(dimensions, index)!;
    const column = getWellColumn(dimensions, index)!;
    const name = wellNames?.[index] ?? `${getRowLabel(row)}${column + 1}`;
    wells.push({ index, row, column, name });
  }
  return { wells, type, dimensions };
};
