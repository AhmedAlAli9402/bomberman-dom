export let currentSubscriber = null;
export function createSignal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();
    function getter() {
        if (currentSubscriber) {
            console.log("getting");
            subscribers.add(currentSubscriber);
        }
        return value;
    }
    function setter(newValue) {
        if (value === newValue)
            return; // if the new value is not different, do not notify dependent effects and memos
        value = newValue;
        for (const subscriber of subscribers) {
            subscriber();
        }
    }
    return [getter, setter];
}
export function createEffect(fn) {
    const previousSubscriber = currentSubscriber; // Step 1
    currentSubscriber = fn;
    if (fn) {
        fn();
    }
    currentSubscriber = previousSubscriber;
}
