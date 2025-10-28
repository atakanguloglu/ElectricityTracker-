'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { logger } from '@/utils/logger'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 dakika
        gcTime: 1000 * 60 * 30, // 30 dakika (eski adı: cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      mutations: {
        retry: 0,
        onError: (error: any) => {
          logger.error('🔴 React Query Mutation Error', error)
        },
        onSuccess: (data: any, variables: any) => {
          logger.success('✅ React Query Mutation Success', { data, variables })
        },
      },
    },
  }))

  // Query cache logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
        if (event?.type === 'observerResultsUpdated') {
          logger.debug('🔄 Query Cache Updated', {
            queryKey: event.query.queryKey,
            state: event.query.state.status,
            dataUpdatedAt: event.query.state.dataUpdatedAt,
          })
        }
      })
      return () => unsubscribe()
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

