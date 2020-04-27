import { expect } from 'chai';
import * as health from "../core/health/api";

describe('#getHealth() using async/await', () => {
  it(`should return 'I am healthy!'`, async () => {
    const res = await new Promise((resolve, reject) => {
      health.getHealth().then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err);
      })
    });
    expect(res).equal('I am healthy!');
  })
});
