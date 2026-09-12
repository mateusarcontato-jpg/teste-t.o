import React from 'react';
import {
  Monitor,
  AppWindow,
  Wifi,
  KeyRound,
  Printer,
  ShieldAlert,
  HelpCircle,
  LucideProps,
} from 'lucide-react';
import { TicketCategory } from '../types';

interface CategoryIconProps extends LucideProps {
  category: TicketCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'hardware':
      return <Monitor {...props} />;
    case 'software':
      return <AppWindow {...props} />;
    case 'rede':
      return <Wifi {...props} />;
    case 'acessos':
      return <KeyRound {...props} />;
    case 'impressoras':
      return <Printer {...props} />;
    case 'seguranca':
      return <ShieldAlert {...props} />;
    case 'outros':
    default:
      return <HelpCircle {...props} />;
  }
};
