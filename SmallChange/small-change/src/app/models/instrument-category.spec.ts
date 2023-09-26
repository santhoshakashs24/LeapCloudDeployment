import { InstrumentCategory } from './instrument-category';

describe('InstrumentCategory', () => {
  it('should create an instance', () => {
    expect(new InstrumentCategory('1','Dummy Category 1')).toBeTruthy();
  });
});
