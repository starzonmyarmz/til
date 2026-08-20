import { useState } from "react";
import { produce } from "immer";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Button,
  Panel,
  Output,
  OutputRow,
  Hint,
} from "../../../components/demo";

type Pkg = { level: string; price: number };
type Product = { id: number; name: string; pkg: Pkg };

const initial: Product[] = [
  { id: 1, name: "Groups", pkg: { level: "Standard", price: 32 } },
  { id: 2, name: "Giving", pkg: { level: "Standard", price: 20 } },
  { id: 3, name: "Registrations", pkg: { level: "Basic", price: 10 } },
];

const naiveCode = `setProducts((prev) =>
  prev.map((p) =>
    p.id === 1
      ? { ...p, pkg: { ...p.pkg, level: 'Premium', price: 64 } }
      : p
  )
);`;

const produceCode = `setProducts(
  produce((draft) => {
    const target = draft.find((p) => p.id === 1);
    if (target) {
      target.pkg.level = 'Premium';
      target.pkg.price = 64;
    }
  })
);`;

export default function NaiveVsProduce() {
  const [mode, setMode] = useState<"naive" | "produce">("naive");
  const [products, setProducts] = useState(initial);

  function upgrade() {
    if (mode === "naive") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === 1
            ? { ...p, pkg: { ...p.pkg, level: "Premium", price: 64 } }
            : p,
        ),
      );
    } else {
      setProducts(
        produce((draft) => {
          const target = draft.find((p) => p.id === 1);
          if (target) {
            target.pkg.level = "Premium";
            target.pkg.price = 64;
          }
        }),
      );
    }
  }

  function reset() {
    setProducts(initial);
  }

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={mode}
          onChange={setMode}
          options={[
            { value: "naive", label: "Hand-written" },
            { value: "produce", label: "produce" },
          ]}
        />
        <Button onClick={upgrade}>Upgrade Groups to Premium</Button>
        <Button onClick={reset}>Reset</Button>
      </Toolbar>
      <Panel title="Update code">
        <pre>{mode === "naive" ? naiveCode : produceCode}</pre>
      </Panel>
      <Output>
        {products.map((p) => (
          <OutputRow key={p.id} label={p.name}>
            {p.pkg.level} · ${p.pkg.price}
          </OutputRow>
        ))}
      </Output>
      <Hint>
        Both buttons land on the same result. The hand-written version has to
        spread every level of the tree that contains the changed field, or it
        ends up mutating the previous state directly. The produce version just
        writes to the draft and lets Immer figure out which levels actually need
        a new object.
      </Hint>
    </Demo>
  );
}
