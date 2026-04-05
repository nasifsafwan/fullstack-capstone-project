const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handleResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

export async function fetchListings() {
  const response = await fetch(`${API_URL}/gifts`);
  return handleResponse(response);
}

export async function fetchListingById(id) {
  const response = await fetch(`${API_URL}/gifts/${id}`);
  return handleResponse(response);
}

export async function searchListings(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const response = await fetch(`${API_URL}/search?${search.toString()}`);
  return handleResponse(response);
}

export async function registerUser(body) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return handleResponse(response);
}

export async function loginUser(body, token = "") {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  return handleResponse(response);
}

export async function fetchProfile(token) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return handleResponse(response);
}

export async function updateProfile(body, token) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  return handleResponse(response);
}

