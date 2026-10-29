import type { Property } from '../data/properties';
import { propertyTitle, propertyUrl } from '../data/properties';
import { formatPrice } from '../lib/format';
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

export function PropertyCard({ property, townName, origin, eager = false, headingLevel: Heading = 'h3', onHide }: PropertyCardProps) {
  const title = propertyTitle(property);
  const url = propertyUrl(property);
  const drop = property.previousPrice ? property.previousPrice - property.price : 0;

  return (
    <article className="property-card">
      <div className="property-card__media">
        <a className="property-card__photo-link" href={url} aria-label={title}>
          <img
            className="property-card__photo"
            src={property.images?.[0] ?? `/img/muestra-${property.tone}.svg`}
            alt={`${title}, foto principal`}
            width="1200"
            height="900"
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            decoding="async"
            style={{ viewTransitionName: `foto-${property.ref.toLowerCase()}` }}
          />
        </a>
        <span className="tag property-card__tag">{property.tag}</span>
        <div className="property-card__tools">
          {onHide && (
            <button
              type="button"
              className="chip chip--on-photo property-card__hide"
              onClick={() => onHide(property.ref)}
              aria-label={`Descartar ${title}`}
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
            <data value={property.price}>{formatPrice(property.price)}</data>
          </p>
          <span className="property-card__ref">{`Ref. ${property.ref}`}</span>
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
        <p className="property-card__place">
          <Icon name="pin" className="property-card__pin" />
          {townName}
        </p>
        <ul className="property-card__facts">
          <li>{`${property.rooms} ${property.rooms === 1 ? 'habitación' : 'habitaciones'}`}</li>
          <li>{`${property.baths} ${property.baths === 1 ? 'baño' : 'baños'}`}</li>
          <li>{`${property.area} m²`}</li>
        </ul>
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
            className="button button--ghost button--small"
            href={phoneUrl()}
            data-contact="llamada"
            data-origin={origin}
            data-ref={property.ref}
            aria-label={`Llamar a Conroma para preguntar por ${title}`}
          >
            <Icon name="phone" className="button__icon" />
            Llamar
          </a>
        </div>
      </div>
    </article>
  );
}
