import axios from "axios";

const API_BASE = "https://travel-ease-production.up.railway.app/api";

export async function sendLog(entry) {
  return axios.post(`${API_BASE}/log`, entry);
}

export async function syncLogs(entries) {
  return axios.post(`${API_BASE}/sync`, entries);
}

export async function fetchLogs() {
  return axios.get(`${API_BASE}/logs`);
}
