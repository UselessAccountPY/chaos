let miNombre = null;
let yaBuzzee = false; // ← nueva
let yaTire = false;

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

const estado = await dbLeerEstado();

if (estado.fase === "lobby") {
  document.getElementById("vista-espera").classList.remove("oculto");
} else if (estado.fase === "dados") {
  document.getElementById("vista-dados-jugador").classList.remove("oculto");
} else if (estado.fase === "juego") {
  document.getElementById("vista-juego").classList.remove("oculto");
  document.getElementById("bienvenida").textContent = nombre;
  document.getElementById("mi-puntaje").textContent = existe ? existe.puntaje : 0;
  if (estado.activa) mostrarPreguntaJugador(estado);
}

await actualizarCantidadesPU();
escucharRealtime();
}

function escucharRealtime() {
  sb.channel("estado_juego_jugador_" + Date.now())
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      async function(payload) {
        const record = payload.new;

        // Detectar aviso de power up saltar (independiente del estado activa)
        if (record.aviso_pu && record.aviso_pu.startsWith("saltar|")) {
          const nombre = record.aviso_pu.split("|")[1];
          mostrarBannerPU(nombre + " ha saltado el turno", "saltar");
        }

        // NUEVO
        if (record.aviso_pu && record.aviso_pu.startsWith("amigo|")) {
          const nombre = record.aviso_pu.split("|")[1];
          mostrarBannerPU(nombre + " llama a un amigo 📞", "amigo");
        }

        if (record.aviso_pu && record.aviso_pu.startsWith("twist|")) {
          const nombre = record.aviso_pu.split("|")[1];
          mostrarBannerPU(nombre + " activa el Twist 🌀", "twist");
        }
        
        if (!record.activa) {
          ocultarPreguntaJugador();
          ocultarBuzzer();
          yaBuzzee = false;
          return;
        }
        if (record.modo === "trivia-niveles" || record.modo === "trivia-pregunta") {
          mostrarPreguntaJugador(record);
          if (record.buzzer_activo) {
            yaBuzzee = false;
            activarBuzzer();
          } else {
            desactivarBuzzer();
          }
        } else {
          mostrarPreguntaJugador(record);
          ocultarBuzzer();
          yaBuzzee = false;
        }
      }
    )
    .subscribe();

  sb.channel("fase_jugador_" + Date.now())
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      async function(payload) {
        const record = payload.new;
        if (record.fase === "dados") {
          document.getElementById("vista-espera").classList.add("oculto");
          document.getElementById("vista-dados-jugador").classList.remove("oculto");
          yaTire = false;
        } else if (record.fase === "manual") {
          document.getElementById("vista-espera").classList.remove("oculto");
          document.getElementById("vista-dados-jugador").classList.add("oculto");
          document.querySelector("#espera-box .subtitulo").textContent =
            "El host está asignando los turnos...";
        } else if (record.fase === "juego") {
          document.getElementById("vista-espera").classList.add("oculto");
          document.getElementById("vista-dados-jugador").classList.add("oculto");
          document.getElementById("vista-juego").classList.remove("oculto");
          document.getElementById("bienvenida").textContent = "¡Hola, " + miNombre + "!";
          await verificarTurnoInicial();
        }
      }
    )
    .subscribe();

  sb.channel("jugadores_puntaje_" + Date.now())
    .on("postgres_changes",
      { event: "UPDATE", schema: "public", table: "jugadores" },
      async function(payload) {
        const record = payload.new;
        if (record.nombre === miNombre) {
          document.getElementById("mi-puntaje").textContent = record.puntaje;
          await actualizarCantidadesPU();
        }
      }
    )
  .subscribe();

  sb.channel("turno_activo_jugador_" + Date.now())
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      async function(payload) {
        const record = payload.new;
        if (record.fase !== "juego") return;
        await verificarMiTurno(record.turno_activo);
      }
    )
    .subscribe();

  escucharDados();
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

  if (yaBuzzee) {
    // Ya apretó — mantener apretado visualmente
    btn.classList.add("buzzer-apretado");
    btn.textContent = "✓";
    btn.onclick = null;
  } else {
    btn.classList.remove("buzzer-apretado");
    btn.textContent = "●";
    btn.onclick = aprestarBuzzer;
  }
}

function desactivarBuzzer() {
  mostrarBuzzer();
  const btn = document.getElementById("buzzer-btn");

  if (yaBuzzee) {
    // Mantener visual de apretado aunque esté desactivado
    btn.classList.remove("buzzer-desactivado");
    btn.classList.add("buzzer-apretado");
    btn.textContent = "✓";
  } else {
    btn.classList.add("buzzer-desactivado");
    btn.classList.remove("buzzer-apretado");
    btn.textContent = "●";
  }
  btn.onclick = null;
}

