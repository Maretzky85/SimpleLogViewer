import {useMemo, useState} from 'react'
import {useLogs} from '../hooks/useLogs'
import {useFilters} from '../hooks/useFilters'
import {FiltersBar} from './FilterBar.tsx'
import LogList from './LogList.tsx'
import {LogDetails} from './LogDetails.tsx'
import type {LogData} from '../types/logs.ts'

export function LogsPage() {
    const {filters, toggleLevel, setDateFrom, setDateTo} = useFilters()
    const [selectedLog, setSelectedLog] = useState<LogData | null>(null)

    const query = useLogs(filters)
    const logs = useMemo(
        () => query.data?.pages.flatMap((p) => p.logs) ?? [],
        [query.data]
    )

    const handleLoadMore = () => {
        if (!query.isFetchingNextPage) query.fetchNextPage()
    }

    const listProps = {
        logs,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        onLoadMore: handleLoadMore,
        onSelect: setSelectedLog,
    }

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 border-b bg-white">
                <FiltersBar
                    filters={filters}
                    onToggleLevel={toggleLevel}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                />
            </div>

            {query.isError && (
                <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
                    <span className="font-medium">Failed to load logs.</span>
                    <span className="text-red-500">{query.error?.message}</span>
                    <button
                        onClick={() => query.refetch()}
                        className="ml-auto underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Desktop: side-by-side list + details */}
            <div className="hidden lg:grid grid-cols-[1fr_400px] flex-1 min-h-0">
                <div className="min-h-0 min-w-0 h-full flex flex-col">
                    <LogList {...listProps} />
                </div>
                <div className="min-h-0 min-w-0 h-full flex flex-col border-l bg-white">
                    <LogDetails log={selectedLog} />
                </div>
            </div>

            {/* Mobile: full-width list */}
            <div className="lg:hidden flex-1 min-h-0 min-w-0 flex flex-col">
                <LogList {...listProps} />
            </div>

            {/* Mobile: details modal */}
            {selectedLog && (
                <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
                    <div className="shrink-0 p-3 border-b">
                        <button
                            onClick={() => setSelectedLog(null)}
                            className="text-sm text-blue-500"
                        >
                            ← Back
                        </button>
                    </div>
                    <div className="flex-1 min-h-0 overflow-auto">
                        <LogDetails log={selectedLog} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default LogsPage
