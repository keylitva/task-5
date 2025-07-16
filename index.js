import express from "express";
import * as z from "zod";
import { BankValidation } from "./validations.js";
import { BankAccountNameValidation } from "./validations.js";
import { TransactionValidation } from "./validations.js";
import { Transactions } from "./classes/transaction-class.js";
import { BankAccount } from "./classes/bank-account-class.js";

const app = express();

app.use(express.json());

export const bc = new BankAccount();
const tx = new Transactions();

const usage = {
  user: { gets: 0, creates: 0, success: 0, fail: 0, delete: 0, change: 0 },
};

app.get("/available-funds/:id", (req, res) => {
  const BankoSaskaitos = bc.getAccountsInfo();
  usage.user.gets++;
  const account = BankoSaskaitos.find((s) => s.id === Number(req.params.id));
  res.setHeader("Content-Type", "text/html");
  res.send(`
        <html>
            <head>
                <title>Banko Likutis</title>
                <style>
                    body { font-family: sans-serif; margin: 1em; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ccc; padding: 2px; }
                    th { background: #eee; }
                    .stats { margin-top: 2em; }
                </style>
            </head>
            <body>
                <h4>Banko Saskaitos Likutis</h4>
                <table>
                    <tr>
                        <th>Likutis</th>
                    </tr>
                    <tr>
                        <td>${account ? account.Funds : "Nerasta"}</td>
                    </tr>
                </table>
                <div class="stats">
                    <h4>Stats</h4>
                    GETs: ${usage.user.gets}, Creates: ${
    usage.user.creates
  }, Success: ${usage.user.success}, Fail: ${usage.user.fail}, Deletes: ${
    usage.user.delete
  }, Changes: ${usage.user.change}
                </div>
            </body>
        </html>
    `);
  res.end();
});
app.get("/account-info", (req, res) => {
  const BankoSaskaitos = bc.getAccountsInfo();
  usage.user.gets++;
  res.setHeader("Content-Type", "text/html");
  res.send(`
          <html>
              <head>
                  <title>Banko Likutis</title>
                  <style>
                      body { font-family: sans-serif; margin: 1em; }
                      table { border-collapse: collapse; width: 100%; }
                      th, td { border: 1px solid #ccc; padding: 2px; }
                      th { background: #eee; }
                      .stats { margin-top: 2em; }
                  </style>
              </head>
              <body>
                  <h4>Banko Saskaitu informacija</h4>
                  <table>
                      <tr>
                          <th>ID</th>
                          <th>SaskaitosNr</th>
                          <th>Savininkas</th>
                          <th>Likutis</th>
                          <th>Sukurtas</th>
                          <th>Atnaujinta</th>
                      </tr>
                      ${BankoSaskaitos.map(
                        (s) => `
                          <tr>
                            <td>${s.id || "0"}</td>
                            <td>${s.BankNumber || ""}</td>
                            <td>${s.AccountName || ""}</td>
                            <td>${s.Funds || ""}</td>
                            <td>${s.createdAt || ""}</td>
                            <td>${s.updatedAt || "No updates"}</td>
                          </tr>
                      `
                      ).join("")}
                  </table>
                  <div class="stats">
                      <h4>Stats</h4>
                      GETs: ${usage.user.gets}, Creates: ${
    usage.user.creates
  }, Success: ${usage.user.success}, Fail: ${usage.user.fail}, Deletes: ${
    usage.user.delete
  }, Changes: ${usage.user.change}
                  </div>
              </body>
          </html>
      `);
  res.end();
});
app.post("/createbankaccount", (req, res) => {
  try {
    const validated = BankValidation.parse(req.body);
    bc.createAccount(validated);
    usage.user.creates++;
    usage.user.success++;
    //console.log(bc.getAccountsInfo());
    res.send({ message: "Created user successfully!" });
  } catch (error) {
    usage.user.fail++;
    return res
      .status(400)
      .send({ message: "Invalid Bank data!", error: error.issues });
  }
});
app.delete("/deletebankaccount/:id", (req, res) => {
  try {
    const banknr = bc.accountdelete(req.params.id);
    return res.send(tx.deleteallTransactionsByBankNr(banknr));
    usage.user.delete++;
  } catch (error) {
    return res
      .status(404)
      .send({ message: "Account deletion failed!", error: error });
  }
});
app.put("/change/:id", (req, res) => {
  req.params.id;

  try {
    const validated = BankAccountNameValidation.parse(req.body);
    return res.send(bc.updateAccountName(validated.AccountName, req.params.id));
    usage.user.change++;
    usage.user.success++;
  } catch (error) {
    usage.user.fail++;
    return res
      .status(400)
      .send({ message: "Invalid Bank data!", error: error.issues });
  }
});
app.get("/transactions", (req, res) => {
  const alltransactions = tx.getransactions();
  res.setHeader("Content-Type", "text/html");
  res.send(`
        <html>
            <head>
                <title>Transactions</title>
                <style>
                    body { font-family: sans-serif; margin: 1em; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ccc; padding: 2px; }
                    th { background: #eee; }
                </style>
            </head>
            <body>
                <h4>Transactions</h4>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Account NR</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Transaction Type</th>
                        <th>Date</th>
                    </tr>
                    ${alltransactions
                      .map(
                        (t) => `
                        <tr>
                            <td>${t.id}</td>
                            <td>${t.BankNumber}</td>
                            <td>${t.Amount}</td>
                            <td>${t.Description}</td>
                            <td>${t.TransactionType}</td>
                            <td>${t.date}</td>
                        </tr>`
                      )
                      .join("")}
                </table>
            </body>
        </html>
    `);
  res.end();
});
app.post("/transaction", (req, res) => {
  try {
    const validated = TransactionValidation.parse(req.body);
    const transaction = tx.createTransaction(validated);
    res.send({
      message: "Transaction created successfully!",
      transaction,
    });
    usage.user.success++;
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Transaction creation failed!", errors: error.issues });
  }
});
app.listen(3000, () => {
  console.log("The create user api has started on port 3000!");
});
