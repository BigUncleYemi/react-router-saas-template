import { expect, test } from '@playwright/test';

import { deleteUserAccountFromDatabaseById } from '~/features/user-accounts/user-accounts-model.server';
import { retrieveUserAccountFromDatabaseByEmail } from '~/features/user-accounts/user-accounts-model.server';
import { stringifyTokenHashData } from '~/test/mocks/handlers/supabase/auth';
import {
  createUserWithOrgAndAddAsMember,
  teardownOrganizationAndMember,
} from '~/test/test-utils';

import { getPath, setupOrganizationAndLoginAsMember } from '../../utils';

const path = '/login/confirm';

test.describe(`${path} API route`, () => {
  test('given: a valid token_hash for an existing user, should: verify OTP and redirect to organizations page', async ({
    page,
  }) => {
    // Create a test user account.
    const { user, organization } = await createUserWithOrgAndAddAsMember();

    // Mock token hash.
    const tokenHash = stringifyTokenHashData({
      email: user.email,
      id: user.supabaseUserId,
    });

    // Navigate to the login-confirm page with token hash.
    await page.goto(`${path}?token_hash=${tokenHash}`);

    // Verify the user is redirected to the organizations page.
    expect(getPath(page)).toEqual(
      `/organizations/${organization.slug}/dashboard`,
    );

    // Clean up.
    await teardownOrganizationAndMember({ user, organization });
  });

  test("given: a valid token_hash for a new user (this can happen if the user is sent here from the register route because they missed or didn't click the first link), should: create user account, verify OTP and redirect to the onboarding page", async ({
    page,
  }) => {
    // Generate a unique email for testing.
    const testEmail = `test-${Date.now()}@example.com`;

    // Use the email as the token hash.
    const tokenHash = stringifyTokenHashData({ email: testEmail });

    // Navigate to the login-confirm page with token hash.
    await page.goto(`${path}?token_hash=${tokenHash}`);

    // Verify the user is redirected to the onboarding page.
    expect(getPath(page)).toEqual('/onboarding/user-account');

    // Verify the user account was created in the database.
    const userAccount = await retrieveUserAccountFromDatabaseByEmail(testEmail);
    expect(userAccount).not.toBeNull();
    expect(userAccount?.email).toEqual(testEmail);

    // Clean up.
    if (userAccount) {
      await deleteUserAccountFromDatabaseById(userAccount.id);
    }
  });

  test('given: an invalid token_hash, should: return an error', async ({
    request,
  }) => {
    // Make request with invalid token
    const response = await request.get(`${path}?token_hash=invalid_token_hash`);

    // Verify response
    expect(response.status()).toEqual(500);
  });

  test('given: no token_hash parameter, should: return an error', async ({
    request,
  }) => {
    // Make request without token hash
    const response = await request.get(path);

    // Verify response
    expect(response.status()).toEqual(500);
  });

  test('given: a logged in user, should: redirect to organizations page', async ({
    page,
  }) => {
    // Create a test user account.
    const { user, organization } = await setupOrganizationAndLoginAsMember({
      page,
    });

    // Navigate to the login-confirm page with any token.
    await page.goto(`${path}?token_hash=any_token`);

    // Verify the user is redirected to the organizations page.
    expect(getPath(page)).toEqual(
      `/organizations/${organization.slug}/dashboard`,
    );

    // Clean up.
    await teardownOrganizationAndMember({ user, organization });
  });
});
