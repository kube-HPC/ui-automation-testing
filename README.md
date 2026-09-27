## HKube UI Automation Testing

Automation testing for UI using Playwright.

## Requirements

- Node.js 18+
- npm

## Install the Project

Clone the repository:

```bash
git clone https://github.com/kube-HPC/ui-automation-testing.git
cd ui-automation-testing
```

Run the setup script:

```bash
npm run setup
```

This command will:

- install all Node dependencies
- download the required Playwright browsers
- install a local pre-commit hook (best effort; setup continues if hook installation is not possible)

## Environment Configuration

Environment values are split between a local, git-ignored `.env` file and the
shared config module in `config/env.js`.

Create your local `.env` from the template:

```bash
cp .env.example .env
```

The `.env` file holds machine-specific and secret values:

- `BASE_URL` — the deployment root, for example `https://cicd.hkube.org/`
- `KEYCLOAK_USERNAME`
- `KEYCLOAK_PASSWORD`
- `VITE_KEYCLOAK_ENABLE` — optional override (Keycloak auth is enabled by default)
- `PREFIX` — optional override for the test-resource prefix (defaults to `pw-`)

`config/env.js` is the single source of truth that derives the URLs used by the
tests from `BASE_URL`:

- dashboard: `${BASE_URL}hkube/dashboard/#/`
- backend: `${BASE_URL}hkube/api-server/api/v1/`

In CI, `BASE_URL`, `KEYCLOAK_USERNAME`, and `KEYCLOAK_PASSWORD` are provided via
GitHub repository **Secrets** (see `.github/workflows/playwright.yml`). Add them
under Settings → Secrets and variables → Actions.

## Run the Tests

```bash
npm test
```

or

```bash
npx playwright test
```

## UI Automation Contribution Policy

Before opening a PR with new or changed tests, run:

```bash
npm run check:test-structure
```

This quality gate enforces:

- no empty files under `tests/`
- camelCase names for folders under `tests/`
- camelCase names for files under `tests/` (based on file name before extension)
- unique test titles across `tests/**/*.spec.ts`
- static test titles only (no dynamic/interpolated test title expressions)

There is no allowlist and no baseline exceptions.
Any violation fails the check.

Then run the relevant Playwright tests for your change.

## One-Time Login Flow (Keycloak)

When `VITE_KEYCLOAK_ENABLE=true`, Playwright runs a dedicated setup project first:

- `tests/auth.setup.ts` logs in once and saves the authenticated browser state to `playwright/.auth/user.json`
- all tests in the `chrome` project reuse that state via `storageState`
- `tests/flows/loginAndLogout/loginAndLogout.spec.ts` runs separately in `auth-flow` to validate login/logout itself

Required environment variables for this flow:

- `KEYCLOAK_USERNAME`
- `KEYCLOAK_PASSWORD`
- `BASE_URL`

Keycloak auth is enabled by default; set `VITE_KEYCLOAK_ENABLE=false` in your
local `.env` to run against a non-auth deployment.

## Update Dependencies

If you pull new changes from the repository, run:

```bash
npm run setup
```

to make sure dependencies and browsers are installed.

## Project Structure (example)

```
tests/
playwright.config.ts
package.json
README.md
```
