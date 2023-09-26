import { ClientIdentification } from './client-identification';

describe('ClientIdentification', () => {
  it('should create an instance', () => {
    expect(new ClientIdentification('SSN','value')).toBeTruthy();
  });
});
