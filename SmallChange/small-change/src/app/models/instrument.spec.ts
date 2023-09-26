import { Instrument } from './instrument';

describe('Instrument', () => {
  it('should create an instance', () => {
    expect(new Instrument('123-123-233','The Dummy Instrument','CUSIP','312344553','1',100,1)).toBeTruthy();
  });
});
