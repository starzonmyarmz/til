import { useState } from "react";
import {
  Demo,
  Toolbar,
  Button,
  PanelGrid,
  Panel,
  Output,
  OutputRow,
  Badge,
} from "../../../components/demo";

type Payload = Record<string, string>;

const EXPECTED: Payload = {
  phases: "[...]",
  end_behavior: '"release"',
  proration_behavior: '"none"',
};

function exactMatch(sent: Payload) {
  const a = Object.keys(sent).sort();
  const b = Object.keys(EXPECTED).sort();
  return (
    a.length === b.length &&
    a.every((k, i) => k === b[i] && sent[k] === EXPECTED[k])
  );
}

function includingMatch(sent: Payload) {
  return sent.proration_behavior === '"none"';
}

export default function MatcherDemo() {
  const [hasProration, setHasProration] = useState(true);
  const [hasExtra, setHasExtra] = useState(false);

  const sent: Payload = {
    phases: "[...]",
    end_behavior: '"release"',
    ...(hasProration ? { proration_behavior: '"none"' } : {}),
    ...(hasExtra ? { metadata: '{ source: "renewal" }' } : {}),
  };

  const exact = exactMatch(sent);
  const including = includingMatch(sent);
  const show = (p: Payload) =>
    Object.entries(p)
      .map(([k, v]) => `${k}: ${v},`)
      .join("\n");

  return (
    <Demo>
      <Toolbar>
        <Button
          variant="pill"
          active={hasProration}
          onClick={() => setHasProration((v) => !v)}
        >
          send proration_behavior
        </Button>
        <Button
          variant="pill"
          active={hasExtra}
          onClick={() => setHasExtra((v) => !v)}
        >
          add unrelated key
        </Button>
      </Toolbar>
      <PanelGrid columns={2}>
        <Panel title="sent kwargs">
          <pre
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              whiteSpace: "pre-wrap",
            }}
          >
            {show(sent)}
          </pre>
        </Panel>
        <Panel title="exact with(...) expects">
          <pre
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              whiteSpace: "pre-wrap",
            }}
          >
            {show(EXPECTED)}
          </pre>
        </Panel>
      </PanelGrid>
      <Output>
        <OutputRow label="with(exact):">
          <Badge tone={exact ? "good" : "bad"}>{exact ? "pass" : "fail"}</Badge>
        </OutputRow>
        <OutputRow label="hash_including:">
          <Badge tone={including ? "good" : "bad"}>
            {including ? "pass" : "fail"}
          </Badge>
          {including ? "" : ' "still sends proration_behavior: none"'}
        </OutputRow>
      </Output>
    </Demo>
  );
}
