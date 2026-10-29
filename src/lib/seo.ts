import { site } from '../data/site';
import type { Property } from '../data/properties';
import { propertyTitle, propertyUrl } from '../data/properties';
import type { FaqItem } from '../data/faq';
import { findTown } from '../data/towns';

export const locales = ['es', 'ca', 'en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const publishedLocales: Locale[] = ['es'];

export interface Crumb {
  name: string;
  path: string;
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export function pageTitle(title: string): string {
  return title.includes(site.name) ? title : `${title} | ${site.name}`;
}

export function alternates(path: string, translations: Partial<Record<Locale, string>> = {}) {
  const available = { es: path, ...translations } as Partial<Record<Locale, string>>;
  const links = publishedLocales
    .filter((locale) => available[locale])
    .map((locale) => ({ hreflang: locale as string, href: absoluteUrl(available[locale] as string) }));
  if (links.length < 2) return [];
  return [...links, { hreflang: 'x-default', href: absoluteUrl(path) }];
}

export function agentSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${site.url}/#agencia`,
    name: site.legalName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl('/brand/conroma-logo.svg'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: ['Malgrat de Mar', 'Blanes', 'Tordera', 'Pineda de Mar', 'Santa Susanna', 'Palafolls', 'Calella', 'Lloret de Mar'],
    knowsLanguage: ['ca', 'es', 'en', 'fr'],
    sameAs: [...site.instagram.map((account) => account.url), ...(site.tiktok ? [site.tiktok] : [])],
    hasMap: site.mapsUrl,
  };
  if (site.geo) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude };
  }
  if (site.openingHours) {
    schema.openingHoursSpecification = site.openingHours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    }));
  }
  return schema;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function collectionPageSchema(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(path),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function listingSchema(property: Property) {
  const town = findTown(property.town)?.name ?? property.town;
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyTitle(property),
    url: absoluteUrl(propertyUrl(property)),
    description: property.description,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${site.url}/#agencia` },
    },
    mainEntity: {
      '@type': property.type === 'Casa' ? 'House' : 'Apartment',
      numberOfRooms: property.rooms,
      numberOfBathroomsTotal: property.baths,
      floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: town,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
    },
  };
}

export function articleSchema(post: { title: string; description: string; date: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: 'es',
    mainEntityOfPage: absoluteUrl(`/es/blog/${post.slug}/`),
    author: { '@id': `${site.url}/#agencia` },
    publisher: { '@id': `${site.url}/#agencia` },
  };
}