async function aprestarBuzzer() {
  if (!miNombre || yaBuzzee) return;
  yaBuzzee = true; // bloquear inmediatamente para evitar doble tap

  await dbBuzzerApretar(miNombre);

  const btn = document.getElementById("buzzer-btn");
  btn.classList.remove("buzzer-desactivado");
  btn.classList.add("buzzer-apretado");
  btn.textContent = "✓";
  btn.onclick = null; // ya no hace nada
}

async function tirarDado() {
  if (yaTire || !miNombre) return;
  yaTire = true;

  // Animación antes del resultado
  const btn = document.getElementById("btn-dado");
  const resultado_div = document.getElementById("resultado-dado-jugador");
  btn.classList.add("dado-girando");
  btn.textContent = "...";

  // Esperar animación
  await new Promise(r => setTimeout(r, 1000));

  const resultado = Math.floor(Math.random() * 12) + 1;
  await dbGuardarResultadoDado(miNombre, resultado);

  btn.classList.remove("dado-girando");
  btn.textContent = resultado;
  btn.classList.add("dado-apretado");
  btn.onclick = null;

  resultado_div.textContent = "Obtuviste " + resultado;
}

async function verificarMiTurno(turnoActivo) {
  const turnos = await dbLeerTurnos();
  const miTurno = turnos.find(t => t.nombre === miNombre);
  if (!miTurno) return;

  const bienvenida = document.getElementById("bienvenida");
  const esMiTurno = Number(miTurno.turno) === Number(turnoActivo);

  if (esMiTurno) {
    bienvenida.textContent = miNombre;
    bienvenida.style.color = "#4caf82";
    bienvenida.style.fontSize = "1.6rem";
  } else {
    bienvenida.textContent = miNombre;
    bienvenida.style.color = "";
    bienvenida.style.fontSize = "";
  }
}

// También verificar al entrar al juego
async function verificarTurnoInicial() {
  const estado = await dbLeerEstado();
  if (estado && estado.fase === "juego") {
    await verificarMiTurno(estado.turno_activo);
  }
}

async function escucharDados() {
  sb.channel("dados_jugador")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      async function(payload) {
        const record = payload.new;
        if (record.fase !== "juego") return;
        if (!record.fase_dado || record.fase_dado === "") {
          ocultarDadosJugador();
          return;
        }

        // Verificar si es mi turno
        const turnos = await dbLeerTurnos();
        const turnoActivo = Number(record.turno_activo) || 1;
        const miTurnoData = turnos.find(t => t.nombre === miNombre);
        const esMiTurno = miTurnoData && Number(miTurnoData.turno) === turnoActivo;

        if (!esMiTurno) {
          ocultarDadosJugador();
          return;
        }

        // Mostrar el dado correcto según la fase
        if (record.fase_dado === "categoria" && Number(record.dado_categoria) === 0) {
          mostrarDadoJugador("categoria");
        } else if (record.fase_dado === "pregunta" && Number(record.dado_pregunta) === 0) {
          mostrarDadoJugador("pregunta");
        } else if (record.fase_dado === "resultado") {
          ocultarDadosJugador();
        }
      }
    )
    .subscribe();
}

function mostrarDadoJugador(tipo) {
  const contenedor = document.getElementById("dado-jugador-contenedor");
  const label = document.getElementById("dado-jugador-label");
  if (!contenedor || !label) return;

  contenedor.classList.remove("oculto");

  if (tipo === "categoria") {
    label.textContent = "Presioná para seleccionar categoría";
    document.getElementById("btn-dado-jugador").onclick = tirarDadoCategoria;
  } else {
    label.textContent = "Presioná para seleccionar pregunta";
    document.getElementById("btn-dado-jugador").onclick = tirarDadoPregunta;
  }
}

function ocultarDadosJugador() {
  const contenedor = document.getElementById("dado-jugador-contenedor");
  if (contenedor) contenedor.classList.add("oculto");
}

async function tirarDadoCategoria() {
  const btn = document.getElementById("btn-dado-jugador");
  btn.classList.add("dado-girando");
  btn.onclick = null;
  await new Promise(r => setTimeout(r, 1000));
  const resultado = Math.floor(Math.random() * 8) + 1; // dado de 8
  btn.classList.remove("dado-girando");
  btn.textContent = resultado;
  btn.classList.add("dado-apretado");
  await recibirResultadoDadoJugador("categoria", resultado);
}

async function tirarDadoPregunta() {
  const btn = document.getElementById("btn-dado-jugador");
  btn.classList.add("dado-girando");
  btn.onclick = null;
  await new Promise(r => setTimeout(r, 1000));
  const resultado = Math.floor(Math.random() * 12) + 1; // dado de 12
  btn.classList.remove("dado-girando");
  btn.textContent = resultado;
  btn.classList.add("dado-apretado");
  await recibirResultadoDadoJugador("pregunta", resultado);
}

