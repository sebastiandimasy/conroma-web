import { useEffect, useRef } from 'react';
import { motion, useDragControls, useReducedMotion } from 'motion/react';
import { Button } from '@heroui/react';
import type { Filters } from '../lib/filters';
import { emptyFilters } from '../lib/filters';

interface FilterSheetProps {
  open: boolean;
  filters: Filters;
  types: string[];
  count: number;
  onChange: (filters: Filters) => void;
  onClose: () => void;
}

const priceSteps = [150000, 200000, 250000, 300000, 400000];
const roomSteps = [1, 2, 3, 4];

export function FilterSheet({ open, filters, types, count, onChange, onClose }: FilterSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const controls = useDragControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const extras: { key: 'terrace' | 'elevator' | 'parking'; label: string }[] = [
    { key: 'terrace', label: 'Terraza' },
    { key: 'elevator', label: 'Ascensor' },
    { key: 'parking', label: 'Parking' },
  ];

  return (
    <dialog
      ref={dialogRef}
      className="filter-dialog"
      aria-label="Filtros"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {open && (
        <motion.div
          className="sheet glass glass--thick"
          initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
          drag={reduceMotion ? false : 'y'}
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120 || info.velocity.y > 600) onClose();
          }}
        >
          <div
            className="sheet__handle"
            onPointerDown={(event) => controls.start(event)}
            aria-hidden="true"
          >
            <div className="sheet__grabber" />
          </div>
          <h2 className="sheet__title">Filtros</h2>

          <fieldset className="sheet__group">
            <legend className="field__label">Precio hasta</legend>
            <div className="chip-row">
              {priceSteps.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="chip"
                  aria-pressed={filters.maxPrice === step}
                  onClick={() => onChange({ ...filters, maxPrice: filters.maxPrice === step ? null : step })}
                >
                  {`${step.toLocaleString('es-ES')} €`}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="sheet__group">
            <legend className="field__label">Habitaciones, como mínimo</legend>
            <div className="chip-row">
              {roomSteps.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="chip"
                  aria-pressed={filters.minRooms === step}
                  onClick={() => onChange({ ...filters, minRooms: filters.minRooms === step ? null : step })}
                >
                  {`${step}+`}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="sheet__group">
            <legend className="field__label">Tipo</legend>
            <div className="chip-row">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className="chip"
                  aria-pressed={filters.type === type}
                  onClick={() => onChange({ ...filters, type: filters.type === type ? null : type })}
                >
                  {type}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="sheet__group">
            <legend className="field__label">Que tenga</legend>
            <div className="chip-row">
              {extras.map((extra) => (
                <button
                  key={extra.key}
                  type="button"
                  className="chip"
                  aria-pressed={filters[extra.key]}
                  onClick={() => onChange({ ...filters, [extra.key]: !filters[extra.key] })}
                >
                  {extra.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="sheet__actions">
            <Button variant="ghost" onPress={() => onChange(emptyFilters)}>
              Quitar
            </Button>
            <Button variant="primary" onPress={onClose}>
              {count === 0 ? 'Ninguna así' : `Ver ${count} ${count === 1 ? 'vivienda' : 'viviendas'}`}
            </Button>
          </div>
        </motion.div>
      )}
    </dialog>
  );
}
