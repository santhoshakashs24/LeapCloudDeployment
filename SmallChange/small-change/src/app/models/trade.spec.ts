import { Order } from './order';
import { Trade } from './trade';

describe('Trade', () => {
  it('should create an instance', () => {
    let order:Order = new Order("",-1,-1,"","");
    expect(new Trade("",-1,-1,"",order,-1,-1,"","",new Date(Date.now()))).toBeTruthy();
  });
});
