import { describe, expect, it } from "vitest";
import { enps, isAlert, pdi702010Ok, type Rec } from "@/lib/rules";

const um = (v: Rec["v"]): Rec => ({ id: "x", f: "um", d: "", q: "", sub: "", by: "", v });

describe("regras", () => {
  it("1:1 com bem-estar abaixo de 5 gera alerta", () => {
    expect(isAlert(um({ bem: "4" }))).toBe(true);
    expect(isAlert(um({ bem: "5", en: "8" }))).toBe(false);
  });
  it("vontade de sair gera alerta", () =>
    expect(isAlert(um({ pa: ["vontade de sair"] }))).toBe(true));
  it("eNPS = %promotores (9-10) - %detratores (0-6)", () => expect(enps([10, 9, 8, 6, 0])).toBe(0));
  it("70-20-10 exige experiência e relacionamento, no máximo 1 formal", () => {
    expect(pdi702010Ok(["experiência (70)", "relacionamento (20)", "formal (10)"])).toBe(true);
    expect(pdi702010Ok(["formal (10)", "formal (10)"])).toBe(false);
  });
});
