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

There is no allowlist and no baseline exceptions.
Any violation fails the check.

Then run the relevant Playwright tests for your change.

## One-Time Login Flow (Keycloak)

When `VITE_KEYCLOAK_ENABLE=true`, Playwright runs a dedicated setup project first:

- `tests/auth.setup.ts` logs in once and saves the authenticated browser state to `playwright/.auth/user.json`
- all tests in the `chrome` project reuse that state via `storageState`
- `tests/flows/loginAndLogout/loginAndLogout.spec.ts` runs separately in `auth-flow` to validate login/logout itself

Required environment variables for this flow:

- `VITE_KEYCLOAK_ENABLE=true`
- `KEYCLOAK_USERNAME`
- `KEYCLOAK_PASSWORD`
- `BASE_URL`

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
