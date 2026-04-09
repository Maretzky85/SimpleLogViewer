import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogList } from './LogList'
import type { LogData } from '../types/logs'

const makLog = (id: number, overrides: Partial<LogData> = {}): LogData => ({
    id,
    hashId: `hash-${id}`,
    timestamp: 1_700_000_000_000 + id * 1000,
    level: 'info',
    message: `Log message ${id}`,
    metadata: '{}',
    ...overrides,
})

const noop = () => {}
const baseProps = {isFetchingNextPage: false, isLoading: false, isError: false, onLoadMore: noop, onSelect: noop}

describe('LogList', () => {
    it('renders a row for each log entry', () => {
        const logs = [makLog(1), makLog(2), makLog(3)]
        render(<LogList {...baseProps} logs={logs} />)
        expect(screen.getByText('Log message 1')).toBeInTheDocument()
        expect(screen.getByText('Log message 2')).toBeInTheDocument()
        expect(screen.getByText('Log message 3')).toBeInTheDocument()
    })

    it('does not show "Load more" when hasNextPage is false', () => {
        render(<LogList {...baseProps} logs={[makLog(1)]} hasNextPage={false} />)
        expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
    })

    it('shows "Load more" button when hasNextPage is true', () => {
        render(<LogList {...baseProps} logs={[makLog(1)]} hasNextPage />)
        expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
    })

    it('calls onLoadMore when "Load more" is clicked', async () => {
        const onLoadMore = vi.fn()
        render(<LogList {...baseProps} logs={[makLog(1)]} hasNextPage onLoadMore={onLoadMore} />)
        await userEvent.click(screen.getByRole('button', { name: /load more/i }))
        expect(onLoadMore).toHaveBeenCalledTimes(1)
    })

    it('calls onSelect with the log when a row is clicked', async () => {
        const onSelect = vi.fn()
        const log = makLog(1)
        render(<LogList {...baseProps} logs={[log]} onSelect={onSelect} />)
        await userEvent.click(screen.getByText('Log message 1'))
        expect(onSelect).toHaveBeenCalledWith(log)
    })

    it('shows "Loading..." and disables the button while fetching next page', () => {
        render(<LogList {...baseProps} logs={[makLog(1)]} hasNextPage isFetchingNextPage />)
        const btn = screen.getByRole('button', { name: /loading/i })
        expect(btn).toBeDisabled()
    })

    it('shows loading state when isLoading is true', () => {
        render(<LogList {...baseProps} logs={[]} isLoading />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('shows empty state when no logs and not loading', () => {
        render(<LogList {...baseProps} logs={[]} />)
        expect(screen.getByText('No logs found')).toBeInTheDocument()
    })
})
