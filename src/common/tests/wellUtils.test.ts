import { getRelativeWellIndex, getWellColumn, getWellCount, getWellRow } from '../wellUtils';

const DIMENSIONS = { rowCount: 8, colCount: 12 };

describe('getWellCount', () => {
  it('returns the total number of wells for a 96-well plate', () => {
    expect(getWellCount(DIMENSIONS)).toBe(96);
  });

  it('returns the total number of wells for a 384-well plate', () => {
    expect(getWellCount({ rowCount: 16, colCount: 24 })).toBe(384);
  });
});

describe('getWellRow', () => {
  it('returns 0 for the first well', () => {
    expect(getWellRow(DIMENSIONS, 0)).toBe(0);
  });

  it('returns 0 for the last well in the first row', () => {
    expect(getWellRow(DIMENSIONS, 11)).toBe(0);
  });

  it('returns 1 for the first well in the second row', () => {
    expect(getWellRow(DIMENSIONS, 12)).toBe(1);
  });

  it('returns the correct row further into the plate', () => {
    expect(getWellRow(DIMENSIONS, 26)).toBe(2);
  });

  it('returns undefined when the index is beyond the well count', () => {
    expect(getWellRow(DIMENSIONS, 96)).toBeUndefined();
  });

  it('returns undefined when the index is negative', () => {
    expect(getWellRow(DIMENSIONS, -1)).toBeUndefined();
  });
});

describe('getWellColumn', () => {
  it('returns 0 for the first well', () => {
    expect(getWellColumn(DIMENSIONS, 0)).toBe(0);
  });

  it('returns the last column for the last well in a row', () => {
    expect(getWellColumn(DIMENSIONS, 11)).toBe(11);
  });

  it('wraps back to 0 at the start of the next row', () => {
    expect(getWellColumn(DIMENSIONS, 12)).toBe(0);
  });

  it('returns the correct column further into the plate', () => {
    expect(getWellColumn(DIMENSIONS, 26)).toBe(2);
  });

  it('returns undefined when the index is beyond the well count', () => {
    expect(getWellColumn(DIMENSIONS, 96)).toBeUndefined();
  });

  it('returns undefined when the index is negative', () => {
    expect(getWellColumn(DIMENSIONS, -1)).toBeUndefined();
  });
});

describe('getRelativeWellIndex', () => {
  it('returns the well one column to the right', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 0, 0, 1)).toBe(1);
  });

  it('returns the well one row down', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 0, 1, 0)).toBe(12);
  });

  it('returns the well one row up and one column left', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 13, -1, -1)).toBe(0);
  });

  it('returns undefined when moving left off the first column', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 0, 0, -1)).toBeUndefined();
  });

  it('returns undefined when moving right off the last column', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 11, 0, 1)).toBeUndefined();
  });

  it('returns undefined when moving above the first row', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 0, -1, 0)).toBeUndefined();
  });

  it('returns undefined when moving right off the last column of a later row', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 23, 0, 1)).toBeUndefined();
  });

  it('returns undefined when moving below the last row', () => {
    expect(getRelativeWellIndex(DIMENSIONS, 95, 1, 0)).toBeUndefined();
  });
});
