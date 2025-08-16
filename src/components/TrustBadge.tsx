import { Badge } from "@/components/ui/badge";
import { Star, Award, Crown, Gem, Zap } from "lucide-react";

interface TrustBadgeProps {
  trustLevel: 'newbie' | 'bronze' | 'silver' | 'gold' | 'platinum';
  overallScore: number;
  completedSessions: number;
  className?: string;
}

const TrustBadge = ({ trustLevel, overallScore, completedSessions, className = "" }: TrustBadgeProps) => {
  const getBadgeConfig = () => {
    switch (trustLevel) {
      case 'platinum':
        return {
          icon: Crown,
          color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
          label: 'Platinum Expert',
          description: 'Elite skill teacher'
        };
      case 'gold':
        return {
          icon: Award,
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
          label: 'Gold Expert',
          description: 'Highly trusted teacher'
        };
      case 'silver':
        return {
          icon: Gem,
          color: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
          label: 'Silver Contributor',
          description: 'Experienced teacher'
        };
      case 'bronze':
        return {
          icon: Star,
          color: 'bg-gradient-to-r from-orange-600 to-red-500 text-white',
          label: 'Bronze Teacher',
          description: 'Proven skills'
        };
      default:
        return {
          icon: Zap,
          color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          label: 'New Teacher',
          description: 'Building reputation'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge className={`${config.color} px-3 py-1 flex items-center space-x-1`}>
        <IconComponent className="w-4 h-4" />
        <span>{config.label}</span>
      </Badge>
      
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{overallScore.toFixed(1)}</span>
        <span>•</span>
        <span>{completedSessions} sessions</span>
      </div>
    </div>
  );
};

export default TrustBadge;