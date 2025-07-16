import { BankAccount } from "./bank-account-class.js";
import { bc } from "../index.js";
import { success } from "zod";

export class Transactions {
  transactions = [];
  id = 0;
  constructor(transactions = [], id = 0) {
    this.transactions = transactions;
    this.id = id;
  }
  getransactions() {
    return this.transactions;
  }
  createTransaction(ValidatedData) {
    const { BankNumber, Amount, Description, TransactionType } = ValidatedData;
    //console.log(bc);
    console.log(
      `Creating transaction for account ${BankNumber} with amount ${Amount}`
    );
    bc.updateFunds(Amount, BankNumber);
    console.log(`Funds updated for account ${BankNumber}.`);
    const transaction = {
      id: this.id,
      BankNumber,
      Amount,
      Description,
      TransactionType,
      date: new Date().toLocaleString("lt-LT"),
    };
    this.transactions.push(transaction);
    this.id = this.id + 1;
    console.log(`Transaction created`);
    return transaction;
  }
  deleteallTransactionsByBankNr(bankNumber) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.BankNumber != bankNumber
    );
    return {
      success: true,
      message: `All transactions for account ${bankNumber} and the account deleted successfully!`,
    };
  }
  getTransactionById(id) {
    return this.transactions.find((transaction) => transaction.id === id);
  }
}
