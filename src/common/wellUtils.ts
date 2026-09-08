import { type PlateDimensions } from '../@types/PlateDimensions';

export const getWellCount = (dimensions: PlateDimensions): number => {
  const { rowCount, colCount } = dimensions;
  return rowCount * colCount;
};

export const getWellRow = (dimensions: PlateDimensions, wellIndex: number): number | undefined => {
  const { colCount } = dimensions;
  if (wellIndex < 0 || wellIndex >= getWellCount(dimensions)) {
    return undefined;
  }
  return Math.floor(wellIndex / colCount);
};

export const getWellColumn = (dimensions: PlateDimensions, wellIndex: number): number | undefined => {
  const { colCount } = dimensions;
  if (wellIndex < 0 || wellIndex >= getWellCount(dimensions)) {
    return undefined;
  }
  return wellIndex % colCount;
};

export const getRelativeWellIndex = (
  dimensions: PlateDimensions,
  wellIndex: number,
  rowDelta: number,
  colDelta: number,
): number | undefined => {
  const { rowCount, colCount } = dimensions;
  const row = getWellRow(dimensions, wellIndex);
  const col = getWellColumn(dimensions, wellIndex);
  if (row === undefined || col === undefined) {
    return undefined;
  }
  const adjRow = row + rowDelta;
  const adjCol = col + colDelta;
  if (adjRow < 0 || adjRow >= rowCount || adjCol < 0 || adjCol >= colCount) {
    return undefined;
  }
  return adjRow * colCount + adjCol;
};
