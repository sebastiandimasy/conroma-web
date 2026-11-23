import { site } from '../data/site';
import type { Property } from '../data/properties';
import { countLabel, hasPublicPrice, propertyTitle, propertyUrl } from '../data/properties';
import type { FaqItem } from '../data/faq';
import { findTown } from '../data/towns';
import { team } from '../data/team';

import { defaultLang, intlLocale, languages, localizePath, strings, type Lang } from '../i18n';
import { formatPrice } from './format';

export interface Crumb {
  name: string;
  path: string;
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export function pageTitle(title: string): string {
  if (title.includes(site.name)) return title;
  const branded = `${title} | ${site.name}`;
  // Google corta hacia los 60 caracteres: si no cabe la marca, se sacrifica la marca y no el contenido.
  return branded.length <= 60 ? branded : title;
}

/** hreflang recíprocos: la misma página en cada idioma, y x-default a la versión en español. */
export function alternates(path: string) {
  if (localizePath(path, defaultLang) === path && !path.startsWith(`/${defaultLang}/`)) return [];
  const links = languages.map((lang: Lang) => ({ hreflang: lang as string, href: absoluteUrl(localizePath(path, lang)) }));
  return [...links, { hreflang: 'x-default', href: absoluteUrl(localizePath(path, defaultLang)) }];
}

/** Textos de los schemas que lee Google (no se ven en la página, pero van en su idioma). */
const schemaText = strings({
  es: {
    founderJob: 'CEO y fundador',
    agencyDescription:
      'Inmobiliaria familiar en Malgrat de Mar (Alt Maresme): compraventa y alquiler de viviendas, gestión de patrimonio y reformas en el Maresme y la Costa Brava.',
  },
  en: {
    founderJob: 'CEO and founder',
    agencyDescription:
      'Family-run estate agency in Malgrat de Mar (Alt Maresme): buying, selling and renting homes, property portfolio management and renovations across the Maresme and the Costa Brava.',
  },
  ca: {
    founderJob: 'CEO i fundador',
    agencyDescription:
      "Immobiliària familiar a Malgrat de Mar (Alt Maresme): compravenda i lloguer d'habitatges, gestió de patrimoni i reformes al Maresme i la Costa Brava.",
  },
});

export function founderSchema(lang: Lang) {
  if (!site.ceo) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.url}/#fundador`,
    name: site.ceo.name,
    jobTitle: schemaText[lang].founderJob,
    url: absoluteUrl(localizePath('/es/equipo/', lang)),
    image: absoluteUrl('/img/equipo/boris.jpg'),
    worksFor: { '@id': `${site.url}/#agencia` },
    knowsLanguage: ['ca', 'es', 'en', 'fr'],
  };
}

/** Personas del equipo (el fundador ya va en el grafo del sitio con su propio @id). */
export function teamSchema(lang: Lang) {
  return team[lang]
    .filter((member) => member.name !== site.ceo?.name)
    .map((member) => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      image: absoluteUrl(member.photo),
      worksFor: { '@id': `${site.url}/#agencia` },
    }));
}

export function agentSchema(lang: Lang) {
  const phones = [
    { telephone: site.phone, contactType: 'customer service' },
    { telephone: site.landline, contactType: 'sales' },
  ].filter((p) => p.telephone);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${site.url}/#agencia`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    telephone: [site.phone, site.landline].filter(Boolean),
    email: site.email,
    image: absoluteUrl('/img/og-conroma.jpg'),
    logo: absoluteUrl('/img/og-conroma.jpg'), // shortcut: solo hay logo SVG; raster del equipo hasta tener un PNG del logotipo
    description: schemaText[lang].agencyDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    contactPoint: phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.telephone,
      contactType: p.contactType,
      email: site.email,
      areaServed: 'ES',
      availableLanguage: ['Catalan', 'Spanish', 'English', 'French'],
    })),
    areaServed: SERVICE_AREA.map((name) => ({ '@type': 'City', name })),
    knowsLanguage: ['ca', 'es', 'en', 'fr'],
    sameAs: [...site.instagram.map((account) => account.url), ...(site.tiktok ? [site.tiktok] : [])],
    hasMap: site.mapsUrl,
  };
  if (site.ceo) {
    schema.founder = { '@id': `${site.url}/#fundador` };
    schema.employee = { '@id': `${site.url}/#fundador` };
  }
  // Nota: NO emitimos aggregateRating. Son reseñas propias de Google (self-serving),
  // que Google no muestra como rich result y puede ignorar/penalizar. El 4,7/122 vive
  // en el texto visible, no en el schema.
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

/** Grafo global (WebSite + agencia + fundador), emitido en todas las páginas con @id estables. */
export function siteGraph(lang: Lang) {
  const nodes = [websiteSchema(), agentSchema(lang), founderSchema(lang)].filter(Boolean) as Record<string, unknown>[];
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map(({ '@context': _ctx, ...rest }) => rest),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: languages.map((lang) => intlLocale[lang]),
    publisher: { '@id': `${site.url}/#agencia` },
  };
}

