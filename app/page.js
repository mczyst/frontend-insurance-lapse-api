"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/predict";

const initialForm = {
  entry_age: 35,
  sex: "M",
  substandard_risk: 0,
  channel1: "1",
  channel2: "1",
  channel3: "1",
  payment_mode: "Monthly",
  premium_amount: 250,
  benefit_amount: 100000,
  initial_benefit: 0,
  advance_premium_count: 0,
  policy_year: 2,
  policy_year_decimal: 2,
  full_benefit: "N",
  non_lapse_guaranteed: "NO NLG",
  policy_type_1: "3",
  policy_type_2: "5",
  policy_type_3: "A",
};

function riskColor(prob) {
  if (prob >= 0.8) return "var(--risk-high-2)";
  if (prob >= 0.6) return "var(--risk-high-1)";
  if (prob >= 0.3) return "var(--risk-mod)";
  return "var(--risk-low)";
}

export default function Page() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const payload = {
      entry_age: Number(form.entry_age),
      sex: form.sex,
      payment_mode: form.payment_mode,
      non_lapse_guaranteed: form.non_lapse_guaranteed,
      substandard_risk: Number(form.substandard_risk),
      advance_premium_count: Number(form.advance_premium_count),
      initial_benefit: Number(form.initial_benefit),
      full_benefit: form.full_benefit,
      policy_year_decimal: Number(form.policy_year_decimal),
      policy_year: Number(form.policy_year),
      channel1: form.channel1,
      channel2: form.channel2,
      channel3: form.channel3,
      policy_type_1: form.policy_type_1,
      policy_type_2: form.policy_type_2,
      policy_type_3: form.policy_type_3,
      benefit_amount: Number(form.benefit_amount),
      premium_amount: Number(form.premium_amount),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend mengembalikan status ${res.status}. ${text}`);
      }

      const data = await res.json();
      setResult(data.prediction);
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err.message?.includes("fetch")
          ? `Tidak bisa menghubungi backend di ${API_URL}. Kemungkinan sedang "bangun" dari idle (free tier) — coba lagi dalam 30 detik.`
          : err.message
      );
      setStatus("error");
    }
  }

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1>Lapse Risk Ledger</h1>
          <p>
            Masukkan data profil polis untuk mengevaluasi probabilitas gagal
            bayar (lapse) secara langsung dari model prediksi.
          </p>
        </div>
        <div className="ref">
          FORM No. 017-EWS
          <br />
          Sistem Prediksi Risiko Lapse
        </div>
      </header>

      <div className="layout">
        <form className="sheet" onSubmit={handleSubmit}>
          <section className="section" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
            <h2>Profil tertanggung</h2>
            <div className="grid-3">
              <div className="field">
                <label htmlFor="entry_age">Entry age</label>
                <input id="entry_age" type="number" min="0" max="100" required
                  value={form.entry_age} onChange={(e) => update("entry_age", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="sex">Sex</label>
                <select id="sex" value={form.sex} onChange={(e) => update("sex", e.target.value)}>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="substandard_risk">Substandard risk (%)</label>
                <input id="substandard_risk" type="number" min="0" step="any"
                  value={form.substandard_risk} onChange={(e) => update("substandard_risk", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="channel1">Channel 1</label>
                <input id="channel1" value={form.channel1} onChange={(e) => update("channel1", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="channel2">Channel 2</label>
                <input id="channel2" value={form.channel2} onChange={(e) => update("channel2", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="channel3">Channel 3</label>
                <input id="channel3" value={form.channel3} onChange={(e) => update("channel3", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Keuangan &amp; pembayaran</h2>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="payment_mode">Payment mode</label>
                <select id="payment_mode" value={form.payment_mode} onChange={(e) => update("payment_mode", e.target.value)}>
                  <option value="Monthly">Monthly</option>
                  <option value="Quaterly">Quaterly</option>
                  <option value="Semiannually">Semiannually</option>
                  <option value="Annually">Annually</option>
                  <option value="Single Premium">Single Premium</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="premium_amount">Premium amount</label>
                <input id="premium_amount" type="number" min="0" step="any" required
                  value={form.premium_amount} onChange={(e) => update("premium_amount", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="benefit_amount">Benefit amount (UP)</label>
                <input id="benefit_amount" type="number" min="0" step="any" required
                  value={form.benefit_amount} onChange={(e) => update("benefit_amount", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="initial_benefit">Initial benefit</label>
                <input id="initial_benefit" type="number" min="0"
                  value={form.initial_benefit} onChange={(e) => update("initial_benefit", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="advance_premium_count">Advance premium count</label>
                <input id="advance_premium_count" type="number" min="0"
                  value={form.advance_premium_count} onChange={(e) => update("advance_premium_count", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Ketentuan &amp; durasi polis</h2>
            <div className="grid-3">
              <div className="field">
                <label htmlFor="policy_year">Policy year</label>
                <input id="policy_year" type="number" min="1"
                  value={form.policy_year} onChange={(e) => update("policy_year", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="policy_year_decimal">Policy year (decimal)</label>
                <input id="policy_year_decimal" type="number" min="0" step="any"
                  value={form.policy_year_decimal} onChange={(e) => update("policy_year_decimal", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="full_benefit">Full benefit?</label>
                <select id="full_benefit" value={form.full_benefit} onChange={(e) => update("full_benefit", e.target.value)}>
                  <option value="N">N</option>
                  <option value="Y">Y</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="non_lapse_guaranteed">Non lapse guaranteed</label>
                <select id="non_lapse_guaranteed" value={form.non_lapse_guaranteed} onChange={(e) => update("non_lapse_guaranteed", e.target.value)}>
                  <option value="NO NLG">NO NLG</option>
                  <option value="NLG Suspend">NLG Suspend</option>
                  <option value="NLG Not Active">NLG Not Active</option>
                  <option value="NLG Active">NLG Active</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="policy_type_1">Policy type 1</label>
                <input id="policy_type_1" value={form.policy_type_1} onChange={(e) => update("policy_type_1", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="policy_type_2">Policy type 2</label>
                <input id="policy_type_2" value={form.policy_type_2} onChange={(e) => update("policy_type_2", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="policy_type_3">Policy type 3</label>
                <input id="policy_type_3" value={form.policy_type_3} onChange={(e) => update("policy_type_3", e.target.value)} />
              </div>
            </div>
          </section>

          <div className="submit-row">
            <button className="submit-btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Menganalisis…" : "Analisis risiko lapse"}
            </button>
            <span className="submit-hint">Terhubung ke: {API_URL}</span>
          </div>
        </form>

        <aside className="result-panel">
          {status === "idle" && (
            <p className="result-empty">
              Hasil evaluasi risiko akan muncul di sini setelah formulir
              dikirim. Isi data di sebelah kiri, lalu klik &quot;Analisis
              risiko lapse&quot;.
            </p>
          )}

          {status === "loading" && (
            <p className="result-empty">Menghubungi model prediksi…</p>
          )}

          {status === "error" && (
            <div className="result-error">{errorMsg}</div>
          )}

          {status === "success" && result && (
            <>
              <div className="result-label">Kategori risiko</div>
              <div className="result-tier" style={{ color: riskColor(result.lapse_probability) }}>
                {result.risk_tier}
              </div>
              <div className="result-prob" style={{ color: riskColor(result.lapse_probability) }}>
                {result.lapse_probability_percentage}
              </div>
              <div className="result-bar-track">
                <div
                  className="result-bar-fill"
                  style={{
                    width: `${Math.min(100, result.lapse_probability * 100)}%`,
                    background: riskColor(result.lapse_probability),
                  }}
                />
              </div>
              <div className="result-action-label">Rekomendasi tindakan</div>
              <div className="result-action">{result.recommended_action}</div>
            </>
          )}
        </aside>
      </div>

      <p className="footer-note">
        Prediksi dihasilkan oleh model machine learning berbasis data historis
        dan bersifat probabilistik, bukan kepastian. Gunakan sebagai alat
        bantu keputusan operasional, bukan satu-satunya dasar keputusan.
      </p>
    </div>
  );
}
