'use client';

interface PlayerAvatarProps {
  emoji: string;
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-10 h-10 text-xl',
  md: 'w-14 h-14 text-3xl',
  lg: 'w-20 h-20 text-5xl',
};

export function PlayerAvatar({ emoji, level, size = 'md' }: PlayerAvatarProps) {
  const borderColor =
    level >= 15 ? 'border-sun' : level >= 10 ? 'border-secondary' : level >= 5 ? 'border-primary' : 'border-gray-300';

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-gradient-to-br from-gray-50 to-gray-100
        border-3 ${borderColor}
        ${sizeClasses[size]}
      `}
      style={{ borderWidth: '3px' }}
    >
      <span role="img" aria-label="avatar">
        {emoji}
      </span>
      {size !== 'sm' && (
        <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
          {level}
        </span>
      )}
    </div>
  );
}
