import { CodigoIdioma } from './idioma';

type Traduccion = Record<CodigoIdioma, string>;

export const TEXTOS = {
  // ── Menú y encabezado ──────────────────────────────
  'menu.tienda':        { es: 'Tienda', en: 'Shop', fr: 'Boutique', it: 'Negozio', pt: 'Loja' },
  'menu.proposito':     { es: '¿Por qué lo hacemos?', en: 'Why we do it', fr: 'Pourquoi nous le faisons', it: 'Perché lo facciamo', pt: 'Por que fazemos isso' },
  'menu.abrir':         { es: 'Abrir menú', en: 'Open menu', fr: 'Ouvrir le menu', it: 'Apri menu', pt: 'Abrir menu' },
  'menu.cerrar':        { es: 'Cerrar menú', en: 'Close menu', fr: 'Fermer le menu', it: 'Chiudi menu', pt: 'Fechar menu' },
  'idioma.seleccionar': { es: 'Seleccionar idioma', en: 'Select language', fr: 'Choisir la langue', it: 'Seleziona lingua', pt: 'Selecionar idioma' },

  // ── Catálogo ───────────────────────────────────────
  'catalogo.productos': { es: 'productos', en: 'products', fr: 'produits', it: 'prodotti', pt: 'produtos' },
  'catalogo.vacio':     { es: 'No hay productos en esta categoría todavía.', en: 'No products in this category yet.', fr: 'Aucun produit dans cette catégorie.', it: 'Nessun prodotto in questa categoria.', pt: 'Ainda não há produtos nesta categoria.' },
  'catalogo.error':     { es: 'No pudimos cargar los productos. Intenta de nuevo en un momento.', en: 'We couldn\'t load the products. Please try again shortly.', fr: 'Impossible de charger les produits. Réessayez dans un instant.', it: 'Impossibile caricare i prodotti. Riprova tra poco.', pt: 'Não conseguimos carregar os produtos. Tente novamente em instantes.' },
  'catalogo.verTodo':   { es: 'Ver todo el catálogo', en: 'View all products', fr: 'Voir tout le catalogue', it: 'Vedi tutto il catalogo', pt: 'Ver todo o catálogo' },

  // ── Producto ───────────────────────────────────────
  'producto.talla':        { es: 'Talla', en: 'Size', fr: 'Taille', it: 'Taglia', pt: 'Tamanho' },
  'producto.agregar':      { es: 'Agregar al carrito', en: 'Add to cart', fr: 'Ajouter au panier', it: 'Aggiungi al carrello', pt: 'Adicionar ao carrinho' },
  'producto.elijaTalla':   { es: 'Elige una talla', en: 'Select a size', fr: 'Choisissez une taille', it: 'Scegli una taglia', pt: 'Escolha um tamanho' },
  'producto.agregado':     { es: 'Producto agregado.', en: 'Added to cart.', fr: 'Ajouté au panier.', it: 'Aggiunto al carrello.', pt: 'Adicionado ao carrinho.' },
  'producto.noExiste':     { es: 'No encontramos este producto.', en: 'We couldn\'t find this product.', fr: 'Produit introuvable.', it: 'Prodotto non trovato.', pt: 'Produto não encontrado.' },
  'producto.volverTienda': { es: 'Volver a la tienda', en: 'Back to shop', fr: 'Retour à la boutique', it: 'Torna al negozio', pt: 'Voltar à loja' },
  'producto.sumarUno':     { es: 'Aumentar cantidad', en: 'Increase quantity', fr: 'Augmenter la quantité', it: 'Aumenta quantità', pt: 'Aumentar quantidade' },
  'producto.quitarUno':    { es: 'Disminuir cantidad', en: 'Decrease quantity', fr: 'Diminuer la quantité', it: 'Diminuisci quantità', pt: 'Diminuir quantidade' },

  // ── Carrito ────────────────────────────────────────
  'carrito.ver':             { es: 'Ver carrito', en: 'View cart', fr: 'Voir le panier', it: 'Vedi carrello', pt: 'Ver carrinho' },
  'carrito.titulo':          { es: 'Mi carrito', en: 'My cart', fr: 'Mon panier', it: 'Il mio carrello', pt: 'Meu carrinho' },
  'carrito.vacio':           { es: 'Tu carrito está vacío.', en: 'Your cart is empty.', fr: 'Votre panier est vide.', it: 'Il tuo carrello è vuoto.', pt: 'Seu carrinho está vazio.' },
  'carrito.articulos':       { es: 'artículos', en: 'items', fr: 'articles', it: 'articoli', pt: 'itens' },
  'carrito.resumen':         { es: 'Resumen del pedido', en: 'Order summary', fr: 'Récapitulatif', it: 'Riepilogo ordine', pt: 'Resumo do pedido' },
  'carrito.subtotal':        { es: 'Subtotal', en: 'Subtotal', fr: 'Sous-total', it: 'Subtotale', pt: 'Subtotal' },
  'carrito.envio':           { es: 'Envío', en: 'Shipping', fr: 'Livraison', it: 'Spedizione', pt: 'Envio' },
  'carrito.envioNota':       { es: 'Se calcula al pagar', en: 'Calculated at checkout', fr: 'Calculé au paiement', it: 'Calcolato al pagamento', pt: 'Calculado no pagamento' },
  'carrito.finalizar':       { es: 'Finalizar compra', en: 'Checkout', fr: 'Commander', it: 'Completa l\'ordine', pt: 'Finalizar compra' },
  'carrito.seguirComprando': { es: 'Seguir comprando', en: 'Continue shopping', fr: 'Continuer mes achats', it: 'Continua lo shopping', pt: 'Continuar comprando' },
  'carrito.eliminar':        { es: 'Eliminar producto', en: 'Remove item', fr: 'Retirer l\'article', it: 'Rimuovi articolo', pt: 'Remover produto' },
  'carrito.irTienda':        { es: 'Ir a la tienda', en: 'Go to shop', fr: 'Aller à la boutique', it: 'Vai al negozio', pt: 'Ir para a loja' },

  // ── Pie de página ──────────────────────────────────
  'pie.lema':       { es: 'Moda con identidad. Diseño colombiano que cruza fronteras.', en: 'Fashion with identity. Colombian design that crosses borders.', fr: 'Une mode avec identité. Un design colombien qui traverse les frontières.', it: 'Moda con identità. Design colombiano che attraversa i confini.', pt: 'Moda com identidade. Design colombiano que cruza fronteiras.' },
  'pie.marca':      { es: 'La marca', en: 'The brand', fr: 'La marque', it: 'Il marchio', pt: 'A marca' },
  'pie.ayuda':      { es: 'Ayuda', en: 'Help', fr: 'Aide', it: 'Aiuto', pt: 'Ajuda' },
  'pie.contacto':   { es: 'Contáctanos', en: 'Contact us', fr: 'Nous contacter', it: 'Contattaci', pt: 'Fale conosco' },
  'pie.envios':     { es: 'Envíos y devoluciones', en: 'Shipping & returns', fr: 'Livraison et retours', it: 'Spedizioni e resi', pt: 'Envios e devoluções' },
  'pie.terminos':   { es: 'Términos y condiciones', en: 'Terms & conditions', fr: 'Conditions générales', it: 'Termini e condizioni', pt: 'Termos e condições' },
  'pie.privacidad': { es: 'Política de privacidad', en: 'Privacy policy', fr: 'Politique de confidentialité', it: 'Informativa sulla privacy', pt: 'Política de privacidade' },
  'pie.derechos':   { es: 'Todos los derechos reservados.', en: 'All rights reserved.', fr: 'Tous droits réservés.', it: 'Tutti i diritti riservati.', pt: 'Todos os direitos reservados.' },
  'pie.hechoPor':   { es: 'Desarrollado por', en: 'Built by', fr: 'Développé par', it: 'Sviluppato da', pt: 'Desenvolvido por' },
  'pie.contactoTitulo': { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatti', pt: 'Contato' },
  'pie.menu':           { es: 'Menú', en: 'Menu', fr: 'Menu', it: 'Menu', pt: 'Menu' },
    // ── Inicio ─────────────────────────────────────────
  'inicio.mujeres':          { es: 'Mujeres', en: 'Women', fr: 'Femmes', it: 'Donne', pt: 'Mulheres' },
  'inicio.mujeresInspirado': { es: 'Inspirado en la mujer Chocoana:', en: 'Inspired by the women of Chocó:', fr: 'Inspiré par la femme du Chocó :', it: 'Ispirato alla donna del Chocó:', pt: 'Inspirado na mulher chocoana:' },
  'inicio.mujeresLema':      { es: 'Una combinación de amor y berraquera.', en: 'A blend of love and fierce determination.', fr: 'Un mélange d\'amour et de caractère.', it: 'Un insieme di amore e grinta.', pt: 'Uma combinação de amor e garra.' },
  'inicio.hombres':          { es: 'Hombres', en: 'Men', fr: 'Hommes', it: 'Uomini', pt: 'Homens' },
  'inicio.hombresInspirado': { es: 'Inspirado en el hombre Chocoano:', en: 'Inspired by the men of Chocó:', fr: 'Inspiré par l\'homme du Chocó :', it: 'Ispirato all\'uomo del Chocó:', pt: 'Inspirado no homem chocoano:' },
  'inicio.hombresLema':      { es: 'Una muestra de entereza y determinación.', en: 'A show of strength and determination.', fr: 'Une démonstration de force et de détermination.', it: 'Una dimostrazione di forza e determinazione.', pt: 'Uma demonstração de firmeza e determinação.' },
  'inicio.comprar':          { es: 'Comprar', en: 'Shop now', fr: 'Acheter', it: 'Acquista', pt: 'Comprar' },
    // ── Horario ────────────────────────────────────────
  'horario.ante':        { es: 'Nuestro Horario de Atención', en: 'Our opening hours', fr: 'Nos horaires d\'ouverture', it: 'I nostri orari', pt: 'Nosso horário de atendimento' },
  'horario.titulo':      { es: 'Planea tu visita: en nuestro horario', en: 'Plan your visit: within our hours', fr: 'Planifiez votre visite : pendant nos horaires', it: 'Pianifica la tua visita nei nostri orari', pt: 'Planeje sua visita dentro do nosso horário' },
  'horario.semana':      { es: 'Lunes a Viernes', en: 'Monday to Friday', fr: 'Du lundi au vendredi', it: 'Da lunedì a venerdì', pt: 'Segunda a sexta' },
  'horario.finDeSemana': { es: 'Sábados y Domingos', en: 'Saturdays and Sundays', fr: 'Samedis et dimanches', it: 'Sabato e domenica', pt: 'Sábados e domingos' },
  'horario.festivos':    { es: 'Festivos', en: 'Public holidays', fr: 'Jours fériés', it: 'Giorni festivi', pt: 'Feriados' },
  'horario.cerrado':     { es: 'Cerrado', en: 'Closed', fr: 'Fermé', it: 'Chiuso', pt: 'Fechado' },
  'horario.escribenos':  { es: '¿Necesitas ayuda? Escríbenos', en: 'Need help? Message us', fr: 'Besoin d\'aide ? Écrivez-nous', it: 'Hai bisogno di aiuto? Scrivici', pt: 'Precisa de ajuda? Fale conosco' },
  'inicio.creando':           { es: 'Estamos creando', en: 'We are creating', fr: 'Nous créons', it: 'Stiamo creando', pt: 'Estamos criando' },
  'inicio.leerMas':           { es: 'Leer más', en: 'Read more', fr: 'En savoir plus', it: 'Scopri di più', pt: 'Saiba mais' },
  'inicio.propositoExtracto': { es: 'En 1994 empezamos a trabajar con mi madre en una máquina de coser casera Singer a pedal, debido a que no teníamos energía…', en: 'In 1994 we started working with my mother on a pedal-powered Singer sewing machine, because we had no electricity…', fr: 'En 1994, nous avons commencé à travailler avec ma mère sur une machine à coudre Singer à pédale, car nous n\'avions pas d\'électricité…', it: 'Nel 1994 abbiamo iniziato a lavorare con mia madre su una macchina da cucire Singer a pedali, perché non avevamo elettricità…', pt: 'Em 1994 começamos a trabalhar com minha mãe em uma máquina de costura Singer a pedal, porque não tínhamos energia…' },
} as const satisfies Record<string, Traduccion>;

export type ClaveTexto = keyof typeof TEXTOS;