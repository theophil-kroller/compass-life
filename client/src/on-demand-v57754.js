/** Framework-neutral route loader: only imports on explicit request.
 * A source is imported only once, concurrency is deduplicated and errors can be retried.
 * Progress is based on actual completed module imports, not a fake timer.
 */
export function createOnDemandRouteLoader(loaders,onProgress=()=>{}){
 const items=Object.fromEntries(Object.entries(loaders).map(([kind,entries])=>[kind,{status:'idle',completed:0,total:entries.length,promise:null,modules:null,error:null}]));
 const get=kind=>items[kind];
 function ensure(kind){
  const item=get(kind);if(!item)return Promise.reject(new Error('Unbekannter Modulbereich'));
  if(item.status==='ready')return Promise.resolve(item.modules);
  if(item.promise)return item.promise;
  item.status='loading';item.completed=0;item.error=null;
  const entries=loaders[kind];onProgress(kind,item);
  const pending=entries.map(async ([name,load])=>{
   const value=await load();
   item.completed++;onProgress(kind,item);
   return [name,value];
  });
  item.promise=Promise.all(pending).then(parts=>{
   item.modules=Object.fromEntries(parts);item.status='ready';item.promise=null;onProgress(kind,item);
   return item.modules;
  }).catch(error=>{item.status='failed';item.error=error;item.promise=null;onProgress(kind,item);throw error;});
  return item.promise;
 }
 return {get,ensure};
}
