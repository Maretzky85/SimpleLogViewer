import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FiltersBar } from './FilterBar'
import type { Filters } from '../types/logs'

const emptyFilters: Filters = { levels: [], dateFrom: undefined, dateTo: undefined }

const noop = () => {}

describe('FiltersBar', () => {
    it('renders a button for each log level', () => {
        render(<FiltersBar filters={emptyFilters} onToggleLevel={noop} onDateFromChange={noop} onDateToChange={noop} />)
        for (const level of ['fatal', 'error', 'warn', 'info', 'debug', 'trace']) {
            expect(screen.getByRole('button', { name: level })).toBeInTheDocument()
        }
    })

    it('calls onToggleLevel with the level when a button is clicked', async () => {
        const onToggleLevel = vi.fn()
        render(<FiltersBar filters={emptyFilters} onToggleLevel={onToggleLevel} onDateFromChange={noop} onDateToChange={noop} />)
        await userEvent.click(screen.getByRole('button', { name: 'error' }))
        expect(onToggleLevel).toHaveBeenCalledWith('error')
    })

    it('marks active levels with blue styling', () => {
        const filters: Filters = { ...emptyFilters, levels: ['warn'] }
        render(<FiltersBar filters={filters} onToggleLevel={noop} onDateFromChange={noop} onDateToChange={noop} />)
        expect(screen.getByRole('button', { name: 'warn' })).toHaveClass('bg-blue-500')
        expect(screen.getByRole('button', { name: 'error' })).not.toHaveClass('bg-blue-500')
    })
})
