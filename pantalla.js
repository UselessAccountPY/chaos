window.addEventListener("load", async function() {
  const estado = await dbLeerEstado();
  aplicarEstado(estado);
  await actualizarJugadoresLobby();
  await actualizarBarraTurnos();
  escucharCambios();
});

function escucharCambios() {
  sb.channel("pantalla_estado")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "estado_juego" },
    async function(payload) {
      aplicarEstado(payload.new);
      await actualizarBarraTurnos(payload.new);
      await manejarPuntajes(payload.new);

      // Detectar aviso de power up saltar
      if (payload.new.aviso_pu && payload.new.aviso_pu.startsWith("saltar|")) {
        const nombre = payload.new.aviso_pu.split("|")[1];
        mostrarOverlaySaltar(nombre);
      }

      // NUEVO: detectar aviso de power up amigo
      if (payload.new.aviso_pu && payload.new.aviso_pu.startsWith("amigo|")) {
        const nombre = payload.new.aviso_pu.split("|")[1];
        mostrarOverlayAmigo(nombre);
        // Mostrar el contador parado en 1:00.00 desde el momento de aceptación
        actualizarTextoContadores("1:00.00");
        mostrarContadores();
      }

      if (payload.new.aviso_pu && payload.new.aviso_pu.startsWith("twist|")) {
        const nombre = payload.new.aviso_pu.split("|")[1];
        mostrarOverlayTwist(nombre);
      }
      
      // NUEVO: detectar señal de contador
      if (payload.new.contador_amigo === "iniciar") {
        iniciarCountdown();
      } else if (payload.new.contador_amigo === "detener") {
        // Congela el número actual sin ocultarlo
        detenerCountdown();
      } else if (payload.new.contador_amigo === "") {
        // Vacío = limpiar completamente (ej: siguiente turno)
        if (rafContador) cancelAnimationFrame(rafContador);
        rafContador = null;
        msAcumulados = 0;
        ocultarContadores();
      }
    }
  )
  .subscribe();

  sb.channel("pantalla_jugadores")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "jugadores" },
      async function() {
        await actualizarJugadoresLobby();
        // Si overlay de puntajes está visible, actualizarlo
        const estado = await dbLeerEstado();
        if (estado?.mostrar_puntajes) await renderizarPuntajes();
      }
    )
    .subscribe();

  sb.channel("pantalla_turnos")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "turnos" },
      async function() {
        const estado = await dbLeerEstado();
        await actualizarBarraTurnos(estado);
      }
    )
    .subscribe();
}


function aplicarEstado(estado) {
  if (!estado) return;

  // Ocultar vistas principales (no overlays)
  document.getElementById("vista-lobby").classList.add("oculto");
  document.getElementById("vista-default").classList.add("oculto");
  document.getElementById("vista-pregunta").classList.add("oculto");
  document.getElementById("vista-trivia-niveles").classList.add("oculto");
  document.getElementById("vista-dados-pantalla").classList.add("oculto");

  if (estado.fase === "lobby") {
    document.getElementById("barra-turnos").classList.add("oculto");
    document.getElementById("vista-lobby").classList.remove("oculto");
    return;
  }

  if (estado.fase === "dados" || estado.fase === "manual") {
    document.getElementById("barra-turnos").classList.add("oculto");
    document.getElementById("vista-dados-pantalla").classList.remove("oculto");
    actualizarDadosPantalla();
    return;
  }

  if (estado.fase === "juego") {
    // Barra de turnos siempre visible en juego
    document.getElementById("barra-turnos").classList.remove("oculto");

    // Manejar overlay de ruleta por separado (no toca las vistas principales)
    manejarRuleta(estado);

    if (!estado.activa) {
      // Sin pregunta activa — mostrar logo
      document.getElementById("vista-default").classList.remove("oculto");
      return;
    }

    mostrarPregunta(estado);
  }
}

async function actualizarBarraTurnos(estado) {
  if (!estado) estado = await dbLeerEstado();
  if (!estado || estado.fase !== "juego") return;

  const turnos = await dbLeerTurnos();
  const turnoActivo = Number(estado.turno_activo) || 1;
  const ronda = Number(estado.ronda) || 1;

  document.getElementById("barra-ronda").textContent = "Ronda " + ronda;

  const ordenados = [...turnos].sort((a, b) => Number(a.turno) - Number(b.turno));
  document.getElementById("barra-jugadores").innerHTML = ordenados.map(function(t) {
    const activo = Number(t.turno) === turnoActivo ? "barra-jugador-activo" : "";
    return `<div class="barra-jugador-box ${activo}">${t.nombre}</div>`;
  }).join("");
}

