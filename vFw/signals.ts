declare module "./signals.js";

export let currentSubscriber: (() => void) | null = null;

interface Setter<T> {
  (newValue: T): void;
}
interface Getter<T> {
  (): T | undefined;
}
export function createSignal<T>(initialValue?: T): [Getter<T>, Setter<T>] {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  function getter() {
    if (currentSubscriber) {
      subscribers.add(currentSubscriber);
    }
    return value;
  }

  function setter(newValue: any) {
    if (value === newValue) return; // if the new value is not different, do not notify dependent effects and memos
    value = newValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  }

  return [getter, setter];
}

export function createEffect(fn: (() => void) | null) {
  const previousSubscriber = currentSubscriber; // Step 1
  currentSubscriber = fn;
  if (fn) {
    fn();
  }
  currentSubscriber = previousSubscriber;
}
