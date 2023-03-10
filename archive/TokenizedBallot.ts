import { ethers } from 'hardhat'

// Project Scripts
import { deploy } from '../utils/scripts/deploy'
import { vote } from '../utils/scripts/vote'

// Project Tools
import { convertStringArrayToBytes32Array } from '../utils/tools/format'
import { logAccountsInfo, logNetworkInfo } from '../utils/tools/log'

// Script Constants
const proposals = [
    'Increase Taxes by 5%',
    'Invest 1 ETH in Compound',
    'Raise Royalties to 10%',
    'Invest in 2 New Devs',
    'Burn Inactive Tokens',
]

// Script
export const t = async (addr: string): Promise<void> => {
    console.log(`\n\n\n-----------------------------------------------------------`)
    console.log(`------- TokenizedBallot Contract Script Initialized -------`)
    console.log(`-----------------------------------------------------------\n\n`)

    const encodedProposals = convertStringArrayToBytes32Array(proposals)
    const tokenAddress = addr
    const targetBlock = await ethers.provider.getBlockNumber()

    const [deployer, account1, account2] = await ethers.getSigners()

    await logNetworkInfo()
    await logAccountsInfo(
        [deployer.address, account1.address, account2.address],
        ['deployer', 'account1', 'account2'],
    )

    // Contract Deploy
    const contract = await deploy(
        'TokenizedBallot',
        deployer,
        [encodedProposals, tokenAddress, targetBlock],
        ['proposals', 'tokenAddress', 'targetBlock'],
    )

    // Account 1 Votes Proposal 1 with 75 Units of Voting Power
    await vote(contract, account1, 1, 75)

    // Account 2 Votes Proposal 2 with 100 Units of Voting Power
    await vote(contract, account2, 2, 100)

    await logNetworkInfo()
    await logAccountsInfo(
        [deployer.address, account1.address, account2.address],
        ['deployer', 'account1', 'account2'],
    )

    console.log(`\n\n-----------------------------------------------------------`)
    console.log(`------- TokenizedBallot Contract Script Finalized -------`)
    console.log(`-----------------------------------------------------------\n\n\n`)
}

// main().catch(error => {
//     console.error(error)
//     process.exitCode = 1
// })