async function manejarPuntajes(estado) {
  if (!estado) return;
  if (estado.mostrar_puntajes) {
    await renderizarPuntajes();
    document.getElementById("overlay-puntajes").classList.remove("oculto");
  } else {
    document.getElementById("overlay-puntajes").classList.add("oculto");
  }
}

async function renderizarPuntajes() {
  const jugadores = await dbLeerJugadores();
  const ordenados = [...jugadores].sort((a, b) => Number(b.puntaje) - Number(a.puntaje));

  document.getElementById("lista-puntajes").innerHTML = ordenados.map(function(j, i) {
    const pos = i + 1;
    const clasePos = pos <= 3 ? `puntaje-pos-${pos}` : "";
    const medalla = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos + "°";
    return `
      <div class="fila-puntaje">
        <span class="puntaje-pos ${clasePos}">${medalla}</span>
        <span class="puntaje-nombre">${j.nombre}</span>
        <span class="puntaje-valor">${j.puntaje} pts</span>
      </div>
    `;
  }).join("");
}

async function actualizarJugadoresLobby() {
  const jugadores = await dbLeerJugadores();
  const contenedor = document.getElementById("jugadores-lobby");
  if (!contenedor) return;
  contenedor.innerHTML = jugadores.length === 0
    ? `<p style="color:#666; font-style:italic;">Esperando jugadores...</p>`
    : jugadores.map(j => `<div class="jugador-lobby-card">${j.nombre}</div>`).join("");
}

function mostrarPregunta(estado) {
  document.getElementById("vista-default").classList.add("oculto");
  document.getElementById("vista-trivia-niveles").classList.add("oculto");

  if (estado.modo === "trivia-niveles") {
    document.getElementById("trivia-categoria-label").textContent = estado.categoria;
    document.getElementById("trivia-subcategoria").textContent = estado.nombre;
    const grid = document.getElementById("trivia-niveles-grid");
    grid.innerHTML = [100, 200, 300, 400, 500].map(pts =>
      `<div class="nivel-box-pantalla">${pts}</div>`
    ).join("");
    const preguntaDiv = document.getElementById("trivia-pregunta-texto");
    if (preguntaDiv) preguntaDiv.textContent = "";
    document.getElementById("vista-trivia-niveles").classList.remove("oculto");

  } else if (estado.modo === "trivia-pregunta") {
    document.getElementById("trivia-categoria-label").textContent = estado.categoria;
    document.getElementById("trivia-subcategoria").textContent = estado.nombre;
    const grid = document.getElementById("trivia-niveles-grid");
    grid.innerHTML = [100, 200, 300, 400, 500].map(pts => {
      const activo = pts === estado.puntaje_activo ? "nivel-box-activo" : "";
      return `<div class="nivel-box-pantalla ${activo}">${pts}</div>`;
    }).join("");
    let preguntaDiv = document.getElementById("trivia-pregunta-texto");
    if (!preguntaDiv) {
      preguntaDiv = document.createElement("p");
      preguntaDiv.id = "trivia-pregunta-texto";
      preguntaDiv.style.fontSize = "1.4rem";
      preguntaDiv.style.color = "#fff";
      preguntaDiv.style.lineHeight = "1.7";
      preguntaDiv.style.marginTop = "0.5rem";
      document.getElementById("box-trivia-niveles").appendChild(preguntaDiv);
    }
    preguntaDiv.textContent = estado.descripcion;
    document.getElementById("vista-trivia-niveles").classList.remove("oculto");

  } else {
    document.getElementById("pantalla-categoria").textContent = estado.categoria;
    document.getElementById("pantalla-titulo").textContent = estado.nombre;
    document.getElementById("pantalla-descripcion").textContent = estado.descripcion;
    document.getElementById("vista-pregunta").classList.remove("oculto");
  }
}

function mostrarDefault() {
  document.getElementById("vista-trivia-niveles").classList.add("oculto");
  document.getElementById("vista-pregunta").classList.add("oculto");
  document.getElementById("vista-default").classList.remove("oculto");
}

async function actualizarDadosPantalla() {
  const turnos = await dbLeerTurnos();
  const contenedor = document.getElementById("lista-dados-pantalla");
  if (!contenedor) return;
  contenedor.innerHTML = turnos.map(function(t) {
    const numeroHTML = t.resultado_dado > 0
      ? `<span class="card-dado-numero">${t.resultado_dado}</span>`
      : `<span class="card-dado-numero pendiente">?</span>`;
    const turnoHTML = t.turno > 0
      ? `<span class="card-dado-turno">Turno ${t.turno}°</span>`
      : `<span class="card-dado-turno" style="color:#555">esperando...</span>`;
    return `
      <div class="card-dado-pantalla">
        ${numeroHTML}
        <span class="card-dado-nombre">${t.nombre}</span>
        ${turnoHTML}
      </div>
    `;
  }).join("");
}

