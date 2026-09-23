import { CodigoIdioma } from './idioma';

export interface Moneda {
  codigo: string;
  locale: string;
  decimales: string;
}

export const MONEDA_BASE: Moneda = { codigo: 'COP', locale: 'es-CO', decimales: '1.0-0' };

export const MONEDA_POR_IDIOMA: Record<CodigoIdioma, Moneda | null> = {
  es: null,                                                    // moneda base, sin conversión
  en: { codigo: 'USD', locale: 'en-US', decimales: '1.2-2' },
  fr: { codigo: 'EUR', locale: 'fr-FR', decimales: '1.2-2' },
  it: { codigo: 'EUR', locale: 'it-IT', decimales: '1.2-2' },
  pt: { codigo: 'EUR', locale: 'pt-PT', decimales: '1.2-2' }
};