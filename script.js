// ---- DATOS DEL JUEGO ---- //

const categories = [
  {
    name: "Perder",
    questions: [
      {
        text: "Huevo",
        description: "Hace algo con el huevo que no esté en mi lista",
        answered: false,
        win: [
          { condition: "Hizo algo diferente", points: 1000 }
        ],
        lose: [
          { condition: "Tirarlo", points: -500 },
          { condition: "Comerlo", points: -450 },
          { condition: "Romperlo", points: -400 },
          { condition: "Empollarlo", points: -350 },
          { condition: "Dibujarle algo", points: -300 },
          { condition: "Hacerlo girar", points: -250 },
          { condition: "Darle un nombre", points: -200 },
          { condition: "Regalarlo", points: -150 },
          { condition: "Hablarle", points: -100 },
          { condition: "Dejarlo", points: -50 },
        ]
      },
      {
        text: "Ruleta",
        description: "De entre las personas que hay se elige cuantos puntos quien le da a quien",
        answered: false,
        win: [
          { condition: "Sujeto a la ruleta", points: 0 }
        ],
        lose: [
          { condition: "Sujeto a la ruleta", points: 0 }
        ]
      },
      {
        text: "Presentación",
        description: "Presentá una presentación por mí sin reírte",
        answered: false,
        win: [
          { condition: "Presentó", points: 1000 }
        ],
        lose: [
          { condition: "Se rió", points: -1000 }
        ]
      },
      {
        text: "Ecolocación",
        description: "Usa el poder de la ecolocación para pasar ciego por una ruta desconocida",
        answered: false,
        win: [
          { condition: "Llegó al final", points: 1000 }
        ],
        lose: [
          { condition: "Chocar contra un objeto", points: -200 },
          { condition: "Se quita la venda", points: -2000 },
          { condition: "No usó ecolocación", points: -1500 }
        ]
      },
      {
        text: "Termómetro",
        description: "Escondí un objeto alrededor nuestro, podés preguntarme la temperatura pero perdés puntos",
        answered: false,
        win: [
          { condition: "Encontró el objeto", points: 1000 }
        ],
        lose: [
          { condition: "Termómetro", points: -200 },
          { condition: "Se rindió", points: -1000 }
        ]
      },
      {
        text: "Hablá con mi IA",
          description: "Formá una opinión y hacé que mi IA coincida contigo",
        answered: false,
        win: [
          { condition: "Llegaron a un acuerdo", points: 1000 }
        ],
        lose: [
          { condition: "Se rindió", points: -1000 },
          { condition: "Se quedó sin tokens", points: -500 }
        ]
      }
    ]
  },
  {
    name: "Pelada",
    estrivia: false,
    questions: [
      {
        text: "Llamada Preseescrita",
        description: "Llamale a alguien sabiendo 5 palabras elegidas por nosotros que debes incluir en la conversación sin que se de cuenta la persona llamada",
        answered: false,
        win: [
          { condition: "Puntos por palabra", points: 150 }
        ],
        lose: [
          { condition: "No le contestó", points: -300 },
          { condition: "Pilló que algo andaba mal", points: -500 },
          { condition: "Se rindió antes de decir las 5 palabras", points: -400 },
        ]
      },
      {
        text: "Historia",
        description: "Subí una historia con una oración creada por los demás jugadores",
        answered: false,
        win: [
          { condition: "Publicó en una red social", points: 350 }
        ],
        lose: [
          { condition: "No publicar", points: -700 }
        ]
      },
      {
        text: "Improvización",
        description: "Hacé la improvisación con el tema elegido por los demás jugadores",
        answered: false,
        win: [
          { condition: "Realizó la improvización", points: 350 },
          { condition: "Hizo reír a alguien", points: 100 }
        ],
        lose: [
          { condition: "Se rió", points: -150 },
          { condition: "Salió del personaje", points: -100 },
          { condition: "No hizo la improvización", points: -700 }
        ]
      },
      {
        text: "Baile",
        description: "Tenes que hacer el baile elegido por los demás jugadores",
        answered: false,
        win: [
          { condition: "Bailó", points: 350 },
        ],
        lose: [
          { condition: "No bailó", points: -700 }
        ]
      },
      {
        text: "A Capela",
        description: "Cantá la canción elegida por los jugadores",
        answered: false,
        win: [
          { condition: "Cantó", points: 350 },
        ],
        lose: [
          { condition: "No cantó", points: -700 }
        ]
      },
      {
        text: "Chistoso",
        description: "Contá mis chistes",
        answered: false,
        win: [
          { condition: "Hizo reir a una persona", points: 350 },
        ],
        lose: [
          { condition: "No hizo reír a nadie", points: -700 }
        ]
      },
      {
        text: "Loro",
        description: "Imitá estos sonidos",
        answered: false,
        win: [
          { condition: "Imitó bien", points: 75 },
        ],
        lose: [
          { condition: "Imitó mal", points: -100 }
        ]
      },
      {
        text: "Resistí el cringe",
        description: "Camos a pasar uno a uno e intentar hacerte cringear",
        answered: false,
        win: [
          { condition: "Resistió", points: 350 },
        ],
        lose: [
          { condition: "No resisiió", points: -700 }
        ]
      },
      {
        text: "Freestyle",
        description: "Lográ tirar barras y hacer un freestyle minimamente decente",
        answered: false,
        win: [
          { condition: "Freestyleó", points: 350 },
        ],
        lose: [
          { condition: "No se bancó", points: -700 },
          { condition: "No rimó", points: -50 }
        ]
      },
    ]
  },
  {
    name: "Suerte",
    questions: [
      {
        text: "Moneda",
        description: "¿Cara o cruz?",
        answered: false,
        win: [
          { condition: "Acertó", points: 500 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Distancia",
        description: "A cuantos kilómetros estamos del lugar seleccionado por los demás jugadores, tolerancia de +/- 1.5km",
        answered: false,
        win: [
          { condition: "Acertó", points: 500 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Temperatura",
        description: "Cuantos grados hacen ahora mismo +/- 1ºC",
        answered: false,
        win: [
          { condition: "Acertó", points: 500 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Norte",
        description: "Apunta al norte +/- 10º",
        answered: false,
        win: [
          { condition: "Acertó", points: 500 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Ndapytai",
        description: "Ndapytai",
        answered: false,
        win: [
          { condition: "Primero", points: 500 },
        ],
        lose: [
          { condition: "Último", points: -500 }
        ]
      },
      {
        text: "Música",
        description: "Decí el BPM de la música seleccionada por los edmás jugadores +/- 5 BPM",
        answered: false,
        win: [
          { condition: "Acertó", points: 500 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Telepatía",
        description: "En tres intentos intentá decir la misma palabra con otro jugador",
        answered: false,
        win: [
          { condition: "Acertaron", points: 500 },
          { condition: "Compañero", points: 100 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Frasco",
        description: "Cuantos arroces hay en este frasco +/- 100",
        answered: false,
        win: [
          { condition: "Acertó", points: 500 },
        ],
        lose: [
          { condition: "Perdió", points: -500 }
        ]
      },
      {
        text: "Receta",
        description: "Adiviná que lleva este postre",
        answered: false,
        win: [
          { condition: "Ingrediente correcto", points: 50 },
        ],
        lose: [
          { condition: "Ingrediente faltante", points: -100 },
          { condition: "Ingrediente extra", points: -50 }
        ]
      },
      {
        text: "Yummy",
        description: "Evitá que coma tu osito",
        answered: false,
        win: [
          { condition: "Por osito comido", points: 100 },
        ],
        lose: [
          { condition: "Comí el osito", points: -500 }
        ]
      }
    ]
  },
  {
    name: "Contrarreloj",
    questions: [
      { text: "Rosado",points: 100, answered: false },
      { text: "Try not to Laugh",points: 200, answered: false },
      { text: "Matemática",points: 300, answered: false },
      { text: "Barra",points: 300, answered: false },
      { text: "Leche",points: 300, answered: false },
      { text: "Soplame las bolas",points: 300, answered: false },
      { text: "Resorte",points: 300, answered: false }
    ]
  },
  {
    name: "Versus",
    questions: [
      { text: "Tembleque",points: 100, answered: false },
      { text: "Ajedrez",points: 200, answered: false },
      { text: "Zoom",points: 300, answered: false },
      { text: "Hakembo",points: 300, answered: false },
      { text: "Precio",points: 300, answered: false },
      { text: "1, 2, 3, Miro",points: 300, answered: false },
      { text: "Vaso",points: 300, answered: false },
      { text: "Tutti Frutti",points: 300, answered: false }
    ]
  },
  {
    name: "Habilidad",
    questions: [
      { text: "Llamada Preescrita",points: 100, answered: false },
      { text: "Historia",points: 200, answered: false },
      { text: "Actuacion",points: 300, answered: false },
      { text: "Baile",points: 300, answered: false },
      { text: "Karaoke",points: 300, answered: false },
      { text: "Payaso",points: 300, answered: false },
      { text: "Loro",points: 300, answered: false },
      { text: "Try not to cringe",points: 300, answered: false },
      { text: "Freestyle",points: 300, answered: false }
    ]
  },
  {
    name: "Maldición o Bendición?",
    questions: [
      { text: "Afirmativo y Negativo",points: 100, answered: false },
      { text: "Preguntas",points: 200, answered: false },
      { text: "Eco",points: 300, answered: false },
      { text: "Mimica",points: 300, answered: false },
      { text: "Regla",points: 300, answered: false },
      { text: "Metemela Dentro",points: 300, answered: false },
      { text: "Naipes",points: 300, answered: false },
      { text: "Arroz",points: 300, answered: false }
    ]
  },
  {
  name: "Trivia",
  estrivia: true, // ← flag especial para identificarla
  questions: [
    {
      text: "Paraguay",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "¿Cuál es la capital de Paraguay?" },
        { puntaje: 200, pregunta: "¿En qué año se fundó Asunción?" },
        { puntaje: 300, pregunta: "¿Cuál es el río más largo de Paraguay?" },
        { puntaje: 400, pregunta: "¿Cómo se llama la represa compartida con Brasil?" },
        { puntaje: 500, pregunta: "¿Cuántos departamentos tiene Paraguay?" }
      ]
    },
    {
      text: "Vexología",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Mujeres",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Quesos",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Gramatica",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Mundiales",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Árboles",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Física",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Sentido Común",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "2010",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Anatomía",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    },
    {
      text: "Ariel",
      answered: false,
      niveles: [
        { puntaje: 100, pregunta: "Pregunta 100 de Vexología" },
        { puntaje: 200, pregunta: "Pregunta 200 de Vexología" },
        { puntaje: 300, pregunta: "Pregunta 300 de Vexología" },
        { puntaje: 400, pregunta: "Pregunta 400 de Vexología" },
        { puntaje: 500, pregunta: "Pregunta 500 de Vexología" }
      ]
    }
    // ... el resto de subcategorías igual
  ]
}
];

let ultimoMensajeConsola = ""; // ← agregá al inicio de script.js

function actualizarConsolaHost(mensaje) {
  // Evitar duplicados consecutivos
  if (mensaje === ultimoMensajeConsola) return;
  ultimoMensajeConsola = mensaje;

  const consola = document.getElementById("consola-dados");
  if (!consola) return;
  const linea = document.createElement("div");
  linea.className = "consola-linea";
  linea.textContent = mensaje;
  consola.appendChild(linea);
  consola.scrollTop = consola.scrollHeight;
}

// ---- NAVEGACIÓN ---- //
async function loadCategory(index) {
  await dbSetEstado("", "", "", false);
  // Limpiar fase_dado al navegar a una categoría
  await dbSetDados(0, 0, "");
  ultimaFaseDado = "";

  const category = categories[index];
  const container = document.getElementById("question-list");
  container.innerHTML = `<h2>${category.name}</h2>`;

  category.questions.forEach(function(question, questionIndex) {
    const btn = document.createElement("button");
    btn.textContent = question.text;
    if (question.answered) {
      btn.classList.add("answered-btn");
      btn.textContent += " ✓";
    }
    btn.onclick = function() {
      if (category.estrivia) {
        loadTrivia(index, questionIndex);
      } else {
        loadQuestion(index, questionIndex);
      }
    };
    container.appendChild(btn);
  });
}


async function loadQuestion(categoryIndex, questionIndex) {
  const question = categories[categoryIndex].questions[questionIndex];

  // Avisar a pantalla y jugadores via Supabase
  await dbSetEstado(
    categories[categoryIndex].name,
    question.text,
    question.description,
    true
  );
  const container = document.getElementById("question-list");

  const winRows = question.win.map(function(w, i) {
    return `
      <div class="outcome-row">
        <div class="outcome win-box">
          <span class="outcome-label">✅ Win</span>
          <span class="outcome-condition">${w.condition}</span>
          <span class="outcome-points">+${w.points} pts</span>
        </div>
        <div class="puntaje-inputs" id="win-inputs-${i}"></div>
      </div>
    `;
  }).join("");

  const loseRows = question.lose.map(function(l, i) {
    return `
      <div class="outcome-row">
        <div class="outcome lose-box">
          <span class="outcome-label">❌ Lose</span>
          <span class="outcome-condition">${l.condition}</span>
          <span class="outcome-points">${l.points} pts</span>
        </div>
        <div class="puntaje-inputs" id="lose-inputs-${i}"></div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="question-header">
      <button onclick="loadCategory(${categoryIndex})">← Volver</button>
      <h2>${categories[categoryIndex].name} — ${question.text}</h2>
    </div>
    <div class="question-card ${question.answered ? "answered" : ""}">
      <p class="question-text">${question.text}</p>
      <p class="question-description">${question.description}</p>
      <div id="outcomes-container">
        ${winRows}
        ${loseRows}
      </div>
    </div>
  `;

  await renderizarInputsJugadores(question);

  if (!question.answered) {
    const markBtn = document.createElement("button");
    markBtn.textContent = "Marcar como respondida";
    markBtn.onclick = function() {
      question.answered = true;
      loadCategory(categoryIndex);
    };
    container.appendChild(markBtn);
  }
}

async function loadTrivia(categoryIndex, questionIndex) {
  const question = categories[categoryIndex].questions[questionIndex];

  await dbSetEstadoTrivia(
    categories[categoryIndex].name,
    question.text,
    "",
    true,
    "trivia-niveles",
    0,
    false // buzzer desactivado al inicio
  );

  await dbBuzzerReset();

  const container = document.getElementById("question-list");

  const nivelesHTML = question.niveles.map(function(n, i) {
    return `
      <button class="btn-nivel" onclick="loadTriviaPregunта(${categoryIndex}, ${questionIndex}, ${i})">
        <span class="nivel-puntaje">${n.puntaje} pts</span>
      </button>
    `;
  }).join("");

  container.innerHTML = `
    <div class="question-header">
      <button onclick="loadCategory(${categoryIndex})">← Volver</button>
      <h2>Trivia — ${question.text}</h2>
    </div>

    <div class="question-card">
      <p class="question-description">Seleccioná el nivel de puntaje:</p>
      <div class="niveles-grid">
        ${nivelesHTML}
      </div>
    </div>

    <div id="buzzer-controles">
      <button id="btn-habilitar-buzzer" onclick="habilitarBuzzer()">
        🟢 Habilitar buzzer
      </button>
      <button onclick="resetBuzzer()">🔄 Resetear buzzer</button>
    </div>

    <div id="buzzer-panel">
      <h3>Orden del buzzer</h3>
      <div id="buzzer-lista"></div>
    </div>

    <div id="puntaje-trivia-panel"></div>
  `;

  // Al final de loadTrivia, después de escucharBuzzer()
  escucharBuzzer();
  await actualizarListaBuzzer(); // ← carga entradas existentes al abrir
}

async function habilitarBuzzer() {
  await dbSetBuzzer(true);
  document.getElementById("btn-habilitar-buzzer").textContent = "🔴 Desactivar buzzer";
  document.getElementById("btn-habilitar-buzzer").onclick = desactivarBuzzer;
}

async function desactivarBuzzer() {
  await dbSetBuzzer(false);
  document.getElementById("btn-habilitar-buzzer").textContent = "🟢 Habilitar buzzer";
  document.getElementById("btn-habilitar-buzzer").onclick = habilitarBuzzer;
}

async function resetBuzzer() {
  await dbBuzzerReset();
  await dbSetBuzzer(false);
  document.getElementById("buzzer-lista").innerHTML = "";
  document.getElementById("btn-habilitar-buzzer").textContent = "🟢 Habilitar buzzer";
  document.getElementById("btn-habilitar-buzzer").onclick = habilitarBuzzer;
}


async function loadTriviaPregunта(categoryIndex, questionIndex, nivelIndex) {
  const question = categories[categoryIndex].questions[questionIndex];
  const nivel = question.niveles[nivelIndex];

  // Mandar pregunta específica a pantalla grande
  await dbSetEstadoTrivia(
    categories[categoryIndex].name,
    question.text,
    nivel.pregunta,
    true,
    "trivia-pregunta",
    nivel.puntaje
  );

  // Mostrar panel de puntaje para asignar
  const panel = document.getElementById("puntaje-trivia-panel");
  const jugadores = await dbLeerJugadores();

  const inputsHTML = jugadores.map(function(j) {
    return `
      <div class="jugador-input-wrap">
        <span class="jugador-nombre-label">${j.nombre}</span>
        <button class="btn-win" onclick="asignarTrivia('${j.nombre}', ${nivel.puntaje})">
          +${nivel.puntaje}
        </button>
        <button class="btn-lose" onclick="asignarTrivia('${j.nombre}', -${nivel.puntaje})">
          -${nivel.puntaje}
        </button>
      </div>
    `;
  }).join("");

  panel.innerHTML = `
    <h3>Asignar puntaje — ${nivel.puntaje} pts</h3>
    ${inputsHTML}
  `;
}


async function asignarTrivia(nombre, puntos) {
  const jugadores = await dbLeerJugadores();
  const jugador = jugadores.find(j => j.nombre === nombre);
  if (!jugador) return;
  await dbActualizarPuntaje(nombre, jugador.puntaje + puntos);
  mostrarFeedback(nombre, puntos);
}


async function resetBuzzer() {
  await dbBuzzerReset();
  document.getElementById("buzzer-lista").innerHTML = "";
}


let canalBuzzer = null; // ← variable global, agregala al inicio del archivo

function escucharBuzzer() {
  // Si ya hay un canal activo, lo removemos completamente antes de crear uno nuevo
  if (canalBuzzer) {
    sb.removeChannel(canalBuzzer);
    canalBuzzer = null;
  }

  canalBuzzer = sb.channel("buzzer_host_" + Date.now()) // nombre único cada vez
    .on("postgres_changes",
      { event: "INSERT", schema: "public", table: "buzzer" },
      async function(payload) {
        console.log("Buzzer recibido:", payload); // para verificar en consola
        await actualizarListaBuzzer();
      }
    )
    .subscribe(function(status) {
      console.log("Estado canal buzzer:", status); // para verificar en consola
    });
}

async function actualizarListaBuzzer() {
  const lista = document.getElementById("buzzer-lista");
  if (!lista) return; // si no existe el div, no hacer nada
  const orden = await dbBuzzerLeer();
  lista.innerHTML = orden.map(function(b, i) {
    return `
      <div class="buzzer-entrada ${i === 0 ? "buzzer-primero" : ""}">
        <span class="buzzer-pos">${i + 1}°</span>
        <span class="buzzer-nombre">${b.nombre}</span>
      </div>
    `;
  }).join("");
}

async function renderizarInputsJugadores(question) {
  const jugadores = await dbLeerJugadores();

  if (jugadores.length === 0) {
    document.getElementById("outcomes-container").insertAdjacentHTML(
      "beforeend",
      "<p class='sin-jugadores'>Ningún jugador conectado aún.</p>"
    );
    return;
  }

  question.win.forEach(function(w, i) {
    const contenedor = document.getElementById("win-inputs-" + i);
    if (!contenedor) return;
    contenedor.innerHTML = ""; // ← limpia antes de rerenderizar
    jugadores.forEach(function(j) {
      contenedor.appendChild(crearInputJugador(j.nombre, w.points));
    });
  });

  question.lose.forEach(function(l, i) {
    const contenedor = document.getElementById("lose-inputs-" + i);
    if (!contenedor) return;
    contenedor.innerHTML = ""; // ← limpia antes de rerenderizar
    jugadores.forEach(function(j) {
      contenedor.appendChild(crearInputJugador(j.nombre, l.points));
    });
  });
}


function crearInputJugador(nombre, puntosDefault) {
  const wrap = document.createElement("div");
  wrap.className = "jugador-input-wrap";

  const label = document.createElement("span");
  label.className = "jugador-nombre-label";
  label.textContent = nombre;

  const input = document.createElement("input");
  input.type = "number";
  input.value = puntosDefault;
  input.className = "input-puntos";

  const btn = document.createElement("button");
  btn.textContent = "Añadir";
  btn.className = "btn-añadir";
  btn.onclick = async function() {
    await agregarPuntaje(nombre, parseInt(input.value));
  };

  wrap.appendChild(label);
  wrap.appendChild(input);
  wrap.appendChild(btn);
  return wrap;
}


async function agregarPuntaje(nombre, puntos) {
  const jugadores = await dbLeerJugadores();
  const jugador = jugadores.find(j => j.nombre === nombre);
  if (!jugador) return;
  await dbActualizarPuntaje(nombre, jugador.puntaje + puntos);
  mostrarFeedback(nombre, puntos);
}


function mostrarFeedback(nombre, puntos) {
  const signo = puntos >= 0 ? "+" : "";
  const msg = document.createElement("div");
  msg.className = "feedback-puntos " + (puntos >= 0 ? "feedback-win" : "feedback-lose");
  msg.textContent = nombre + ": " + signo + puntos + " pts";
  document.getElementById("question-list").appendChild(msg);
  setTimeout(function() { msg.remove(); }, 2000);
}


async function resetJuego() {
  const confirmar = confirm("¿Seguro? Esto resetea absolutamente todo el juego.");
  if (!confirmar) return;

  await dbResetJugadores();
  await dbResetTurnos();
  await dbBuzzerReset();

  // Reset explícito fila por fila para asegurar que Supabase lo recibe
  const { error } = await sb.from("estado_juego").update({
    categoria: "",
    nombre: "",
    descripcion: "",
    activa: false,
    modo: "normal",
    puntaje_activo: 0,
    buzzer_activo: false,
    fase: "lobby",
    turno_activo: 1,
    ronda: 1,
    mostrar_puntajes: false,
    dado_categoria: 0,
    dado_pregunta: 0,
    fase_dado: ""
  }).eq("id", 1);

  if (error) {
    console.error("Error en reset:", error);
    alert("Error al resetear: " + error.message);
    return;
  }

  // Limpiar consola visual
  const consola = document.getElementById("consola-dados");
  if (consola) consola.innerHTML = "";

  // Limpiar preguntas respondidas en memoria
  categories.forEach(function(cat) {
    cat.questions.forEach(function(q) { q.answered = false; });
  });

  mostrarLobbyHost();
  await dbResetSolicitudes();
}

let canalJugadores = null; // ← agregá esta variable al inicio del archivo

function escucharJugadoresNuevos() {
  if (canalJugadores) {
    sb.removeChannel(canalJugadores);
    canalJugadores = null;
  }

  canalJugadores = sb.channel("jugadores_host_" + Date.now())
    .on("postgres_changes",
      { event: "*", schema: "public", table: "jugadores" },
      async function() {
        await actualizarContadorJugadores();
        const estado = await dbLeerEstado();
        if (estado && estado.activa) {
          const categoria = categories.find(c => c.name === estado.categoria);
          if (categoria) {
            const pregunta = categoria.questions.find(q => q.text === estado.nombre);
            if (pregunta) await renderizarInputsJugadores(pregunta);
          }
        }
      }
    )
    .subscribe();
}


// Al cargar, verificar fase
window.addEventListener("load", async function() {
  const estado = await dbLeerEstado();
  if (estado.fase === "lobby") {
    mostrarLobbyHost();
  } else {
    mostrarJuegoHost();
  }
  escucharJugadoresNuevos();
});

function mostrarLobbyHost() {
  document.getElementById("vista-lobby-host").classList.remove("oculto");
  document.getElementById("vista-juego-host").classList.add("oculto");
  actualizarContadorJugadores();
}



async function actualizarContadorJugadores() {
  const jugadores = await dbLeerJugadores();
  document.getElementById("contador-jugadores").textContent =
    jugadores.length + " jugador" + (jugadores.length !== 1 ? "es" : "") + " conectado" + (jugadores.length !== 1 ? "s" : "");
  document.getElementById("jugadores-lobby-host").innerHTML =
    jugadores.map(function(j) {
      return `<div class="jugador-lobby-card">${j.nombre}</div>`;
    }).join("");
}

async function iniciarJuego() {
  const turnos = await dbLeerTurnos();
  console.log("Turnos antes de asignar:", turnos);
  // fijate si turno es 0 o ya tiene valor
  
  await dbAsignarTurnos();
  
  const turnosDespues = await dbLeerTurnos();
  console.log("Turnos después de asignar:", turnosDespues);
  
  await dbSetFase("juego");
  mostrarJuegoHost();
}

function mostrarJuegoHost() {
  document.getElementById("vista-lobby-host").classList.add("oculto");
  document.getElementById("vista-dados-host").classList.add("oculto");
  document.getElementById("vista-manual-host").classList.add("oculto");
  document.getElementById("vista-juego-host").classList.remove("oculto");

  const container = document.getElementById("category-buttons");
  container.innerHTML = "";
  categories.forEach(function(category, index) {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.onclick = function() { loadCategory(index); };
    container.appendChild(btn);
  });

  document.getElementById("question-list").innerHTML = "<p>Seleccioná una categoría.</p>";

  inicializarPanelControl(); // ← inicializar panel
  escucharSolicitudes();
}

async function darDados() {
  // Crear fila en turnos por cada jugador que no esté ya
  const jugadores = await dbLeerJugadores();
  const turnos = await dbLeerTurnos();
  const nombresEnTurnos = turnos.map(t => t.nombre);

  for (const j of jugadores) {
    if (!nombresEnTurnos.includes(j.nombre)) {
      await dbCrearTurno(j.nombre);
    }
  }

  await dbSetFase("dados");
  mostrarDadosHost();
}

function mostrarDadosHost() {
  document.getElementById("vista-lobby-host").classList.add("oculto");
  document.getElementById("vista-dados-host").classList.remove("oculto");
  document.getElementById("vista-juego-host").classList.add("oculto");
  escucharResultadosDados();
}

function escucharResultadosDados() {
  sb.channel("turnos_host")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "turnos" },
      async function() {
        await actualizarTablaTurnos();
      }
    )
    .subscribe();
}

async function actualizarTablaTurnos() {
  const turnos = await dbLeerTurnos();
  const contenedor = document.getElementById("tabla-turnos-host");
  if (!contenedor) return;

  contenedor.innerHTML = turnos.map(function(t) {
    const dado = t.resultado_dado > 0
      ? `<span class="dado-resultado">${t.resultado_dado}</span>`
      : `<span class="dado-pendiente">esperando...</span>`;
    const turno = t.turno > 0
      ? `<span class="turno-num">${t.turno}°</span>`
      : `<span class="dado-pendiente">—</span>`;
    return `
      <div class="fila-turno">
        <span class="turno-nombre">${t.nombre}</span>
        ${dado}
        ${turno}
      </div>
    `;
  }).join("");
}

async function asignacionManual() {
  // Crear filas en turnos por cada jugador que no esté ya
  const jugadores = await dbLeerJugadores();
  const turnos = await dbLeerTurnos();
  const nombresEnTurnos = turnos.map(t => t.nombre);

  for (const j of jugadores) {
    if (!nombresEnTurnos.includes(j.nombre)) {
      await dbCrearTurno(j.nombre);
    }
  }

  await dbSetFase("manual");
  mostrarManualHost();
}

async function mostrarManualHost() {
  document.getElementById("vista-lobby-host").classList.add("oculto");
  document.getElementById("vista-juego-host").classList.add("oculto");
  document.getElementById("vista-dados-host").classList.add("oculto");
  document.getElementById("vista-manual-host").classList.remove("oculto");

  await renderizarPanelManual();
  escucharTurnosManual();
}

async function renderizarPanelManual() {
  const turnos = await dbLeerTurnos();
  const contenedor = document.getElementById("tabla-manual-host");
  if (!contenedor) return;

  contenedor.innerHTML = turnos.map(function(t) {
    const valor = Number(t.resultado_dado) > 0 ? t.resultado_dado : "";
    const turnoTexto = Number(t.turno) > 0
      ? `<span class="turno-num">${t.turno}°</span>`
      : `<span class="dado-pendiente">—</span>`;

    return `
      <div class="fila-turno">
        <span class="turno-nombre">${t.nombre}</span>
        <input
          type="number"
          class="input-dado-manual"
          min="1" max="12"
          placeholder="--"
          value="${valor}"
          onchange="asignarDadoManual('${t.nombre}', this.value)"
        />
        ${turnoTexto}
      </div>
    `;
  }).join("");
}

async function asignarDadoManual(nombre, valor) {
  const num = parseInt(valor);
  if (isNaN(num) || num < 1 || num > 12) return;
  await dbSetDadoManual(nombre, num);
}

let canalTurnosManual = null;

function escucharTurnosManual() {
  if (canalTurnosManual) {
    sb.removeChannel(canalTurnosManual);
    canalTurnosManual = null;
  }

  canalTurnosManual = sb.channel("turnos_manual_" + Date.now())
    .on("postgres_changes",
      { event: "*", schema: "public", table: "turnos" },
      async function() {
        await renderizarPanelManual();
      }
    )
    .subscribe();
}

let canalPanelControl = null;

async function inicializarPanelControl() {
  await renderizarPanelControl();

  if (canalPanelControl) {
    sb.removeChannel(canalPanelControl);
    canalPanelControl = null;
  }

  canalPanelControl = sb.channel("panel_control_" + Date.now())
    .on("postgres_changes",
      { event: "*", schema: "public", table: "turnos" },
      async function() { await renderizarPanelControl(); }
    )
    .on("postgres_changes",
      { event: "*", schema: "public", table: "jugadores" },
      async function() { await renderizarPanelControl(); }
    )
    .on("postgres_changes",
      { event: "*", schema: "public", table: "estado_juego" },
      async function() { await renderizarPanelControl(); }
    )
    .subscribe();
}

async function renderizarPanelControl() {
  const [turnos, jugadores, estado] = await Promise.all([
    dbLeerTurnos(),
    dbLeerJugadores(),
    dbLeerEstado()
  ]);

  const turnoActivo = Number(estado?.turno_activo) || 1;
  const ronda = Number(estado?.ronda) || 1;

  // Actualizar contador de rondas
  const contadorRonda = document.getElementById("contador-ronda");
  if (contadorRonda) contadorRonda.textContent = "Ronda " + ronda;

  // Ordenar por turno
  const ordenados = [...turnos].sort((a, b) => Number(a.turno) - Number(b.turno));

  const contenedor = document.getElementById("panel-control-lista");
  if (!contenedor) return;

  contenedor.innerHTML = ordenados.map(function(t) {
    const jugador = jugadores.find(jug => jug.nombre === t.nombre) || { puntaje: 0, pu_saltar: 1, pu_amigo: 1, pu_twist: 1 };
    const esSuTurno = Number(t.turno) === turnoActivo;

    return `
      <div class="panel-fila ${esSuTurno ? "turno-activo-fila" : ""}">

        <div class="panel-indicador ${esSuTurno ? "indicador-verde" : "indicador-rojo"}"></div>

        <div class="panel-info">
          <span class="panel-nombre">${t.nombre}</span>
          <span class="panel-turno-num">Turno ${t.turno}°</span>
        </div>

        <div class="panel-puntaje-control">
          <span class="panel-puntaje">${jugador.puntaje} pts</span>
          <div class="panel-puntaje-btns">
            <input
              type="number"
              class="input-puntaje-panel"
              id="input-panel-${t.nombre}"
              value="100"
              min="1"
            />
            <button class="btn-sumar"
              onclick="modificarPuntajePanel('${t.nombre}', 1)">+</button>
            <button class="btn-restar"
              onclick="modificarPuntajePanel('${t.nombre}', -1)">−</button>
          </div>
        </div>
        
       <div class="panel-pu-control">
        <span class="panel-pu-item pu-color-saltar" title="Saltar turno">
          ⏭
          <input type="number" min="0" max="9"
            class="input-pu-panel"
            value="${jugador.pu_saltar || 0}"
            onchange="editarPU('${t.nombre}', 'saltar', this.value)"/>
        </span>
        <span class="panel-pu-item pu-color-amigo" title="Llamar a un amigo">
          📞
          <input type="number" min="0" max="9"
            class="input-pu-panel"
            value="${jugador.pu_amigo || 0}"
            onchange="editarPU('${t.nombre}', 'amigo', this.value)"/>
        </span>
        <span class="panel-pu-item pu-color-twist" title="Twist">
          🌀
          <input type="number" min="0" max="9"
            class="input-pu-panel"
            value="${jugador.pu_twist || 0}"
            onchange="editarPU('${t.nombre}', 'twist', this.value)"/>
        </span>
      </div>
      <button class="btn-dado-panel" onclick="darDadosJugador()" title="Dar dados">🎲</button>

      </div>
    `;
  }).join("");
}

async function modificarPuntajePanel(nombre, signo) {
  const input = document.getElementById("input-panel-" + nombre);
  const valor = parseInt(input?.value) || 0;
  if (valor <= 0) return;

  const jugadores = await dbLeerJugadores();
  const jugador = jugadores.find(j => j.nombre === nombre);
  if (!jugador) return;

  await dbActualizarPuntaje(nombre, jugador.puntaje + (valor * signo));
}

async function siguienteTurno() {
  // Si había un contador de "amigo" corriendo, lo apagamos
  await dbSetContadorAmigo("");
  await dbSiguienteTurno();
}

async function toggleMostrarPuntajes() {
  const estado = await dbLeerEstado();
  const actual = estado?.mostrar_puntajes || false;
  await dbTogglePuntajes(!actual);

  // Actualizar texto del botón
  const btn = document.getElementById("btn-mostrar-puntajes");
  if (btn) {
    btn.textContent = !actual ? "🏆 Ocultar puntajes" : "🏆 Mostrar puntajes";
  }
}

async function darDadosJugador() {
  const estado = await dbLeerEstado();
  const turnoActivo = Number(estado?.turno_activo) || 1;
  const turnos = await dbLeerTurnos();
  const jugadorActivo = turnos.find(t => Number(t.turno) === turnoActivo);
  if (!jugadorActivo) return;

  // Resetear dados y activar fase categoria
  await dbSetDados(0, 0, "categoria");
  actualizarConsolaHost("🎲 Dados entregados a " + jugadorActivo.nombre);
}


async function recibirResultadoDado(tipo, valor) {
  const estado = await dbLeerEstado();

  if (tipo === "categoria") {
    // Guardar categoría y pasar a fase pregunta
    await dbSetDados(valor, 0, "pregunta");
    const nombreCategoria = categories[valor - 1]?.name || "Categoría " + valor;
    actualizarConsolaHost("📌 Categoría seleccionada: " + nombreCategoria + " (" + valor + ")");

  } else if (tipo === "pregunta") {
    // Guardar pregunta
    await dbSetDados(estado.dado_categoria, valor, "resultado");
    const nombreCategoria = categories[estado.dado_categoria - 1]?.name || "Cat. " + estado.dado_categoria;
    actualizarConsolaHost("📋 Pregunta seleccionada: " + valor + " — " + nombreCategoria);
  }
}


function actualizarConsolaHost(mensaje) {
  const consola = document.getElementById("consola-dados");
  if (!consola) return;
  const linea = document.createElement("div");
  linea.className = "consola-linea";
  linea.textContent = mensaje;
  consola.appendChild(linea);
  consola.scrollTop = consola.scrollHeight;
}


// Escuchar cambios en estado para actualizar consola
let ultimaFaseDado = "";

sb.channel("dados_host")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "estado_juego" },
    async function(payload) {
      const record = payload.new;
      if (!record.fase_dado) return;

      // Solo actuar si la fase_dado cambió
      const claveCambio = record.fase_dado + "_" + record.dado_categoria + "_" + record.dado_pregunta;
      if (claveCambio === ultimaFaseDado) return;
      ultimaFaseDado = claveCambio;

      if (record.fase_dado === "categoria" && Number(record.dado_categoria) === 0) {
        actualizarConsolaHost("⏳ Esperando tirada de categoría...");
      } else if (record.fase_dado === "pregunta" && Number(record.dado_pregunta) === 0) {
        actualizarConsolaHost("⏳ Esperando tirada de pregunta...");
      } else if (record.fase_dado === "resultado") {
        const cat = categories[Number(record.dado_categoria) - 1]?.name || "Cat. " + record.dado_categoria;
        actualizarConsolaHost("✅ Resultado final — " + cat + " / Pregunta " + record.dado_pregunta);
      }
    }
  )
  .subscribe();

async function editarPU(nombre, tipo, cantidad) {
  const num = Math.max(0, parseInt(cantidad) || 0);
  await dbActualizarPowerUp(nombre, tipo, num);
}


let canalSolicitudes = null;

function escucharSolicitudes() {
  if (canalSolicitudes) {
    sb.removeChannel(canalSolicitudes);
    canalSolicitudes = null;
  }

  canalSolicitudes = sb.channel("solicitudes_host_" + Date.now())
    .on("postgres_changes",
      { event: "INSERT", schema: "public", table: "solicitudes_pu" },
      async function(payload) {
        const solicitud = payload.new;
        mostrarSolicitudConsola(solicitud);
      }
    )
    .subscribe();
}

function mostrarSolicitudEnConsola(solicitud) {
  const consola = document.getElementById("consola-dados");
  if (!consola) return;

  const wrap = document.createElement("div");
  wrap.className = "consola-solicitud";

  // Botones de contador solo para el power up "amigo"
  const botonesContador = solicitud.tipo === "amigo" ? `
    <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
      <button class="btn-aceptar-pu" onclick="iniciarContador()">▶ Iniciar contador</button>
      <button class="btn-rechazar-pu" onclick="detenerContador()">■ Detener contador</button>
    </div>
  ` : "";

  wrap.innerHTML = `
    <div class="solicitud-texto">
      🔔 ${solicitud.nombre} quiere usar <strong>${solicitud.tipo}</strong>
    </div>
    <div class="solicitud-btns">
      <button class="btn-aceptar-pu"
        onclick="aceptarSolicitud(${solicitud.id}, '${solicitud.nombre}', '${solicitud.tipo}', this)">
        ✔ Aceptar
      </button>
      <button class="btn-rechazar-pu"
        onclick="rechazarSolicitud(${solicitud.id}, this)">
        ✕ Rechazar
      </button>
    </div>
    ${botonesContador}
  `;
  consola.appendChild(wrap);
  consola.scrollTop = consola.scrollHeight;
}


async function aceptarSolicitud(id, nombre, tipo, btnEl) {
  await dbAceptarPowerUp(id, nombre, tipo);
  const nombres = {
    saltar: "Saltar turno", amigo: "Llamar a un amigo", twist: "Twist"
  };

  // Mostrar confirmación en la consola del host
  const wrap = btnEl.closest(".consola-solicitud");
  if (wrap) {
    wrap.innerHTML = `
      <div class="consola-linea" style="border-left-color:#4caf82">
        ✅ Power up aceptado — ${nombre} usa ${nombres[tipo]}
      </div>`;
  }

  // Comportamiento específico de cada power up
  if (tipo === "saltar") {
    // 1. Emitir aviso a pantalla.html y jugadores.html via Supabase
    await dbEmitirAvisoSaltar(nombre);

    // 2. Deseleccionar categoría y pregunta activa
    //    (mismo efecto que loadCategory: limpia la pregunta de la pantalla grande)
    await dbSetEstado("", "", "", false);
    await dbSetDados(0, 0, "");
    document.getElementById("question-list").innerHTML = "<p>Seleccioná una categoría.</p>";

    // 3. Avanzar al siguiente turno (igual que el botón "Siguiente turno")
    await siguienteTurno();
  }

  // NUEVO: comportamiento de llamar a un amigo
  if (tipo === "amigo") {
    // Emitir aviso visual a pantalla.html y jugadores.html
    await dbEmitirAvisoAmigo(nombre);
  }
}

async function rechazarSolicitud(id, btnEl) {
  await dbRechazarPowerUp(id);
  const wrap = btnEl.closest(".consola-solicitud");
  if (wrap) {
    wrap.innerHTML = `
      <div class="consola-linea" style="border-left-color:#cf6679">
        ✕ Solicitud rechazada
      </div>`;
  }
}

function limpiarConsola() {
  const consola = document.getElementById("consola-dados");
  if (consola) consola.innerHTML = "";
  ultimoMensajeConsola = "";
  ultimaFaseDado = "";
}

// Le dice a pantalla.html que empiece el countdown de 1 minuto
async function iniciarContador() {
  await dbSetContadorAmigo("iniciar");
  actualizarConsolaHost("▶ Contador iniciado");
}

// Le dice a pantalla.html que detenga el countdown
async function detenerContador() {
  await dbSetContadorAmigo("detener");
  actualizarConsolaHost("■ Contador detenido");
}
