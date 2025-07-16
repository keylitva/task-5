import express from "express";
import * as z from "zod";
import { BankValidation } from "./validations.js";
import { id } from "zod/locales";

const app = express();

app.use(express.json());

const BankoSaskaitos = [];
let accountid = 0;

const usage = {
  user: { gets: 0, creates: 0, success: 0, fail: 0, delete: 0, change: 0 },
};

app.get("/available-funds/:id", (req, res) => {
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
                      </tr>
                      ${BankoSaskaitos.map(
                        (s) => `
                          <tr>
                            <td>${s.id || "0"}</td>
                            <td>${s.BankNumber || ""}</td>
                            <td>${s.AccountName || ""}</td>
                            <td>${s.Funds || ""}</td>
                            <td>${s.createdAt || ""}</td>
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
    console.log("Received Bank Account Data:", req.body);
    const validated = BankValidation.parse(req.body);
    console.log("Validated Bank Account:", validated);
    usage.user.creates++;
    usage.user.success++;
    validated.createdAt = new Date().toLocaleString("lt-LT");
    validated.id = accountid++;
    console.log("Adding Bank Account:", validated);
    BankoSaskaitos.push(validated);
    console.log("Current Bank Accounts:", BankoSaskaitos);
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
    const accountIndex = BankoSaskaitos.findIndex(
      (s) => s.id === Number(req.params.id)
    );
    if (accountIndex === -1) {
      usage.user.fail++;
      return res.status(404).send({ message: "Account not found!" });
    }
    BankoSaskaitos.splice(accountIndex, 1);
    usage.user.delete++;
    return res.send({ message: "Account deleted successfully!" });
  } catch (error) {
    return res
      .status(404)
      .send({ message: "Account deletion failed!", error: error });
  }
});

app.listen(3000, () => {
  console.log("The create user api has started on port 3000!");
});
