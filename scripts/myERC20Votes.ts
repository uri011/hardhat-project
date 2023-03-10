import hre from 'hardhat'
import { ethers } from 'hardhat'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Project Scripts
import { burn } from '../utils/scripts/burn'
import { delegate } from '../utils/scripts/delegate'
import { deploy } from '../utils/scripts/deploy'
import { mint } from '../utils/scripts/mint'
import { transfer } from '../utils/scripts/transfer'

// Project Tools
import { selectContract } from '../utils/tools/select'
import { logAccountsInfo, logNetworkInfo } from '../utils/tools/logs/info'

// Script
const main = async (): Promise<void> => {
    console.log(`\n\n\n--------------------------------------------------------------`)
    console.log(`---------- MyERC20Votes Contract Script Initialized ----------`)
    console.log(`--------------------------------------------------------------\n\n`)

    // SAVE STORAGE LAYOUT IN REPORTS & NOTIFY VIA CONSOLE.LOG
    //---------------------------------------------------------------------
    await hre.storageLayout.export()
    //---------------------------------------------------------------------

    // Script Transaction Signers
    const [deployer, account1, account2] = await ethers.getSigners()

    await logNetworkInfo()
    await logAccountsInfo(
        [deployer.address, account1.address, account2.address],
        ['deployer', 'account1', 'account2'],
    )

    // Contract Deploy / Contract Load
    const rl = readline.createInterface({ input, output })

    let contract

    while (true) {
        const answer = await rl.question('\n- Deploy Contract (y/n): ')
        if (answer === 'y') {
            contract = await deploy('MyERC20Votes', deployer, [], [])
            break
        } else if (answer === 'n') {
            contract = await selectContract('MyERC20Votes')
            break
        }
    }

    // Deployer Mints 25 Tokens for Account 1
    await mint(contract, deployer, account1.address, 25)

    // Account 1 Self Delegates Voting Power
    await delegate(contract, account1, account1.address)

    // Deployer Mints 100 Tokens for Account 2
    await mint(contract, deployer, account2.address, 100)

    // Account 2 Self Delegates Voting Power
    await delegate(contract, account2, account2.address)

    // Deployer Mints 50 Tokens for Deployer
    await mint(contract, deployer, deployer.address, 50)

    // Deployer Delegates Voting Power to Account 1
    await delegate(contract, deployer, account1.address)

    // Deployer Mints 100 Tokens for Deployer
    await mint(contract, deployer, deployer.address, 100)

    // Deployer Transfers 100 Tokens to Account1
    await transfer(contract, deployer, account1.address, 100)

    // Account 1 Self Delegates Voting Power
    await delegate(contract, account1, account1.address)

    // Deployer Burns 100 Tokens of Account 1
    await burn(contract, deployer, account1.address, 100)

    await logNetworkInfo()
    await logAccountsInfo(
        [deployer.address, account1.address, account2.address],
        ['deployer', 'account1', 'account2'],
    )

    console.log(`\n\n-------------------------------------------------------------`)
    console.log(`---------- MyERC20Votes Contract Script Finalized ----------`)
    console.log(`------------------------------------------------------------\n\n\n`)
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
