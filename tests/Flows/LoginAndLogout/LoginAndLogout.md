# LoginAndLogout Test Steps

## Goal

Validate that a user can log in to HKube and then log out successfully.

## Preconditions

- Test user exists with valid credentials.
- HKube UI is reachable.

## Test Steps

1. Open the HKube page at `/hkube/dashboard/#/jobs?&experiment=main`.
2. Enter the username in the Username field insert "ziv".
3. Enter the password in the Password field insert "ziv".
4. Click the Log In button.
5. Open the user menu by clicking the avatar in the header.
6. Click the logout link.
7. Verify the heading `Hkube Log In` is visible.

## Expected Result

After logout, the login page is displayed and the heading `Hkube Log In` appears.
