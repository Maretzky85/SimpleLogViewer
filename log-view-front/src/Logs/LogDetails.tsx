import type {LogData} from "../types/logs.ts";

export function LogDetails({ log }: { log: LogData | null }) {
    if (!log) {
        return (
            <div className="hidden lg:flex h-full items-center justify-center text-gray-400">
                Select a log to view details
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 text-sm text-gray-500 p-4 border-b">
                {log.level} • {new Date(log.timestamp).toLocaleString()}
            </div>

            <div className="flex-1 overflow-auto p-4">
        <pre className="text-xs whitespace-pre-wrap break-words">
          {log.message}
        </pre>

                {log.metadata && (
                    <pre className="mt-4 text-xs text-gray-600 whitespace-pre-wrap break-words">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
                )}
            </div>
        </div>
    )
}