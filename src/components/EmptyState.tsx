import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  actionOnClick?: () => void;
  variant?: 'default' | 'card' | 'inline';
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  actionOnClick,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  const ActionButton = () => {
    if (actionLink) {
      return (
        <Link to={actionLink}>
          <Button className="mt-4">
            {actionLabel}
          </Button>
        </Link>
      );
    }
    
    if (actionOnClick) {
      return (
        <Button onClick={actionOnClick} className="mt-4">
          {actionLabel}
        </Button>
      );
    }
    
    return null;
  };

  if (variant === 'card') {
    return (
      <Card className={`border-dashed border-gray-300 ${className}`}>
        <CardContent className="p-6 text-center">
          {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
          <p className="text-gray-500 mb-4">{description}</p>
          <ActionButton />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`text-center py-8 ${className}`}>
        {Icon && <Icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />}
        <h3 className="text-base font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        <ActionButton />
      </div>
    );
  }

  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <ActionButton />
    </div>
  );
}
