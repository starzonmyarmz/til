import { useState } from "react";
import {
  Demo,
  Toolbar,
  Spacer,
  Button,
  ToggleGroup,
  PanelGrid,
  Panel,
  Badge,
  Hint,
} from "../../../components/demo";

type Mode = "conditional" | "unconditional";

export default function GateGap() {
  const [mode, setMode] = useState<Mode>("conditional");
  const [immediate, setImmediate] = useState(false);
  const [trialReset, setTrialReset] = useState(false);
  const [reanchor, setReanchor] = useState(true);

  const gateOpen = immediate || trialReset;
  const sendsKey = mode === "unconditional" || gateOpen;
  const currentPhaseChanges = immediate || trialReset || reanchor;
  const effective = sendsKey ? "none" : "create_prorations";
  const risky = currentPhaseChanges && effective === "create_prorations";

  const payload = [
    "update_subscription_schedule(",
    "  schedule.id,",
    "  phases: [",
    reanchor
      ? '    { ..., billing_cycle_anchor: "phase_start" },'
      : "    { ... },",
    "    { ... },",
    "  ],",
    '  end_behavior: "release",',
    ...(sendsKey ? ['  proration_behavior: "none",'] : []),
    ")",
  ].join("\n");

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          variant="primary"
          value={mode}
          onChange={setMode}
          options={[
            { value: "conditional", label: "**proration_for(...)" },
            { value: "unconditional", label: 'always "none"' },
          ]}
        />
        <Spacer />
      </Toolbar>
      <Toolbar>
        <Button
          variant="pill"
          active={immediate}
          onClick={() => setImmediate((v) => !v)}
        >
          immediate items
        </Button>
        <Button
          variant="pill"
          active={trialReset}
          onClick={() => setTrialReset((v) => !v)}
        >
          trial resets
        </Button>
        <Button
          variant="pill"
          active={reanchor}
          onClick={() => setReanchor((v) => !v)}
        >
          re-anchor phase 0
        </Button>
      </Toolbar>
      <PanelGrid columns={2}>
        <Panel title="request sent">
          <pre
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              whiteSpace: "pre-wrap",
            }}
          >
            {payload}
          </pre>
        </Panel>
        <Panel title="what the server does">
          <div>
            guard (proxy):{" "}
            <Badge tone={gateOpen ? "good" : "info"}>
              {gateOpen ? "true" : "false"}
            </Badge>
          </div>
          <div>
            current phase billing changes:{" "}
            <Badge tone={currentPhaseChanges ? "warn" : "info"}>
              {currentPhaseChanges ? "yes" : "no"}
            </Badge>
          </div>
          <div>
            effective proration_behavior:{" "}
            <Badge tone={sendsKey ? "good" : "warn"}>{effective}</Badge>
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <Badge tone={risky ? "bad" : "good"}>
              {risky ? "unexpected proration" : "no surprise charge"}
            </Badge>
          </div>
        </Panel>
      </PanelGrid>
      <Hint>
        The guard only looks at the two lists. The server looks at whether the
        current phase’s billing configuration changed. Re-anchoring alone opens
        the gap.
      </Hint>
    </Demo>
  );
}
