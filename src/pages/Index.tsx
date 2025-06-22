
import Dashboard from "./Dashboard";
import { useDebugAuth } from "@/hooks/useDebugAuth";

const Index = () => {
  console.log('📄 INDEX PAGE: Component rendering');
  
  const auth = useDebugAuth('Index');
  
  console.log('📊 INDEX PAGE: Auth state received', {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    hasUser: !!auth.user
  });
  
  console.log('🔄 INDEX PAGE: Rendering Dashboard component');
  return <Dashboard />;
};

export default Index;