async function recibirResultadoDadoJugador(tipo, valor) {
  const estado = await dbLeerEstado();

  if (tipo === "categoria") {
    await dbSetDados(valor, 0, "pregunta");
    // No ocultar acá — el listener detecta fase_dado="pregunta" y muestra el dado de pregunta
  } else if (tipo === "pregunta") {
    await dbSetDados(estado.dado_categoria, valor, "resultado");
    // Ocultar solo cuando es resultado final
    setTimeout(function() {
      const btn = document.getElementById("btn-dado-jugador");
      if (btn) {
        btn.classList.remove("dado-apretado", "dado-girando");
        btn.textContent = "⬡";
      }
      ocultarDadosJugador();
    }, 1500);
  }
}

const POWERUP_INFO = {
  saltar: {
    nombre: "⏭ Saltar turno",
    // ↓ EDITÁ ESTA DESCRIPCIÓN
    descripcion: "Saltás tu turno sin consecuencias. La categoría y pregunta seleccionada pasan al siguiente jugador.",
    color: "saltar"
  },
  amigo: {
    nombre: "📞 Llamar a un amigo",
    // ↓ EDITÁ ESTA DESCRIPCIÓN
    descripcion: "Podés pedirle a otra persona fuera del juego que responda la pregunta por vos, incluso llamarle a alguien. Si no te contesta pierdes el turno.",
    color: "amigo"
  },
  twist: {
    nombre: "🌀 Twist",
    // ↓ EDITÁ ESTA DESCRIPCIÓN
    descripcion: "Caos. Modifica la pregunta sea para bien o para mal.",
    color: "twist"
  }
};

let puActivo = null; // power up actualmente abierto en el panel

async function actualizarCantidadesPU() {
  const jugadores = await dbLeerJugadores();
  const yo = jugadores.find(j => j.nombre === miNombre);
  if (!yo) return;

  ["saltar", "amigo", "twist"].forEach(function(tipo) {
    const campo = tipo === "saltar" ? "pu_saltar"
      : tipo === "amigo" ? "pu_amigo" : "pu_twist";
    const cantidad = Number(yo[campo]) || 0;

    // Actualizar contador
    const el = document.getElementById("pu-cantidad-" + tipo);
    if (el) el.textContent = "x" + cantidad;

    // Marcar como agotado si es 0
    const btn = document.querySelector(".pu-" + tipo);
    if (btn) {
      if (cantidad === 0) btn.classList.add("agotado");
      else btn.classList.remove("agotado");
    }
  });
}

async function abrirPowerUp(tipo) {
  const jugadores = await dbLeerJugadores();
  const yo = jugadores.find(j => j.nombre === miNombre);
  const campo = tipo === "saltar" ? "pu_saltar"
    : tipo === "amigo" ? "pu_amigo" : "pu_twist";

  if (!yo || Number(yo[campo]) <= 0) return; // agotado

  puActivo = tipo;
  const info = POWERUP_INFO[tipo];
  const estado = await dbLeerEstado();
  const turnos = await dbLeerTurnos();
  const turnoActivo = Number(estado?.turno_activo) || 1;
  const miTurnoData = turnos.find(t => t.nombre === miNombre);
  const esMiTurno = miTurnoData && Number(miTurnoData.turno) === turnoActivo;

  // Rellenar panel
  document.getElementById("panel-pu-titulo").textContent = info.nombre;
  document.getElementById("panel-pu-descripcion").textContent = info.descripcion;

  // Color del panel
  const contenido = document.getElementById("panel-pu-contenido");
  contenido.className = "color-" + info.color;

  // Botón usar
  const btnUsar = document.getElementById("btn-usar-pu");
  btnUsar.className = "";
  if (esMiTurno) {
    btnUsar.textContent = "USAR POWER UP";
    btnUsar.classList.add("pu-activo-" + tipo);
    btnUsar.disabled = false;
  } else {
    btnUsar.textContent = "Solo puede usarse cuando sea tu turno";
    btnUsar.classList.add("pu-desactivado");
    btnUsar.disabled = true;
  }

  document.getElementById("panel-powerup").classList.remove("oculto");
}

function cerrarPowerUp() {
  puActivo = null;
  document.getElementById("panel-powerup").classList.add("oculto");
}

async function usarPowerUp() {
  if (!puActivo || !miNombre) return;
  await dbSolicitarPowerUp(miNombre, puActivo);
  cerrarPowerUp();
}

// tipo puede ser "saltar" o "amigo" — aplica el color correcto via CSS
function mostrarBannerPU(mensaje, tipo) {
  const banner = document.getElementById("banner-pu");
  if (!banner) return;

  // Limpiar clases de color anteriores y aplicar la nueva
  banner.className = "banner-" + tipo;
  banner.textContent = mensaje;
  banner.style.display = "block";

  setTimeout(function() {
    banner.style.display = "none";
    banner.className = "";
  }, 5000);
}
