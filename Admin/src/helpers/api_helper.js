import axios from "axios"
import accessToken from "./jwt-token-access/accessToken"

//pass new generated access token here
const token = accessToken

// --- KONFIGURASI API KEMENAG ---
// TODO: Paste API KEY dari mentor di dalam tanda kutip di bawah ini
const KEMENAG_API_KEY = ""
// TODO: Pastikan nama headernya. Biasanya 'x-api-key' atau 'Authorization' atau 'token'
// Tanyakan ke mentor: "Pak, nama header untuk key-nya apa ya?"
const KEMENAG_HEADER_NAME = "X-API-Key"

//apply base url for axios
const API_URL = ""

export const axiosApi = axios.create({
  baseURL: API_URL,
})

axiosApi.defaults.headers.common["Authorization"] = token

// Jika nanti API KEY sudah diisi, otomatis ditambahkan ke header
if (KEMENAG_API_KEY) {
  axiosApi.defaults.headers.common[KEMENAG_HEADER_NAME] = KEMENAG_API_KEY
}

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
