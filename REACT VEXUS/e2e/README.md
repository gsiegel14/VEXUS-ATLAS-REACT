# VEXUS browser checks

Use Node 22.12 or newer. Install this test package with `npm ci` from `e2e/`,
then run `npm run test:e2e` from `REACT VEXUS/`.

The suite starts the local Vite app and uses Chromium without model calls. It
checks all app routes, desktop and mobile navigation, publication search,
synthetic Image Atlas filtering, and manual calculator scoring through reset.
The Image Atlas API response is synthetic; image submission, live Airtable, and
AI image classification require separate service-backed checks.

Reports and the project-specific browser cache stay under `e2e/.e2e/`.
Telemetry is disabled by the test script. The test dependencies are separate
from the app package so its Node 18 production Docker build is unaffected.
