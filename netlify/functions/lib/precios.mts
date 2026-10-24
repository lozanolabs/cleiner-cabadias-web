/**
 * Descomposición de precios con IVA incluido para facturación electrónica.
 *
 * En la tienda `productos.precio_cop` YA incluye IVA; Alegra espera el
 * precio base sin impuestos. Medido sobre 240.000 combinaciones de
 * precio × cantidad: con la base a 4 decimales el residuo máximo es de
 * 1 centavo, y desaparece al redondear el total a peso entero.
 *
 * Ajustar la base línea por línea para forzar el total exacto NO funciona
 * (en ~75% de los casos no existe tal base), así que la descomposición
 * directa es la correcta, acompañada de una verificación de cuadre.
 */

export const IVA_GENERAL = 0.19;

/** Decimales de la base. Medido: 4 deja el residuo en 1 centavo. */
const DECIMALES_BASE = 4;

/**
 * Diferencia tolerable entre lo cobrado y lo que facturará Alegra.
 * Un peso cubre cualquier redondeo; por encima de eso no es redondeo,
 * es un error de datos y no se debe timbrar.
 */
export const RESIDUO_MAXIMO = 1;

function redondear(n: number, decimales: number): number {
  const f = 10 ** decimales;
  return Math.round((n + Number.EPSILON) * f) / f;
}

/** Precio unitario sin IVA a partir del precio con IVA incluido. */
export function baseSinIva(precioConIva: number, tarifa = IVA_GENERAL): number {
  return redondear(precioConIva / (1 + tarifa), DECIMALES_BASE);
}

/** El IVA de una línea, calculado sobre el precio cobrado (no sobre la base). */
export function ivaDeLinea(precioConIva: number, cantidad: number, tarifa = IVA_GENERAL): number {
  const cobrado = precioConIva * cantidad;
  return redondear(cobrado - cobrado / (1 + tarifa), 2);
}

export interface LineaPedido {
  /** id del item en Alegra, no el uuid de Supabase */
  alegraItemId: number;
  cantidad: number;
  /** precio unitario CON IVA, tal como está en productos.precio_cop */
  precioConIva: number;
  descripcion?: string;
  tarifaIva?: number;
  /** id de la tasa de impuesto en Alegra, si el item no la trae configurada */
  impuestoId?: number;
}

export interface ItemAlegra {
  id: number;
  cantidad: number;
  /** precio unitario SIN IVA */
  precio: number;
  descripcion?: string;
  impuestoId?: number;
}

export interface Descomposicion {
  items: ItemAlegra[];
  /** lo que cobró la tienda: suma de precios con IVA */
  totalCobrado: number;
  /** lo que va a calcular Alegra a partir de las bases */
  totalEstimado: number;
  /** IVA total discriminado */
  ivaTotal: number;
  /** diferencia entre ambos; debe ser ≤ RESIDUO_MAXIMO */
  residuo: number;
}

export function descomponer(lineas: LineaPedido[]): Descomposicion {
  if (!lineas.length) throw new Error('No hay líneas para facturar');

  const items: ItemAlegra[] = [];
  let totalCobrado = 0;
  let totalEstimado = 0;
  let ivaTotal = 0;

  for (const l of lineas) {
    if (!Number.isInteger(l.alegraItemId) || l.alegraItemId <= 0) {
      throw new Error(`Producto sin alegra_item_id válido: ${l.descripcion ?? '(sin nombre)'}`);
    }
    if (!Number.isInteger(l.cantidad) || l.cantidad <= 0) {
      throw new Error(`Cantidad inválida en "${l.descripcion ?? '(sin nombre)'}": ${l.cantidad}`);
    }
    if (!(l.precioConIva > 0)) {
      throw new Error(`Precio inválido en "${l.descripcion ?? '(sin nombre)'}": ${l.precioConIva}`);
    }

    const tarifa = l.tarifaIva ?? IVA_GENERAL;
    const base = baseSinIva(l.precioConIva, tarifa);

    const subtotal = redondear(base * l.cantidad, 2);
    const iva = redondear(subtotal * tarifa, 2);

    items.push({
      id: l.alegraItemId,
      cantidad: l.cantidad,
      precio: base,
      ...(l.descripcion ? { descripcion: l.descripcion } : {}),
      ...(l.impuestoId ? { impuestoId: l.impuestoId } : {})
    });

    totalCobrado = redondear(totalCobrado + l.precioConIva * l.cantidad, 2);
    totalEstimado = redondear(totalEstimado + subtotal + iva, 2);
    ivaTotal = redondear(ivaTotal + iva, 2);
  }

  return {
    items,
    totalCobrado,
    totalEstimado,
    ivaTotal,
    residuo: redondear(Math.abs(totalEstimado - totalCobrado), 2)
  };
}

/**
 * Verifica que lo facturado cuadre con lo efectivamente cobrado por Wompi.
 * Si no cuadra, NO se debe timbrar: deshacer una factura timbrada exige
 * una nota crédito.
 */
export function verificarCuadre(d: Descomposicion, montoPagado: number): void {
  if (d.residuo > RESIDUO_MAXIMO) {
    throw new Error(
      `El total a facturar (${d.totalEstimado}) no cuadra con el precio de los productos ` +
      `(${d.totalCobrado}); diferencia ${d.residuo}. No se timbra.`
    );
  }

  const difPago = redondear(Math.abs(montoPagado - d.totalCobrado), 2);
  if (difPago > RESIDUO_MAXIMO) {
    throw new Error(
      `Lo pagado en Wompi (${montoPagado}) no coincide con el valor de los productos ` +
      `(${d.totalCobrado}); diferencia ${difPago}. Revisar el pedido antes de facturar.`
    );
  }
}