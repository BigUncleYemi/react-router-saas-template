import {
  ChartNoAxesColumnIncreasingIcon,
  CircleHelpIcon,
  FolderIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { href, useParams } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';

import { NavGroup } from './nav-group';
import type { NavUserProps } from './nav-user';
import { NavUser } from './nav-user';
import type { OrganizationSwitcherProps } from './organization-switcher';
import { OrganizationSwitcher } from './organization-switcher';
import type { Info } from '.react-router/types/app/routes/organizations_+/$organizationsSlug+/+types/_layout';

type AppSidebarProps = {} & ComponentProps<typeof Sidebar> &
  OrganizationSwitcherProps &
  NavUserProps;

export function AppSidebar({ organizations, user, ...props }: AppSidebarProps) {
  const params = useParams<Info['params']>();
  const { t } = useTranslation('organizations', {
    keyPrefix: 'layout.app-sidebar.nav',
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher organizations={organizations} />
      </SidebarHeader>

      <SidebarContent>
        <NavGroup
          items={[
            {
              icon: LayoutDashboardIcon,
              title: t('app.dashboard'),
              url: href('/organizations/:organizationsSlug/dashboard', {
                organizationsSlug: params.organizationsSlug!,
              }),
            },
            {
              icon: FolderIcon,
              title: t('app.projects.title'),
              items: [
                {
                  title: t('app.projects.all'),
                  url: href('/organizations/:organizationsSlug/projects', {
                    organizationsSlug: params.organizationsSlug!,
                  }),
                },
                {
                  title: t('app.projects.active'),
                  url: href(
                    '/organizations/:organizationsSlug/projects/active',
                    {
                      organizationsSlug: params.organizationsSlug!,
                    },
                  ),
                },
              ],
            },
            {
              icon: ChartNoAxesColumnIncreasingIcon,
              title: t('app.analytics'),
              url: href('/organizations/:organizationsSlug/analytics', {
                organizationsSlug: params.organizationsSlug!,
              }),
            },
          ]}
          title={t('app.title')}
        />

        <NavGroup
          className="mt-auto"
          items={[
            {
              title: t('settings.organization-settings'),
              url: href('/organizations/:organizationsSlug/settings', {
                organizationsSlug: params.organizationsSlug!,
              }),
              icon: SettingsIcon,
            },
            {
              title: t('settings.get-help'),
              url: href('/organizations/:organizationsSlug/get-help', {
                organizationsSlug: params.organizationsSlug!,
              }),
              icon: CircleHelpIcon,
            },
          ]}
          size="sm"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
