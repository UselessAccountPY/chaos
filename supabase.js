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
  await sb.from("turnos")
    .update({ resultado_dado: resultado })
    .eq("nombre", nombre);
}

async function dbAsignarTurnos() {
  const { data } = await sb.from("turnos").select("*");
  if (!data) return;

  // Solo asignar a los que no tienen turno ni dado
  const sinAsignar = data.filter(j => j.resultado_dado === 0 && j.turno === 0);
  if (sinAsignar.length === 0) return;

  // Orden aleatorio
  const shuffled = sinAsignar
    .map(j => ({ nombre: j.nombre, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort);

  for (let i = 0; i < shuffled.length; i++) {
    await sb.from("turnos")
      .update({ turno: i + 1 })
      .eq("nombre", shuffled[i].nombre);
  }
}

async function dbCrearTurno(nombre) {
  await sb.from("turnos").insert({ nombre, resultado_dado: 0, turno: 0 });
}

async function dbResetTurnos() {
  await sb.from("turnos").delete().neq("id", 0);
}
