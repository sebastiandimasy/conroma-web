import type { Property } from '../data/properties';
import { cardFacts, hasPublicPrice, propertyTitle, propertyUrl } from '../data/properties';
import { findTown } from '../data/towns';
import { formatPrice } from '../lib/format';
import { isNewListing } from '../lib/inventory';
import { phoneUrl, whatsappUrl } from '../lib/links';
import { Icon } from './Icon';
import FavoriteToggle from './FavoriteToggle';

interface PropertyCardProps {
  property: Property;
  townName: string;
  origin: string;
  eager?: boolean;
  headingLevel?: 'h2' | 'h3';
  onHide?: (ref: string) => void;
}

// El CDN sirve variantes por ancho (xl 800, 2xl 1024, 3xl 1280); la tarjeta no necesita la maxima.
const cdnSize = (url: string, size: string) => url.replace('/3xl/', `/${size}/`);

export function PropertyCard({ property, townName, origin, eager = false, headingLevel: Heading = 'h3', onHide }: PropertyCardProps) {
  const title = propertyTitle(property);
  const url = propertyUrl(property);
  const hasPhotos = (property.images?.length ?? 0) > 0 || property.photos > 0;
  const cardPhoto = property.images?.[0];
  const drop = property.previousPrice ? property.previousPrice - property.price : 0;
  const facts = cardFacts(property);
  const place = findTown(property.town)?.name ?? townName;

  return (
    <article className="property-card">
      <div className="property-card__media">
        <a className="property-card__photo-link" href={url} aria-label={title}>
          {/* Mismo criterio que PropertyGallery: sin fotos reales, marcador etiquetado en vez de pseudo-foto. */}
          {hasPhotos ? (
            <img
              className="property-card__photo"
              src={cardPhoto ? cdnSize(cardPhoto, 'xl') : `/img/muestra-${property.tone}.svg`}
              srcSet={
                cardPhoto?.includes('/3xl/')
                  ? `${cdnSize(cardPhoto, 'xl')} 800w, ${cdnSize(cardPhoto, '2xl')} 1024w`
                  : undefined
              }
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              alt={`${title}, foto principal`}
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
              <span>Fotos próximamente</span>
            </div>
          )}
        </a>
        <div className="property-card__tools">
          {onHide && (
            <button
              type="button"
              className="chip chip--on-photo property-card__hide"
              onClick={() => onHide(property.ref)}
              aria-label={`Descartar ${title}`}
              /* El icono solo no dice nada: sin el title, nadie sabe qué hace el ojo tachado. */
              title="Descartar: lo quita de la lista. Puedes recuperarlo arriba."
            >
              <Icon name="hide" className="save-button__icon" />
              <span>Descartar</span>
            </button>
          )}
          <FavoriteToggle propertyRef={property.ref} />
        </div>
      </div>
      <div className="property-card__body">
        <div className="property-card__top">
          <p className="property-card__price">
            {hasPublicPrice(property) ? (
              <data value={property.price}>{formatPrice(property.price)}</data>
            ) : (
              <span className="property-card__price--ask">Precio a consultar</span>
            )}
          </p>
          <span className="property-card__ref">
            {isNewListing(property) && <span className="tag-new">Nuevo</span>}
            {`Ref. ${property.ref}`}
          </span>
        </div>
        {drop > 0 && property.previousPrice && (
          <p className="property-card__drop">
            {`Antes ${formatPrice(property.previousPrice)} · ha bajado ${formatPrice(drop)}`}
          </p>
        )}
        <Heading className="property-card__title">
          <a href={url}>
            {`${property.type} en ${property.zone}`}
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
            href={whatsappUrl({ propertyRef: property.ref, propertyTitle: title })}
            data-contact="whatsapp"
            data-origin={origin}
            data-ref={property.ref}
            aria-label={`Preguntar por ${title} por WhatsApp`}
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
            aria-label={`Llamar a Conroma para preguntar por ${title}`}
          >
            Llamar
          </a>
        </div>
      </div>
    </article>
  );
}
