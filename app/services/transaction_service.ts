import Transaction from '#models/transaction'
import { EthereumTransaction } from '#types/etherscan'

export default class TransactionService {
  public async getLastTransactionByAdress(adress: string): Promise<Transaction | null> {
    const transaction = Transaction.query()
      .where('wallet_address', adress)
      .orderBy('date', 'desc')
      .first()
    return transaction
  }

  public async createTransaction(
    ethereumTransaction: EthereumTransaction,
    walletAddress: string
  ): Promise<Transaction | null> {
    try {
      const transaction = await Transaction.create({
        timeStamp: ethereumTransaction.timeStamp,
        gas: ethereumTransaction.gas,
        gasUsed: ethereumTransaction.gasUsed,
        gasPrice: ethereumTransaction.gasPrice,
        isError: ethereumTransaction.isError,
        hash: ethereumTransaction.hash,
        from: ethereumTransaction.from.toLowerCase(),
        to: ethereumTransaction.to.toLowerCase(),
        value: ethereumTransaction.value,
        walletAddress: walletAddress.toLowerCase(),
      })
      return transaction
    } catch (error) {
      console.log('Error creating transaction', error)
      return null
    }
  }
}
