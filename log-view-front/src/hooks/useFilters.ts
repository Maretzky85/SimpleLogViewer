import {useState} from 'react'
import type {Filters, LogLevel} from '../types/logs.ts'

export function useFilters() {
    const [filters, setFilters] = useState<Filters>({
        levels: [],
        dateFrom: undefined,
        dateTo: undefined,
    })

    const toggleLevel = (level: LogLevel) =>
        setFilters(f => {
            const exists = f.levels.includes(level)
            return {
                ...f,
                levels: exists ? f.levels.filter(l => l !== level) : [...f.levels, level],
            }
        })

    const setDateFrom = (value: number | undefined) =>
        setFilters(f => ({...f, dateFrom: value}))

    const setDateTo = (value: number | undefined) =>
        setFilters(f => ({...f, dateTo: value}))

    return {filters, toggleLevel, setDateFrom, setDateTo}
}
