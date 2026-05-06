window.addEventListener("load", async function() {
  // Ver si ya hay pregunta activa al cargar
  const estado = await dbLeerEstado();
  if (estado && estado.activa) {
    mostrarPregunta(estado);
  }

  // Escuchar cambios en tiempo real
  sb.channel("estado_juego")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      function(payload) {
        const record = payload.new;
        if (record.activa) {
          mostrarPregunta(record);
        } else {
          mostrarDefault();
        }
      }
    )
    .subscribe();
});

function mostrarPregunta(estado) {
  // Ocultar todo primero
  document.getElementById("vista-default").classList.add("oculto");
  document.getElementById("vista-pregunta").classList.add("oculto");
  document.getElementById("vista-trivia-niveles").classList.add("oculto");

  document.getElementById("pantalla-categoria").textContent = estado.categoria;

  if (estado.modo === "trivia-niveles") {
    // Mostrar los 5 niveles como boxes visuales
    document.getElementById("trivia-categoria-label").textContent = estado.categoria;
    document.getElementById("trivia-subcategoria").textContent = estado.nombre;

    const grid = document.getElementById("trivia-niveles-grid");
    grid.innerHTML = [100, 200, 300, 400, 500].map(function(pts) {
      return `<div class="nivel-box-pantalla">${pts}</div>`;
    }).join("");

    document.getElementById("vista-trivia-niveles").classList.remove("oculto");

  } else if (estado.modo === "trivia-pregunta") {
    // Resaltar el nivel activo y mostrar pregunta
    document.getElementById("trivia-categoria-label").textContent = estado.categoria;
    document.getElementById("trivia-subcategoria").textContent = estado.nombre;

    const grid = document.getElementById("trivia-niveles-grid");
    grid.innerHTML = [100, 200, 300, 400, 500].map(function(pts) {
      const activo = pts === estado.puntaje_activo ? "nivel-box-activo" : "";
      return `<div class="nivel-box-pantalla ${activo}">${pts}</div>`;
    }).join("");

    document.getElementById("vista-trivia-niveles").classList.remove("oculto");

    // También mostrar la pregunta debajo
    document.getElementById("pantalla-titulo").textContent = estado.nombre;
    document.getElementById("pantalla-descripcion").textContent = estado.descripcion;
    document.getElementById("vista-pregunta").classList.remove("oculto");

  } else {
    // Modo normal
    document.getElementById("pantalla-titulo").textContent = estado.nombre;
    document.getElementById("pantalla-descripcion").textContent = estado.descripcion;
    document.getElementById("vista-pregunta").classList.remove("oculto");
  }
}

function mostrarDefault() {
  document.getElementById("vista-pregunta").classList.add("oculto");
  document.getElementById("vista-default").classList.remove("oculto");
}
