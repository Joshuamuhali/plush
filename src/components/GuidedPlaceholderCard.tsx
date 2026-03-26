import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface GuidedPlaceholderCardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  actionOnClick?: () => void;
  steps?: string[];
  variant?: 'property' | 'activity' | 'process' | 'action';
  className?: string;
  primaryAction?: string;
  secondaryAction?: string;
  primaryLink?: string;
  secondaryLink?: string;
}

export default function GuidedPlaceholderCard({
  icon: Icon,
  title,
  subtitle,
  description,
  actionLabel,
  actionLink,
  actionOnClick,
  steps,
  variant = 'property',
  className = '',
  primaryAction,
  secondaryAction,
  primaryLink,
  secondaryLink,
}: GuidedPlaceholderCardProps) {
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

  const DualActions = () => {
    if (primaryAction && secondaryAction) {
      return (
        <div className="flex gap-3 mt-6">
          {primaryLink && (
            <Link to={primaryLink}>
              <Button className="flex-1">
                {primaryAction}
              </Button>
            </Link>
          )}
          {secondaryLink && (
            <Link to={secondaryLink}>
              <Button variant="outline" className="flex-1">
                {secondaryAction}
              </Button>
            </Link>
          )}
        </div>
      );
    }
    return <ActionButton />;
  };

  if (variant === 'action') {
    return (
      <Card className={`border-dashed border-gray-300 ${className}`}>
        <CardContent className="p-6 text-center">
          {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
          <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
          <p className="text-sm text-gray-600 mb-6 text-center">{description}</p>
          <DualActions />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'property') {
    return (
      <Card className={`border-dashed border-gray-300 bg-gray-50/50 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {Icon && <Icon className="w-8 h-8 text-gray-400" />}
            <div>
              <h3 className="font-medium text-gray-700">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <ActionButton />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'activity') {
    return (
      <Card className={`border-dashed border-gray-300 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />}
            <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <p className="text-sm text-gray-600 mb-4 text-center">{description}</p>
          <div className="text-center">
            <ActionButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'process') {
    return (
      <Card className={`border-dashed border-gray-300 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />}
            <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          
          {steps && steps.length > 0 && (
            <div className="space-y-3 mb-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <ActionButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-dashed border-gray-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {Icon && <Icon className="w-8 h-8 text-gray-400" />}
          <div>
            <h3 className="font-medium text-gray-700">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <ActionButton />
      </CardContent>
    </Card>
  );
}
