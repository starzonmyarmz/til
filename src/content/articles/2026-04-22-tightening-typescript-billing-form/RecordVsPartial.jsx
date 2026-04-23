import { useState } from "react"

const keys = ["address", "city", "state", "zip_code"]

export default function RecordVsPartial() {
  const [strict, setStrict] = useState(true)

  const value = "123 Main St"

  const readResult = strict
    ? { type: "string", body: `"${value}"`, hint: "Always a string. Safe to call .toUpperCase() or .join on an errors array." }
    : { type: "string | undefined", body: `"${value}"`, hint: "Could be undefined at the type level, even if it never is at runtime. You'll need a fallback at every read." }

  return (
    <div className="demo">
      <div className="row">
        <button onClick={() => setStrict(true)} className={strict ? "active" : ""}>
          Record&lt;K, string&gt;
        </button>
        <button onClick={() => setStrict(false)} className={!strict ? "active" : ""}>
          Partial&lt;Record&lt;K, string&gt;&gt;
        </button>
      </div>

      <div className="panel">
        <div className="codelike">fields[&quot;address&quot;]</div>
        <div className="arrow">↓</div>
        <div className="codelike">
          <span className="typelabel">type:</span> {readResult.type}
        </div>
        <div className="codelike">
          <span className="typelabel">value:</span> {readResult.body}
        </div>
        <p className="hint">{readResult.hint}</p>
      </div>

      <p className="hint">
        Keys in both types: {keys.map(k => <code key={k} style={{ marginRight: 6 }}>{k}</code>)}
      </p>
    </div>
  )
}
