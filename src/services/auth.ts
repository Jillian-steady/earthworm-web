"use client";

import LogtoClient from "@logto/browser";

let logtoClient: LogtoClient | null = null;
let _isAuthenticated = false;

export function getLogtoClient(): LogtoClient {
  if (!logtoClient) {
    logtoClient = new LogtoClient({
      endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
      appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
    });
  }
  return logtoClient;
}

export async function signIn(callback?: string) {
  if (callback) {
    setSignInCallback(callback);
  }
  const client = getLogtoClient();
  await client.signIn(process.env.NEXT_PUBLIC_LOGTO_SIGN_IN_REDIRECT_URI!);
}

export async function signOut() {
  const client = getLogtoClient();
  _isAuthenticated = false;
  await client.signOut(process.env.NEXT_PUBLIC_LOGTO_SIGN_OUT_REDIRECT_URI!);
}

export function isAuthenticated(): boolean {
  return _isAuthenticated;
}

export async function checkAuthenticated(): Promise<boolean> {
  const client = getLogtoClient();
  _isAuthenticated = await client.isAuthenticated();
  return _isAuthenticated;
}

export async function getToken(): Promise<string | undefined> {
  const client = getLogtoClient();
  try {
    return await client.getAccessToken(process.env.NEXT_PUBLIC_API_BASE);
  } catch {
    return undefined;
  }
}

export async function fetchUserInfo() {
  const client = getLogtoClient();
  return await client.fetchUserInfo();
}

export async function handleSignInCallback(callbackUrl: string) {
  const client = getLogtoClient();
  await client.handleSignInCallback(callbackUrl);
  _isAuthenticated = await client.isAuthenticated();
}

export function getSignInCallback(): string {
  const callback = sessionStorage.getItem("callback");
  if (callback) {
    sessionStorage.removeItem("callback");
    return callback;
  }
  return "/";
}

function setSignInCallback(callback: string) {
  sessionStorage.setItem("callback", callback);
}
