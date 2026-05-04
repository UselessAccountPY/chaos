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
        text: "Presentacion",
        description: "Presentá una presentación por mí",
        answered: false,
        win: [
          { condition: "Presentó", points: 1000 }
        ],
        lose: [
          { condition: "Se rió", points: -500 }
        ]
      },
      { text: "Ecolocacion",   points: 300, answered: false},
      { text: "Busqueda del tesoro",   points: 300, answered: false},
      { text: "Hablá con mi IA",   points: 300, answered: false}
    ]
  },
  {
    name: "Pelada",
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
    name: "Suerte",
    questions: [
      { text: "Moneda",points: 100, answered: false },
      { text: "Dado",points: 200, answered: false },
      { text: "Temperatura",points: 300, answered: false },
      { text: "Hora",points: 300, answered: false },
      { text: "Norte",points: 300, answered: false },
      { text: "Ndapytai",points: 300, answered: false },
      { text: "PPM",points: 300, answered: false },
      { text: "Telepatía",points: 300, answered: false},
      { text: "Frasco",points: 300, answered: false },
      { text: "Receta",points: 300, answered: false },
      { text: "Comer",points: 300, answered: false }
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
    questions: [
      { text: "Paraguay",points: 100, answered: false },
      { text: "Vexología",points: 200, answered: false },
      { text: "Mujeres",points: 300, answered: false },
      { text: "Quesos",points: 300, answered: false },
      { text: "Gramatica",points: 300, answered: false },
      { text: "Mundiales",points: 300, answered: false },
      { text: "Abroles",points: 300, answered: false },
      { text: "Fisica",points: 300, answered: false },
      { text: "Sentido Comun",points: 300, answered: false },
      { text: "2010",points: 300, answered: false },
      { text: "Anatomia",points: 300, answered: false },
      { text: "Ariel",points: 300, answered: false }
    ]
  }
];



// ---- NAVEGACIÓN ---- //
async function loadCategory(index) {
  // Apagar pregunta activa en Supabase
  await dbSetEstado("", "", "", false);

  const category = categories[index];
  const container = document.getElementById("question-list");
  container.innerHTML = `<h2>${category.name}</h2>`;

  category.questions.forEach(function(question, questionIndex) {
    const btn = document.createElement("button");
    btn.textContent = "Pregunta " + (questionIndex + 1);
    if (question.answered) {
      btn.classList.add("answered-btn");
      btn.textContent += " ✓";
    }
    btn.onclick = function() {
      loadQuestion(index, questionIndex);
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
    jugadores.forEach(function(j) {
      contenedor.appendChild(crearInputJugador(j.nombre, w.points));
    });
  });

  question.lose.forEach(function(l, i) {
    const contenedor = document.getElementById("lose-inputs-" + i);
    if (!contenedor) return;
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
  const confirmar = confirm("¿Seguro? Esto borra todos los jugadores y puntajes.");
  if (!confirmar) return;
  await dbResetJugadores();
  await dbSetEstado("", "", "", false);
  alert("Reset hecho.");
}


// Escuchar jugadores nuevos en tiempo real
function escucharJugadoresNuevos() {
  sb.channel("jugadores_host")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "jugadores" },
      async function() {
        // Si hay una pregunta abierta, re-renderizar los inputs
        const estado = await dbLeerEstado();
        if (estado && estado.activa) {
          const contenedor = document.getElementById("outcomes-container");
          if (contenedor) {
            // Buscar la pregunta activa actual y re-renderizar
            const categoria = categories.find(c => c.name === estado.categoria);
            if (categoria) {
              const pregunta = categoria.questions.find(q => q.text === estado.nombre);
              if (pregunta) await renderizarInputsJugadores(pregunta);
            }
          }
        }
      }
    )
    .subscribe();
}

// Llamala al final del archivo
escucharJugadoresNuevos();
