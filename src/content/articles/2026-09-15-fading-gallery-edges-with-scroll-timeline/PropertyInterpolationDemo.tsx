import { useState } from "react";
import { Demo, Toolbar, Button, Row, Hint } from "../../../components/demo";

const REGISTERED = "--stop-registered";
const UNREGISTERED = "--stop-unregistered";

export default function PropertyInterpolationDemo() {
  const [active, setActive] = useState(false);

  return (
    <Demo>
      <style>{`
        @property ${REGISTERED} {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 10%;
        }
        .interp-bar {
          height: 2rem;
          border: 1px solid var(--rule);
          border-radius: 0.25rem;
          transition: ${REGISTERED} 900ms ease, ${UNREGISTERED} 900ms ease;
        }
        .interp-bar.registered {
          background: linear-gradient(to right, var(--tone-good) var(${REGISTERED}), transparent 0);
        }
        .interp-bar.unregistered {
          background: linear-gradient(to right, var(--tone-warn) var(${UNREGISTERED}), transparent 0);
        }
      `}</style>
      <Toolbar>
        <Button variant="primary" onClick={() => setActive((value) => !value)}>
          {active ? "Reset" : "Animate"}
        </Button>
      </Toolbar>
      <Row>
        <div style={{ flex: 1 }}>
          <div
            className="interp-bar registered"
            style={
              { [REGISTERED]: active ? "90%" : "10%" } as React.CSSProperties
            }
          />
          <Hint>Registered with @property: eases smoothly.</Hint>
        </div>
        <div style={{ flex: 1 }}>
          <div
            className="interp-bar unregistered"
            style={
              { [UNREGISTERED]: active ? "90%" : "10%" } as React.CSSProperties
            }
          />
          <Hint>Not registered: flips partway through instead of easing.</Hint>
        </div>
      </Row>
    </Demo>
  );
}
