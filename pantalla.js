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
  document.getElementById("pantalla-categoria").textContent = estado.categoria;
  document.getElementById("pantalla-titulo").textContent = estado.nombre;
  document.getElementById("pantalla-descripcion").textContent = estado.descripcion;
  document.getElementById("vista-default").classList.add("oculto");
  document.getElementById("vista-pregunta").classList.remove("oculto");
}

function mostrarDefault() {
  document.getElementById("vista-pregunta").classList.add("oculto");
  document.getElementById("vista-default").classList.remove("oculto");
}
