import { useEffect, useState } from "react";
import logo from "@/assets/konvex-logo.png.asset.json";
import { FORMS, ITEMS, type FormKey, type Item } from "@/lib/forms";
import {
  ROLE,
  seed,
  quarter,
  isPeople,
  isLead,
  canSee,
  subjects,
  isAlert,
  peers360Done,
  enps,
  pdi702010Ok,
  avg,
  num,
  MAX_360_PER_ROUND,
  MIN_360_RESPONDENTS,
  MIN_CLIMATE_RESPONSES,
  type DB,
  type Rec,
  type Role,
  type Val,
} from "@/lib/rules";

type View = { p: string; x?: string | undefined };
const KEY = "kx";
const today = () => new Date().toISOString().slice(0, 10);

function Field({ i, v, set }: { i: Item; v: Val; set: (k: string, x: Val[string]) => void }) {
  const cur = v[i.k];
  let body;
  if (i.y === "s") {
    const o: string[] = [];
    for (let n = i.a!; n <= i.b!; n++) o.push(String(n));
    if (i.na) o.push("N");
    body = (
      <>
        <div className="sc">
          {o.map((n) => (
            <button
              key={n}
              type="button"
              className={cur === n ? "on" : ""}
              onClick={() => set(i.k, cur === n ? undefined : n)}
            >
              {n}
            </button>
          ))}
        </div>
        {i.lo && (
          <small>
            {i.a} = {i.lo} · {i.b} = {i.hi}
          </small>
        )}
      </>
    );
  } else if (i.y === "r" || i.y === "c") {
    const arr = (cur as string[]) || [];
    body = (
      <div className="op">
        {i.o!.map((o) => {
          const on = i.y === "c" ? arr.includes(o) : cur === o;
          return (
            <button
              key={o}
              type="button"
              className={on ? "on" : ""}
              onClick={() =>
                set(
                  i.k,
                  i.y === "c"
                    ? on
                      ? arr.filter((x) => x !== o)
                      : [...arr, o]
                    : on
                      ? undefined
                      : o,
                )
              }
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  } else if (i.y === "n") {
    body = (
      <input
        type="number"
        min={0}
        max={80}
        value={(cur as string) || ""}
        onChange={(e) => set(i.k, e.target.value)}
      />
    );
  } else {
    body = <textarea value={(cur as string) || ""} onChange={(e) => set(i.k, e.target.value)} />;
  }
  return (
    <div className="q">
      <b>{i.t}</b>
      {body}
    </div>
  );
}

export function KonvexApp() {
  const [D, setD] = useState<DB>(seed);
  const [ready, setReady] = useState(false);
  const [V, setV] = useState<View>({ p: "home" });
  const [cur, setCur] = useState<Val>({});
  const [sub, setSub] = useState("");
  const [rt, setRt] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setD(JSON.parse(s));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(D));
  }, [D, ready]);

  const me = (D.u.find((x) => x.id === D.me) || D.u[0])!;
  const U = (id: string) => D.u.find((x) => x.id === id) || { n: "—" };
  const q = quarter();
  const go = (p: string, x?: string) => {
    setV({ p, x });
    setCur({});
    setSub("");
    window.scrollTo(0, 0);
  };
  const set = (k: string, x: Val[string]) => setCur((c) => ({ ...c, [k]: x }));
  const recs = (f: FormKey) =>
    D.rec.filter((r) => r.f === f && canSee(D, me, r)).sort((a, b) => b.d.localeCompare(a.d));

  function save(f: FormKey) {
    const r: Rec = { id: "r" + Date.now(), f, d: today(), q, sub: "", by: "", v: { ...cur } };
    const next = { ...D, rec: [...D.rec], done: { ...D.done } };
    if (f === "cl") {
      if (cur["e"] === undefined) return alert("Responda a pergunta de eNPS.");
      next.done[q] = [...(next.done[q] || []), me.id];
    } else {
      r.sub = sub || (f === "f3" ? D.u[0]!.id : subjects(D, me)[0]!.id);
      r.by = me.id;
      if (f === "f3") {
        if (!cur["rel"]) return alert("Escolha sua relação com a pessoa.");
        if (r.sub !== me.id && peers360Done(D, me.id, q) >= MAX_360_PER_ROUND)
          return alert("Limite de 3 colegas avaliados por rodada.");
      }
      if (f === "pdi") {
        const t = [1, 2, 3].map((n) => cur["t" + n] as string).filter(Boolean);
        if (
          !pdi702010Ok(t) &&
          !confirm(
            "Regra 70-20-10: pelo menos 1 meta de experiência, 1 de relacionamento e no máximo 1 formal. Salvar mesmo assim?",
          )
        )
          return;
      }
    }
    next.rec.push(r);
    setD(next);
    alert("Salvo.");
    go(f === "cl" ? "home" : f, f);
  }

  const List = ({ f }: { f: FormKey }) => (
    <>
      <h2>{FORMS[f].n}</h2>
      <button className="btn" onClick={() => go("fill", f)}>
        + Novo
      </button>
      {f === "f3" && (
        <button className="btn g" onClick={() => go("rep360")}>
          Relatório individual
        </button>
      )}
      <div className="card tw">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>{f === "f3" ? "Avaliado" : "Membro"}</th>
              <th>Rodada</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recs(f).map((x) => (
              <tr key={x.id}>
                <td>{x.d}</td>
                <td>{U(x.sub).n}</td>
                <td>{x.q}</td>
                <td>{isAlert(x) && <span className="bd">alerta</span>}</td>
                <td>
                  <button className="lk" onClick={() => go("show", x.id)}>
                    abrir
                  </button>
                </td>
              </tr>
            ))}
            {!recs(f).length && (
              <tr>
                <td colSpan={5} className="m">
                  Nada registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  function Fill({ f }: { f: FormKey }) {
    const F = FORMS[f];
    if (f === "cl" && (D.done[q] || []).includes(me.id))
      return (
        <div className="card">
          <h3>Pesquisa de clima</h3>Você já respondeu a rodada {q}. Obrigado!
        </div>
      );
    const opts = f === "f3" ? D.u : subjects(D, me);
    return (
      <>
        <h2>
          {F.n}
          {f === "cl" ? " trimestral · " + q : ""}
        </h2>
        {f !== "cl" && (
          <div className="card">
            <b>{f === "f3" ? "Quem você está avaliando" : "Membro"}</b>
            <select
              className="f"
              value={sub || opts[0]?.id}
              onChange={(e) => setSub(e.target.value)}
            >
              {opts.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.n}
                  {u.id === me.id ? " (eu)" : ""} · {ROLE[u.r]}
                </option>
              ))}
            </select>
          </div>
        )}
        {F.s.map((s) => (
          <div className="card" key={s.h}>
            <h3>{s.h}</h3>
            {s.n && <div className="note">{s.n}</div>}
            {s.i.map((i) => (
              <Field key={i.k} i={i} v={cur} set={set} />
            ))}
          </div>
        ))}
        <br />
        <button className="btn" onClick={() => save(f)}>
          Salvar
        </button>
      </>
    );
  }

  function Show({ id }: { id: string }) {
    const r = D.rec.find((x) => x.id === id);
    if (!r) return null;
    const F = FORMS[r.f];
    return (
      <>
        <h2>
          {F.n} · {U(r.sub).n}
        </h2>
        <small>
          {r.d} · registrado por {U(r.by).n}
        </small>
        {isAlert(r) && (
          <div className="note">
            Sinais de alerta: avisar Pessoas em até 5 dias úteis (Anexo A).
          </div>
        )}
        {F.s.map((s) => {
          const rows = s.i.filter(
            (i) => r.v[i.k] && (!Array.isArray(r.v[i.k]) || (r.v[i.k] as string[]).length),
          );
          return (
            <div className="card" key={s.h}>
              <h3>{s.h}</h3>
              {rows.length ? (
                rows.map((i) => {
                  const v = r.v[i.k];
                  return (
                    <div className="q" key={i.k}>
                      <small>{i.t}</small>
                      <div>
                        <b>{Array.isArray(v) ? v.join(", ") : v}</b>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="m">—</span>
              )}
            </div>
          );
        })}
        <br />
        <button className="btn g" onClick={() => go(r.f)}>
          Voltar
        </button>
      </>
    );
  }

  function Rep360() {
    const s = subjects(D, me),
      t = rt || me.id;
    const R = D.rec.filter((r) => r.f === "f3" && r.sub === t);
    const oth = R.filter((r) => r.v["rel"] !== "autoavaliação");
    const it = ITEMS("f3").filter((i) => i.ax);
    const G: Record<string, Rec[]> = {
      Auto: R.filter((r) => r.v["rel"] === "autoavaliação"),
      Colegas: R.filter((r) => r.v["rel"] === "colega"),
      Líder: R.filter((r) => r.v["rel"] === "líder direto"),
      Liderados: R.filter((r) => r.v["rel"] === "liderado"),
    };
    const axes = [...new Set(it.map((i) => i.ax!))];
    return (
      <>
        <h2>Relatório individual · 360</h2>
        <select className="f" value={t} onChange={(e) => setRt(e.target.value)}>
          {s.map((u) => (
            <option key={u.id} value={u.id}>
              {u.n}
            </option>
          ))}
        </select>
        {oth.length < MIN_360_RESPONDENTS ? (
          <div className="note">
            Mínimo de 3 respondentes (hoje: {oth.length}). Relatório bloqueado para proteger o
            anonimato.
          </div>
        ) : (
          <>
            <div className="card tw">
              <table>
                <thead>
                  <tr>
                    <th>Eixo</th>
                    {Object.keys(G).map((g) => (
                      <th key={g}>{g}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {axes.map((a) => (
                    <tr key={a}>
                      <td>{a}</td>
                      {Object.values(G).map((g, j) => (
                        <td key={j}>
                          {avg(
                            g.flatMap((r) =>
                              it
                                .filter((i) => i.ax === a)
                                .map((i) => num(r.v[i.k]))
                                .filter((x): x is number => x !== null),
                            ),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <small>
                Se um grupo de pares tiver só 1 pessoa, una a outro grupo. Devolutiva sempre em
                conversa de 30 min.
              </small>
            </div>
            {isPeople(me) && (
              <div className="card">
                <h3>Comentários (sem autoria)</h3>
                {oth.flatMap((r) =>
                  ["o1", "o2", "o3"]
                    .filter((k) => r.v[k])
                    .map((k) => <p key={r.id + k}>• {r.v[k] as string}</p>),
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  }

  function Clima() {
    const fillLink = (
      <button className="sh" style={{ width: "100%" }} onClick={() => go("fill", "cl")}>
        ☁ Responder a pesquisa deste trimestre
      </button>
    );
    if (!isLead(me))
      return (
        <>
          {fillLink}
          <div className="card">
            Os resultados do clima são apresentados em Reunião Geral, com o plano de ação.
          </div>
        </>
      );
    const R = D.rec.filter((r) => r.f === "cl" && r.q === q),
      n = R.length;
    if (n < MIN_CLIMATE_RESPONSES)
      return (
        <>
          {fillLink}
          <h2>Clima {q}</h2>
          <div className="note">Mínimo de 5 respondentes para exibir resultados (hoje: {n}).</div>
        </>
      );
    const e = R.map((r) => Number(r.v["e"]));
    const ps = ITEMS("cl").filter((i) => /^s\d$/.test(i.k));
    const dims: Record<string, number[]> = {};
    ITEMS("cl")
      .filter((i) => i.dim)
      .forEach((i) =>
        (dims[i.dim!] = dims[i.dim!] || []).push(
          ...R.map((r) => num(r.v[i.k])).filter((x): x is number => x !== null),
        ),
      );
    return (
      <>
        {fillLink}
        <h2>Clima {q}</h2>
        <div className="grid">
          <div className="card">
            <h3>eNPS</h3>
            <div className="big">{enps(e)}</div>
            <small>
              {e.filter((x) => x >= 9).length} promotores · {e.filter((x) => x <= 6).length}{" "}
              detratores · {n} respostas
            </small>
          </div>
          <div className="card">
            <h3>Segurança psicológica</h3>
            <div className="big">
              {avg(
                ps.flatMap((i) =>
                  R.map((r) => num(r.v[i.k]))
                    .filter((x): x is number => x !== null)
                    .map((x) => (i.R ? 6 - x : x)),
                ),
              )}
            </div>
            <small>média (itens invertidos corrigidos)</small>
          </div>
          <div className="card">
            <h3>Taxa de resposta</h3>
            <div className="big">{Math.round((n / D.u.length) * 100)}%</div>
          </div>
        </div>
        <div className="card">
          <h3>Dimensões</h3>
          <table>
            <tbody>
              {Object.entries(dims).map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>
                    <b>{avg(v)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function Team() {
    const [nn, setNn] = useState(""),
      [nr, setNr] = useState<Role>("membro"),
      [na, setNa] = useState(""),
      [nl, setNl] = useState("");
    const levels: Role[] = ["diretoria", "gerencia", "membro", "trainee"];
    return (
      <>
        <h2>Gestão de pessoas</h2>
        {levels.map((lv) => {
          const people = D.u.filter((u) => u.r === lv);
          return (
            <div className="card tw" key={lv}>
              <h4 style={{ marginTop: 0, textTransform: "capitalize" }}>
                {ROLE[lv]} · {people.length}
              </h4>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Área</th>
                    <th>Líder</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((u) => (
                    <tr key={u.id}>
                      <td>{u.n}</td>
                      <td>{u.a}</td>
                      <td>{U(u.l).n}</td>
                      <td>
                        {u.id !== me.id && (
                          <button
                            className="lk"
                            onClick={() =>
                              confirm("Remover " + u.n + "?") &&
                              setD({ ...D, u: D.u.filter((x) => x.id !== u.id) })
                            }
                          >
                            remover
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
        <div className="card">
          <h3>Adicionar pessoa</h3>
          <div className="grid">
            <input placeholder="Nome" value={nn} onChange={(e) => setNn(e.target.value)} />
            <select className="f" value={nr} onChange={(e) => setNr(e.target.value as Role)}>
              {levels.map((k) => (
                <option key={k} value={k}>
                  {ROLE[k]}
                </option>
              ))}
            </select>
            <input
              placeholder="Área (Pessoas, Projetos, Mercado, Financeiro...)"
              value={na}
              onChange={(e) => setNa(e.target.value)}
            />
            <select className="f" value={nl} onChange={(e) => setNl(e.target.value)}>
              <option value="">Sem líder</option>
              {D.u.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.n}
                </option>
              ))}
            </select>
          </div>
          <br />
          <button
            className="btn"
            onClick={() => {
              if (!nn.trim()) return;
              setD({
                ...D,
                u: [...D.u, { id: "u" + Date.now(), n: nn.trim(), r: nr, a: na.trim(), l: nl }],
              });
              setNn("");
              setNa("");
            }}
          >
            Adicionar
          </button>
          <button
            className="btn g"
            onClick={() => {
              if (confirm("Apagar todos os dados de demonstração?")) {
                setD(seed());
                go("home");
              }
            }}
          >
            Reiniciar demo
          </button>
        </div>
      </>
    );
  }

  function Home() {
    const mo = today().slice(0, 7),
      pend: string[] = [];
    if (!D.rec.some((r) => r.f === "um" && r.sub === me.id && r.d.startsWith(mo)))
      pend.push("1:1 do mês");
    if (!D.rec.some((r) => r.f === "pdi" && r.sub === me.id)) pend.push("PDI");
    if (!(D.done[q] || []).includes(me.id)) pend.push("Pesquisa de clima " + q);
    const al = D.rec.filter((r) => isAlert(r) && canSee(D, me, r) && r.sub !== me.id).length;
    const f3 = Math.max(0, MAX_360_PER_ROUND - peers360Done(D, me.id, q));
    return (
      <>
        <div className="hero">
          <div>
            <h1>Olá, {me.n.split(" ")[0]}.</h1>
            <p>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              . {ROLE[me.r]} · {me.a}
            </p>
            <button className="btn" onClick={() => go("fill", "um")}>
              Fazer 1:1
            </button>
            <button className="btn g" onClick={() => go("fill", "cl")}>
              Responder clima
            </button>
          </div>
          <div className="st">
            <div>
              <b>{pend.length}</b>
              <span>pendências</span>
            </div>
            <div>
              <b>{f3}</b>
              <span>avaliações 360 disponíveis</span>
            </div>
            <div>
              <b>{al}</b>
              <span>sinais de alerta</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Minhas pendências</h3>
          {pend.length ? (
            pend.map((p) => (
              <span key={p} className="bd">
                {p}
              </span>
            ))
          ) : (
            <span className="m">Tudo em dia.</span>
          )}
        </div>
        {al > 0 && (
          <div className="note">
            <b>Sinais de alerta:</b> há 1:1s com bem-estar baixo, energia baixa, sobrecarga ou
            vontade de sair. Avisar Pessoas em até 5 dias úteis (Anexo A).
          </div>
        )}
        <h2>Atalhos</h2>
        <div className="grid">
          {(["um", "pdi", "f3", "cl"] as FormKey[]).map((f) => (
            <button key={f} className="sh" onClick={() => go(f)}>
              {FORMS[f].ic} {FORMS[f].n}
            </button>
          ))}
          {isLead(me) && (
            <button className="sh" onClick={() => go("team")}>
              ☷ Gestão de pessoas
            </button>
          )}
        </div>
      </>
    );
  }

  const nav: [string, string, string][] = [
    ["home", "▦", "Início"],
    ["um", "♡", "1:1"],
    ["pdi", "◎", "PDI"],
    ["f3", "◈", "Feedback 360"],
    ["cl", "☁", "Clima"],
  ];
  if (isLead(me)) nav.push(["team", "☷", "Gestão"]);

  const { p, x } = V;
  let page;
  if (p === "home") page = <Home />;
  else if (p === "fill") page = <Fill f={x as FormKey} />;
  else if (p === "show") page = <Show id={x!} />;
  else if (p === "rep360") page = <Rep360 />;
  else if (p === "team") page = <Team />;
  else if (p === "cl") page = <Clima />;
  else page = <List f={p as FormKey} />;

  return (
    <div className="kx" data-t={D.th}>
      <header>
        <div className="hi">
          <img src={logo.url} alt="Konvex Jr" onClick={() => go("home")} />
          <span className="sp" />
          <span className="chip">
            Hoje · {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
          </span>
          <button
            title="Tema"
            onClick={() => setD({ ...D, th: D.th === "dark" ? "light" : "dark" })}
          >
            {D.th === "dark" ? "☀" : "☾"}
          </button>
          <select
            title="Trocar de usuário"
            value={me.id}
            onChange={(e) => {
              setD({ ...D, me: e.target.value });
              go("home");
            }}
          >
            {D.u.map((u) => (
              <option key={u.id} value={u.id}>
                {u.n} · {ROLE[u.r]}
              </option>
            ))}
          </select>
        </div>
      </header>
      <nav>
        {nav.map(([k, i, t]) => (
          <button
            key={k}
            title={t}
            aria-label={t}
            className={p === k || (x === k && p !== "show") ? "on" : ""}
            onClick={() => go(k)}
          >
            {i}
          </button>
        ))}
      </nav>
      <main>{page}</main>
    </div>
  );
}
