import { promises as fs } from "node:fs";
import path from "node:path";
import { requireActor,response,failure,StudioError } from "@/lib/studio/access";
import { dataDir } from "@/lib/studio/config";
export async function GET(request:Request){try{await requireActor(request,{admin:true});if(process.env.CMS_MAIL_MODE!=="local")throw new StudioError("Not found.",404);const dir=path.join(dataDir(),"mail");const files=await fs.readdir(dir).catch(()=>[]);return response(await Promise.all(files.filter(f=>f.endsWith(".json")).sort().reverse().slice(0,20).map(async file=>JSON.parse(await fs.readFile(path.join(dir,file),"utf8")))));}catch(error){return failure(error);}}
