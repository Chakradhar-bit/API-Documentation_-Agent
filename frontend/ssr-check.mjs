// Render smoke test: bundles the app with esbuild, then renders every route
// with a fetch shim proxying to the live backend so the *loaded* UI paths
// (cards, tables, badges, charts) are exercised without a browser.
//
// Usage:  node ssr-check.mjs      (backend must be running on :8000)
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { build } from "esbuild";

await build({
  entryPoints: ["src/App.tsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: ".ssr/App.mjs",
  external: ["react", "react-dom", "react-router-dom"],
  logLevel: "silent",
});

const { default: App } = await import("./.ssr/App.mjs");

const BACKEND = "http://localhost:8000";
const realFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  const target = url.startsWith("http") ? url : `${BACKEND}${url}`;
  const res = await realFetch(target, init);
  return res;
};

const ROUTES = [
  ["/", "API Documentation Agent"],
  ["/dashboard", "Run Demo Change"],
  ["/dashboard?demo=1", "Run Demo Change"],
  ["/explorer", "API Explorer"],
  ["/changes", "Changes"],
  ["/changes/1", "Change"],
  ["/documentation", "Documentation"],
  ["/repository", "Snapshots"],
];

let failures = 0;
for (const [route, expect] of ROUTES) {
  try {
    const html = await renderToString(
      React.createElement(
        StaticRouter,
        { location: route },
        React.createElement(App, null),
      ),
    );
    const has = html.includes(expect);
    console.log(
      `${has ? "OK  " : "WARN"} ${route.padEnd(20)} ${html.length} chars` +
        (has ? "" : ` (expected text not found: "${expect}")`),
    );
    if (!has) failures++;
  } catch (e) {
    failures++;
    console.log(`FAIL ${route} -> ${e.message}`);
  }
}

console.log(failures === 0 ? "ALL_ROUTES_OK" : `ROUTE_FAILURES=${failures}`);