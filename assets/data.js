/* ==========================================================================
   KAGURA · CATÁLOGO COMPARTIDO
   Pósters reales de /images. Los títulos están verificados contra los HTML
   de la carpeta y contra la guía de estilos — no hay nombres inventados.
   IMG es el prefijo de ruta: las páginas viven en /kagura y las imágenes en
   /images, un nivel por encima.
   ========================================================================== */
var IMG = "images/";

var A = {
  onepiece:  {t:"ONE PIECE",                                   p:"bx21-ELSYx3yMPcKM.jpg",     b:"21-wf37VakJmZqs.jpg",     f:"TV",      y:1999, s:87, eps:1100, st:"Emitiendo",  st2:"airing", g:["Acción","Aventura","Fantasía"], studio:"Toei Animation", live:true,
    d:"Monkey D. Luffy zarpa con una tripulación imposible para encontrar el tesoro que dejó el Rey de los Piratas. Veinticinco años de mares, islas y promesas que se cumplen tarde pero se cumplen."},
  frieren:   {t:"Frieren: Beyond Journey's End",               p:"bx154587-qQTzQnEJJ3oB.jpg", b:"154587-ivXNJ23SM1xB.jpg", f:"TV",      y:2023, s:91, eps:28,   st:"Finalizado", st2:"finished", g:["Aventura","Drama","Fantasía"], studio:"Madhouse",
    d:"La elfa Frieren sobrevive a los compañeros con los que derrotó al Rey Demonio y descubre, demasiado tarde, que nunca se molestó en conocerlos. Un viaje sobre el tiempo que a ella no le pesa y a los demás sí."},
  fmab:      {t:"Fullmetal Alchemist: Brotherhood",            p:"bx5114-nSWCgQlmOMtj.jpg",   b:"5114-q0V5URebphSG.jpg",   f:"TV",      y:2009, s:90, eps:64,   st:"Finalizado", st2:"finished", g:["Acción","Aventura","Drama"], studio:"Bones",
    d:"Dos hermanos pagan un precio irreversible por intentar devolver a la vida a su madre. La búsqueda de la Piedra Filosofal los lleva al centro de un país que se sostiene sobre un crimen."},
  aot:       {t:"Attack on Titan",                             p:"bx16498-buvcRTBx4NSm.jpg",  b:"16498-8jpFCOcDmneX.jpg",  f:"TV",      y:2013, s:85, eps:87,   st:"Finalizado", st2:"finished", g:["Acción","Drama","Fantasía"], studio:"Wit Studio",
    d:"La humanidad se refugia tras tres murallas desde hace un siglo. El día que la exterior cae, Eren Jaeger descubre que el enemigo no estaba solo fuera."},
  hxh:       {t:"Hunter x Hunter",                             p:"bx11061-y5gsT1hoHuHw.png",  b:"11061-8WkkTZ6duKpq.jpg",  f:"TV",      y:2011, s:89, eps:148,  st:"Finalizado", st2:"finished", g:["Acción","Aventura"], studio:"Madhouse",
    d:"Gon busca a un padre al que no conoce y para encontrarlo tiene que convertirse en Hunter. Lo que empieza como una aventura infantil se endurece capítulo a capítulo."},
  deathnote: {t:"Death Note",                                  p:"bx1535-kUgkcrfOrkUM.jpg",   b:"1535.jpg",                f:"TV",      y:2006, s:84, eps:37,   st:"Finalizado", st2:"finished", g:["Misterio","Psicológico","Thriller"], studio:"Madhouse",
    d:"Un cuaderno mata a quien nombres en él. Light Yagami decide limpiar el mundo con él y un detective sin nombre decide detenerlo. La partida se juega entera dentro de dos cabezas."},
  rezero:    {t:"Re:ZERO -Starting Life in Another World-",     p:"bx163134-yieRFbvUOH9a.jpg", b:"163134-CqaXjXVivwJ5.jpg", f:"TV",      y:2024, s:87, eps:50,   st:"Emitiendo",  st2:"airing", g:["Drama","Fantasía","Psicológico"], studio:"White Fox", live:true,
    d:"Subaru Natsuki cae en un mundo de fantasía sin más poder que el de volver a empezar cada vez que muere. Entre reinos en disputa, brujas y lealtades que se rompen, cada bucle le cuesta algo que no recupera."},
  csm:       {t:"Chainsaw Man — The Movie: Reze Arc",          p:"bx171627-ZN9D7P46yHnw.png", b:"",                        f:"Movie",   y:2025, s:90, eps:1,    st:"Finalizado", st2:"finished", g:["Acción","Sobrenatural"], studio:"MAPPA",
    d:"Denji conoce a una chica en una cabina de teléfono durante una tormenta. Lo que viene después no le deja elegir entre lo que quiere y lo que es."},
  mushoku:   {t:"Mushoku Tensei: Jobless Reincarnation S3",     p:"bx178789-hNXjKFzUq7mk.jpg", b:"178789-9nHWmoRLlcLu.jpg", f:"TV",      y:2026, s:85, eps:14,   st:"Emitiendo",  st2:"airing", g:["Aventura","Fantasía"], studio:"Studio Bind", live:true,
    d:"Un hombre que desperdició su vida renace en un mundo de magia con la memoria intacta. La segunda oportunidad no le hace mejor persona de golpe: se la tiene que trabajar."},
  gintamaF:  {t:"Gintama: THE VERY FINAL",                     p:"bx114129-RLgSuh6YbeYx.jpg", b:"",                        f:"Movie",   y:2021, s:91, eps:1,    st:"Finalizado", st2:"finished", g:["Acción","Comedia"], studio:"Bandai Namco Pictures",
    d:"El cierre de una serie que pasó veinte años negándose a terminar. Gintoki y los Yorozuya se enfrentan a lo que llevaban esquivando desde el principio."},
  gintama3:  {t:"Gintama Season 3",                            p:"bx20996-kBEGEGdeK1r7.jpg",  b:"",                        f:"TV",      y:2015, s:90, eps:51,   st:"Finalizado", st2:"finished", g:["Acción","Comedia"], studio:"Bandai Namco Pictures",
    d:"Edo sigue ocupada por aliens y los Yorozuya siguen aceptando cualquier trabajo. Entre chiste y chiste, la serie se pone seria sin avisar."},
  dying:     {t:"I Want to Love You Till Your Dying Day",      p:"bx187260-WW5RBa5NINRP.jpg", b:"",                        f:"TV",      y:2026, s:74, eps:13,   st:"Emitiendo",  st2:"airing", g:["Romance","Drama"], studio:"—", live:true,
    d:"Una historia de amor con fecha de caducidad escrita desde el primer episodio."},
  saint:     {t:"The Oblivious Saint Can't Contain Her Power", p:"bx196219-imvC0rbk4VzH.jpg", b:"",                        f:"TV",      y:2026, s:64, eps:12,   st:"Emitiendo",  st2:"airing", g:["Comedia","Fantasía"], studio:"—", live:true,
    d:"Una santa que no se entera de lo poderosa que es y un reino que se beneficia de su despiste."},
  ladies:    {t:"Young Ladies Don't Play Fighting Games",      p:"bx128757-Iqc6hTjEYIz4.png", b:"",                        f:"TV",      y:2026, s:74, eps:12,   st:"Emitiendo",  st2:"airing", g:["Comedia","Slice of Life"], studio:"—", live:true,
    d:"Señoritas de buena familia descubren los juegos de lucha y no vuelven a ser las mismas."},
  ninthjedi: {t:"Star Wars: Visions — The Ninth Jedi",         p:"bx213847-VJBiihCv12zh.jpg", b:"",                        f:"ONA",     y:2026, s:64, eps:8,    st:"Emitiendo",  st2:"airing", g:["Acción","Sci-Fi"], studio:"Production I.G",
    d:"Una hija de forjador de sables de luz recorre una galaxia donde los Jedi ya son leyenda."},
  ribbon:    {t:"THE RIBBON HERO",                             p:"b211308-88VZiAPkkXZV.jpg",  b:"b211308-88VZiAPkkXZV.jpg",f:"Movie",   y:2026, s:66, eps:1,    st:"Finalizado", st2:"finished", g:["Acción","Deporte"], studio:"—",
    d:"Gimnasia rítmica llevada al terreno del shōnen deportivo."},
  kyapi:     {t:"Kyapi",                                       p:"bx214893-WoxSDFCR0xmm.png", b:"",                        f:"Music",   y:2026, s:0,  eps:1,    st:"Finalizado", st2:"finished", g:["Música"], studio:"—", d:"Videoclip musical."},
  rise:      {t:"We Will Rise Again",                          p:"bx214894-KjyPf2DrTdIb.jpg", b:"",                        f:"Special", y:2026, s:0,  eps:1,    st:"Finalizado", st2:"finished", g:["Drama"], studio:"—", d:"Especial de un solo episodio."},
  astral:    {t:"Astral lamp",                                 p:"bx214892-Ocb9A6tiuX2G.png", b:"",                        f:"Music",   y:2026, s:0,  eps:1,    st:"Finalizado", st2:"finished", g:["Música"], studio:"—", d:"Videoclip musical."}
};

/* orden estable para listados */
var KEYS = Object.keys(A);

var GENRES = ["Acción","Aventura","Comedia","Drama","Fantasía","Romance","Sci-Fi","Slice of Life","Deporte","Sobrenatural","Misterio","Psicológico"];
var GENRE_COUNTS = [1240,986,874,742,1105,986,612,538,304,721,489,357];
var GENRE_DESC = [
  "Peleas de alto riesgo, persecuciones y coreografía cinética.",
  "Viajes entre mundos y mares — exploración, misiones y lo desconocido.",
  "Comedia de situación, parodia y humor cotidiano.",
  "Conflicto humano, pérdida y personajes que cambian.",
  "Sistemas de magia, criaturas míticas y mundos que no son este.",
  "Vínculos que se construyen despacio y cuestan.",
  "Tecnología, futuro y preguntas incómodas.",
  "El día a día contado con calma y detalle.",
  "Entrenamiento, rivalidad y el minuto final.",
  "Lo que no se explica con física.",
  "Pistas, sospechosos y una respuesta que duele.",
  "La cabeza del protagonista como campo de batalla."
];

/* fuentes/servidores del reproductor */
var SOURCES = ["Kagura","Miruro","AniYume","AniHQ"];
