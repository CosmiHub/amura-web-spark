
import * as React from "react";
import { cn } from "@/lib/utils";

const TimeLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative pl-6 border-l border-amura-purple", className)}
    {...props}
  />
));
TimeLine.displayName = "TimeLine";

const TimeLineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative mb-10 last:mb-0", className)}
    {...props}
  >
    <div className="absolute top-2 -left-9 w-4 h-4 rounded-full bg-amura-purple"></div>
    {props.children}
  </div>
));
TimeLineItem.displayName = "TimeLineItem";

export { TimeLine, TimeLineItem };
