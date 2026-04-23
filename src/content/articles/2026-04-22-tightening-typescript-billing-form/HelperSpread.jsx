import { useState } from "react"

const fields = ["Address", "City", "State", "ZipCode"]

export default function HelperSpread() {
  const [helper, setHelper] = useState(true)

  const inlineCode = fields
    .map(
      f =>
        `  <Input\n    description={formErrors[FormFieldName.${f}]?.join(", ")}\n    invalid={Boolean(formErrors[FormFieldName.${f}])}\n  />`
    )
    .join("\n")

  const helperCode = fields
    .map(f => `  <Input {...errorProps(FormFieldName.${f})} />`)
    .join("\n")

  return (
    <div className="demo">
      <div className="row">
        <button onClick={() => setHelper(false)} className={!helper ? "active" : ""}>
          Inline (before)
        </button>
        <button onClick={() => setHelper(true)} className={helper ? "active" : ""}>
          Helper (after)
        </button>
      </div>

      <div className="panel">
        <pre style={{ margin: 0 }}>
          <code>{helper ? helperCode : inlineCode}</code>
        </pre>
        <p className="hint">
          {helper
            ? "Four lines, one thing to read. Change how errors render? One edit to errorProps."
            : `${inlineCode.split("\n").length} lines. Eight places to update if the display changes.`}
        </p>
      </div>
    </div>
  )
}
