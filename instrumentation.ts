/**
 * Next.js instrumentation hook - runs once when the server starts.
 *
 * Problem: this process is launched with --localstorage-file=<invalid-path>
 * (Node's experimental-webstorage flag). That injects a `localStorage` global
 * whose methods (getItem, setItem, …) are undefined, breaking any SSR code
 * that touches `localStorage`. We patch it here, before React renders anything.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const ls = (global as Record<string, unknown>).localStorage as
      | Storage
      | undefined;

    // Only patch when the shim exists but is broken
    if (ls !== undefined && typeof ls.getItem !== "function") {
      const safe: Storage = {
        getItem:    ()     => null,
        setItem:    ()     => {},
        removeItem: ()     => {},
        clear:      ()     => {},
        key:        ()     => null,
        length:     0,
      };
      Object.defineProperty(global, "localStorage", {
        value:      safe,
        writable:   true,
        configurable: true,
      });
    }
  }
}
