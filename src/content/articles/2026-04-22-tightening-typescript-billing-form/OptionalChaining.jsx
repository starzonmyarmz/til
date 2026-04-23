import { useState } from "react"

export default function OptionalChaining() {
  const [count, setCount] = useState(0)

  const messages = [
    "can't be blank",
    "must be at least 5 characters",
    "contains invalid characters",
  ]
  const error = count === 0 ? undefined : messages.slice(0, count)

  const description = error?.join(", ")
  const invalid = Boolean(error)

  return (
    <div className="demo">
      <label className="row">
        Errors for this field:{" "}
        <input
          type="range"
          min={0}
          max={3}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
        />
        <span>{count}</span>
      </label>

      <div className="panel">
        <div className="codelike">
          <span className="typelabel">error:</span>{" "}
          {error === undefined ? "undefined" : JSON.stringify(error)}
        </div>
        <div className="codelike">
          <span className="typelabel">error?.join(", "):</span>{" "}
          {description === undefined ? "undefined" : `"${description}"`}
        </div>
        <div className="codelike">
          <span className="typelabel">Boolean(error):</span> {String(invalid)}
        </div>

        <div
          className="fieldpreview"
          style={{
            borderColor: invalid ? "#c0392b" : "var(--rule)",
          }}
        >
          <div className="label">Address</div>
          <div className="fakeinput">123 Main St</div>
          {description && <div className="errorText">{description}</div>}
        </div>
      </div>

      <p className="hint">
        Slide from 0 → 3. At 0, <code>error</code> is undefined; optional chaining short-circuits
        and no error UI renders. At 1+, the array joins into a single string and{" "}
        <code>invalid</code> becomes true.
      </p>
    </div>
  )
}