// Canal turnos para dados
sb.channel("turnos_pantalla")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "turnos" },
    async function() {
      const estado = await dbLeerEstado();
      if (estado && (estado.fase === "dados" || estado.fase === "manual")) {
        await actualizarDadosPantalla();
      }
    }
  )
  .subscribe();


function construirRuletaSVG() {
  const categorias = [
    { nombre: "1", color: "#e74c3c" },
    { nombre: "2", color: "#e67e22" },
    { nombre: "3", color: "#f1c40f" },
    { nombre: "4", color: "#2ecc71" },
    { nombre: "5", color: "#1abc9c" },
    { nombre: "6", color: "#3498db" },
    { nombre: "7", color: "#9b59b6" },
    { nombre: "8", color: "#e91e8c" }
  ];

  const cx = 200, cy = 200, r = 180;
  const total = categorias.length;
  const angulo = (2 * Math.PI) / total;

  let paths = "";
  let textos = "";

  categorias.forEach(function(cat, i) {
    const inicio = i * angulo - Math.PI / 2;
    const fin = inicio + angulo;
    const x1 = cx + r * Math.cos(inicio);
    const y1 = cy + r * Math.sin(inicio);
    const x2 = cx + r * Math.cos(fin);
    const y2 = cy + r * Math.sin(fin);
    const midAngle = inicio + angulo / 2;
    const tx = cx + (r * 0.65) * Math.cos(midAngle);
    const ty = cy + (r * 0.65) * Math.sin(midAngle);

    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z"
      fill="${cat.color}" stroke="#0a0a0a" stroke-width="2" opacity="0.85"/>`;
    textos += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle"
      fill="#fff" font-size="13" font-weight="bold"
      transform="rotate(${(midAngle * 180 / Math.PI)}, ${tx}, ${ty})">${cat.nombre}</text>`;
  });

  return `<svg width="400" height="400" viewBox="0 0 400 400">
    <circle cx="200" cy="200" r="182" fill="none" stroke="#333" stroke-width="3"/>
    ${paths}
    ${textos}
    <circle cx="200" cy="200" r="20" fill="#0a0a0a" stroke="#555" stroke-width="2"/>
  </svg>`;
}

let ruletaRotacion = 0;

async function manejarRuleta(estado) {
  const overlay = document.getElementById("overlay-ruleta");

  // Ocultar ruleta si no hay fase_dado activa o ya se eligió categoria y pregunta
  if (!estado.fase_dado || estado.fase_dado === "") {
    overlay.classList.add("oculto");
    return;
  }

  // Mostrar overlay
  overlay.classList.remove("oculto");

  // Construir SVG si no existe
  const svgContenedor = document.getElementById("ruleta-svg-contenedor");
  if (!svgContenedor.innerHTML) {
    svgContenedor.innerHTML = construirRuletaSVG();
  }

  if (estado.fase_dado === "categoria" && Number(estado.dado_categoria) === 0) {
    // Esperando tirada de categoría
    document.getElementById("ruleta-resultado-box").classList.add("oculto");
    document.getElementById("ruleta-dado12-box").classList.add("oculto");

  } else if (Number(estado.dado_categoria) > 0) {
    // Animar ruleta
    const catIndex = Number(estado.dado_categoria) - 1;
    const anguloPorSeccion = 360 / 8;
    const anguloDestino = 360 * 5 + (270 - catIndex * anguloPorSeccion);
    const svg = svgContenedor.querySelector("svg");
    if (svg) {
      svg.style.transition = "transform 2s cubic-bezier(0.17, 0.67, 0.12, 1)";
      svg.style.transform = `rotate(${anguloDestino}deg)`;
      svg.style.transformOrigin = "center";
    }

    setTimeout(function() {
      document.getElementById("ruleta-categoria-nombre").textContent =
        "Categoría " + estado.dado_categoria;
      document.getElementById("ruleta-resultado-box").classList.remove("oculto");
    }, 2200);

    // Mostrar resultado de pregunta si ya está
    if (Number(estado.dado_pregunta) > 0) {
      setTimeout(function() {
        document.getElementById("ruleta-dado12-valor").textContent = estado.dado_pregunta;
        document.getElementById("ruleta-dado12-box").classList.remove("oculto");
      }, 2500);
    }
  }

  // Ocultar overlay cuando el host seleccionó categoria en index.html
  // Esto se dispara cuando fase_dado pasa a "" al hacer loadCategory
  if (estado.fase_dado === "") {
    overlay.classList.add("oculto");
  }
}

