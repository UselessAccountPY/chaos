const SUPABASE_URL = "https://pomwgcnwygbqakbjizjf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbXdnY253eWdicWFrYmppempmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIxMjUsImV4cCI6MjA5MzQ5ODEyNX0.l7BSUas8SwEpBME3QyWV_NDFi6G1nwJTA3UzWpbcnmo";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function dbLeerJugadores() {
  const { data } = await sb.from("jugadores").select("*");
  return data || [];
}

async function dbCrearJugador(nombre) {
  const { data } = await sb.from("jugadores").insert({ nombre, puntaje: 0 }).select();
  return data?.[0];
}

async function dbActualizarPuntaje(nombre, puntajeNuevo) {
  await sb.from("jugadores").update({ puntaje: puntajeNuevo }).eq("nombre", nombre);
}

async function dbResetJugadores() {
  await sb.from("jugadores").delete().neq("id", 0);
}

async function dbSetEstado(categoria, nombre, descripcion, activa) {
  await sb.from("estado_juego")
    .update({ categoria, nombre, descripcion, activa, modo: "normal", puntaje_activo: 0 })
    .eq("id", 1);
}

async function dbLeerEstado() {
  const { data } = await sb.from("estado_juego").select("*").eq("id", 1);
  return data?.[0];
}

// Buzzer
async function dbBuzzerApretar(nombre) {
  await sb.from("buzzer").insert({ nombre, tiempo: Date.now() });
}

async function dbBuzzerLeer() {
  const { data } = await sb.from("buzzer").select("*").order("tiempo", { ascending: true });
  return data || [];
}

async function dbBuzzerReset() {
  await sb.from("buzzer").delete().neq("id", 0);
}

// Actualizar estado con modo y puntaje
async function dbSetEstadoTrivia(categoria, nombre, descripcion, activa, modo, puntajeActivo, buzzerActivo = false) {
  await sb.from("estado_juego")
    .update({ categoria, nombre, descripcion, activa, modo, puntaje_activo: puntajeActivo, buzzer_activo: buzzerActivo })
    .eq("id", 1);
}

// Nueva función solo para cambiar el buzzer
async function dbSetBuzzer(activo) {
  await sb.from("estado_juego").update({ buzzer_activo: activo }).eq("id", 1);
}

async function dbSetFase(fase) {
  await sb.from("estado_juego").update({ fase }).eq("id", 1);
}

// Turnos
async function dbLeerTurnos() {
  const { data } = await sb.from("turnos")
    .select("*")
    .order("turno", { ascending: true });
  return data || [];
}

async function dbGuardarResultadoDado(nombre, resultado) {
  // 1 — Guardar el resultado del dado
  await sb.from("turnos")
    .update({ resultado_dado: resultado })
    .eq("nombre", nombre);

  // 2 — Leer todos los turnos actualizados
  const { data } = await sb.from("turnos").select("*");
  if (!data) return;

  // 3 — Separar los que ya tiraron de los que no
  const tiraron = data.filter(j => Number(j.resultado_dado) > 0);
  const noTiraron = data.filter(j => Number(j.resultado_dado) === 0);

  // 4 — Ordenar los que tiraron:
  //     Mayor dado = turno más temprano
  //     Empate: se respeta el orden de llegada (turno ya asignado)
  tiraron.sort(function(a, b) {
    if (Number(b.resultado_dado) !== Number(a.resultado_dado)) {
      // Diferente valor — mayor dado va primero
      return Number(b.resultado_dado) - Number(a.resultado_dado);
    }
    // Empate — el que ya tenía turno asignado mantiene su posición
    // Si ninguno tiene turno (ambos acaban de tirar igual), 
    // se respeta el orden actual del array (quien llegó antes)
    const turnoA = Number(a.turno) || 999;
    const turnoB = Number(b.turno) || 999;
    return turnoA - turnoB;
  });

  // 5 — Asignar turnos del 1 en adelante a los que tiraron
  for (let i = 0; i < tiraron.length; i++) {
    await sb.from("turnos")
      .update({ turno: i + 1 })
      .eq("nombre", tiraron[i].nombre);
  }

  // 6 — Los que no tiraron quedan sin turno (0)
  for (const j of noTiraron) {
    await sb.from("turnos")
      .update({ turno: 0 })
      .eq("nombre", j.nombre);
  }
}

async function dbAsignarTurnos() {
  const { data } = await sb.from("turnos").select("*");
  if (!data || data.length === 0) return;

  // Solo los que no tiraron (resultado_dado = 0)
  const noTiraron = data.filter(j => Number(j.resultado_dado) === 0);
  if (noTiraron.length === 0) return; // todos tiraron, nada que hacer

  // El último turno asignado hasta ahora
  const maxTurno = Math.max(...data.map(j => Number(j.turno) || 0));

  // Asignar turnos siguientes en orden aleatorio
  const shuffled = [...noTiraron].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffled.length; i++) {
    await sb.from("turnos")
      .update({ turno: maxTurno + i + 1 })
      .eq("nombre", shuffled[i].nombre);
  }
}

async function dbCrearTurno(nombre) {
  await sb.from("turnos").insert({ nombre, resultado_dado: 0, turno: 0 });
}

async function dbResetTurnos() {
  await sb.from("turnos").delete().neq("id", 0);
}
