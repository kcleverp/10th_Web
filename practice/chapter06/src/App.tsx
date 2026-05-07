// main.tsx 또는 App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {Welcome} from "../pages/Welcome"

function App(){
  const queryClient = new QueryClient();
  return(
  <QueryClientProvider client={queryClient}>
    <Welcome />
  </QueryClientProvider>
  )
}

export default App