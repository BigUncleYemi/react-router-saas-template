import { LuBellRing } from "react-icons/lu";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

type UrgentFunnelBlockProps = {
  loaderData: {
    urgent: {
      body: string;
      level: string;
      title: string;
    };
  };
};

export default function UrgentFunnelBlock({
  loaderData,
}: UrgentFunnelBlockProps) {
  const { urgent } = loaderData;
  return (
    <div className="w-full bg-muted/50 border-border border rounded-none pt-5 p-3 pr-0 h-fit">
      <h3 className="text-2xl font-semibold mb-6">Urgent Funnel Update</h3>
      <div className="grid grid-cols-[40px_1fr] gap-x-3 p-6 pb-5 bg-white w-full">
        <LuBellRing className="mx-auto" size={32} />
        <div className="w-full">
          <h5 className="text-lg font-medium tracking-wider">{urgent.title}</h5>
          <p className="text-black/80">{urgent.body}</p>
          <div className="flex items-center gap-x-3 pt-2">
            <Badge className="rounded-full px-3 py-1.5! h-fit">
              {urgent.level}
            </Badge>
            <Button
              className="rounded-none border-black shadow-none px-4 py-1! h-fit!"
              variant="outline"
            >
              Send Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
