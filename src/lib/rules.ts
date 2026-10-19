import type { FormKey } from "./forms";

export type Role = "diretoria" | "gerencia" | "membro" | "trainee";
export type User = { id: string; n: string; r: Role; a: string; l: string };
export type Val = Record<string, string | string[] | undefined>;
export type Rec = { id: string; f: FormKey; d: string; q: string; sub: string; by: string; v: Val };
export type DB = {
  u: User[];
  rec: Rec[];
  done: Record<string, string[]>;
  me: string;
  th: "dark" | "light";
};

export const ROLE: Record<Role, string> = {
  diretoria: "diretoria",
  gerencia: "gerência",
  membro: "membro",
  trainee: "trainee",
};

export const seed = (): DB => ({
  u: [
    { id: "u1", n: "Ana Souza", r: "diretoria", a: "Pessoas", l: "" },
    { id: "u2", n: "Bruno Lima", r: "diretoria", a: "Projetos", l: "" },
    { id: "u3", n: "Carla Dias", r: "gerencia", a: "Projetos", l: "u2" },
    { id: "u4", n: "Maria Luísa Gomes e Silva", r: "membro", a: "Projetos", l: "u3" },
    { id: "u5", n: "Davi Rocha", r: "trainee", a: "Projetos", l: "u3" },
  ],
  rec: [],
  done: {},
  me: "u4",
  th: "dark",
});

export const quarter = (d = new Date()) =>
  d.getFullYear() + "-T" + Math.ceil((d.getMonth() + 1) / 3);
export const isPeople = (u: User) => u.r === "diretoria" && u.a === "Pessoas";
export const isLead = (u: User) => u.r === "diretoria" || u.r === "gerencia";
const n = (v: unknown) => (v === undefined || v === "" || v === "N" ? null : Number(v));
export const num = n;

/** Who may read a record: subject, their leader, People directorate, or a manager of the same area. 360 only author + People. */
export function canSee(D: DB, me: User, r: Rec) {
  const s = D.u.find((x) => x.id === r.sub);
  if (r.f === "f3") return r.by === me.id || isPeople(me);
  return (
    r.sub === me.id || s?.l === me.id || isPeople(me) || (me.r === "gerencia" && s?.a === me.a)
  );
}

/** People this user may fill 1:1/PDI for. */
export const subjects = (D: DB, me: User) =>
  isPeople(me)
    ? D.u
    : D.u.filter((u) => u.id === me.id || u.l === me.id || (me.r === "gerencia" && u.a === me.a));

/** 1:1 alert signals (Anexo A). */
export function isAlert(r: Rec) {
  if (r.f !== "um") return false;
  const v = r.v;
  const lt = (k: string, x: number) => {
    const y = n(v[k]);
    return y !== null && y < x;
  };
  const pa = (v["pa"] as string[]) || [];
  return (
    lt("bem", 5) ||
    lt("en", 4) ||
    ["aut", "comp", "per2"].some((k) => lt(k, 3)) ||
    pa.some((x) => ["carga", "vontade de sair"].includes(x))
  );
}

export const MAX_360_PER_ROUND = 3;
export const MIN_360_RESPONDENTS = 3;
export const MIN_CLIMATE_RESPONSES = 5;

export const peers360Done = (D: DB, by: string, q: string) =>
  D.rec.filter((x) => x.f === "f3" && x.by === by && x.q === q && x.sub !== by).length;

export function enps(scores: number[]) {
  if (!scores.length) return 0;
  const p = scores.filter((x) => x >= 9).length,
    d = scores.filter((x) => x <= 6).length;
  return Math.round(((p - d) / scores.length) * 100);
}

/** 70-20-10: ≥1 experience, ≥1 relationship, ≤1 formal. */
export function pdi702010Ok(types: string[]) {
  if (!types.length) return true;
  return (
    types.some((t) => t.startsWith("exp")) &&
    types.some((t) => t.startsWith("rel")) &&
    types.filter((t) => t.startsWith("form")).length <= 1
  );
}

export const avg = (a: number[]) =>
  a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : "—";
