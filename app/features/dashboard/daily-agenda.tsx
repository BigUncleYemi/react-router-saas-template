import { format } from "date-fns";
import { LuClock } from "react-icons/lu";

import { Checkbox } from "~/components/ui/checkbox";

type DailyAgendaListProps = {
  loaderData: {
    dailyAgendas: {
      id: number;
      text: string;
    }[];
  };
};

type CheckListItemProps = {
  id: number;
  text: string;
};

const CheckListItem = (props: CheckListItemProps) => {
  const { text } = props;
  return (
    <div className="grid grid-cols-[0.9fr_0.1fr] items-center justify-between py-3">
      <div className="flex items-start gap-4">
        <Checkbox className="rounded-none border-black" />
        <span className="mt-0">{text}</span>
      </div>
      <LuClock className="ml-auto" size={22} />
    </div>
  );
};

export default function DailyAgendaList({ loaderData }: DailyAgendaListProps) {
  const { dailyAgendas } = loaderData;
  return (
    <div className="w-full bg-muted/50 rounded-none pt-5 h-fit">
      <div className="flex justify-between items-center px-5 pb-5 border-b border-black">
        <h3 className="text-2xl font-semibold">
          Daily Agenda &nbsp;{"//"} &nbsp;
          {format(new Date(2025, 4, 23), "yyyy.MM.dd")}
        </h3>
        <LuClock size={32} />
      </div>
      <div className="px-5 [&>div]:border-b [&>div]:border-black overflow-auto h-[147px]">
        {(dailyAgendas || []).map((agenda) => (
          <CheckListItem id={agenda.id} key={agenda.id} text={agenda.text} />
        ))}
      </div>
    </div>
  );
}
