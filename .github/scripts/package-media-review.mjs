import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { validatePublicNetworkUrl } from "../../web/scripts/resource-media-discovery-lib.mjs";
import { ALLOWED_RASTER_TYPES } from "../../web/scripts/resource-media-review-lib.mjs";

const [candidatePath, outputDirectory] = process.argv.slice(2);
if (!candidatePath || !outputDirectory) throw new Error("Usage: node package-media-review.mjs <candidates.json> <output-dir>");
const MAX_REDIRECTS = 3, MAX_BYTES = 12 * 1024 * 1024, TIMEOUT_MS = 10_000;
const extensionFor = (contentType) => new Map([["image/avif","avif"],["image/jpeg","jpg"],["image/png","png"],["image/webp","webp"]]).get(contentType);
async function fetchRaster(initialUrl) {
  let current = initialUrl; const redirects = [];
  for (let index=0; index<=MAX_REDIRECTS; index+=1) {
    await validatePublicNetworkUrl(current);
    const response = await fetch(current,{redirect:"manual",signal:AbortSignal.timeout(TIMEOUT_MS),headers:{accept:"image/avif,image/webp,image/png,image/jpeg;q=0.9,*/*;q=0.1","user-agent":"Tessli reviewed-media evidence/1.0"}});
    if ([301,302,303,307,308].includes(response.status)) {
      const location=response.headers.get("location"); if(!location||index===MAX_REDIRECTS) throw new Error(`Unsafe or excessive redirect from ${current}`);
      current=new URL(location,current).toString(); redirects.push(current); continue;
    }
    if(!response.ok) throw new Error(`HTTP ${response.status} for ${current}`);
    const contentType=(response.headers.get("content-type")||"").split(";",1)[0].trim().toLowerCase();
    if(!ALLOWED_RASTER_TYPES.has(contentType)) throw new Error(`Unsupported response type ${contentType||"missing"}`);
    const declaredLength=Number(response.headers.get("content-length")||0); if(declaredLength>MAX_BYTES) throw new Error("Raster exceeds byte limit.");
    const bytes=Buffer.from(await response.arrayBuffer()); if(bytes.length===0||bytes.length>MAX_BYTES) throw new Error("Raster is empty or exceeds byte limit.");
    return {bytes,contentType,finalUrl:current,redirects};
  }
  throw new Error("Redirect limit exceeded.");
}
const source=JSON.parse(await fs.readFile(candidatePath,"utf8")); await fs.mkdir(outputDirectory,{recursive:true}); const manifest=[];
for(const resource of source.resources??[]) for(const kind of ["preview","favicon"]) {
  const media=resource[kind]; if(!media?.url) continue;
  const entry={resourceId:resource.resourceId,resourceName:resource.resourceName,canonicalUrl:resource.canonicalUrl,sourcePageUrl:resource.sourcePageUrl??resource.canonicalUrl,kind,declaredUrl:media.url,source:media.source??"favicon",sourceProperty:media.sourceProperty??null,discoveryContentType:media.contentType};
  try { const result=await fetchRaster(media.url); const fileName=`${resource.resourceId}-${kind}.${extensionFor(result.contentType)}`; await fs.writeFile(path.join(outputDirectory,fileName),result.bytes); Object.assign(entry,{status:"downloaded",fileName,finalUrl:result.finalUrl,redirects:result.redirects,contentType:result.contentType,bytes:result.bytes.length,sha256:crypto.createHash("sha256").update(result.bytes).digest("hex")}); }
  catch(error){Object.assign(entry,{status:"failed",error:error instanceof Error?error.message:"Raster download failed."});}
  manifest.push(entry);
}
await fs.writeFile(path.join(outputDirectory,"manifest.json"),`${JSON.stringify({version:1,media:manifest},null,2)}\n`);
console.log(JSON.stringify({downloaded:manifest.filter(x=>x.status==="downloaded").length,failed:manifest.filter(x=>x.status==="failed").length}));
