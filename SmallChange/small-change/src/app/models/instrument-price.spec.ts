import { Instrument } from './instrument';
import { InstrumentPrice } from './instrument-price';

describe('InstrumentPrice', () => {
  it('should create an instance', () => {
    expect(new InstrumentPrice('123-123-233',34,34.34,new Date(Date.now()),new Instrument('123-123-233','The Dummy Instrument','CUSIP','312344553','1',100,1))).toBeTruthy();
  });
});
