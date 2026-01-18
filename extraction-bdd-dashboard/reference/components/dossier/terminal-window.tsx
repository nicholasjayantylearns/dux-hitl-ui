import type { ReactNode } from "react"

interface TerminalWindowProps {
  title: string
  status: string
  statusColor: string
  children: ReactNode
}

export function TerminalWindow({ title, status, statusColor, children }: TerminalWindowProps) {
  return (
    <div className="w-full h-full border-2 border-green-900/80 bg-black/70 rounded-lg shadow-2xl shadow-green-500/10 flex flex-col font-mono">
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-green-900/80 bg-green-950/50">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <p className="text-green-300 text-sm font-bold tracking-widest">{title}</p>
        <div className="flex items-center space-x-2">
          <span className={`relative flex h-2 w-2`}>
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-75`}
            ></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`}></span>
          </span>
          <span className="text-green-400 text-xs font-bold">{status}</span>
        </div>
      </div>
      <div className="flex-grow p-1 overflow-hidden">{children}</div>
    </div>
  )
}
