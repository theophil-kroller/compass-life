/** Compass Finance 0.5.14.1 · deterministic, auditable bank classification.
 * No personal names, financial records, or remote classifier are included in source.
 * Categories describe what the payment text establishes, not its unknown economic purpose.
 */
const r=(pattern,category,flow='expense',reason='Händler/Verwendungszweck erkannt',confidence='high')=>({rx:new RegExp(pattern,'iu'),category,flow,reason,confidence});

// More specific descriptors FIRST, before generic online shopping / mobility / restaurant rules.
export const FINANCE_DETAIL_RULES=[
 r('KAPITALERTRAGSTEUER|KAPITALERTRAGSTEUER|\\bKEST\\b|KAPITALERTRAG\\s*STEUER','Finanzen / Kapitalertragsteuer','expense','Kapitalertragsteuer auf Erträge – keine Konsumausgabe'),
 r('(?:PANDA\\s*ASIA|ASIA\\s*MARKT|ASIA\\s*SHOP|ASIA\\s*SUPERMARKT)','Lebensmittel / Asia-Supermarkt'),
 r('(?:ALDI(?:\\s|\\d)|PINGO\\s*DOCE|KONZUM\\s*P-|\\bDESPAR\\b)','Lebensmittel / Supermarkt'),
 r('(?:DM-FIL\\.|DM\\s+FIL|\\bBIPA\\b)','Lebensmittel / Drogerie'),
 r('(?:MASS\\s*RESPONSE\\s*SERVICE|T-MOBILE\\s+AUSTRIA|A1\\s+TELEKOM\\s+AUSTRIA)','Verträge & Abos / Telekommunikation','expense','Telekomanbieter / Mobilfunk'),
 r('(?:PAYWARD\\s+IRELAND|\\bKRAKEN\\b)','Transfer / Krypto','transfer','Kryptobörse; nicht als Konsumausgabe zählen'),
 r('(?:\\bFLATEX\\b)','Transfer / Depot & Wertpapiere','transfer','Broker/Depot; nicht als Konsumausgabe zählen'),
 r('(?:ORF[- ]?BEITRAGS\\s+SERVICE|OBS\\s+GMBH)','Wohnen / ORF-Beitrag','expense','Gesetzlicher ORF-Beitrag'),
 r('(?:SB[- ]?BEHEBUNG|BARGELDABHEBUNG|GELDAUTOMAT)','Bargeld / Bargeldbehebung','cash','Bargeld, spätere Verwendung unbekannt'),
 r('(?:\\bSOLLZINSEN\\b|\\bÜBERZIEHUNGSZINSEN\\b)','Finanzen / Sollzinsen','expense','Bankzinsen auf negative Salden'),
 r('(?:WIENER\\s+LINIEN|HOLDING\\s+GRAZ|TFNSW\\s+OPAL)','Mobilität / Öffentliche Verkehrsmittel'),
 r('(?:AUSTER\\s+SPORT|AUGARTEN\\s+BAD|WELL\\s+WELT)','Gesundheit & Sport / Schwimmen & Bäder'),
 r('(?:UNI\\s+FOR\\s+LIFE|WEITERBILDUNG|\\bLIBRO\\b)','Bildung & Beruf / Bildung & Fachliteratur'),
 r('(?:JETSTAR|VIRGIN\\s+AU|\\bQANTAS\\b|\\bAIRASIA\\b|\\bLUFTHANSA\\b)','Freizeit & Reisen / Flüge'),
 r('(?:HOTELS?\\s+LJUBLJANA|CAMPING\\s+GLAVOTOK|KAMP\\s+GLAVOTOK|ROGNER\\s+BAD\\s+BLUMAU|UND[E]?RDOG\\s+HOTELS)','Freizeit & Reisen / Reisen & Unterkunft'),
 r('(?:CINEPLEXX|ALBERTINA|THEATER\\s+IM\\s+HAFEN)','Freizeit & Reisen / Kultur & Freizeit'),
 r('(?:BIOGAST|BIO[- ]?GAST)','Lebensmittel / Bio-Lebensmittel','expense','Biogast – Lebensmittel; bei privaten Zahlungen nur Zweck des Verwendungszwecks'),
 r('(?:^|\\W)(?:M[- ]?CAFE|MENSA|MENSA\\s+HARBURG|SERVICE\\s+BETRIEB\\s+ÖH)(?:\\W|$)','Essen & Ausgehen / Mensa & Kantine'),
 r('(?:STUKITZSAUNA|STUKITZ\\s*SAUNA|THERME\\s+NOVA|DM\\s+THERMEN|AUSTER\\s+WELLNESS|SAUNAEINTRITT|THERMENBESUCH)','Gesundheit & Sport / Sauna & Therme'),
 r('(?:BUJINKAN|KAMPFSPORT|MARTIAL\\s*ARTS|AIKIDO|KARATE|JUDO|BRAZILIAN\\s*JIU[- ]?JITSU|KRAV\\s*MAGA)','Gesundheit & Sport / Kampfsport'),
 r('(?:KIZ\\s+ROYAL|TANZSCH(?:ULE|\\.)|TANZKURS|TANZSTUDIO|DANCE\\s+STUDIO|ZOUK(?:TIME)?|BACHATA|KIZOMBA|SALSA\\s*(?:NIGHT|KURS|FESTIVAL)|CONNY\\s*&\\s*DADO|TANZSEMINAR)','Gesundheit & Sport / Tanzen'),
 r('(?:BGYM|ANSA\\s*FITNESS|FITINN|MCFIT|GYM\\s*GRAZ|FITNESSSTUDIO|FITNESSCENTER)','Gesundheit & Sport / Fitness & Sport'),
 r('(?:WUTSCHER\\s*OPTIK|FIELMANN|PEARLE\\s*OPTIK)','Gesundheit & Sport / Optik'),
 r('(?:MARTIN\\s+AUER|BÄCKEREI|BAECKEREI|BACKEREI|BACKSHOP)','Lebensmittel / Bäckerei'),
 r('(?:FLUGHAFEN\\s+WIEN\\s+PARKEN|PARKEN\\s+STADT\\s+GRAZ|PARK\\s+AND\\s+CONTROL|PARKPL\\s+TRAGOESS|PARKING\\s+AUTOMAT|PARKPLATZ|PARKGEBÜHR)','Mobilität / Parken & Maut'),
 r('(?:DB\\s+AUTOMAT|DEUTSCHE\\s+BAHN|OEBB|ÖBB|FLIXBUS|VERKEHRSVERBUND|BUS[- ]GRAZ[- ]HOLDING|MOBILITAETSZENTRUM)','Mobilität / Öffentliche Verkehrsmittel'),
 r('(?:SPRITKONIG|SPRITKÖNIG|TANKSTELLE|SHELL|TURMOEL|\\bOMV\\b)','Mobilität / Auto & Tanken'),
 r('(?:BICYCLE\\s+GRAZ|FAHRRADWERKSTATT|FAHRRADREPARATUR)','Mobilität / Fahrrad'),
 r('(?:MONTANA\\s+ENERGIE|MONTANA\\s+STROM|ENERGIE\\s+STEIERMARK|STROMRECHNUNG|\\bVERBUND\\b)','Wohnen / Strom & Heizung'),
 r('(?:M[- ]?CAFE|SUBWAY|BOWLS\\s+POTS|LE\\s+VIET|ISAAN\\s+THAI|CAFE\\s+ERDE|CAFE\\s+ROSENHAIN|COFFEESHOP|KFC\\s+GRAZ|LE\\s+BURGER|GINKO\\s+GRAZ|BAUSATZLOKALE|OSTERIA\\s+DEI|DR\\s+ARTHUR\\s+GELATO|LENDPLATZL)','Essen & Ausgehen / Restaurant & Café'),
 r('(?:AMAZON|AMZN|AMAZON\\s+PAYMENTS|AMAZON\\s+EU|AMAZON\\s+MEDIA)','Shopping / Online-Shopping','expense','Amazon-Marktplatz; tatsächlicher Artikel unbekannt','broad'),
 r('(?:TEMU|WHALECO\\s+TECHNOLOGY)','Shopping / Online-Shopping','expense','Temu-Marktplatz; tatsächlicher Artikel unbekannt','broad'),
 r('(?:LIEB\\s+MARKT|BAUHAUS|OBI\\s+BAUMARKT|HORNBACH)','Wohnen / Haushalt & Einrichtung','expense','Baumarkt/Haushalt; konkrete Artikel nicht bekannt','broad'),
];

