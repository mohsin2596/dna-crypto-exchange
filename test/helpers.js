import * as utils from 'web3-utils';

export const EVM_REVERT = 'VM Exception while processing transaction: revert';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const tokens = (n) => {
    return utils.toBN(
        utils.toWei(n.toString(), 'ether')
    )
}