import { z } from "zod";

export const BankValidation = z.object({
  BankNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{2}[0-9]{12}$/, {
      message:
        "Banko sąskaita turi prasidėti su dviem didžiosiomis raidėmis ir turėti 12 skaičių.",
    }),
  AccountName: z
    .string()
    .trim()
    .regex(/^[A-Z][a-z]+ [A-Z][a-z]+$/)
    .min(7, {
      message:
        "Sąskaitos savininko vardas ir pavardė turi sudaryti bent 7 simbolius.",
    }),
  Funds: z
    .string()
    .trim()
    .regex(/^-?[0-9]+$/, {
      message: "Likutis turi būti teigiamas arba neigiamas sveikasis skaičius.",
    }),
});

export const BankAccountNameValidation = z.object({
  AccountName: z
    .string()
    .trim()
    .regex(/^[A-Z][a-z]+ [A-Z][a-z]+$/, {
      message: "Sąskaitos savininko vardas ir pavardė turi būti teisingi.",
    }),
});

export const TransactionValidation = z.object({
  BankNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{2}[0-9]{12}$/, {
      message:
        "Banko sąskaita turi prasidėti su dviem didžiosiomis raidėmis ir turėti 12 skaičių.",
    }),
  Amount: z
    .string()
    .trim()
    .regex(/^-?[0-9]+$/, {
      message: "Suma turi būti teigiamas arba neigiamas sveikasis skaičius.",
    }),
  Description: z.string().trim().min(5, {
    message: "Aprašymas turi sudaryti bent 5 simbolius.",
  }),
  TransactionType: z.enum(
    [
      "Deposit",
      "Withdrawal",
      "Transfer",
      "Payment",
      "Refund",
      "Fee",
      "Interest",
      "Adjustment",
    ],
    {
      message:
        "Transakcijos tipas turi būti vienas iš: 'Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Refund', 'Fee', 'Interest', arba 'Adjustment'.",
    }
  ),
});
