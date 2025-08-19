import AppRoutes from "./routes.js";
import { useTheme } from './hooks/use-theme';
import ThemeToggle from './components/common/ThemeToggle';

function App() {
  useTheme(); // Apply the theme globally

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
