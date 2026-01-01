import { LuSparkles } from "react-icons/lu";
import { href } from "react-router";

import type { Route } from "./+types/dashboard";
import CalendarDayViewer from "~/components/calendar-viewer";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import AIAssistantSection from "~/features/dashboard/ai-assistant";
import DailyAgendaList from "~/features/dashboard/daily-agenda";
import UrgentFunnelBlock from "~/features/dashboard/uregent-funnel";
import { getInstance } from "~/features/localization/i18next-middleware.server";
import { getPageTitle } from "~/utils/get-page-title.server";

export function loader({ params, context }: Route.LoaderArgs) {
  const i18n = getInstance(context);
  const t = i18n.t.bind(i18n);

  return {
    aiAssistant: {
      messages: [
        "Hello! I'm your AI Assistant. How can I help you today?",
        "Show me candidates for the Senior Software engineer role.",
        "I've filtered the pipeline for Senior Software Engineer candidates. Alice Johnson is currently in the 'Applied' stage. Would you like me to summarize her profile?",
      ],
    },
    breadcrumb: {
      title: t("organizations:dashboard.breadcrumb"),
      to: href("/organizations/:organizationSlug/dashboard", {
        organizationSlug: params.organizationSlug,
      }),
    },
    calendarEvents: [
      {
        duration: 60,
        endTime: "2024-10-25T03:00:00",
        id: "1",
        startTime: "2024-10-25T04:00:00",
        title: "AI Candidate Screening",
      },
      {
        duration: 60,
        endTime: "2024-10-25T11:30:00",
        id: "2",
        startTime: "2024-10-25T10:30:00",
        title: "Team Sync: Q4 Agentic Features",
      },
      {
        duration: 60,
        endTime: "2024-10-26T10:00:00",
        id: "1",
        startTime: "2024-10-26T09:00:00",
        title: "AI Candidate Screening",
      },
      {
        duration: 60,
        endTime: "2024-10-26T11:30:00",
        id: "2",
        startTime: "2024-10-26T10:30:00",
        title: "Team Sync: Q4 Agentic Features",
      },
      {
        duration: 30,
        endTime: "2024-10-27T14:30:00",
        id: "3",
        startTime: "2024-10-27T14:00:00",
        title: "Interview: Senior Developer",
      },
      {
        duration: 45,
        endTime: "2024-10-27T16:45:00",
        id: "4",
        startTime: "2024-10-27T16:00:00",
        title: "HR Review Meeting",
      },
    ],
    dailyAgenda: [
      {
        id: 1,
        text: "Review Al Candidate Profiles for Senior Software Engineer Role",
      },
      {
        id: 2,
        text: "Schedule interview with candidate 'Alex Johnson'",
      },
    ],
    pageTitle: getPageTitle(t, "organizations:dashboard.pageTitle"),
    urgentUpdate: {
      body: "Awaiting offer acceptance for the senior Product Manager role. Deadline: EOD.",
      level: "High",
      title: "Offer Pending for Sarah Miller",
    },
  };
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.pageTitle },
];

const BottomSection = () => (
  <div className="min-h-[500px] flex-1 w-full grid grid-cols-1 xl:grid-cols-2 bg-muted/50 md:min-h-min items-center mt-5">
    <div className="w-36 h-[350px] flex items-center justify-center m-auto">
      <img alt="target" src="/svgs/archery-target-icon.svg" />
    </div>
    <div className="w-60 h-[350px] flex items-center justify-center m-auto">
      <img alt="trends" src="/svgs/bar-trends-icon.svg" />
    </div>
  </div>
);

export default function OrganizationDashboardRoute({
  loaderData,
}: Route.ComponentProps) {
  const { aiAssistant, calendarEvents, dailyAgenda, urgentUpdate } = loaderData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_0.7fr] lg:grid-cols-[1fr_340px] h-full">
      <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
        <div className="grid auto-rows-min gap-4 xl:grid-cols-2">
          <UrgentFunnelBlock loaderData={{ urgent: urgentUpdate }} />
          <DailyAgendaList loaderData={{ dailyAgendas: dailyAgenda }} />
        </div>

        <div className="max-h-[520px] flex-1 border border-black">
          <CalendarDayViewer loaderData={{ events: calendarEvents }} />
        </div>

        <BottomSection />
      </div>

      <div className="h-full bg-muted/50 p-4 max-md:hidden">
        <AIAssistantSection loaderData={{ aiAssistant: aiAssistant }} />
      </div>

      <Sheet>
        <SheetTrigger>
          <Button className="fixed bottom-10 right-5 rounded-full shadow-md z-10 md:hidden">
            <LuSparkles /> AI
          </Button>
        </SheetTrigger>
        <SheetContent>
          <AIAssistantSection loaderData={{ aiAssistant: aiAssistant }} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
