import { useCallback, useState } from 'react'

export interface OptimisticUpdateOptions<T> {
  onSuccess?: (result: T) => void
  onError?: (error: Error) => void
  simulateFailure?: boolean
  failureRate?: number
}

export interface OptimisticState<T> {
  data: T
  isPending: boolean
  error: Error | null
  lastUpdate: number
}

export function useOptimisticUpdates<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {},
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isPending: false,
    error: null,
    lastUpdate: Date.now(),
  })

  const {
    onSuccess,
    onError,
    simulateFailure = false,
    failureRate = 0.3,
  } = options

  const simulateApiCall = useCallback(
    async (data: T): Promise<T> => {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000),
      )

      if (simulateFailure && Math.random() < failureRate) {
        throw new Error('Simulated API failure - network error')
      }

      return data
    },
    [simulateFailure, failureRate],
  )

  const updateOptimistically = useCallback(
    async (newData: T) => {
      const previousData = state.data
      const updateId = Date.now()

      setState((prev) => ({
        ...prev,
        data: newData,
        isPending: true,
        error: null,
        lastUpdate: updateId,
      }))

      try {
        const result = await simulateApiCall(newData)

        setState((current) => {
          if (current.lastUpdate !== updateId) {
            return current
          }

          return {
            ...current,
            data: result,
            isPending: false,
            error: null,
          }
        })

        onSuccess?.(result)
      } catch (error) {
        setState((current) => {
          if (current.lastUpdate !== updateId) {
            return current
          }

          return {
            ...current,
            data: previousData,
            isPending: false,
            error: error as Error,
          }
        })

        onError?.(error as Error)
      }
    },
    [state.data, simulateApiCall, onSuccess, onError],
  )

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }))
  }, [])

  return {
    data: state.data,
    isPending: state.isPending,
    error: state.error,
    updateOptimistically,
    resetError,
    setData,
  }
}

export function useOptimisticList<T extends { id: string }>(
  initialItems: T[],
  updateFn: (items: T[]) => Promise<T[]>,
  options: OptimisticUpdateOptions<T[]> = {},
) {
  const optimisticState = useOptimisticUpdates(initialItems, updateFn, options)

  const addItem = useCallback(
    (item: T) => {
      const newItems = [...optimisticState.data, item]
      optimisticState.updateOptimistically(newItems)
    },
    [optimisticState],
  )

  const updateItem = useCallback(
    (id: string, updates: Partial<T>) => {
      const newItems = optimisticState.data.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      )
      optimisticState.updateOptimistically(newItems)
    },
    [optimisticState],
  )

  const removeItem = useCallback(
    (id: string) => {
      const newItems = optimisticState.data.filter((item) => item.id !== id)
      optimisticState.updateOptimistically(newItems)
    },
    [optimisticState],
  )

  return {
    ...optimisticState,
    addItem,
    updateItem,
    removeItem,
  }
}
