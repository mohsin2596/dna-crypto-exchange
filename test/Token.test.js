/* eslint-disable no-undef */
const Token = artifacts.require('./Token');
require('chai').use(require('chai-as-promised')).should()

contract('Token', (accounts) => {
  const name = 'DNA TOKEN';
  let token;

  beforeEach(async () => {
    token = await Token.new();
  })

  describe('deployment', () => {
     it('tracks the name', async () => {
         // Read token name here ...
         // The token name is DNA TOKEN
        const result = await token.name();
        result.should.equal(name);
     }) 

     it('tracks the symbol', async () => {
        const result = await token.symbol();
        result.should.equal('DNA')
     })

     it('tracks the decimals', async () => {
        const result = await token.decimals();
        result.toString().should.equal('18')
    })

    it('tracks the supply', async () => {
        const result = await token.totalSupply();
        result.toString().should.equal('1000000000000000000000000')
    })
  })  
})