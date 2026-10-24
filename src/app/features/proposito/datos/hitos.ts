import { CodigoIdioma } from '../../../core/i18n/idioma';

export type Multi = Record<CodigoIdioma, string>;
export type Icono = 'personas' | 'maquina' | 'indigena' | 'mayor' | 'reciclaje';

export interface Cifra { icono: Icono; texto: Multi; }

export interface Hito {
  anio: string;
  lado: 'izq' | 'der';
  imagen?: string;
  alt?: Multi;
  cifras?: Cifra[];
  parrafos: Multi[];
}

// ── Cifras reutilizables ────────────────────────────────
const personas = (n: number): Multi => ({
  es: `${n} personas`, en: `${n} people`, fr: `${n} personnes`,
  it: `${n} persone`, pt: `${n} pessoas`
});

const maquinas = (n: number): Multi => ({
  es: `${n} máquinas`, en: `${n} machines`, fr: `${n} machines`,
  it: `${n} macchine`, pt: `${n} máquinas`
});

// ── Línea de tiempo ─────────────────────────────────────
export const HITOS: Hito[] = [
  {
    anio: '1994',
    lado: 'izq',
    parrafos: [{
      es: 'Empezamos a trabajar con mi madre en una <strong>máquina de coser casera Singer a pedal</strong>, debido a que no teníamos energía y de igual manera veníamos del campo en situación de desplazamiento de la vereda Mesopotamia, que pertenece al municipio de Bojayá (Chocó). Motivados por la necesidad de sustento, hacíamos arreglos o remiendo de todo tipo de indumentaria.',
      en: 'We started out working with my mother on a <strong>pedal-powered Singer home sewing machine</strong>, because we had no electricity. We had come from the countryside, displaced from the village of Mesopotamia, in the municipality of Bojayá (Chocó). Driven by the need to make a living, we took in mending and alterations of every kind of garment.',
      fr: "Nous avons commencé à travailler avec ma mère sur une <strong>machine à coudre Singer à pédale</strong>, car nous n'avions pas d'électricité. Nous venions de la campagne, déplacées du hameau de Mesopotamia, dans la municipalité de Bojayá (Chocó). Poussées par la nécessité de subvenir à nos besoins, nous faisions des retouches et des réparations sur toutes sortes de vêtements.",
      it: 'Abbiamo iniziato a lavorare con mia madre su una <strong>macchina da cucire Singer a pedale</strong>, perché non avevamo elettricità. Venivamo dalla campagna, sfollate dalla frazione di Mesopotamia, nel comune di Bojayá (Chocó). Spinte dalla necessità di sostentamento, facevamo riparazioni e rammendi di ogni tipo di indumento.',
      pt: 'Começámos a trabalhar com a minha mãe numa <strong>máquina de costura Singer a pedal</strong>, porque não tínhamos eletricidade. Vínhamos do campo, deslocadas da aldeia de Mesopotamia, no município de Bojayá (Chocó). Movidas pela necessidade de sustento, fazíamos arranjos e remendos em todo o tipo de vestuário.'
    }]
  },

  {
    anio: '1998',
    lado: 'izq',
    imagen: 'assets/hito-1998.jpg',
    alt: {
      es: 'Cleiner Cabadías junto a su madre',
      en: 'Cleiner Cabadías with her mother',
      fr: 'Cleiner Cabadías avec sa mère',
      it: 'Cleiner Cabadías con sua madre',
      pt: 'Cleiner Cabadías com a sua mãe'
    },
    parrafos: [{
      es: 'En 1998 me convertí en la modista de mis compañeras de colegio y del barrio donde vivía.',
      en: 'In 1998 I became the dressmaker for my schoolmates and for the neighbourhood where I lived.',
      fr: 'En 1998, je suis devenue la couturière de mes camarades de classe et du quartier où je vivais.',
      it: 'Nel 1998 sono diventata la sarta delle mie compagne di scuola e del quartiere in cui vivevo.',
      pt: 'Em 1998 tornei-me a costureira das minhas colegas de escola e do bairro onde vivia.'
    }]
  },

  {
    anio: '2000',
    lado: 'der',
    imagen: 'assets/hito-2000.jpg',
    alt: {
      es: 'Cleiner Cabadías en su taller de confección',
      en: 'Cleiner Cabadías in her sewing workshop',
      fr: 'Cleiner Cabadías dans son atelier de couture',
      it: 'Cleiner Cabadías nel suo laboratorio di sartoria',
      pt: 'Cleiner Cabadías na sua oficina de costura'
    },
    parrafos: [{
      es: 'Inicié a trabajar para un prestigioso almacén de modas en Quibdó, donde me di a conocer por los consumidores de moda, pero al mismo tiempo seguía en casa con mi madre en el pequeño taller.',
      en: 'I began working for a well-known fashion store in Quibdó, where I made a name for myself among fashion buyers, while still working at home with my mother in our small workshop.',
      fr: "J'ai commencé à travailler pour une boutique de mode réputée à Quibdó, où je me suis fait connaître des acheteurs, tout en continuant à travailler à la maison avec ma mère dans notre petit atelier.",
      it: 'Ho iniziato a lavorare per un noto negozio di moda a Quibdó, dove mi sono fatta conoscere dagli acquirenti, continuando allo stesso tempo a lavorare a casa con mia madre nel nostro piccolo laboratorio.',
      pt: 'Comecei a trabalhar para uma conceituada loja de moda em Quibdó, onde me dei a conhecer junto dos compradores, continuando ao mesmo tempo a trabalhar em casa com a minha mãe na pequena oficina.'
    }]
  },

  {
    anio: '2005',
    lado: 'izq',
    imagen: 'assets/hito-2005.jpg',
    alt: {
      es: 'Publicación de prensa sobre la marca',
      en: 'Press coverage of the brand',
      fr: 'Article de presse sur la marque',
      it: 'Articolo di stampa sul marchio',
      pt: 'Publicação de imprensa sobre a marca'
    },
    cifras: [
      { icono: 'personas', texto: personas(3) },
      { icono: 'maquina', texto: maquinas(2) }
    ],
    parrafos: [{
      es: 'En este año me independizo y establezco mi propio negocio en el centro de Quibdó, con registro en cámara de comercio e industria y comercio del municipio de Quibdó. Reutilizamos dos máquinas caseras de una chatarrería; trabajamos mis hermanas, yo y mi madre, quien siempre estuvo ahí. Nuestro trabajo era suficiente para los gastos del hogar y el estudio de las hermanas.',
      en: "This was the year I set out on my own and opened my own business in the centre of Quibdó, registered with the chamber of commerce and the municipal trade registry. We salvaged two home sewing machines from a scrapyard; my sisters, my mother — who was always there — and I worked side by side. What we earned was enough to cover the household and my sisters' schooling.",
      fr: "Cette année-là, je me suis mise à mon compte et j'ai ouvert ma propre entreprise dans le centre de Quibdó, enregistrée à la chambre de commerce et au registre municipal. Nous avons récupéré deux machines à coudre domestiques dans une casse ; mes sœurs, ma mère — toujours présente — et moi travaillions ensemble. Notre travail suffisait à couvrir les dépenses du foyer et les études de mes sœurs.",
      it: "Quell'anno mi sono messa in proprio e ho aperto la mia attività nel centro di Quibdó, registrata presso la camera di commercio e il registro municipale. Abbiamo recuperato due macchine da cucire domestiche da uno sfasciacarrozze; lavoravamo io, le mie sorelle e mia madre, che c'è sempre stata. Il nostro lavoro bastava per le spese di casa e per gli studi delle mie sorelle.",
      pt: 'Nesse ano estabeleci-me por conta própria e abri o meu próprio negócio no centro de Quibdó, registado na câmara de comércio e no registo municipal. Recuperámos duas máquinas de costura domésticas de uma sucata; trabalhávamos eu, as minhas irmãs e a minha mãe, que esteve sempre presente. O nosso trabalho chegava para as despesas da casa e para os estudos das minhas irmãs.'
    }]
  },

  {
    anio: '2008',
    lado: 'der',
    imagen: 'assets/hito-2008.jpg',
    alt: {
      es: 'Desfile con prendas de la marca',
      en: 'Runway show featuring the brand',
      fr: 'Défilé présentant les créations de la marque',
      it: 'Sfilata con i capi del marchio',
      pt: 'Desfile com peças da marca'
    },
    cifras: [
      { icono: 'personas', texto: personas(5) },
      { icono: 'maquina', texto: maquinas(3) }
    ],
    parrafos: [
      {
        es: 'Nuestra primera aparición en los medios se dio en 2008 por un concurso de <strong>RCN</strong> (Diseñadores con Estilo), donde tuve la oportunidad de enviar mis diseños al programa Estilo RCN; nos felicitaron por nuestra destacada participación. En este año me gradué de la universidad como <strong>Administradora de Empresas</strong>. Durante este periodo la ropa que hacíamos era sobre medida y por pedidos de clientes para sus eventos sociales.',
        en: 'Our first appearance in the media came in 2008 through a competition run by <strong>RCN</strong> (Diseñadores con Estilo), where I had the chance to send my designs to the programme Estilo RCN; they congratulated us on our standout entry. That same year I graduated from university as a <strong>business administrator</strong>. During this period the clothes we made were custom-fitted, commissioned by clients for their social events.',
        fr: "Notre première apparition dans les médias a eu lieu en 2008 grâce à un concours de la chaîne <strong>RCN</strong> (Diseñadores con Estilo), où j'ai pu envoyer mes créations à l'émission Estilo RCN ; notre participation remarquée a été saluée. La même année, j'ai obtenu mon diplôme universitaire de <strong>gestion d'entreprise</strong>. À cette époque, les vêtements que nous réalisions étaient sur mesure, commandés par des clientes pour leurs événements.",
        it: "La nostra prima apparizione sui media è avvenuta nel 2008 grazie a un concorso dell'emittente <strong>RCN</strong> (Diseñadores con Estilo), dove ho potuto inviare i miei progetti al programma Estilo RCN; ci hanno fatto i complimenti per la nostra partecipazione. Nello stesso anno mi sono laureata in <strong>economia aziendale</strong>. In quel periodo i capi che realizzavamo erano su misura, su commissione delle clienti per i loro eventi.",
        pt: 'A nossa primeira aparição nos meios de comunicação aconteceu em 2008 através de um concurso da <strong>RCN</strong> (Diseñadores con Estilo), onde tive a oportunidade de enviar os meus desenhos para o programa Estilo RCN; felicitaram-nos pela nossa participação em destaque. Nesse mesmo ano licenciei-me em <strong>gestão de empresas</strong>. Durante este período a roupa que fazíamos era por medida, encomendada por clientes para os seus eventos sociais.'
      },
      {
        es: 'Las prendas de <strong>origen étnico</strong> surgen de la intención de buscar una identidad propia donde nos viéramos reflejados. Gracias a este reconocimiento logramos solicitar un crédito y compramos 3 máquinas industriales y una fileteadora. Para ese entonces trabajábamos 5 personas. Por mi parte alternaba mi vocación con un empleo temporal como instructora de confecciones en el SENA.',
        en: 'The garments of <strong>ethnic origin</strong> grew out of a search for an identity of our own, one in which we could see ourselves reflected. That recognition allowed us to apply for a loan and buy three industrial machines and an overlocker. By then there were five of us working. For my part, I combined my craft with temporary work as a sewing instructor at SENA.',
        fr: "Les pièces d'<strong>origine ethnique</strong> sont nées de la volonté de trouver une identité qui nous ressemble. Cette reconnaissance nous a permis d'obtenir un crédit et d'acheter trois machines industrielles et une surjeteuse. Nous étions alors cinq à travailler. De mon côté, j'alternais ma vocation avec un emploi temporaire de formatrice en confection au SENA.",
        it: "I capi di <strong>origine etnica</strong> nascono dal desiderio di trovare un'identità nostra, in cui potessimo riconoscerci. Questo riconoscimento ci ha permesso di ottenere un credito e acquistare tre macchine industriali e una taglia e cuci. A quel punto eravamo in cinque a lavorare. Da parte mia, alternavo la mia vocazione con un lavoro temporaneo come istruttrice di confezione presso il SENA.",
        pt: 'As peças de <strong>origem étnica</strong> nascem da vontade de encontrar uma identidade própria na qual nos reconhecêssemos. Este reconhecimento permitiu-nos pedir um crédito e comprar três máquinas industriais e uma corta-e-cose. Nessa altura éramos cinco a trabalhar. Da minha parte, alternava a minha vocação com um emprego temporário como instrutora de confeção no SENA.'
      }
    ]
  },

  {
    anio: '2014',
    lado: 'der',
    parrafos: [{
      es: 'Participamos en el <strong>Petronio Álvarez</strong> con un showroom; el éxito de este nos permite una participación en Medellín, en un evento privado en El Poblado llamado <strong>Pasarela Univentas</strong>. Por primera vez soy el blanco de la prensa nacional, llenando una página completa del periódico <strong>El Tiempo</strong> y con comentarios positivos en <strong>El Espectador</strong> y <strong>El Colombiano</strong>. Para este tiempo mejora nuestra imagen como microempresa y como diseñadora.',
      en: 'We took part in the <strong>Petronio Álvarez</strong> festival with a showroom; its success opened the door to Medellín, to a private event in El Poblado called <strong>Pasarela Univentas</strong>. For the first time I drew the attention of the national press, filling a full page of the newspaper <strong>El Tiempo</strong> and earning favourable coverage in <strong>El Espectador</strong> and <strong>El Colombiano</strong>. Around this time our standing improved, both as a small business and as a designer.',
      fr: "Nous avons participé au festival <strong>Petronio Álvarez</strong> avec un showroom ; son succès nous a ouvert les portes de Medellín, lors d'un événement privé à El Poblado appelé <strong>Pasarela Univentas</strong>. Pour la première fois, j'ai attiré l'attention de la presse nationale, occupant une page entière du journal <strong>El Tiempo</strong> et recevant des critiques favorables dans <strong>El Espectador</strong> et <strong>El Colombiano</strong>. C'est à cette période que notre image de micro-entreprise et de créatrice s'est affirmée.",
      it: "Abbiamo partecipato al festival <strong>Petronio Álvarez</strong> con uno showroom; il suo successo ci ha aperto le porte di Medellín, a un evento privato a El Poblado chiamato <strong>Pasarela Univentas</strong>. Per la prima volta ho attirato l'attenzione della stampa nazionale, occupando un'intera pagina del quotidiano <strong>El Tiempo</strong> e ricevendo commenti positivi su <strong>El Espectador</strong> e <strong>El Colombiano</strong>. In quel periodo è migliorata la nostra immagine come microimpresa e come stilista.",
      pt: 'Participámos no festival <strong>Petronio Álvarez</strong> com um showroom; o seu êxito abriu-nos as portas de Medellín, num evento privado em El Poblado chamado <strong>Pasarela Univentas</strong>. Pela primeira vez atraí a atenção da imprensa nacional, ocupando uma página inteira do jornal <strong>El Tiempo</strong> e recebendo comentários positivos em <strong>El Espectador</strong> e <strong>El Colombiano</strong>. Por esta altura melhorou a nossa imagem como microempresa e como designer.'
    }]
  },

  {
    anio: '2016',
    lado: 'izq',
    imagen: 'assets/hito-2016.jpg',
    alt: {
      es: 'Bocetos de diseño sobre la mesa de trabajo',
      en: 'Design sketches on the work table',
      fr: 'Croquis de création sur la table de travail',
      it: 'Bozzetti di design sul tavolo da lavoro',
      pt: 'Esboços de design sobre a mesa de trabalho'
    },
    parrafos: [
      {
        es: 'La Unidad para las Víctimas y la multinacional <strong>Henkel</strong> patrocinan mi participación en el <strong>Bogotá Fashion Week</strong>, en un evento privado de la multinacional llamado la pasarela <strong>Somos Color</strong>. Tuve como modelos especiales a Melina Ramírez, Catalina Maya, Vivian Dávila y Adriana Tarud.',
        en: "The Victims' Unit and the multinational <strong>Henkel</strong> sponsored my participation in <strong>Bogotá Fashion Week</strong>, at a private event held by the company called the <strong>Somos Color</strong> runway show. Melina Ramírez, Catalina Maya, Vivian Dávila and Adriana Tarud appeared as guest models.",
        fr: "L'Unité pour les victimes et la multinationale <strong>Henkel</strong> ont parrainé ma participation à la <strong>Bogotá Fashion Week</strong>, lors d'un événement privé de l'entreprise, le défilé <strong>Somos Color</strong>. Melina Ramírez, Catalina Maya, Vivian Dávila et Adriana Tarud y ont défilé comme mannequins invitées.",
        it: "L'Unità per le Vittime e la multinazionale <strong>Henkel</strong> hanno sponsorizzato la mia partecipazione alla <strong>Bogotá Fashion Week</strong>, in un evento privato dell'azienda chiamato la sfilata <strong>Somos Color</strong>. Melina Ramírez, Catalina Maya, Vivian Dávila e Adriana Tarud hanno sfilato come modelle ospiti.",
        pt: 'A Unidade para as Vítimas e a multinacional <strong>Henkel</strong> patrocinaram a minha participação na <strong>Bogotá Fashion Week</strong>, num evento privado da empresa chamado o desfile <strong>Somos Color</strong>. Melina Ramírez, Catalina Maya, Vivian Dávila e Adriana Tarud desfilaram como modelos convidadas.'
      },
      {
        es: 'La participación en este evento fue muy importante y exitosa. Los medios escritos y la televisión visibilizan nuestro trabajo; es entonces cuando nuestros diseños toman valor a nivel nacional. Desde entonces no pararon las entrevistas en importantes revistas como <strong>Cromos</strong>, <strong>Easyfly</strong>, <strong>Rostros e Historias del Pacífico</strong> y la revista <strong>Glamour</strong>, además de algunos documentales sobre mi historia en diferentes canales de la televisión nacional.',
        en: 'Taking part in that event mattered a great deal, and it went well. The press and television gave our work visibility; that is when our designs gained standing nationwide. The interviews never stopped after that — in magazines such as <strong>Cromos</strong>, <strong>Easyfly</strong>, <strong>Rostros e Historias del Pacífico</strong> and <strong>Glamour</strong>, alongside documentaries about my story on several national television channels.',
        fr: "Cette participation a été déterminante et couronnée de succès. La presse écrite et la télévision ont donné de la visibilité à notre travail ; c'est à ce moment-là que nos créations ont pris de la valeur à l'échelle nationale. Depuis, les interviews n'ont plus cessé, dans des magazines tels que <strong>Cromos</strong>, <strong>Easyfly</strong>, <strong>Rostros e Historias del Pacífico</strong> et <strong>Glamour</strong>, ainsi que des documentaires sur mon parcours sur plusieurs chaînes nationales.",
        it: "La partecipazione a quell'evento è stata molto importante e di successo. La carta stampata e la televisione hanno dato visibilità al nostro lavoro; è allora che le nostre creazioni hanno acquisito valore a livello nazionale. Da allora le interviste non si sono più fermate, su riviste come <strong>Cromos</strong>, <strong>Easyfly</strong>, <strong>Rostros e Historias del Pacífico</strong> e <strong>Glamour</strong>, oltre ad alcuni documentari sulla mia storia su diversi canali televisivi nazionali.",
        pt: 'A participação neste evento foi muito importante e bem-sucedida. A imprensa escrita e a televisão deram visibilidade ao nosso trabalho; é então que as nossas criações ganham valor a nível nacional. Desde então as entrevistas não pararam, em revistas como <strong>Cromos</strong>, <strong>Easyfly</strong>, <strong>Rostros e Historias del Pacífico</strong> e <strong>Glamour</strong>, além de alguns documentários sobre a minha história em diferentes canais da televisão nacional.'
      }
    ]
  }
];

