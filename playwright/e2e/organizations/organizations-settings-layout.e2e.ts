import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { createPopulatedOrganization } from '~/features/organizations/organizations-factories.server';
import { createPopulatedUserAccount } from '~/features/user-accounts/user-accounts-factories.server';
import { deleteUserAccountFromDatabaseById } from '~/features/user-accounts/user-accounts-model.server';
import { teardownOrganizationAndMember } from '~/test/test-utils';

import {
  getPath,
  loginAndSaveUserAccountToDatabase,
  setupOrganizationAndLoginAsMember,
} from '../../utils';

test.describe('organization settings layout', () => {
  test('given: a logged out user, should: redirect to login page with redirectTo parameter', async ({
    page,
  }) => {
    const { slug } = createPopulatedOrganization();
    await page.goto(`/organizations/${slug}/settings`);

    const searchParameters = new URLSearchParams();
    searchParameters.append('redirectTo', `/organizations/${slug}/settings`);
    expect(getPath(page)).toEqual(`/login?${searchParameters.toString()}`);
  });

  test('given: a logged in user who is NOT onboarded, should: redirect to the onboarding page', async ({
    page,
  }) => {
    const { slug } = createPopulatedOrganization();
    const { id } = await loginAndSaveUserAccountToDatabase({
      user: createPopulatedUserAccount({ name: '' }),
      page,
    });

    await page.goto(`/organizations/${slug}/settings`);

    expect(getPath(page)).toEqual('/onboarding/user-account');

    await deleteUserAccountFromDatabaseById(id);
  });

  test('given: a logged in user who is onboarded and a member of the organization, should: redirect from /settings to /settings/general', async ({
    page,
  }) => {
    const { organization, user } = await setupOrganizationAndLoginAsMember({
      page,
    });

    await page.goto(`/organizations/${organization.slug}/settings`);

    expect(getPath(page)).toEqual(
      `/organizations/${organization.slug}/settings/general`,
    );

    await teardownOrganizationAndMember({ organization, user });
  });

  test('given: a logged in user who is onboarded and a member of the organization, should: show the correct settings navigation', async ({
    page,
  }) => {
    const { organization, user } = await setupOrganizationAndLoginAsMember({
      page,
    });

    await page.goto(`/organizations/${organization.slug}/settings/general`);

    // Verify settings navigation
    const settingsNav = page.getByRole('navigation', {
      name: /settings navigation/i,
    });
    await expect(settingsNav).toBeVisible();

    // Verify general settings link is active
    const generalLink = settingsNav.getByRole('link', { name: /general/i });
    await expect(generalLink).toBeVisible();
    await expect(generalLink).toHaveAttribute(
      'href',
      `/organizations/${organization.slug}/settings/general`,
    );
    await expect(generalLink).toHaveAttribute('data-active', 'true');

    await teardownOrganizationAndMember({ organization, user });
  });

  test('given: a logged in user who is onboarded and a member of the organization, should: lack any automatically detectable accessibility issues', async ({
    page,
  }) => {
    const { organization, user } = await setupOrganizationAndLoginAsMember({
      page,
    });

    await page.goto(`/organizations/${organization.slug}/settings/general`);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules('color-contrast')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await teardownOrganizationAndMember({ organization, user });
  });
});
