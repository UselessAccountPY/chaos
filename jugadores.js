let miNombre = null;
let canalRealtime = null;

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

  // Mostrar puntaje actual
  const puntajeActual = existe ? existe.puntaje : 0;
  document.getElementById("mi-puntaje").textContent = puntajeActual;

  // Ver si ya hay una pregunta activa
  const estado = await dbLeerEstado();
  if (estado && estado.activa) {
    mostrarPreguntaJugador(estado);
  }

  escucharRealtime();
}


function escucharRealtime() {
  // Canal para estado del juego
  const wsEstado = new WebSocket(
    "wss://pomwgcnwygbqakbjizjf.supabase.co/realtime/v1/websocket?apikey=" + SUPABASE_KEY
  );

  wsEstado.onopen = function() {
    wsEstado.send(JSON.stringify({
      topic: "realtime:public:estado_juego",
      event: "phx_join",
      payload: { config: { broadcast: { self: true }, presence: {}, postgres_changes: [{ event: "*", schema: "public", table: "estado_juego" }] } },
      ref: "1"
    }));
  };

  wsEstado.onmessage = async function(msg) {
    const data = JSON.parse(msg.data);
    if (data.event === "postgres_changes") {
      const record = data.payload?.data?.record;
      if (!record) return;
      if (record.activa) {
        mostrarPreguntaJugador(record);
      } else {
        ocultarPreguntaJugador();
      }
    }
    // Actualizar puntaje propio
    if (data.event === "postgres_changes" && data.payload?.data?.table === "jugadores") {
      const record = data.payload?.data?.record;
      if (record && record.nombre === miNombre) {
        document.getElementById("mi-puntaje").textContent = record.puntaje;
      }
    }
  };

  // Canal para puntajes
  const wsJugadores = new WebSocket(
    "wss://pomwgcnwygbqakbjizjf.supabase.co/realtime/v1/websocket?apikey=" + SUPABASE_KEY
  );

  wsJugadores.onopen = function() {
    wsJugadores.send(JSON.stringify({
      topic: "realtime:public:jugadores",
      event: "phx_join",
      payload: { config: { broadcast: { self: true }, presence: {}, postgres_changes: [{ event: "*", schema: "public", table: "jugadores" }] } },
      ref: "2"
    }));
  };

  wsJugadores.onmessage = function(msg) {
    const data = JSON.parse(msg.data);
    if (data.event === "postgres_changes") {
      const record = data.payload?.data?.record;
      if (record && record.nombre === miNombre) {
        document.getElementById("mi-puntaje").textContent = record.puntaje;
      }
    }
  };
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