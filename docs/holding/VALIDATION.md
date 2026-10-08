# Holding validation

- Static build: PASS. No functions or paid-provider calls.
- Dedicated unit tests: 5/5 PASS.
- Local HTTP smoke: 11 checks PASS (homepage, robots, sitemap, legacy routes, API 503, workers, www path-preserving redirect).
- TypeScript: PASS.
- i18n parity: PASS.
- verify:design: PASS; original football source assets preserved.
- Cloud browser: desktop and 390 x 844 CSS iframe inspected; mobile scrollWidth/clientWidth both 390 and scrollHeight/clientHeight both 844. No app console errors; only an unrelated browser-extension metadata error.
- Full source units in local alternative loader: 432 passed / 5 module-loading failures. Standard tsx CLI blocked by IPC socket restrictions; five failures are named-export loading under the Node 24 alternative loader, not established app regressions. CI uses the existing Node 20 runner.
- Local Playwright: BLOCKED by unavailable Chromium binary; download returned unusable archives. Dedicated CI browser job is mandatory before release.
- Full Next regression build: BLOCKED by automatic approval review because the existing Sentry build integration attempted outbound transmission of build data. Not retried or bypassed. Static build is the deployed surface and passes.
- Protected Vercel deployment: READY, deployment dpl_5bCqUn4yGdsQGQ377PM3gJUD4E64, preview protection verified by anonymous redirect to Vercel login. Connector temporary-bypass fetch was rejected by automatic approval review; protection retained.
- GitHub source-quality CI: PASS, including standard full unit suite, types, i18n and fundamentals on the Node 20 runner. This resolves the local loader uncertainty.
- First dedicated browser CI: 5/6 PASS (desktop/tablet/320px/390px, axe, routes). Worker test encountered its expected reload during polling. Test now explicitly waits for the worker-triggered navigation before checking retirement/cache state; rerun is required.

No claim of production pause, billing cancellation, complete regression success or zero total historical API usage is made.
