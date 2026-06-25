import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    [{
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.goalcurrent.app",
        sha256_cert_fingerprints: [
          "89:11:AD:11:9A:CC:51:DD:A0:16:B6:C8:5F:0A:E8:12:89:B4:16:1B:E8:96:D9:2B:7B:D0:BF:07:79:EA:A2:DD",
          "64:6A:D3:60:A6:B6:5D:20:82:F8:98:A8:6C:1F:73:64:67:BA:6A:CA:D4:33:62:D7:3D:8B:D3:9A:68:20:43:5E"
        ]
      }
    }],
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    }
  );
}
