import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET(){
  try{
    const hash = execSync("git rev-parse HEAD").toString().trim().slice(0,7);
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    const date = execSync("git log -1 --format=%cI").toString().trim();
    return NextResponse.json({hash, branch, date, version:"1.0.0"});
  }catch{
    return NextResponse.json({hash:"dev", branch:"main", date: new Date().toISOString(), version:"1.0.0"});
  }
}
