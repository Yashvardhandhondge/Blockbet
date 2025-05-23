
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const OriginTabs = TabsPrimitive.Root

const OriginTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg border border-white/10 bg-btc-dark/50 p-0.5 text-white w-full",
      className
    )}
    {...props}
  />
))
OriginTabsList.displayName = TabsPrimitive.List.displayName

interface OriginTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactElement<LucideIcon>
}

const OriginTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  OriginTabsTriggerProps
>(({ className, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs sm:text-sm sm:px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-btc-orange/10 data-[state=active]:text-btc-orange data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-white/5 flex-1",
      className
    )}
    {...props}
  >
    {icon && <span className="mr-1 sm:mr-2">{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
))
OriginTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const OriginTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
OriginTabsContent.displayName = TabsPrimitive.Content.displayName

export { OriginTabs, OriginTabsList, OriginTabsTrigger, OriginTabsContent }
