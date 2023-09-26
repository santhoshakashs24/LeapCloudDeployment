import { Order } from './order';

describe('Order', () => {
  it('should create an instance', () => {
    expect(new Order('123-123',0,0,'123-der','B')).toBeTruthy();
  });
});