// Escuchar cambios de dados en pantalla
sb.channel("dados_pantalla")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "estado_juego" },
    async function(payload) {
      const record = payload.new;
      if (record.fase === "juego") {
        await manejarRuleta(record);
      }
    }
  )
  .subscribe();

// Muestra el overlay naranja de "saltar turno" durante 5 segundos
function mostrarOverlaySaltar(nombre) {
  const overlay = document.getElementById("overlay-saltar");
  const texto = document.getElementById("overlay-saltar-texto");
  texto.textContent = nombre + " ha saltado el turno";

  // Mostrar usando flex (necesario para que el centrado funcione)
  overlay.style.display = "flex";

  // Ocultarlo después de 5 segundos
  setTimeout(function() {
    overlay.style.display = "none";
  }, 5000);
}

// Muestra el overlay rojo de "llamar a un amigo" durante 5 segundos
function mostrarOverlayAmigo(nombre) {
  const overlay = document.getElementById("overlay-amigo");
  const texto = document.getElementById("overlay-amigo-texto");
  texto.textContent = nombre + " llama a un amigo";
  overlay.style.display = "flex";
  setTimeout(function() {
    overlay.style.display = "none";
  }, 5000);
}

function mostrarOverlayTwist(nombre) {
  const overlay = document.getElementById("overlay-twist");
  const texto = document.getElementById("overlay-twist-texto");
  texto.textContent = nombre + " activa el Twist 🌀";
  overlay.style.display = "flex";
  setTimeout(function() {
    overlay.style.display = "none";
  }, 5000);
}

// Guarda la referencia al loop de animación para poder cancelarlo
let rafContador = null;
// Guarda el momento exacto en que arrancó (o reanudó) el contador
let tiempoInicioContador = null;
// Guarda los milisegundos que ya pasaron antes de una pausa
let msAcumulados = 0;
// Duración total del contador en ms
const DURACION_CONTADOR = 60000;

// Formatea ms totales restantes como "0:59.43"
function formatearContador(msRestantes) {
  const totalSegundos = Math.max(0, msRestantes);
  const mins = Math.floor(totalSegundos / 60000);
  const segs = Math.floor((totalSegundos % 60000) / 1000);
  const cents = Math.floor((totalSegundos % 1000) / 10);
  return mins + ":" + (segs < 10 ? "0" : "") + segs + "." + (cents < 10 ? "0" : "") + cents;
}

// Actualiza el texto en ambos contadores (pregunta normal y trivia)
function actualizarTextoContadores(texto) {
  const elPregunta = document.getElementById("contador-amigo-pantalla");
  const elTrivia   = document.getElementById("contador-amigo-trivia");
  if (elPregunta) elPregunta.textContent = texto;
  if (elTrivia)   elTrivia.textContent   = texto;
}

// Muestra ambos contadores
function mostrarContadores() {
  const elPregunta = document.getElementById("contador-amigo-pantalla");
  const elTrivia   = document.getElementById("contador-amigo-trivia");
  if (elPregunta) elPregunta.style.display = "block";
  if (elTrivia)   elTrivia.style.display   = "block";
}

// Oculta ambos contadores
function ocultarContadores() {
  const elPregunta = document.getElementById("contador-amigo-pantalla");
  const elTrivia   = document.getElementById("contador-amigo-trivia");
  if (elPregunta) elPregunta.style.display = "none";
  if (elTrivia)   elTrivia.style.display   = "none";
}

function iniciarCountdown() {
  // Cancelar cualquier loop anterior
  if (rafContador) cancelAnimationFrame(rafContador);

  // Arrancar desde 0 ms acumulados (contador nuevo)
  msAcumulados = 0;
  tiempoInicioContador = performance.now();

  // Mostrar el contador detenido en 1:00.00 antes del primer frame
  actualizarTextoContadores("1:00.00");
  mostrarContadores();

  function tick(ahora) {
    const msPasados = msAcumulados + (ahora - tiempoInicioContador);
    const msRestantes = DURACION_CONTADOR - msPasados;

    actualizarTextoContadores(formatearContador(msRestantes));

    if (msRestantes <= 0) {
      // Llegó a cero — mostrar 0:00.00 y parar
      actualizarTextoContadores("0:00.00");
      rafContador = null;
      return;
    }

    // Pedir el siguiente frame
    rafContador = requestAnimationFrame(tick);
  }

  rafContador = requestAnimationFrame(tick);
}

function detenerCountdown() {
  if (rafContador) {
    // Guardar cuántos ms pasaron hasta este momento
    msAcumulados += performance.now() - tiempoInicioContador;
    cancelAnimationFrame(rafContador);
    rafContador = null;
    // El texto queda congelado en el último valor mostrado — no tocamos nada más
  }
  // Si no había contador corriendo, no hacemos nada (ya está congelado o nunca arrancó)
}
