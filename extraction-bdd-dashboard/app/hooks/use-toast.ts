import * as React from "react"

export interface ToastAction {
  altText: string
  onClick: () => void
}

export interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastAction
  variant?: "default" | "destructive"
}

interface ToasterState {
  toasts: Toast[]
}

type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; id: string; toast: Partial<Toast> }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "REMOVE_TOAST"; id: string }

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: ToasterState, action: Action): ToasterState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 3),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { id } = action
      if (toastTimeouts.has(id)) {
        clearTimeout(toastTimeouts.get(id))
        toastTimeouts.delete(id)
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.id === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }
  }
}

const listeners: Array<(state: ToasterState) => void> = []

let memoryState: ToasterState = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface Toast extends Omit<Toast, "id"> {}

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: Toast) =>
    dispatch({
      type: "UPDATE_TOAST",
      id,
      toast: { ...props },
    })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    } as Toast,
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<ToasterState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", id: toastId! }),
  }
}

export { useToast, toast }
