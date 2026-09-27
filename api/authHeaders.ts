import axios from "axios";
import {
  BACKEND_URL_ROOT,
  getKeycloakCredentials,
  isKeycloakEnabled,
} from "../config/env";

type ApiLoginResponse = {
  access_token: string;
  expires_in?: number;
};

type ApiLoginEnvelope = {
  data?: ApiLoginResponse;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let pendingTokenRequest: Promise<string> | null = null;

function getApiLoginUrl() {
  return `${BACKEND_URL_ROOT}auth/login`;
}

function extractLoginPayload(payload: ApiLoginResponse | ApiLoginEnvelope) {
  const loginPayload =
    "data" in payload && payload.data
      ? payload.data
      : (payload as ApiLoginResponse);

  if (!loginPayload.access_token) {
    throw new Error("Login response did not include access_token.");
  }

  return loginPayload;
}

async function fetchApiAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 15_000) {
    return cachedToken;
  }

  if (pendingTokenRequest) {
    return pendingTokenRequest;
  }

  pendingTokenRequest = (async () => {
    const loginUrl = getApiLoginUrl();
    const { username, password } = getKeycloakCredentials();
    const response = await axios.post<ApiLoginResponse | ApiLoginEnvelope>(
      loginUrl,
      {
        username,
        password,
      },
    );

    const loginPayload = extractLoginPayload(response.data);
    const { access_token: token, expires_in: expiresIn = 60 } = loginPayload;

    cachedToken = token;
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    return token;
  })();

  try {
    return await pendingTokenRequest;
  } finally {
    pendingTokenRequest = null;
  }
}

export async function getApiAuthHeaders() {
  if (!isKeycloakEnabled()) {
    return {};
  }

  const providedToken =
    process.env.API_ACCESS_TOKEN || process.env.KEYCLOAK_ACCESS_TOKEN;
  const token = providedToken || (await fetchApiAccessToken());

  return {
    Authorization: `Bearer ${token}`,
  };
}
