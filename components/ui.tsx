import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as SelectPrimitive from '@radix-ui/react-select'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { Check, ChevronDown, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

const buttonStyles = cva('inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-45', {
  variants: {
    variant: {
      primary: 'bg-[var(--lime)] text-[#10150c] hover:bg-[#d8ff9d]',
      secondary: 'border border-white/10 bg-white/[.045] text-white hover:bg-white/[.09]',
      ghost: 'text-slate-400 hover:bg-white/[.06] hover:text-white',
      danger: 'border border-rose-300/20 bg-rose-300/10 text-rose-200 hover:bg-rose-300/20',
    },
    size: { default: 'h-10 px-4', sm: 'h-8 px-3 text-xs', icon: 'size-9' },
  },
  defaultVariants: { variant: 'secondary', size: 'default' },
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {}
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-white/[.075] bg-white/[.025]', className)} {...props} />
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[.045] px-2 py-1 text-[10px] font-medium text-slate-300', className)} {...props} />
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white placeholder:text-slate-600 focus:border-[var(--cyan)] focus:outline-none', className)} {...props} />
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-24 w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm leading-relaxed text-white placeholder:text-slate-600 focus:border-[var(--cyan)] focus:outline-none', className)} {...props} />
}

export function Progress({ value, className, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return <ProgressPrimitive.Root className={cn('relative h-2 w-full overflow-hidden rounded-full bg-white/[.08]', className)} {...props}>
    <ProgressPrimitive.Indicator className="h-full w-full rounded-full bg-[var(--lime)] transition-transform duration-700" style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }} />
  </ProgressPrimitive.Root>
}

export const Tabs = TabsPrimitive.Root
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => <TabsPrimitive.List ref={ref} className={cn('inline-flex h-10 items-center gap-1 rounded-lg border border-white/[.06] bg-black/20 p-1', className)} {...props} />)
TabsList.displayName = 'TabsList'
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => <TabsPrimitive.Trigger ref={ref} className={cn('rounded-md px-3 py-1.5 text-xs text-slate-400 transition data-[state=active]:bg-white/10 data-[state=active]:text-white', className)} {...props} />)
TabsTrigger.displayName = 'TabsTrigger'
export const TabsContent = TabsPrimitive.Content

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#101719] p-6 shadow-2xl', className)} {...props}>
      {children}<DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-slate-500 hover:text-white" aria-label="Close"><X size={17} /></DialogPrimitive.Close>
    </DialogPrimitive.Content></DialogPrimitive.Portal>
}
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(({ className, children, ...props }, ref) => <SelectPrimitive.Trigger ref={ref} className={cn('flex h-10 w-full items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white', className)} {...props}>{children}<SelectPrimitive.Icon><ChevronDown size={14} className="text-slate-500" /></SelectPrimitive.Icon></SelectPrimitive.Trigger>)
SelectTrigger.displayName = 'SelectTrigger'
export const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(({ className, children, position = 'popper', ...props }, ref) => <SelectPrimitive.Portal><SelectPrimitive.Content ref={ref} position={position} className={cn('z-[70] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-white/10 bg-[#172023] p-1 shadow-xl', className)} {...props}><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>)
SelectContent.displayName = 'SelectContent'
export const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(({ className, children, ...props }, ref) => <SelectPrimitive.Item ref={ref} className={cn('relative flex cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-8 text-sm text-slate-300 outline-none focus:bg-white/[.06] data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText><SelectPrimitive.ItemIndicator className="absolute right-2"><Check size={14} /></SelectPrimitive.ItemIndicator></SelectPrimitive.Item>)
SelectItem.displayName = 'SelectItem'