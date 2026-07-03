import { NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase App for server-side use
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    
    // Upload buffer to GCS
    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    });
    
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error("Server-side Upload error details:", error);
    let errorMessage = error.message || "Failed to upload file to storage";
    if (error.serverResponse) {
      errorMessage += ` (Server Response: ${error.serverResponse})`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