const SERVICE_AREA = ['Malgrat de Mar', 'Santa Susanna', 'Pineda de Mar', 'Calella', 'Palafolls', 'Blanes', 'Lloret de Mar', 'Tordera'];

export function serviceSchema(name: string, description: string, path: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    provider: { '@id': `${site.url}/#agencia` },
    areaServed: SERVICE_AREA,
    url: absoluteUrl(localizePath(path, lang)),
  };
}

/** Las rutas de las migas vienen en español (`/es/...`): aquí se pasan al idioma de la página. */
export function breadcrumbSchema(crumbs: Crumb[], lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(localizePath(crumb.path, lang)),
    })),
  };
}

export function collectionPageSchema(name: string, path: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(localizePath(path, lang)),
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

/**
 * Antes todo lo que no fuera "Casa" se declaraba `Apartment`: terrenos, locales,
 * parkings y restaurantes iban a Google como pisos. Cada tipo con lo suyo.
 */
const HOUSE_TYPES = new Set([
  'Casa',
  'Casa adosada',
  'Casa unifamiliar',
  'Casa de campo',
  'Casa cueva',
  'Chalet',
  'Chalet unifamiliar',
  'Bungalow',
  'Masia',
]);
const APARTMENT_TYPES = new Set(['Piso', 'Ático', 'Dúplex']);

function listingEntityType(type: string): 'House' | 'Apartment' | 'Place' {
  if (HOUSE_TYPES.has(type)) return 'House';
  if (APARTMENT_TYPES.has(type)) return 'Apartment';
  return 'Place';
}

export function listingSchema(property: Property, lang: Lang) {
  const town = findTown(property.town)?.name ?? property.town;
  const entityType = listingEntityType(property.type);
  const isAccommodation = entityType !== 'Place';

  const address = {
    '@type': 'PostalAddress',
    addressLocality: town,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  };

  const mainEntity: Record<string, unknown> = {
    '@type': entityType,
    floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' },
    address,
  };
  // Habitaciones y baños solo tienen sentido en vivienda: un terreno con
  // "0 habitaciones" es ruido para Google y para quien lee el resultado.
  if (isAccommodation) {
    mainEntity.numberOfRooms = property.rooms;
    mainEntity.numberOfBathroomsTotal = property.baths;
  }

  // El inventario usa 10 € como "precio a consultar": no se publica como oferta.
  const offers = hasPublicPrice(property)
    ? {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${site.url}/#agencia` },
      }
    : undefined;

  // Sin descripción propia, resumen factual con los datos del inventario.
  const parts = [
    propertyTitle(property, lang),
    `${property.area} m²`,
    ...(isAccommodation ? [countLabel(property.rooms, 'room', lang)] : []),
    ...(hasPublicPrice(property) ? [formatPrice(property.price, lang)] : []),
  ];
  // La descripción de Habitatsoft está en español: en en/ca, la suya si el feed la trae y si no el resumen.
  const ownDescription = lang === 'es' ? property.description : property.descriptions?.[lang];
  const description = ownDescription?.trim() || `${parts.join(', ')}.`;
  const images = (property.images ?? []).filter((src) => !src.endsWith('.svg')).map((src) => absoluteUrl(src));
  if (property.geo) {
    mainEntity.geo = { '@type': 'GeoCoordinates', latitude: property.geo.latitude, longitude: property.geo.longitude };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyTitle(property, lang),
    url: absoluteUrl(propertyUrl(property, lang)),
    inLanguage: lang,
    description,
    ...(images.length ? { image: images } : {}),
    ...(offers ? { offers } : {}),
    mainEntity,
  };
}

/** VideoObject del vídeo propio (reel de Instagram alojado en la web) de un artículo del blog. */
export function videoSchema(
  post: { description: string; slug: string },
  video: { file: string; title: string; uploaded: string; seconds: number },
  thumbnailPath: string,
  lang: Lang,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: post.description,
    thumbnailUrl: absoluteUrl(thumbnailPath),
    uploadDate: video.uploaded,
    duration: `PT${video.seconds}S`,
    contentUrl: absoluteUrl(`/video/${video.file}.mp4`),
    url: absoluteUrl(`/${lang}/blog/${post.slug}/`),
    // El reel está grabado en español en las tres versiones de la página: es el idioma del vídeo.
    inLanguage: 'es',
    publisher: { '@id': `${site.url}/#agencia` },
  };
}

export function articleSchema(post: { title: string; description: string; date: string; updated?: string; slug: string }, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: absoluteUrl('/img/og-conroma.jpg'),
    inLanguage: lang,
    mainEntityOfPage: absoluteUrl(`/${lang}/blog/${post.slug}/`),
    author: site.ceo ? { '@id': `${site.url}/#fundador` } : { '@id': `${site.url}/#agencia` },
    publisher: { '@id': `${site.url}/#agencia` },
  };
}
