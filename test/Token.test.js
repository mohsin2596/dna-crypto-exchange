import {EVM_REVERT, tokens} from './helpers';

/* eslint-disable no-undef */
const Token = artifacts.require('./Token');
require('chai').use(require('chai-as-promised')).should()



contract('Token', ([deployer, receiver, exchange]) => {
  const name = 'DNA TOKEN';
  let token;
  const totalSupply = tokens(1000000);

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
        result.toString().should.equal(totalSupply.toString())
    })

    it('assigns total supply to deployer', async () => {
        const result = await token.balanceOf(deployer);
        result.toString().should.equal(totalSupply.toString())
    })

  })  

  describe ('sending tokens', () => {
    let amount;
    let result;

    describe('success', () => {
        beforeEach(async () => {
            amount = tokens(100);
            result = await token.transfer(receiver, amount, {from: deployer});
        })
    
        it('transfers token balances', async () => {
            let balanceOf;
            
            balanceOf = await token.balanceOf(deployer);
            balanceOf.toString().should.equal(tokens(999900).toString());
    
            balanceOf = await token.balanceOf(receiver);
            balanceOf.toString().should.equal(amount.toString());
            
        })
    
        it('emits a transfer event', async () => {
            const log = result.logs[0];
            log.event.should.equal('Transfer');
    
            const event = log.args;
            event.from.toString().should.equal(deployer, 'from is correct');
            event.to.toString().should.equal(receiver, 'to is correct');
            event.value.toString().should.equal(amount.toString(), 'value is correct');
        })
    }) 

    describe('failure', () => {
        it('rejects insufficient balances', async () => {
            let invalidAmount;
            invalidAmount = tokens(100000000); // Greater than our total supply
            await token.transfer(receiver, invalidAmount, {from: deployer}).should
            .be.rejectedWith(EVM_REVERT);

            // Attempt transfer tokens, when you have none
            invalidAmount = tokens(10);
            await token.transfer(deployer, invalidAmount, {from: receiver}).should
            .be.rejectedWith(EVM_REVERT); 
        })

        it('rejects invalid recipiens', async () => {
            await token.transfer(0x0, amount, {from: deployer}).should.be.rejected;
        })
    })
  })

  describe('approving tokens', () => {
      let result
      let amount
      
        beforeEach(async () => {
            amount = tokens(100);
            result = await token.approve(exchange, amount, {from: deployer});
        })

      describe('success', () => {
          it('allocates an allowance for delegated token spending on exchange', async () => {
            const allowance = await token.allowance(deployer, exchange);
            allowance.toString().should.equal(amount.toString());
          })

          it('emits a approval event', async () => {
            const log = result.logs[0];
            log.event.should.equal('Approval');
    
            const event = log.args;
            event.owner.toString().should.equal(deployer, 'owner is correct');
            event.spender.toString().should.equal(exchange, 'spender is correct');
            event.value.toString().should.equal(amount.toString(), 'value is correct');
        })
      })

      describe('failure', () => {
        it('rejects invalid spenders', async () => {
            await token.approve(0x0, amount, {from: deployer}).should.be.rejected;
        })
      })
  })

  describe ('delegated token transfers', () => {
    let amount;
    let result;

    beforeEach(async () => {
        amount = tokens(100);
        await token.approve(exchange,amount, {from : deployer});
    })

    describe('success', () => {
        beforeEach(async () => {
            result = await token.transferFrom(deployer,receiver, amount, {from: exchange});
        })
    
        it('transfers token balances', async () => {
            let balanceOf;
            
            balanceOf = await token.balanceOf(deployer);
            balanceOf.toString().should.equal(tokens(999900).toString());
    
            balanceOf = await token.balanceOf(receiver);
            balanceOf.toString().should.equal(amount.toString());
            
        })

        it('resets the allowance', async () => {
            const allowance = await token.allowance(deployer, exchange);
            allowance.toString().should.equal('0');
        })
    
        it('emits a transfer event', async () => {
            const log = result.logs[0];
            log.event.should.equal('Transfer');
    
            const event = log.args;
            event.from.toString().should.equal(deployer, 'from is correct');
            event.to.toString().should.equal(receiver, 'to is correct');
            event.value.toString().should.equal(amount.toString(), 'value is correct');
        })
    }) 

    describe('failure', () => {
        it('rejects insufficient amounts', async () => {
            const invalidAmount = tokens(100000000);
            await token.transferFrom(deployer,receiver,invalidAmount, {from : exchange}).should.be.rejectedWith(EVM_REVERT);
        })

        it('rejects invalid recipients', async () => {
            await token.transferFrom(deployer,0x0, amount, {from : exchange}).should.be.rejected;
        })
    })
  })
})