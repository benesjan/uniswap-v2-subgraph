/* eslint-disable prefer-const */
import {BigInt} from '@graphprotocol/graph-ts'
import {Transaction} from '../types/schema'
import {Transfer} from '../types/templates/Pair/Pair'
import {ADDRESS_ZERO} from './helpers'


export function handleTransfer(event: Transfer): void {
    // ignore initial transfers for first adds
    if (event.params.to.toHexString() == ADDRESS_ZERO && event.params.value.equals(BigInt.fromI32(1000))) {
        return
    }

    let transactionHash = event.transaction.hash.toHexString()

    // get or create transaction
    let transaction = Transaction.load(transactionHash)
    if (transaction === null) {
        transaction = new Transaction(transactionHash)
        transaction.from = event.params.from
        transaction.to = event.params.to
        transaction.blockNumber = event.block.number
        transaction.timestamp = event.block.timestamp
        transaction.gasUsed = event.transaction.gasUsed
        transaction.gasPrice = event.transaction.gasPrice
        transaction.mints = []
        transaction.burns = []
        transaction.swaps = []
    }


    transaction.save()
}