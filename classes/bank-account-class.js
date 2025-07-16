import { success } from "zod";

export class BankAccount {
  constructor(Accounts = [], id = 0) {
    this.Accounts = Accounts;
    this.id = id;
  }

  getAccountsInfo() {
    return this.Accounts;
  }

  createAccount(ValidatedData) {
    const { BankNumber, AccountName, Funds } = ValidatedData;
    if (this.findAccountIndexByBankNumber(BankNumber) !== -1) {
      throw new Error("Bank account already exists!");
    }
    console.log(
      `Creating bank account with number ${BankNumber} and initial funds ${Funds}`
    );
    this.Accounts.push({
      id: this.id,
      BankNumber,
      AccountName,
      Funds,
    });
    this.id += 1;
    return {
      message: "Bank account created successfully!",
      account: this.Accounts[this.Accounts.length - 1],
    };
  }

  findAccountIndexByBankNumber(bankNumber) {
    const index = this.Accounts.findIndex(
      (account) => account.BankNumber === bankNumber
    );
    return index;
  }
  findAccountById(id) {
    return this.Accounts.find((account) => account.id === id);
  }
  updateAccountName(newAccountName, id) {
    const index = this.Accounts.findIndex(
      (account) => account.id === Number(id)
    );
    if (index === -1) {
      return res.status(404).send({ message: "Account not found!" });
    }
    this.Accounts[index].AccountName = newAccountName;
    return success({
      message: "Account name updated successfully!",
    });
  }

  updateFunds(newFunds, bankNumber) {
    const index = this.findAccountIndexByBankNumber(bankNumber);
    if (index === -1) {
      throw new Error("Bank account not found!");
    }
    this.Accounts[index].Funds =
      Number(this.Accounts[index].Funds) + Number(newFunds);
    return success({
      message: "Funds updated successfully!",
    });
  }

  accountdelete(id) {
    const accountIndex = this.Accounts.findIndex(
      (account) => account.id === Number(id)
    );
    if (accountIndex === -1) {
      throw new Error("Account not found!");
    }
    const bankNumber = this.Accounts[accountIndex].BankNumber;
    this.Accounts.splice(accountIndex, 1);
    console.log(bankNumber);
    return bankNumber;
  }
}
