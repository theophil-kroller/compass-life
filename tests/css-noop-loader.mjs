/** Test-only Node loader to ignore CSS imports while testing pure Coach planning. */
export async function load(url,context,nextLoad){
 if(url.endsWith('.css'))return {format:'module',shortCircuit:true,source:'export default {};'};
 return nextLoad(url,context);
}
