// Only these named, local SVG symbols may be stored on a folder. No arbitrary HTML, URLs or emoji.
export const FOLDER_ICONS=[['folder','Ordner'],['book','Buch & Lehre'],['target','Ziele'],['calendar','Kalender'],['people','Menschen'],['heart','Beziehungen'],['activity','Aktivität'],['suitcase','Reisen'],['bookmark','Merkliste'],['shield','Sicherheit'],['spark','Ideen'],['compass','Orientierung']];
export const FOLDER_ICON_IDS=new Set(FOLDER_ICONS.map(x=>x[0]));
export const validFolderIcon=(name)=>name==null||FOLDER_ICON_IDS.has(name);
export const folderIcon=(project)=>project?.kind==='folder'&&FOLDER_ICON_IDS.has(project.folderIcon)?project.folderIcon:'folder';
