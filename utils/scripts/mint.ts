// Types
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Project Tools
import { handleContractFunction } from '../tools/handler'
import { logAccountsInfo } from '../tools/logs/info'
import { logProcessParameters, logProcessReceipt } from '../tools/logs/process'
import { sleep } from '../tools/time'

// Project Constants
import { processTimeout, requestTimeout } from '../constants'

// Script
export const mint = async (
    contract: Contract,
    signer: SignerWithAddress,
    to: string,
    amount: number,
): Promise<void> => {
    console.log(`\n------------------------------------`)
    console.log(`----- Mint Process Initialized -----`)
    console.log(`------------------------------------\n`)

    const contractName: string = await contract.name()
    await sleep(requestTimeout)

    await logAccountsInfo([contract.address, signer.address, to], [contractName, 'signer', 'to'])

    const states = await logProcessParameters(
        contract,
        signer,
        'mint',
        [to, amount],
        ['to', 'amount'],
    )

    await handleContractFunction(contract, 'mint', signer, to, amount)

    await logProcessReceipt(contract, signer, 'mint', [to, amount], states)

    console.log(`\n-----------------------------------`)
    console.log(`----- Mint Process Finalized -----`)
    console.log(`-----------------------------------\n`)

    await sleep(processTimeout)
}
