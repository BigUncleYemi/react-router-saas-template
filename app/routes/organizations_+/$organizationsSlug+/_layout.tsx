import type { ShouldRevalidateFunctionArgs, UIMatch } from 'react-router';
import {
  href,
  Outlet,
  redirect,
  useLoaderData,
  useMatches,
} from 'react-router';

import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { requireOnboardedUserAccountExists } from '~/features/onboarding/onboarding-helpers.server';
import {
  AppHeader,
  findHeaderTitle,
} from '~/features/organizations/layout/app-header';
import { AppSidebar } from '~/features/organizations/layout/app-sidebar';
import {
  getSidebarState,
  mapOnboardingUserToOrganizationLayoutProps,
} from '~/features/organizations/layout/layout-helpers.server';

import type { Route } from './+types/_layout';

export const handle = { i18n: 'organizations' };

/**
 * @see https://reactrouter.com/start/framework/route-module#shouldrevalidate
 */
export const shouldRevalidate = ({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  if (currentParams.organizationSlug !== nextParams.organizationSlug) {
    return true;
  }
  return defaultShouldRevalidate;
};

export async function loader({ request, params }: Route.LoaderArgs) {
  if (
    params.organizationsSlug &&
    request.url.endsWith(`/organizations/${params.organizationsSlug}`)
  ) {
    return redirect(
      href('/organizations/:organizationsSlug/dashboard', {
        organizationsSlug: params.organizationsSlug,
      }),
    );
  }

  const { user, headers } = await requireOnboardedUserAccountExists(request);
  const defaultSidebarOpen = getSidebarState(request);

  return {
    headers,
    headerTitle: 'React Router SaaS Template',
    defaultSidebarOpen,
    ...mapOnboardingUserToOrganizationLayoutProps(user),
  };
}

export default function OrganizationLayoutRoute() {
  const { defaultSidebarOpen, organizations, user } =
    useLoaderData<typeof loader>();
  const matches = useMatches() as UIMatch<{ headerTitle?: string }>[];

  const headerTitle = findHeaderTitle(matches);

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar organizations={organizations} user={user} />

      <SidebarInset>
        <AppHeader title={headerTitle} />

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
