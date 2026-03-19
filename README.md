#HKube UI Automation Testing

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
