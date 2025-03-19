import type { UIMatch } from 'react-router';
import { describe, expect, test } from 'vitest';

import { SidebarProvider } from '~/components/ui/sidebar';
import { createRoutesStub, render, screen } from '~/test/react-test-utils';
import type { Factory } from '~/utils/types';

import type { AppHeaderProps } from './app-header';
import { findHeaderTitle } from './app-header';
import { AppHeader } from './app-header';

const createProps: Factory<AppHeaderProps> = ({ title } = {}) => ({
  title,
});

describe('findHeaderTitle()', () => {
  test('given an array of matches: returns the last item in the array that has a header title', () => {
    const matches: UIMatch<
      { headerTitle?: string } & Record<string, unknown>
    >[] = [
      {
        id: 'root',
        pathname: '/',
        params: { organizationSlug: 'tromp---schinner' },
        data: { headerTitle: 'wrong-title' },
        handle: { i18n: 'common' },
      },
      {
        id: 'routes/organization_.$organizationSlug',
        pathname: '/organizations/tromp---schinner',
        params: { organizationSlug: 'tromp---schinner' },
        data: { headerTitle: 'correct-title' },
        handle: { i18n: ['organizations', 'sidebar'] },
      },
      {
        id: 'routes/organization_.$organizationSlug.recordings',
        pathname: '/organizations/tromp---schinner/recordings',
        params: { organizationSlug: 'tromp---schinner' },
        data: { currentPage: 1, organizationName: 'Tromp - Schinner' },
        handle: { i18n: 'recordings' },
      },
    ];

    const actual = findHeaderTitle(matches);
    const expected = 'correct-title';

    expect(actual).toEqual(expected);
  });
});

describe('AppHeader Component', () => {
  test('given: a title, should: render header with title and notification button', () => {
    const props = createProps({ title: 'Test Title' });
    const path = '/test';
    const RouterStub = createRoutesStub([
      { path, Component: () => <AppHeader {...props} /> },
    ]);

    render(
      <SidebarProvider>
        <RouterStub initialEntries={[path]} />
      </SidebarProvider>,
    );

    // Verify the title is displayed
    expect(
      screen.getByRole('heading', { name: props.title!, level: 1 }),
    ).toBeInTheDocument();

    // Verify the notification button is present
    const notificationButton = screen.getByRole('button', {
      name: /open notifications/i,
    });
    expect(notificationButton).toBeInTheDocument();
    expect(notificationButton).toHaveClass('size-8');
  });

  test('given: no title, should: render header without title but with notification button', () => {
    const props = createProps({ title: undefined });
    const path = '/test';
    const RouterStub = createRoutesStub([
      { path, Component: () => <AppHeader {...props} /> },
    ]);

    render(
      <SidebarProvider>
        <RouterStub initialEntries={[path]} />
      </SidebarProvider>,
    );

    // Verify the title is not displayed
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    // Verify the notification button is still present
    const notificationButton = screen.getByRole('button', {
      name: /open notifications/i,
    });
    expect(notificationButton).toBeInTheDocument();
  });
});
