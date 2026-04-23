import { useState } from "react"

const keys = ["address", "city", "state", "zip_code"]
const organization = {
  address: "123 Main St",
  city: "Carlsbad",
  state: "CA",
  zip_code: "92008",
}

export default function FromEntries() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState("fromEntries")

  const maxSteps = keys.length

  function next() {
    setStep(s => Math.min(s + 1, maxSteps))
  }
  function reset() {
    setStep(0)
  }

  const partial = {}
  for (let i = 0; i < step; i++) {
    partial[keys[i]] = organization[keys[i]]
  }

  return (
    <div className="demo">
      <div className="row">
        <button onClick={() => { setMode("fromEntries"); reset() }} className={mode === "fromEntries" ? "active" : ""}>
          Object.fromEntries
        </button>
        <button onClick={() => { setMode("reduce"); reset() }} className={mode === "reduce" ? "active" : ""}>
          reduce
        </button>
      </div>

      <div className="panel">
        {mode === "reduce" ? (
          <>
            <div className="codelike">
              step {step}: spread accumulator, add <code>{keys[step - 1] ?? "—"}</code>
            </div>
            <div className="codelike">
              {"{ "}
              {Object.entries(partial).map(([k, v], i) => (
                <span key={k}>{i > 0 && ", "}{k}: "{v}"</span>
              ))}
              {" }"}
            </div>
            <p className="hint">
              Each step allocates a brand-new object from the previous one. Four fields = four
              intermediate objects. Reads like plumbing.
            </p>
          </>
        ) : (
          <>
            <div className="codelike">step {step}: collect [key, value] pair {step > 0 && `→ ["${keys[step - 1]}", "${organization[keys[step - 1]]}"]`}</div>
            <div className="codelike">
              {step === maxSteps
                ? `Object.fromEntries([${keys.map(k => `["${k}", "${organization[k]}"]`).join(", ")}])`
                : `entries so far: ${keys.slice(0, step).map(k => `["${k}", "${organization[k]}"]`).join(", ") || "[]"}`}
            </div>
            <p className="hint">
              Map to pairs, then one call builds the object. The shape of the code matches the
              shape of the data.
            </p>
          </>
        )}
      </div>

      <div className="row">
        <button onClick={next} disabled={step >= maxSteps}>Next step</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
