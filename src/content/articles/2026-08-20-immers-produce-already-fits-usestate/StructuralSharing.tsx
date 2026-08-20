import { useState } from "react";
import { produce } from "immer";
import {
  Demo,
  Toolbar,
  Button,
  Output,
  OutputRow,
  Badge,
  Hint,
} from "../../../components/demo";

type Item = { id: number; name: string; price: number };

const initial: Item[] = [
  { id: 1, name: "Groups", price: 32 },
  { id: 2, name: "Giving", price: 20 },
  { id: 3, name: "Registrations", price: 10 },
];

export default function StructuralSharing() {
  const [items, setItems] = useState(initial);
  const [before, setBefore] = useState<Item[] | null>(null);
  const [after, setAfter] = useState<Item[] | null>(null);

  function updatePrice() {
    const prev = items;
    const next = produce(prev, (draft) => {
      draft[1].price = 25; // only Giving changes
    });
    setBefore(prev);
    setAfter(next);
    setItems(next);
  }

  function reset() {
    setItems(initial);
    setBefore(null);
    setAfter(null);
  }

  return (
    <Demo>
      <Toolbar>
        <Button onClick={updatePrice}>Change Giving&apos;s price to $25</Button>
        <Button onClick={reset}>Reset</Button>
      </Toolbar>
      <Output>
        {items.map((item, i) => {
          const unchanged = before && after ? before[i] === after[i] : null;
          return (
            <OutputRow key={item.id} label={item.name}>
              ${item.price}{" "}
              {unchanged !== null && (
                <Badge tone={unchanged ? "good" : "warn"}>
                  {unchanged ? "same object" : "new object"}
                </Badge>
              )}
            </OutputRow>
          );
        })}
      </Output>
      <Hint>
        Only the array itself and the one item that changed get new identities;
        the other two items keep the exact object reference they had before the
        update. A row component wrapped in React.memo for one of those unchanged
        items would skip re-rendering, with no manual memoization of the item
        itself required.
      </Hint>
    </Demo>
  );
}
