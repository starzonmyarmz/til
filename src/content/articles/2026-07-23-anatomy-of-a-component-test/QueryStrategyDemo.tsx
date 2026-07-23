import { useState, useRef } from "react";
import type { Tone } from "../../../components/demo";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Button,
  Output,
  OutputRow,
  Badge,
} from "../../../components/demo";

type Presence = "present" | "absent";

type Result = {
  query: string;
  tone: Tone;
  text: string;
} | null;

export default function QueryStrategyDemo() {
  const [presence, setPresence] = useState<Presence>("absent");
  const [result, setResult] = useState<Result>(null);
  const [pending, setPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPresent = presence === "present";

  function reset(next: Presence) {
    setPresence(next);
    setResult(null);
    setPending(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  function runGetBy() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPending(false);
    if (isPresent) {
      setResult({
        query: "getByText",
        tone: "good",
        text: "Returns the element immediately.",
      });
    } else {
      setResult({
        query: "getByText",
        tone: "bad",
        text: 'Throws right away: "Unable to find an element with the text: ..."',
      });
    }
  }

  function runQueryBy() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPending(false);
    if (isPresent) {
      setResult({
        query: "queryByText",
        tone: "good",
        text: "Returns the element immediately.",
      });
    } else {
      setResult({
        query: "queryByText",
        tone: "info",
        text: "Returns null. No throw.",
      });
    }
  }

  function runFindBy() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPending(true);
    setResult(null);
    timeoutRef.current = setTimeout(() => {
      setPending(false);
      if (isPresent) {
        setResult({
          query: "findByText",
          tone: "good",
          text: "Promise resolves with the element once it shows up.",
        });
      } else {
        setResult({
          query: "findByText",
          tone: "bad",
          text: "Promise rejects after polling and timing out (default 1000ms).",
        });
      }
    }, 900);
  }

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={presence}
          onChange={reset}
          options={[
            { value: "absent", label: "Element: absent" },
            { value: "present", label: "Element: present" },
          ]}
        />
      </Toolbar>
      <Toolbar>
        <Button onClick={runGetBy}>run getByText</Button>
        <Button onClick={runQueryBy}>run queryByText</Button>
        <Button onClick={runFindBy}>run findByText</Button>
      </Toolbar>
      <Output grid={false}>
        {pending && (
          <OutputRow label="findByText">
            <Badge tone="warn">polling…</Badge>
          </OutputRow>
        )}
        {result && (
          <OutputRow label={result.query}>
            <Badge tone={result.tone}>{result.text}</Badge>
          </OutputRow>
        )}
        {!pending && !result && (
          <OutputRow label="result">
            <span>Pick a query above.</span>
          </OutputRow>
        )}
      </Output>
    </Demo>
  );
}
