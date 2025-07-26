'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  text?: string;
  showText?: boolean;
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
}

export default function LoadingSpinner({
  size = 'md',
  color = 'blue',
  text = 'Carregando...',
  showText = true,
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-2 ${sizeClasses[size]} ${colorClasses[color]}`}></div>
        {showText && (
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-2">
          <div className={`${sizeClasses[size]} bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`${sizeClasses[size]} bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`${sizeClasses[size]} bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
        {showText && (
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`${sizeClasses[size]} bg-${color}-600 rounded-full animate-pulse opacity-75`}></div>
        {showText && (
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1 bg-${color}-600 rounded-full animate-pulse`}
              style={{
                height: size === 'sm' ? '16px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '40px',
                animationDelay: `${i * 100}ms`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
        {showText && (
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// Skeleton loader components
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonButton() {
  return <div className="animate-pulse h-10 bg-gray-200 rounded-lg w-full"></div>;
}