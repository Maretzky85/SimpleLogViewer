import {Component, type ReactNode} from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
    state: State = {error: null}

    static getDerivedStateFromError(error: Error): State {
        return {error}
    }

    render() {
        if (this.state.error) {
            return (
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center max-w-md p-6">
                        <p className="text-lg font-semibold text-red-600 mb-2">Something went wrong</p>
                        <p className="text-sm text-gray-500 font-mono">{this.state.error.message}</p>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
