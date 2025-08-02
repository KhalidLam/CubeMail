import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

const Spinner = React.forwardRef(({ className, size = 4, ...props }, ref) => (
  <Loader2 
    ref={ref}
    className={cn("animate-spin", `h-${size} w-${size}`, className)} 
    {...props} 
  />
))
Spinner.displayName = "Spinner"

export { Spinner }