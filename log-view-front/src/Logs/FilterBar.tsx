import type {Filters, LogLevel} from '../types/logs'

const ALL_LEVELS: LogLevel[] = [
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
]

type FilterBarProps = {
    filters: Filters
    onToggleLevel: (level: LogLevel) => void
    onDateFromChange: (value: number | undefined) => void
    onDateToChange: (value: number | undefined) => void
}

export function FiltersBar({filters, onToggleLevel, onDateFromChange, onDateToChange}: FilterBarProps) {
    return (
        <div className="p-2 flex flex-col gap-2">
            {/* Date range */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end">
                <label className="flex flex-col gap-0.5 text-xs text-gray-500">
                    From
                    <input
                        type="datetime-local"
                        className="border rounded px-1.5 py-1 text-sm text-gray-800"
                        onChange={(e) =>
                            onDateFromChange(
                                e.target.value ? new Date(e.target.value).getTime() : undefined
                            )
                        }
                    />
                </label>

                <label className="flex flex-col gap-0.5 text-xs text-gray-500">
                    To
                    <input
                        type="datetime-local"
                        className="border rounded px-1.5 py-1 text-sm text-gray-800"
                        onChange={(e) =>
                            onDateToChange(
                                e.target.value ? new Date(e.target.value).getTime() : undefined
                            )
                        }
                    />
                </label>
            </div>

            {/* Level */}
            <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Level</span>
                <div className="flex gap-1">
                    {ALL_LEVELS.map((level) => (
                        <button
                            key={level}
                            onClick={() => onToggleLevel(level)}
                            className={`px-2 py-1 text-xs rounded border ${
                                filters.levels.includes(level)
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-gray-100 border-gray-200'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
