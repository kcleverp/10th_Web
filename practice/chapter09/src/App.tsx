import CounterPage from './components/CounterPage';
import CompanyPage from './components/CompanyPage';

function App() {
  return (
    <div className="flex w-full flex-col gap-10 px-5 py-8 text-left">
      <CounterPage />
      <CompanyPage />
    </div>
  );
}

export default App;
