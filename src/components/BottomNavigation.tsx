
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/career-test', label: 'Career', icon: '🎯' },
    { path: '/skill-swap', label: 'Skills', icon: '🔄' },
    { path: '/my-sessions', label: 'Sessions', icon: '📝' },
    { path: '/interview-trainer', label: 'Practice', icon: '🎤' },
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 shadow-lg">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => navigate(item.path)}
            variant="ghost"
            className={`flex flex-col items-center py-1 px-2 h-auto min-w-0 flex-1 text-xs ${
              location.pathname === item.path 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="text-sm mb-1">
              {typeof item.icon === 'string' ? item.icon : item.icon}
            </div>
            <span className="text-xs font-medium leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
