import { PlateType } from '../../@enums/PlateType';
import { constructPlate } from '../plateUtils';

describe('constructPlate', () => {
  it('builds the correct number of wells', () => {
    const plate = constructPlate({ rowCount: 8, colCount: 12 }, PlateType.Well96);

    expect(plate.wells).toHaveLength(96);
  });

  it('stores the given type and dimensions', () => {
    const dimensions = { rowCount: 8, colCount: 12 };
    const plate = constructPlate(dimensions, PlateType.Well96);

    expect(plate.type).toBe(PlateType.Well96);
    expect(plate.dimensions).toBe(dimensions);
  });

  it('assigns sequential 0-based indexes, rows, and columns', () => {
    const plate = constructPlate({ rowCount: 8, colCount: 12 }, PlateType.Well96);

    expect(plate.wells[0]).toMatchObject({ index: 0, row: 0, column: 0, name: 'A1' });
    expect(plate.wells[11]).toMatchObject({ index: 11, row: 0, column: 11, name: 'A12' });
    expect(plate.wells[12]).toMatchObject({ index: 12, row: 1, column: 0, name: 'B1' });
    expect(plate.wells[95]).toMatchObject({ index: 95, row: 7, column: 11, name: 'H12' });
  });

  it('labels rows beyond Z with double letters', () => {
    const plate = constructPlate({ rowCount: 27, colCount: 1 }, PlateType.Well384);

    expect(plate.wells[25].name).toBe('Z1');
    expect(plate.wells[26].name).toBe('AA1');
  });

  it('uses the given well names when provided', () => {
    const plate = constructPlate({ rowCount: 1, colCount: 3 }, PlateType.Well96, ['Blank', 'Control', 'Sample']);

    expect(plate.wells.map((well) => well.name)).toEqual(['Blank', 'Control', 'Sample']);
  });

  it('falls back to the computed name for indexes missing from wellNames', () => {
    const plate = constructPlate({ rowCount: 1, colCount: 3 }, PlateType.Well96, ['Blank']);

    expect(plate.wells.map((well) => well.name)).toEqual(['Blank', 'A2', 'A3']);
  });
});
