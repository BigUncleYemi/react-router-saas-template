import {
  LuCalendarDays,
  LuClipboardList,
  LuMail,
  LuUserRoundCheck,
} from "react-icons/lu";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type AIAssistantSectionProps = {
  loaderData: {
    aiAssistant: {
      messages: string[];
    };
  };
};

type ContextualActionButtonProps = React.ComponentProps<typeof Button> & {
  children: React.ReactNode;
};

const ContextualActionButton = ({
  children,
  ...props
}: ContextualActionButtonProps) => {
  return (
    <Button
      className="w-full justify-start flex rounded-none border-black shadow-none px-3"
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
};

export default function AIAssistantSection({
  loaderData,
}: AIAssistantSectionProps) {
  const { aiAssistant } = loaderData;
  const contextualActions = [
    {
      icon: <LuCalendarDays />,
      onClick: () => {},
      text: "Schedule Interview",
    },
    {
      icon: <LuClipboardList />,
      onClick: () => {},
      text: "Summarize Candidate",
    },
    {
      icon: <LuMail />,
      onClick: () => {},
      text: "Send To Marketplace",
    },
    {
      icon: <LuUserRoundCheck />,
      onClick: () => {},
      text: "Move to Next Stage",
    },
  ];

  return (
    <div className="bg-white p-4 h-full flex flex-col justify-between">
      <div>
        <h4 className="font-semibold text-xl">AI Assistant</h4>
        <div className="my-6 max-h-[58.5vh] overflow-auto w-full">
          <div className="px-3 py-6 space-y-8 bg-muted/50 w-full lg:max-w-4/5">
            {(aiAssistant.messages || []).map((message) => (
              <p key={`${message}-${Math.random()}`}>{message}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full space-y-3">
        <Input
          className="rounded-none py-5 w-full"
          placeholder="Ask me anything..."
        />
        <Button className="w-full py-5 rounded-none">Send</Button>
        <hr />
        <p className="text-mono text-lg tracking-wide">Contextual Actions:</p>
        {contextualActions.map((btn) => (
          <ContextualActionButton key={btn.text} onClick={btn.onClick}>
            {btn.icon} {btn.text}
          </ContextualActionButton>
        ))}
      </div>
    </div>
  );
}
