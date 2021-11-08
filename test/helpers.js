import * as utils from 'web3-utils';

export const EVM_REVERT = 'VM Exception while processing transaction: revert';

export const tokens = (n) => {
    return utils.toBN(
        utils.toWei(n.toString(), 'ether')
    )
}