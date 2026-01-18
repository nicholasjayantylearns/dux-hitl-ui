"use client"

import { Button } from "@/components/ui/button"
import { FileText, GitMerge, MessageSquare, Send } from "lucide-react"

interface ActionHubProps {
  provenanceId: string
  problemId: string
}

export function ActionHub({ provenanceId, problemId }: ActionHubProps) {
  const handleAction = (action: string) => {
    alert(`Action triggered: ${action}\nProvenance ID: ${provenanceId}\nProblem ID: ${problemId}`)
  }

  return (
    <div className="bg-black/30 border border-green-900/50 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-green-300 mb-4">Action Hub</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="ghost"
          className="flex flex-col h-24 items-center justify-center space-y-2 text-green-400 hover:bg-green-900/50 hover:text-green-200 border border-green-800/50"
          onClick={() => handleAction("Generate One-Sheet")}
        >
          <FileText className="w-6 h-6" />
          <span className="text-xs text-center">Generate One-Sheet</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col h-24 items-center justify-center space-y-2 text-green-400 hover:bg-green-900/50 hover:text-green-200 border border-green-800/50"
          onClick={() => handleAction("Create Engineering Ticket")}
        >
          <GitMerge className="w-6 h-6" />
          <span className="text-xs text-center">Create Eng Ticket</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col h-24 items-center justify-center space-y-2 text-green-400 hover:bg-green-900/50 hover:text-green-200 border border-green-800/50"
          onClick={() => handleAction("Draft Stakeholder Memo")}
        >
          <Send className="w-6 h-6" />
          <span className="text-xs text-center">Draft Stakeholder Memo</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col h-24 items-center justify-center space-y-2 text-green-400 hover:bg-green-900/50 hover:text-green-200 border border-green-800/50"
          onClick={() => handleAction("Start Team Discussion")}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs text-center">Start Team Discussion</span>
        </Button>
      </div>
    </div>
  )
}
