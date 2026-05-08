window.addEventListener("load", async function() {
  const estado = await dbLeerEstado();
  aplicarEstado(estado);
  await actualizarJugadoresLobby();
  escucharCambios();
});

function escucharCambios() {
  // Escuchar estado del juego
  sb.channel("pantalla_estado")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      function(payload) {
        aplicarEstado(payload.new);
      }
    )
    .subscribe();

  // Escuchar jugadores nuevos (para lobby)
  sb.channel("pantalla_jugadores")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "jugadores" },
      async function() {
        await actualizarJugadoresLobby();
      }
    )
    .subscribe();
}

function aplicarEstado(estado) {
  if (!estado) return;

  // Ocultar todo
  document.getElementById("vista-lobby").classList.add("oculto");
  document.getElementById("vista-default").classList.add("oculto");
  document.getElementById("vista-pregunta").classList.add("oculto");
  document.getElementById("vista-trivia-niveles").classList.add("oculto");

  if (estado.fase === "lobby") {
    document.getElementById("vista-lobby").classList.remove("oculto");
    return;
  }

  // Fase juego — lógica existente
  if (!estado.activa) {
    mostrarDefault();
    return;
  }

  mostrarPregunta(estado);
}

async function actualizarJugadoresLobby() {
  const jugadores = await dbLeerJugadores();
  const contenedor = document.getElementById("jugadores-lobby");
  if (!contenedor) return;

  contenedor.innerHTML = jugadores.length === 0
    ? `<p style="color:#666; font-style:italic;">Esperando jugadores...</p>`
    : jugadores.map(function(j) {
        return `<div class="jugador-lobby-card">${j.nombre}</div>`;
      }).join("");
}

function mostrarPregunta(estado) {
  document.getElementById("vista-default").classList.add("oculto");
  document.getElementById("vista-trivia-niveles").classList.add("oculto");

  if (estado.modo === "trivia-niveles") {
    document.getElementById("trivia-categoria-label").textContent = estado.categoria;
    document.getElementById("trivia-subcategoria").textContent = estado.nombre;
    const grid = document.getElementById("trivia-niveles-grid");
    grid.innerHTML = [100, 200, 300, 400, 500].map(function(pts) {
      return `<div class="nivel-box-pantalla">${pts}</div>`;
    }).join("");
    const preguntaDiv = document.getElementById("trivia-pregunta-texto");
    if (preguntaDiv) preguntaDiv.textContent = "";
    document.getElementById("vista-trivia-niveles").classList.remove("oculto");

  } else if (estado.modo === "trivia-pregunta") {
    document.getElementById("trivia-categoria-label").textContent = estado.categoria;
    document.getElementById("trivia-subcategoria").textContent = estado.nombre;
    const grid = document.getElementById("trivia-niveles-grid");
    grid.innerHTML = [100, 200, 300, 400, 500].map(function(pts) {
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