const pattern=(s,re)=>re.test(s);
const transferRx=/(?:ONLINE BANKING|(?<!PAYMENT )RECIPIENT:|ZAHLUNGSEMPFÄNGER:|EMPFÄNGER:)/iu;
const genericIn=(category,reason,flow='income')=>({category,flow,confidence:'broad',needsReview:false,source:'broad-rule',ruleReason:reason});
const auto=(x)=>({...x,needsReview:false,source:x.confidence==='broad'?'broad-rule':'rule'});

export function detailedFinanceMatch(transaction){
 const raw=String(transaction?.description||'').normalize('NFKC');const s=raw.toLocaleUpperCase('de-AT');const value=Number(transaction?.amountCents)||0;
 if(value===0)return null;
 // Explicit tax and benefits override generic classifications. Do not call capital gains tax investments.
 if(pattern(s,/KAPITALERTRAGSTEUER|KAPITALERTRAG\s*STEUER|\bKEST\b/iu)){
  return value<0?auto({category:'Finanzen / Kapitalertragsteuer',flow:'expense',confidence:'high',ruleReason:'Kapitalertragsteuer: Steuerabzug auf Kapitalerträge, nicht der Kauf eines Wertpapiers'}):auto({category:'Rückerstattung / Steuerrückzahlung',flow:'refund',confidence:'high',ruleReason:'Gutschrift mit Steuervermerk'});
 }
 if(value>0){
  if(pattern(s,/FAMILIENBEIHILFE|KINDERBETREUUNGSGELD/iu))return auto({category:'Einnahmen / Familienleistungen',flow:'income',confidence:'high',ruleReason:'Staatliche Familienleistung'});
  if(pattern(s,/BIOGAST/iu)&&pattern(s,/RÜCKZAHLUNG|RUECKZAHLUNG|ERSTATTUNG/iu))return auto({category:'Rückerstattung / Lebensmittel-Erstattung',flow:'refund',confidence:'high',ruleReason:'Biogast: Rückerstattung eines Lebensmitteleinkaufs laut Verwendungszweck'});
  if(pattern(s,/RÜCKERSTATTUNG|RUECKERSTATTUNG|RÜCKZAHLUNG|RUECKZAHLUNG|REFUND|STORNO|RET(OURE|OUREN)/iu))return auto({category:'Rückerstattung / Rückzahlung',flow:'refund',confidence:'broad',ruleReason:'Rückzahlung laut Buchungstext; ursprüngliche Ausgabenkategorie noch unbekannt'});
  if(pattern(s,/(?:LOHN(?:ABRECHNUNG)?|GEHALT|SALARY|PAYROLL|BEZUGSABRECHNUNG)/iu))return auto({category:'Einnahmen / Gehalt',flow:'income',confidence:'high',ruleReason:'Gehalt/Entgelt laut Text'});
  if(pattern(s,/KREDITKARTENABRECHNUNG|EIGENÜBERTRAG|EIGENES KONTO|TRANSFER\s+OWN\s+ACCOUNT/iu))return auto({category:'Transfer / Eigene Konten',flow:'transfer',confidence:'high',ruleReason:'Interner Transfer laut Buchungstext'});
  if(pattern(s,/DIVIDENDE|ZINSERTRAG|ZINSEN\s*GUTSCHRIFT/iu))return auto({category:'Einnahmen / Kapitalerträge',flow:'income',confidence:'high',ruleReason:'Kapitalertrag laut Buchungstext'});
  if(value>=100000)return {category:'Prüfen / Noch ungeklärt',flow:'income',confidence:'low',needsReview:true,source:'review',ruleReason:'Größerer Zahlungseingang: Gehalt, Rückzahlung oder Übertrag? Bitte einmal prüfen'};
  return null;
 }
 // Precise child-related purposes are known even when the receiver is not in a private pack.
 if(pattern(s,/\b(?:NACHHILFE|SCHULKOSTEN|SCHULGELD)\b/iu)&&pattern(s,/\b(?:KIND|TOCHTER|SOHN|KURS|SCHULE)\b/iu))return auto({category:'Familie / Schul- & Kurskosten',flow:'expense',confidence:'high',ruleReason:'Nachhilfe oder Schulkosten laut Verwendungszweck'});
 // Cash withdrawals have an unknown use, but they are not pending classification.
 if(pattern(s,/\b(?:BANKOMAT|BARGELD(?:BE|AB)HEBUNG|GELDAUTOMAT|CASH\\s+WITHDRAWAL)\b|\bATM\\s+(?:S[0-9A-Z]{5,}|\d{4,})/iu))return auto({category:'Bargeld / Bargeldbehebung',flow:'cash',confidence:'high',ruleReason:'Bargeldabhebung; spätere Verwendung lässt sich aus Bankumsatz nicht feststellen'});
 // Explicit purpose in payment reference supersedes the payment recipient.
 for(const r of FINANCE_DETAIL_RULES){if(r.rx.test(s))return auto({category:r.category,flow:r.flow,confidence:r.confidence,ruleReason:r.reason});}
 // Card settlements are transfers to the card issuer; avoid counting payment twice when card transactions are imported later.
 if(pattern(s,/CARD\\s*COMPLETE.*VISA|KREDITKARTENABRECHNUNG|KREDITKARTEN\\s+ABRECHNUNG/iu))return auto({category:'Transfer / Kreditkartenabrechnung',flow:'transfer',confidence:'high',ruleReason:'Sammelabrechnung; Karteneinkäufe werden erst mit separatem Kartenexport aufgeschlüsselt'});
 if(pattern(s,/\b(?:PAYPAL|KLARNA|STRIPE|SUMUP)\b/iu))return auto({category:'Shopping / Zahlungsdienst (Inhalt unbekannt)',flow:'expense',confidence:'broad',ruleReason:'Zahlungsdienst bekannt, gekaufter Artikel oder Leistung unbekannt'});
 if(pattern(s,/\b(?:ATM|GELDAUTOMAT)\b/iu))return auto({category:'Bargeld / Bargeldbehebung',flow:'cash',confidence:'high',ruleReason:'Bargeldbehebung; Verwendung nicht rekonstruierbar'});
 // Payment to a private recipient with generic purpose is not necessarily consumption or own-account transfer.
 if(transferRx.test(s)&&!pattern(s,/SPESEN|KONTOFÜHRUNG|VERSICHERUNG/iu)&&value<0){
  const match=raw.match(/(?:^|\s)Recipient:\s*(.{4,100}?)(?=\s+Payment reference:|\s+Purpose of use:|\s+Recipient IBAN:|$)/iu);
  const payee=match?.[1]?.trim()||'';
  const looksPrivate=/^[\p{L}]+(?:[\s-]+[\p{L}]+){1,2}$/u.test(payee)&&!/(?:UNIVERSITÄT|GMBH|BANK|ENERGIE|PAYMENT|CARD|AMAZON|STADT|GRAZ|STIFTUNG|HOTEL|VERBAND|VERLAG)/iu.test(payee);
  if(looksPrivate)return genericIn('Transfer / Private Überweisung','Zahlung an private Person; der genaue Zweck ist nicht bekannt','transfer');
  if(Math.abs(value)>=100000)return {category:'Prüfen / Noch ungeklärt',flow:'expense',confidence:'low',needsReview:true,source:'review',ruleReason:'Größere Überweisung ohne gesicherten Zweck (Konsum, Transfer oder Vermögen?)'};
  return genericIn('Sonstiges / Überweisung ohne klaren Zweck','Empfänger bekannt, wirtschaftlicher Zweck offen','expense');
 }
 return null;
}

