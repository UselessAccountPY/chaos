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
  await sb.from("estado_juego").update({ categoria, nombre, descripcion, activa }).eq("id", 1);
}

async function dbLeerEstado() {
  const { data } = await sb.from("estado_juego").select("*").eq("id", 1);
  return data?.[0];
}
