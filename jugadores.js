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
  document.getElementById("bienvenida").textContent = "¡Hola, " + nombre + "!";
  document.getElementById("mi-puntaje").textContent = existe ? existe.puntaje : 0;
  if (estado.activa) mostrarPreguntaJugador(estado);
}

escucharRealtime();
}

async function escucharRealtime() {
  // Al inicio de escucharRealtime, antes de los canales existentes
  sb.channel("fase_jugador")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "estado_juego" },
    async function(payload) {
      const record = payload.new;
      if (record.fase === "dados") {
        document.getElementById("vista-espera").classList.add("oculto");
        document.getElementById("vista-dados-jugador").classList.remove("oculto");
        yaTire = false;
      } else if (record.fase === "manual") {
        // En asignación manual los jugadores solo esperan
        document.getElementById("vista-espera").classList.remove("oculto");
        document.getElementById("vista-dados-jugador").classList.add("oculto");
        document.querySelector("#espera-box .subtitulo").textContent =
          "El host está asignando los turnos...";
      } else if (record.fase === "juego") {
        document.getElementById("vista-espera").classList.add("oculto");
        document.getElementById("vista-dados-jugador").classList.add("oculto");
        document.getElementById("vista-juego").classList.remove("oculto");
        document.getElementById("bienvenida").textContent = "¡Hola, " + miNombre + "!";
        await verificarTurnoInicial(); // ← agregá esta línea
      }
    }
  )
  .subscribe();
  // Escuchar cambios en estado del juego
  sb.channel("estado_juego_jugador")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "estado_juego" },
    function(payload) {
      const record = payload.new;
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

  sb.channel("turno_activo_jugador_" + miNombre)
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      async function(payload) {
        const record = payload.new;
        if (record.fase !== "juego") return;
        await verificarMiTurno(record.turno_activo);
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
    bienvenida.textContent = "¡Es tu turno, " + miNombre + "!";
    bienvenida.style.color = "#4caf82";
    bienvenida.style.fontSize = "1.6rem";
  } else {
    bienvenida.textContent = "¡Hola, " + miNombre + "!";
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
