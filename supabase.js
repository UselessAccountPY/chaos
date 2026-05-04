// Credenciales de Supabase — mismo archivo para todas las páginas
const SUPABASE_URL = "https://pomwgcnwygbqakbjizjf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbXdnY253eWdicWFrYmppempmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIxMjUsImV4cCI6MjA5MzQ5ODEyNX0.l7BSUas8SwEpBME3QyWV_NDFi6G1nwJTA3UzWpbcnmo";

const HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer " + SUPABASE_KEY,
  "Prefer": "return=representation"
};

// Lee todos los jugadores
async function dbLeerJugadores() {
  const res = await fetch(SUPABASE_URL + "/rest/v1/jugadores?select=*", {
    headers: HEADERS
  });
  return await res.json();
}

// Crea un jugador nuevo
async function dbCrearJugador(nombre) {
  const res = await fetch(SUPABASE_URL + "/rest/v1/jugadores", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ nombre: nombre, puntaje: 0 })
  });
  return await res.json();
}

// Actualiza el puntaje de un jugador por nombre
async function dbActualizarPuntaje(nombre, puntajeNuevo) {
  await fetch(SUPABASE_URL + "/rest/v1/jugadores?nombre=eq." + encodeURIComponent(nombre), {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({ puntaje: puntajeNuevo })
  });
}

// Elimina todos los jugadores
async function dbResetJugadores() {
  await fetch(SUPABASE_URL + "/rest/v1/jugadores?id=gte.0", {
    method: "DELETE",
    headers: HEADERS
  });
}

// Actualiza el estado del juego (fila id=1 siempre)
async function dbSetEstado(categoria, nombre, descripcion, activa) {
  await fetch(SUPABASE_URL + "/rest/v1/estado_juego?id=eq.1", {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({ categoria, nombre, descripcion, activa })
  });
}

// Lee el estado actual del juego
async function dbLeerEstado() {
  const res = await fetch(SUPABASE_URL + "/rest/v1/estado_juego?id=eq.1", {
    headers: HEADERS
  });
  const data = await res.json();
  return data[0];
}