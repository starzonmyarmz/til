import { useState } from "react"

const FormFieldName = {
  Address: "address",
  City: "city",
  State: "state",
  ZipCode: "zip_code",
}
const validKeys = new Set(Object.values(FormFieldName))

export default function EnumKeys() {
  const [input, setInput] = useState("address")
  const [looseMode, setLooseMode] = useState(false)

  const isValid = validKeys.has(input)
  const looseResult = `formErrors["${input}" as FormFieldName] → ${isValid ? "✓ works at runtime" : "✗ silent bug — returns undefined, no error"}`
  const strictResult = isValid
    ? `formErrors[FormFieldName.${capitalize(input)}] → ✓ typechecks, works`
    : `TypeScript error: "${input}" is not assignable to FormFieldName`

  return (
    <div className="demo">
      <div className="row">
        <label>
          Typed key:{" "}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="txt"
          />
        </label>
      </div>

      <div className="row">
        <button onClick={() => setLooseMode(false)} className={!looseMode ? "active" : ""}>
          Strict: name: FormFieldName
        </button>
        <button onClick={() => setLooseMode(true)} className={looseMode ? "active" : ""}>
          Loose: name: string
        </button>
      </div>

      <div className="panel">
        <div className={looseMode ? "codelike" : "codelike muted"}>{looseResult}</div>
        <div className={!looseMode ? "codelike" : "codelike muted"}>{strictResult}</div>
      </div>

      <p className="hint">
        Try typing <code>addres</code> (one s) or <code>zip</code>. The strict typing catches the
        typo at compile time. The loose <code>string</code> typing only notices at runtime — if
        at all.
      </p>
    </div>
  )
}

function capitalize(s) {
  const map = { address: "Address", city: "City", state: "State", zip_code: "ZipCode" }
  return map[s] || s
}
