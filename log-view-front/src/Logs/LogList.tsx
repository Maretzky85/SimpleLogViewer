import type {LogData, LogLevel} from "../types/logs.ts";

const levelStyles: Record<LogLevel, string> = {
    fatal: 'bg-red-700 text-white',
    error: 'bg-red-500 text-white',
    warn:  'bg-yellow-400 text-black',
    info:  'bg-blue-500 text-white',
    debug: 'bg-gray-400 text-white',
    trace: 'bg-gray-200 text-gray-600',
}

type LogListProps = {
    logs: LogData[]
    hasNextPage?: boolean
    isFetchingNextPage: boolean
    isLoading: boolean
    isError: boolean
    onLoadMore: () => void
    onSelect: (log: LogData) => void
}

export function LogList({logs, hasNextPage, isFetchingNextPage, isLoading, isError, onLoadMore, onSelect}: LogListProps) {
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                Loading...
            </div>
        )
    }

    if (!isError && logs.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                No logs found
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-sm table-fixed">
                <thead className="sticky top-0 bg-white border-b">
                    <tr>
                        <th className="text-left p-2 w-20 font-medium text-gray-500">Level</th>
                        <th className="hidden sm:table-cell text-left p-2 w-44 font-medium text-gray-500">Timestamp</th>
                        <th className="text-left p-2 font-medium text-gray-500">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr
                            key={log.id}
                            onClick={() => onSelect(log)}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                        >
                            <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium uppercase ${levelStyles[log.level]}`}>
                                    {log.level}
                                </span>
                            </td>
                            <td className="hidden sm:table-cell p-2 text-xs text-gray-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-2 truncate max-w-0">
                                {log.message}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {hasNextPage && (
                <button
                    onClick={onLoadMore}
                    disabled={isFetchingNextPage}
                    className="w-full p-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </button>
            )}
        </div>
    )
}

export default LogList