export function financeGenericFallback(transaction){
 const cents=Number(transaction?.amountCents)||0;
 if(cents>0)return genericIn('Einnahmen / Eingang ohne klare Herkunft','Zahlungseingang; Einnahme vs. Transfer kann ohne Gegenkonto unklar bleiben','income');
 // High-value unknown debits deserve a concrete review rather than silent certainty.
 if(Math.abs(cents)>=100000)return {category:'Prüfen / Noch ungeklärt',flow:'expense',confidence:'low',needsReview:true,source:'review',ruleReason:'Hoher Betrag ohne verlässliche Zuordnung: wirtschaftliche Art bitte prüfen'};
 return genericIn('Sonstiges / Zahlung ohne klaren Zweck','Für diesen Händler liegt keine eindeutige Zuordnung vor; als grober Geldabfluss erfasst','expense');
}

/** Reclassify only NOT-YET-CONFIRMED transactions; user's decisions are immutable. */
export function updateBankSuggestions(transactions=[],customRules=[],classify){
 if(typeof classify!=='function')throw new Error('Klassifizierer fehlt.');
 let changed=0,closed=0,review=0,manualKept=0;
 const rows=transactions.map(t=>{
  // Statement-native Revolut types (especially Deposit / Transfer) must never be
  // reclassified using Raiffeisen heuristics; otherwise own-account topups can become income.
  if(t?.sourceFileType==='revolut-csv')return t;
  if((!t?.needsReview&&t?.source!=='broad-rule')||t.source==='user'||t.confidence==='confirmed'){manualKept+=t?.source==='user'?1:0;return t;}
  const suggestion=classify(t,customRules);
  if(!suggestion||!suggestion.category)return t;
  const next={...t,...suggestion};if(next.category!==t.category||next.needsReview!==t.needsReview||next.flow!==t.flow){changed++;if(!next.needsReview)closed++;}
  if(next.needsReview)review++;
  return next;
 });
 return {rows,changed,closed,review,manualKept};
}
