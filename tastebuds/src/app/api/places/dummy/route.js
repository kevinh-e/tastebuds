import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const filePath = path.join(process.cwd(), "dummy-places-response.json");

    // Read the dummy file
    const data = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(data);

    return NextResponse.json(json);
  } catch (error) {
    console.error("❌ Failed to read dummy data:", error);
    return NextResponse.json(
      { error: "Failed to load dummy places data" },
      { status: 500 }
    );
  }
}