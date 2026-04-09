import { act, renderHook } from '@testing-library/react'
import { useFilters } from './useFilters'

describe('useFilters', () => {
    it('starts with empty levels and no dates', () => {
        const { result } = renderHook(() => useFilters())
        expect(result.current.filters.levels).toEqual([])
        expect(result.current.filters.dateFrom).toBeUndefined()
        expect(result.current.filters.dateTo).toBeUndefined()
    })

    it('toggleLevel adds a level that is not active', () => {
        const { result } = renderHook(() => useFilters())
        act(() => result.current.toggleLevel('error'))
        expect(result.current.filters.levels).toContain('error')
    })

    it('toggleLevel removes a level that is already active', () => {
        const { result } = renderHook(() => useFilters())
        act(() => result.current.toggleLevel('error'))
        act(() => result.current.toggleLevel('error'))
        expect(result.current.filters.levels).not.toContain('error')
    })

    it('toggleLevel can have multiple levels active at once', () => {
        const { result } = renderHook(() => useFilters())
        act(() => result.current.toggleLevel('error'))
        act(() => result.current.toggleLevel('warn'))
        expect(result.current.filters.levels).toEqual(['error', 'warn'])
    })

    it('setDateFrom updates dateFrom', () => {
        const { result } = renderHook(() => useFilters())
        act(() => result.current.setDateFrom(1000))
        expect(result.current.filters.dateFrom).toBe(1000)
    })

    it('setDateTo updates dateTo', () => {
        const { result } = renderHook(() => useFilters())
        act(() => result.current.setDateTo(2000))
        expect(result.current.filters.dateTo).toBe(2000)
    })
})
