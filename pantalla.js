// Al cargar, ver si ya hay pregunta activa
window.addEventListener("load", async function() {
  const estado = await dbLeerEstado();
  if (estado && estado.activa) {
    mostrarPregunta(estado);
  }
});

// Escuchar cambios en tiempo real
const wsPantalla = new WebSocket(
  "wss://pomwgcnwygbqakbjizjf.supabase.co/realtime/v1/websocket?apikey=" + SUPABASE_KEY
);

wsPantalla.onopen = function() {
  wsPantalla.send(JSON.stringify({
    topic: "realtime:public:estado_juego",
    event: "phx_join",
    payload: { config: { broadcast: { self: true }, presence: {}, postgres_changes: [{ event: "*", schema: "public", table: "estado_juego" }] } },
    ref: "1"
  }));
};

wsPantalla.onmessage = function(msg) {
  const data = JSON.parse(msg.data);
  if (data.event === "postgres_changes") {
    const record = data.payload?.data?.record;
    if (!record) return;
    if (record.activa) {
      mostrarPregunta(record);
    } else {
      mostrarDefault();
    }
  }
};


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