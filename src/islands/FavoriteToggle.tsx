import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { ToggleButton } from '@heroui/react';
import { hydrateStore, savedRefs, toggleSaved } from '../lib/store';
import { Icon } from './Icon';

interface FavoriteToggleProps {
  propertyRef: string;
  label?: boolean;
}

// Favorito basado en el ToggleButton de HeroUI (interacción pressable + estado on/off
// accesible vía react-aria), conectado al store existente para no perder lo guardado.
export default function FavoriteToggle({ propertyRef, label = false }: FavoriteToggleProps) {
  const saved = useStore(savedRefs).includes(propertyRef);

  useEffect(() => {
    hydrateStore();
  }, []);

  return (
    <ToggleButton
      className="favorite-toggle"
      size="sm"
      isSelected={saved}
      onChange={() => toggleSaved(propertyRef)}
      aria-label={saved ? 'Quitar de guardados' : 'Guardar este piso'}
    >
      <Icon name="heart" className="save-button__icon" filled={saved} />
      {label && <span>{saved ? 'Guardado' : 'Guardar'}</span>}
    </ToggleButton>
  );
}
