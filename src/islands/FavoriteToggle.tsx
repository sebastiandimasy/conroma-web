import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { ToggleButton } from '@heroui/react';
import { hydrateStore, savedRefs, toggleSaved } from '../lib/store';
import { Icon } from './Icon';
import { strings, type Lang } from '../i18n';

interface FavoriteToggleProps {
  propertyRef: string;
  label?: boolean;
  lang: Lang;
}

const texts = strings({
  es: { remove: 'Quitar de guardados', save: 'Guardar este piso', saved: 'Guardado', saveShort: 'Guardar' },
  en: { remove: 'Remove from saved', save: 'Save this property', saved: 'Saved', saveShort: 'Save' },
  ca: { remove: 'Treure de desats', save: 'Desar aquest pis', saved: 'Desat', saveShort: 'Desar' },
});

// Favorito basado en el ToggleButton de HeroUI (interacción pressable + estado on/off
// accesible vía react-aria), conectado al store existente para no perder lo guardado.
export default function FavoriteToggle({ propertyRef, label = false, lang }: FavoriteToggleProps) {
  const t = texts[lang];
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
      aria-label={saved ? t.remove : t.save}
    >
      <Icon name="heart" className="save-button__icon" filled={saved} />
      {label && <span>{saved ? t.saved : t.saveShort}</span>}
    </ToggleButton>
  );
}
