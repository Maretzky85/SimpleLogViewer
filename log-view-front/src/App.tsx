import LogsPage from "./Logs/LogsPage.tsx";
import {ErrorBoundary} from "./ErrorBoundary.tsx";

function App() {
    return (
        <ErrorBoundary>
            <div className="h-screen flex flex-col">
                <header className="p-3 border-b font-semibold">
                    Log Viewer
                </header>
                <main className="flex-1 overflow-hidden">
                    <LogsPage />
                </main>
            </div>
        </ErrorBoundary>
    )
}

export default App
