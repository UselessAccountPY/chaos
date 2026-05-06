let miNombre = null;

async function registrarJugador() {
  const input = document.getElementById("input-nombre");
  const nombre = input.value.trim();
  if (!nombre) return;

  const jugadores = await dbLeerJugadores();
  const existe = jugadores.find(j => j.nombre === nombre);

  if (!existe) {
    await dbCrearJugador(nombre);
  }

  miNombre = nombre;

  document.getElementById("vista-registro").classList.add("oculto");
  document.getElementById("vista-juego").classList.remove("oculto");
  document.getElementById("bienvenida").textContent = "¡Hola, " + nombre + "!";
  document.getElementById("mi-puntaje").textContent = existe ? existe.puntaje : 0;

  // Ver si ya hay pregunta activa
  const estado = await dbLeerEstado();
  if (estado && estado.activa) {
    mostrarPreguntaJugador(estado);
  }

  escucharRealtime();
}

function escucharRealtime() {
  // Escuchar cambios en estado del juego
  sb.channel("estado_juego_jugador")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "estado_juego" },
    function(payload) {
      const record = payload.new;
      if (!record.activa) {
        ocultarPreguntaJugador();
        ocultarBuzzer();
        return;
      }
      if (record.modo === "trivia-niveles" || record.modo === "trivia-pregunta") {
        mostrarPreguntaJugador(record);
        if (record.buzzer_activo) {
          activarBuzzer();
        } else {
          desactivarBuzzer();
        }
      } else {
        mostrarPreguntaJugador(record);
        ocultarBuzzer();
      }
    }
  )
  .subscribe();

  // Escuchar cambios en puntajes
  sb.channel("jugadores_puntaje")
    .on("postgres_changes",
      { event: "UPDATE", schema: "public", table: "jugadores" },
      function(payload) {
        const record = payload.new;
        if (record.nombre === miNombre) {
          document.getElementById("mi-puntaje").textContent = record.puntaje;
        }
      }
    )
    .subscribe();
}

function mostrarPreguntaJugador(estado) {
  document.getElementById("jugador-titulo-pregunta").textContent =
    estado.categoria + " — " + estado.nombre;
  document.getElementById("jugador-descripcion-pregunta").textContent =
    estado.descripcion;
  document.getElementById("pantalla-pregunta-jugador").classList.remove("oculto");
  document.querySelector(".subtitulo").textContent = "";
}

function ocultarPreguntaJugador() {
  document.getElementById("pantalla-pregunta-jugador").classList.add("oculto");
  document.querySelector(".subtitulo").textContent = "Esperando pregunta...";
}

function mostrarBuzzer() {
  document.getElementById("buzzer-btn").classList.remove("oculto");
}

function ocultarBuzzer() {
  document.getElementById("buzzer-btn").classList.add("oculto");
}

function activarBuzzer() {
  mostrarBuzzer();
  const btn = document.getElementById("buzzer-btn");
  btn.classList.remove("buzzer-desactivado");
  btn.onclick = aprestarBuzzer;
}

function desactivarBuzzer() {
  mostrarBuzzer();
  const btn = document.getElementById("buzzer-btn");
  btn.classList.add("buzzer-desactivado");
  btn.onclick = null; // no hace nada al apretar
}

async function aprestarBuzzer() {
  if (!miNombre) return;
  await dbBuzzerApretar(miNombre);
  const btn = document.getElementById("buzzer-btn");
  btn.classList.add("buzzer-apretado");
  btn.textContent = "✓";
  setTimeout(function() {
    btn.classList.remove("buzzer-apretado");
    btn.textContent = "●";
  }, 1500);
}
