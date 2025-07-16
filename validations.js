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
