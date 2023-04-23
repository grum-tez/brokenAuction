import {
  delay_mockup_now_by_day,
  delay_mockup_now_by_minute,
  get_account,
  get_mockup_now,
  reset_experiment,
  set_mockup,
  set_mockup_now,
} from '@completium/experiment-ts'

import { Duration, Tez, Int } from '@completium/archetype-ts-types'

import { brokenAuction } from './binding/brokenAuction'

const assert = require('assert')

/* Utils ------------------------------------------------------------------- */
function addHourToDate(date: Date): Date {
  return new Date(date.getTime() + 60 * 60 * 1000)
}

/* Accounts ---------------------------------------------------------------- */

// NOTE, if you have edited your accounts with completium-cli, you will need to change
// the account names passed to get_account() to match the names in your accounts.json file.
// To see your mockup accounts, enter `completium-cli show accounts` in the terminal.

const alice = get_account('alice')
const bob = get_account('bob')
const seller1 = get_account('carl')
const timeNow = new Date(Date.now())

/* Initialisation ---------------------------------------------------------- */

describe('Initialisation', async () => {
  it('Reset experiment', async () => {
    await reset_experiment({
      account: 'alice',
      endpoint: 'mockup',
      quiet: true,
    })
  })
  it('set_mockup', async () => {
    set_mockup()
    // await mockup_init()
  })
  it('set_mockup_now', async () => {
    set_mockup_now(timeNow)
  })
})

/* Scenario ---------------------------------------------------------------- */

describe('[brokenAuction] Contract deployment', async () => {
  it('Deploy test_binding', async () => {
    await brokenAuction.deploy({ as: alice })
  })
})

describe('Extortion attack scenario', async () => {
  it('Seller Mints NFT', async () => {
    await brokenAuction.mint('My NFT', { as: seller1, amount: new Tez(1) })
  })
  it('Seller opens auction on NFT', async () => {
    const oneHourLater = addHourToDate(get_mockup_now())

    await brokenAuction.openAuction(
      new Int(1),
      seller1.get_address(),
      oneHourLater,
      { as: seller1 }
    )
  })

  it('Alice makes a bid', async () => {
    delay_mockup_now_by_minute(1)
    await brokenAuction.bid(new Int(1), { as: alice, amount: new Tez(1) })
  })
  it('Bob makes a bid', async () => {
    delay_mockup_now_by_minute(1)
    await brokenAuction.bid(new Int(1), { as: bob, amount: new Tez(2) })
  })
  it('Seller delays claiming top bid as part of extortion attack', async () => {
    // At this point, the seller can claim the top bid at their leisure. Bob cannot withdraw
    // his bid at this time.
    // Because the seller can withdraw the bid at their leisure,
    // They can extort the top bidder for a further payment. If the top bidder
    // refuses, they can refuse to continue with the sale, and the top bidder will simply
    // have lost their bid. (Even if the top bidder does pay some extorted fee, this does
    // not guarantee that the seller will transfer the token.)

    delay_mockup_now_by_day(365)
    // The seller waits for a year before claiming the bid and transferring the token.
    await brokenAuction.claimTopBid(new Int(1), { as: seller1 })
  })
})
