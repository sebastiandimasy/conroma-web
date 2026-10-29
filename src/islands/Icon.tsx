import { icons, filledIcons, iconViewBox, type IconName } from '../lib/icons';

interface IconProps {
  name: IconName;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className, filled }: IconProps) {
  const isFilled = filled ?? filledIcons.includes(name);
  return (
    <svg
      className={className}
      viewBox={iconViewBox[name] ?? '0 0 24 24'}
      width="24"
      height="24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled && filledIcons.includes(name) ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name]} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}
