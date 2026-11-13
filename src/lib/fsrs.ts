import { createEmptyCard, fsrs, type Card, type Grade } from "ts-fsrs";

const f = fsrs();

export function newCard() {
  const c = createEmptyCard();
  return { json: JSON.stringify(c), due: c.due.toISOString() };
}

export function review(json: string, grade: Grade) {
  const c = JSON.parse(json);
  c.due = new Date(c.due);
  if (c.last_review) c.last_review = new Date(c.last_review);
  const next = f.next(c as Card, new Date(), grade).card;
  return { json: JSON.stringify(next), due: next.due.toISOString() };
}
