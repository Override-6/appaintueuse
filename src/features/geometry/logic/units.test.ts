import {outputSuffix} from './units';

describe('outputSuffix', () => {
  test('aires au carré, volumes au cube, longueurs telles quelles', () => {
    expect(outputSuffix('area', 'm')).toBe('m²');
    expect(outputSuffix('lateralArea', 'cm')).toBe('cm²');
    expect(outputSuffix('volume', 'mm')).toBe('mm³');
    expect(outputSuffix('perimeter', 'm')).toBe('m');
  });
});
