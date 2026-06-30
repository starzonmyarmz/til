import { useEffect, useMemo, useState } from "react";
import {
  Demo,
  Toolbar,
  Spacer,
  Button,
  ToggleGroup,
  Field,
  Input,
  Output,
  OutputRow,
  Hint,
} from "../../../components/demo";

type Mode = "naive" | "memoized";

function useFakeSearch(query: string, where: Record<string, boolean>) {
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    setFetchCount((c) => c + 1);
    // `where` is the effect's dependency here -- a new reference reruns this,
    // regardless of whether `query` changed.
  }, [query, where]);

  return fetchCount;
}

export default function RerenderLoopDemo() {
  const [mode, setMode] = useState<Mode>("naive");
  const [query, setQuery] = useState("");
  const [bumps, setBumps] = useState(0);

  const naiveWhere = { active: true }; // new object every render, on purpose
  const memoizedWhere = useMemo(() => ({ active: true }), []);
  const where = mode === "naive" ? naiveWhere : memoizedWhere;

  const fetchCount = useFakeSearch(query, where);

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={mode}
          onChange={(next) => {
            setMode(next);
            setQuery("");
            setBumps(0);
          }}
          options={[
            { value: "naive", label: "naive: new object every render" },
            { value: "memoized", label: "memoized: useMemo([])" },
          ]}
        />
        <Spacer />
        <Button onClick={() => setBumps((b) => b + 1)}>
          Force re-render (unrelated state)
        </Button>
      </Toolbar>
      <Field label="query">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type here"
        />
      </Field>
      <Output>
        <OutputRow label="fetches so far">{fetchCount}</OutputRow>
        <OutputRow label="unrelated re-renders">{bumps}</OutputRow>
      </Output>
      <Hint>
        {mode === "naive"
          ? 'Click "Force re-render" without touching the query box -- the fetch count climbs anyway, because the where object gets rebuilt on every render of this component.'
          : 'Click "Force re-render" as many times as wanted -- the fetch count only moves when the query itself changes, because where is memoized.'}
      </Hint>
    </Demo>
  );
}
