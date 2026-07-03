import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "not found";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "not found";
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "not found";
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "not found";
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "not found";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "not found";
  
  return NextResponse.json({
    projectId,
    storageBucket,
    authDomain,
    messagingSenderId,
    appId,
    apiKeyMasked: apiKey !== "not found" ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : "not found",
    allPublicEnvKeys: Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_"))
  });
}