// ── Actualmente ─────────────────────────────────────────
export const CIFRAS_ACTUALES: Cifra[] = [
  { icono: 'personas', texto: personas(30) },
  {
    icono: 'indigena',
    texto: {
      es: 'Integración de comunidades indígenas',
      en: 'Working with indigenous communities',
      fr: 'Intégration de communautés indigènes',
      it: 'Integrazione di comunità indigene',
      pt: 'Integração de comunidades indígenas'
    }
  },
  {
    icono: 'mayor',
    texto: {
      es: 'Integración de mujeres de la tercera edad',
      en: 'Working with older women',
      fr: 'Intégration de femmes âgées',
      it: 'Integrazione di donne anziane',
      pt: 'Integração de mulheres idosas'
    }
  },
  {
    icono: 'reciclaje',
    texto: {
      es: 'Reutilización de los recortes de tela',
      en: 'Reuse of fabric offcuts',
      fr: 'Réutilisation des chutes de tissu',
      it: 'Riutilizzo degli scampoli di tessuto',
      pt: 'Reutilização dos retalhos de tecido'
    }
  }
];

export const CIERRE: Multi = {
  es: 'Además de diseñar y comercializar prendas de vestir, tenemos un objetivo social que consiste en preparar personas en situación de desplazamiento forzado y brindarles oportunidad laboral que se traduzca en mejorar su entorno familiar y su nivel de vida. De esa forma contamos con 10 personas laborando en el taller y más de 20 con empleos temporales. Entre ellos, la comunidad indígena <strong>Gunadule o Kunas</strong> de Unguía, Chocó, quienes se encargan de fabricar las <strong>molas</strong> que utilizamos en las prendas y accesorios, y un grupo de <strong>mujeres afro de la tercera edad</strong> que se encargan de hacer hermosos tejidos con los recortes de tela sobrantes, minimizando así el impacto que genera nuestra producción, siendo más amables con nuestro ambiente además de construir tejido social.',
  en: 'Beyond designing and selling clothing, we pursue a social purpose: training people displaced by conflict and offering them work that improves their family circumstances and their standard of living. We currently have 10 people in the workshop and more than 20 in temporary roles. Among them are the <strong>Gunadule (Kuna)</strong> indigenous community of Unguía, Chocó, who make the <strong>molas</strong> we use in our garments and accessories, and a group of <strong>older Afro-Colombian women</strong> who weave beautiful pieces from our leftover fabric offcuts — reducing the impact of our production, treating our environment more kindly, and building social fabric along the way.',
  fr: "Au-delà de la création et de la vente de vêtements, nous poursuivons un objectif social : former des personnes déplacées par le conflit et leur offrir un travail qui améliore leur situation familiale et leur niveau de vie. Nous comptons aujourd'hui 10 personnes à l'atelier et plus de 20 en emploi temporaire. Parmi elles, la communauté indigène <strong>Gunadule (Kuna)</strong> d'Unguía, dans le Chocó, qui fabrique les <strong>molas</strong> que nous utilisons dans nos vêtements et accessoires, et un groupe de <strong>femmes afro-colombiennes âgées</strong> qui tissent de belles pièces à partir de nos chutes de tissu — réduisant ainsi l'impact de notre production, ménageant notre environnement et tissant du lien social.",
  it: "Oltre a disegnare e vendere capi di abbigliamento, perseguiamo un obiettivo sociale: formare persone sfollate dal conflitto e offrire loro un lavoro che migliori la situazione familiare e il tenore di vita. Oggi contiamo 10 persone nel laboratorio e più di 20 con impieghi temporanei. Tra loro, la comunità indigena <strong>Gunadule (Kuna)</strong> di Unguía, nel Chocó, che realizza le <strong>molas</strong> che utilizziamo nei capi e negli accessori, e un gruppo di <strong>donne afrocolombiane anziane</strong> che tessono bellissimi lavori con gli scampoli di tessuto avanzati — riducendo l'impatto della nostra produzione, trattando con più cura il nostro ambiente e costruendo al tempo stesso tessuto sociale.",
  pt: 'Para além de desenhar e comercializar peças de vestuário, perseguimos um objetivo social: preparar pessoas em situação de deslocamento forçado e oferecer-lhes trabalho que melhore o seu ambiente familiar e o seu nível de vida. Contamos atualmente com 10 pessoas a trabalhar na oficina e mais de 20 com empregos temporários. Entre elas, a comunidade indígena <strong>Gunadule (Kuna)</strong> de Unguía, no Chocó, que fabrica as <strong>molas</strong> que utilizamos nas peças e acessórios, e um grupo de <strong>mulheres afro-colombianas idosas</strong> que tecem belos trabalhos com os retalhos de tecido sobrantes — reduzindo o impacto da nossa produção, sendo mais amáveis com o nosso ambiente e construindo, ao mesmo tempo, tecido social.'
};