import type { Property } from '../data/properties';
import { cardFacts, hasPublicPrice, propertyTitle, propertyUrl, typeLabel } from '../data/property-text';
import { photoSources } from '../lib/photos';
import { findTown } from '../data/towns';
import { formatPrice } from '../lib/format';
import { isNewListing } from '../lib/inventory';
import { phoneUrl, whatsappUrl } from '../lib/links';
import { strings, type Lang } from '../i18n';
import { Icon } from './Icon';
import FavoriteToggle from './FavoriteToggle';

interface PropertyCardProps {
  property: Property;
  townName: string;
  origin: string;
  eager?: boolean;
  headingLevel?: 'h2' | 'h3';
  onHide?: (ref: string) => void;
  lang: Lang;
}

const texts = strings({
  es: {
    photoAlt: (title: string) => `${title}, foto principal`,
    photosSoon: 'Fotos próximamente',
    hideAria: (title: string) => `Descartar ${title}`,
    hideHint: 'Descartar: lo quita de la lista. Puedes recuperarlo arriba.',
    hide: 'Descartar',
    priceAsk: 'Precio a consultar',
    isNew: 'Nuevo',
    drop: (before: string, drop: string) => `Antes ${before} · ha bajado ${drop}`,
    heading: (type: string, zone: string) => `${type} en ${zone}`,
    whatsappAria: (title: string) => `Preguntar por ${title} por WhatsApp`,
    callAria: (title: string) => `Llamar a Conroma para preguntar por ${title}`,
    call: 'Llamar',
  },
  en: {
    photoAlt: (title: string) => `${title}, main photo`,
    photosSoon: 'Photos coming soon',
    hideAria: (title: string) => `Hide ${title}`,
    hideHint: 'Hide: takes it off the list. You can bring it back from the top.',
    hide: 'Hide',
    priceAsk: 'Price on request',
    isNew: 'New',
    drop: (before: string, drop: string) => `Was ${before} · down ${drop}`,
    heading: (type: string, zone: string) => `${type} in ${zone}`,
    whatsappAria: (title: string) => `Ask about ${title} on WhatsApp`,
    callAria: (title: string) => `Call Conroma to ask about ${title}`,
    call: 'Call',
  },
  ca: {
    photoAlt: (title: string) => `${title}, foto principal`,
    photosSoon: 'Fotos aviat',
    hideAria: (title: string) => `Descartar ${title}`,
    hideHint: 'Descartar: el treu de la llista. El pots recuperar a dalt.',
    hide: 'Descartar',
    priceAsk: 'Preu a consultar',
    isNew: 'Nou',
    drop: (before: string, drop: string) => `Abans ${before} · ha baixat ${drop}`,
    heading: (type: string, zone: string) => `${type} a ${zone}`,
    whatsappAria: (title: string) => `Preguntar per WhatsApp sobre ${title}`,
    callAria: (title: string) => `Trucar a Conroma per preguntar per ${title}`,
    call: 'Trucar',
  },
});

export function PropertyCard({ property, townName, origin, eager = false, headingLevel: Heading = 'h3', onHide, lang }: PropertyCardProps) {
  const t = texts[lang];
  const title = propertyTitle(property, lang);
  const url = propertyUrl(property, lang);
  const hasPhotos = (property.images?.length ?? 0) > 0 || property.photos > 0;
  const cardPhoto = property.images?.[0] ? photoSources(property.images[0]) : undefined;
  const drop = property.previousPrice ? property.previousPrice - property.price : 0;
  const facts = cardFacts(property, lang);
  const place = findTown(property.town)?.name ?? townName;

  return (
    <article className="property-card">
      <div className="property-card__media">
        <a className="property-card__photo-link" href={url} aria-label={title}>
          {/* Mismo criterio que PropertyGallery: sin fotos reales, marcador etiquetado en vez de pseudo-foto. */}
          {hasPhotos ? (
            <img
              className="property-card__photo"
              src={cardPhoto?.src ?? `/img/muestra-${property.tone}.svg`}
              srcSet={cardPhoto?.srcset}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              alt={t.photoAlt(title)}
              width="800"
              height="600"
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'auto'}
              decoding="async"
              style={{ viewTransitionName: `foto-${property.ref.toLowerCase()}` }}
            />
          ) : (
            <div className="gallery__empty property-card__photo" style={{ borderRadius: 0 }}>
              <Icon name="camera" />
              <span>{t.photosSoon}</span>
            </div>
          )}
        </a>
        <div className="property-card__tools">
          {onHide && (
            <button
              type="button"
              className="chip chip--on-photo property-card__hide"
              onClick={() => onHide(property.ref)}
              aria-label={t.hideAria(title)}
              /* El icono solo no dice nada: sin el title, nadie sabe qué hace el ojo tachado. */
              title={t.hideHint}
            >
              <Icon name="hide" className="save-button__icon" />
              <span>{t.hide}</span>
            </button>
          )}
          <FavoriteToggle propertyRef={property.ref} lang={lang} />
        </div>
      </div>
      <div className="property-card__body">
        <div className="property-card__top">
          <p className="property-card__price">
            {hasPublicPrice(property) ? (
              <data value={property.price}>{formatPrice(property.price, lang)}</data>
            ) : (
              <span className="property-card__price--ask">{t.priceAsk}</span>
            )}
          </p>
          <span className="property-card__ref">
            {isNewListing(property) && <span className="tag-new">{t.isNew}</span>}
            {`Ref. ${property.ref}`}
          </span>
        </div>
        {drop > 0 && property.previousPrice && (
          <p className="property-card__drop">
            {t.drop(formatPrice(property.previousPrice, lang), formatPrice(drop, lang))}
          </p>
        )}
        <Heading className="property-card__title">
          <a href={url}>
            {t.heading(typeLabel(property.type, lang), property.zone)}
          </a>
        </Heading>
        {/* El pueblo del propio inmueble (townName si no está en el catálogo). Si la zona ya
            es el pueblo («Bungalow en Malgrat de Mar»), no se repite. */}
        {place !== property.zone && <p className="property-card__place">{place}</p>}
        {facts.length > 0 && (
          <ul className="property-card__facts">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        )}
        <div className="property-card__actions">
          <a
            className="button button--ink button--small"
            href={whatsappUrl(lang, { propertyRef: property.ref, propertyTitle: title })}
            data-contact="whatsapp"
            data-origin={origin}
            data-ref={property.ref}
            aria-label={t.whatsappAria(title)}
          >
            <Icon name="whatsapp" className="button__icon" />
            WhatsApp
          </a>
          <a
            className="text-link text-link--quiet"
            href={phoneUrl()}
            data-contact="llamada"
            data-origin={origin}
            data-ref={property.ref}
            aria-label={t.callAria(title)}
          >
            {t.call}
          </a>
        </div>
      </div>
    </article>
  );
}
