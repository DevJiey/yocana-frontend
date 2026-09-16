// Standard Philippine Postal / ZIP Codes dictionary
// Covers NCR cities and districts, plus major cities and municipalities across all regions.

const PH_ZIP_CODES = {
  // National Capital Region (NCR)
  "city of manila": "1000",
  "manila": "1000",
  "quezon city": "1100",
  "city of makati": "1200",
  "makati": "1200",
  "city of pasay": "1300",
  "pasay": "1300",
  "city of caloocan": "1400",
  "caloocan": "1400",
  "city of valenzuela": "1440",
  "valenzuela": "1440",
  "city of malabon": "1470",
  "malabon": "1470",
  "city of navotas": "1485",
  "navotas": "1485",
  "city of san juan": "1500",
  "san juan": "1500",
  "city of mandaluyong": "1550",
  "mandaluyong": "1550",
  "city of pasig": "1600",
  "pasig": "1600",
  "pateros": "1620",
  "municipality of pateros": "1620",
  "taguig": "1630",
  "city of taguig": "1630",
  "city of parañaque": "1700",
  "city of paranaque": "1700",
  "paranaque": "1700",
  "city of las piñas": "1740",
  "city of las pinas": "1740",
  "las pinas": "1740",
  "city of muntinlupa": "1770",
  "muntinlupa": "1770",
  "city of marikina": "1800",
  "marikina": "1800",

  // Region IV-A (CALABARZON)
  // Cavite
  "bacoor": "4102",
  "city of bacoor": "4102",
  "imus": "4103",
  "city of imus": "4103",
  "kawit": "4104",
  "noveleta": "4105",
  "rosario": "4106",
  "cavite city": "4100",
  "dasmarinas": "4114",
  "city of dasmariñas": "4114",
  "city of dasmarinas": "4114",
  "carmona": "4116",
  "city of carmona": "4116",
  "silang": "4118",
  "general trias": "4107",
  "city of general trias": "4107",
  "tagaytay": "4120",
  "city of tagaytay": "4120",
  "trece martires": "4109",
  "city of trece martires": "4109",
  "tanza": "4108",
  "naic": "4110",
  "maragondon": "4112",
  "ternate": "4111",
  "alfonso": "4123",
  "amadeo": "4119",
  "indang": "4122",
  "magallanes": "4113",
  "mendez": "4121",
  "general emilio aguinaldo": "4124",
  "general mariano alvarez": "4117",

  // Laguna
  "san pedro": "4023",
  "city of san pedro": "4023",
  "biñan": "4024",
  "binan": "4024",
  "city of biñan": "4024",
  "santa rosa": "4026",
  "city of santa rosa": "4026",
  "cabuyao": "4025",
  "city of cabuyao": "4025",
  "calamba": "4027",
  "city of calamba": "4027",
  "los baños": "4030",
  "los banos": "4030",
  "bay": "4033",
  "calauan": "4012",
  "san pablo": "4000",
  "city of san pablo": "4000",
  "santa cruz": "4009",
  "pagsanjan": "4008",
  "lumban": "4014",
  "paete": "4016",
  "pakil": "4017",
  "pangil": "4018",
  "siniloan": "4019",
  "alaminos": "4001",
  "victoria": "4011",
  "pila": "4010",
  "nagcarlan": "4002",
  "liliw": "4004",
  "magdalena": "4007",
  "majayjay": "4005",
  "luisiana": "4032",
  "cavinti": "4013",
  "kalayaan": "4015",
  "mabitac": "4020",
  "santa maria": "4022",
  "famy": "4021",
  "rizal": "4003",

  // Rizal
  "antipolo": "1870",
  "city of antipolo": "1870",
  "cainta": "1900",
  "taytay": "1920",
  "angono": "1930",
  "binangonan": "1940",
  "san mateo": "1850",
  "rodriguez": "1860",
  "montalban": "1860",
  "baras": "1970",
  "cardona": "1950",
  "morong": "1960",
  "pililla": "1910",
  "tanay": "1980",
  "teresa": "1960",
  "jalajala": "1990",

  // Batangas
  "batangas city": "4200",
  "city of batangas": "4200",
  "lipa": "4217",
  "city of lipa": "4217",
  "tanauan": "4232",
  "city of tanauan": "4232",
  "santo tomas": "4234",
  "city of santo tomas": "4234",
  "bauan": "4201",
  "san pascual": "4204",
  "san jose": "4227",
  "ibaan": "4230",
  "rosario": "4225",
  "san juan": "4226",
  "padre garcia": "4224",
  "malvar": "4233",
  "balete": "4219",
  "mataasnakahoy": "4223",
  "cuenca": "4222",
  "alitagtag": "4205",
  "sta. teresita": "4206",
  "taal": "4208",
  "san nicolas": "4207",
  "lemery": "4209",
  "calaca": "4212",
  "city of calaca": "4212",
  "balayan": "4213",
  "tuy": "4214",
  "nasugbu": "4231",
  "lian": "4216",
  "calatagan": "4215",
  "mabini": "4202",
  "tingloy": "4203",
  "lobo": "4229",
  "taysan": "4228",

  // Bulacan
  "malolos": "3000",
  "city of malolos": "3000",
  "meycauayan": "3020",
  "city of meycauayan": "3020",
  "san jose del monte": "3023",
  "city of san jose del monte": "3023",
  "marilao": "3019",
  "bocaue": "3018",
  "balagtas": "3016",
  "guiguinto": "3015",
  "plaridel": "3004",
  "pulilan": "3005",
  "baliwag": "3006",
  "city of baliwag": "3006",
  "san rafael": "3008",
  "san ildefonso": "3010",
  "san miguel": "3011",
  "angatt": "3012",
  "norzagaray": "3013",
  "santa maria": "3022",
  "bustos": "3007",
  "pandil": "3014",
  "calumpit": "3003",
  "paombong": "3001",
  "hagonoy": "3002",
  "obando": "3021",
  "donya remedios trinidad": "3009",

  // Pampanga
  "san fernando": "2000",
  "city of san fernando": "2000",
  "angeles": "2009",
  "city of angeles": "2009",
  "mabalacat": "2010",
  "city of mabalacat": "2010",
  "guagua": "2003",
  "lubao": "2005",
  "floridablanca": "2006",
  "porac": "2008",
  "mexico": "2021",
  "arayat": "2017",
  "magalang": "2011",
  "candaba": "2013",
  "san simon": "2015",
  "apalit": "2016",
  "macabebe": "2018",
  "masantol": "2014",
  "santa rita": "2002",
  "bacolor": "2001",
  "santa ana": "2022",
  "san luis": "2020",
  "sasmuan": "2004",
  "minis": "2019",

  // Cebu
  "cebu city": "6000",
  "city of cebu": "6000",
  "mandaue": "6014",
  "city of mandaue": "6014",
  "lapu-lapu": "6015",
  "city of lapu-lapu": "6015",
  "talisay": "6045",
  "city of talisay": "6045",
  "toledo": "6038",
  "city of toledo": "6038",
  "danaos": "6004",
  "city of danao": "6004",
  "danao": "6004",
  "carcar": "6019",
  "city of carcar": "6019",
  "naga": "6037",
  "city of naga": "6037",
  "consolacion": "6001",
  "liloan": "6002",
  "compostela": "6003",
  "cordova": "6017",
  "minglanilla": "6046",
  "san fernando": "6018",
  "balamban": "6041",
  "bantayan": "6052",
  "dumanjug": "6035",
  "bogo": "6010",
  "city of bogo": "6010",

  // Davao
  "davao city": "8000",
  "city of davao": "8000",
  "tagum": "8100",
  "city of tagum": "8100",
  "panabo": "8105",
  "city of panabo": "8105",
  "digos": "8002",
  "city of digos": "8002",
  "samal": "8120",
  "island garden city of samal": "8120",
  "mati": "8200",
  "city of mati": "8200",

  // Iloilo
  "iloilo city": "5000",
  "city of iloilo": "5000",
  "passi": "5037",
  "city of passi": "5037",
  "oton": "5020",
  "pavia": "5001",
  "santa barbara": "5002",
  "cabatuan": "5031",
  "pototan": "5008",
  "dumangas": "5006",
  "barotac nuevo": "5007",
  "miagao": "5023",

  // Negros Occidental
  "bacolod": "6100",
  "city of bacolod": "6100",
  "talisay": "6115",
  "silay": "6116",
  "city of silay": "6116",
  "bago": "6101",
  "city of bago": "6101",
  "cadiz": "6121",
  "city of cadiz": "6121",
  "san carlos": "6127",
  "city of san carlos": "6127",
  "victorias": "6119",
  "city of victorias": "6119",
  "kabankalan": "6111",
  "city of kabankalan": "6111",
  "sagay": "6122",
  "city of sagay": "6122",

  // Benguet & CAR
  "baguio": "2600",
  "city of baguio": "2600",
  "la trinidad": "2601",
  "itogon": "2604",
  "tuba": "2603",
  "tublay": "2605",

  // Pangasinan
  "dagupan": "2400",
  "city of dagupan": "2400",
  "san carlos": "2420",
  "urdaneta": "2428",
  "city of urdaneta": "2428",
  "alaminos": "2404",
  "city of alaminos": "2404",
  "lingayen": "2401",
  "malasiqui": "2421",
  "calasiao": "2418",
  "mangaldan": "2432",
  "binmaley": "2417",
  "bayambang": "2423",
  "rosales": "2441",
  "villasis": "2427",

  // Tarlac
  "tarlac city": "2300",
  "city of tarlac": "2300",
  "capas": "2315",
  "concepcion": "2316",
  "paniqui": "2307",
  "camiling": "2306",
  "gerona": "2302",
  "bamban": "2317",

  // Nueva Ecija
  "cabanatuan": "3100",
  "city of cabanatuan": "3100",
  "gapan": "3105",
  "city of gapan": "3105",
  "san jose": "3121",
  "city of san jose": "3121",
  "palayan": "3132",
  "city of palayan": "3132",
  "science city of muñoz": "3119",
  "munoz": "3119",
  "talavera": "3114",
  "guimba": "3115",
  "santa rosa": "3101",
  "san leonardo": "3102",

  // Bataan
  "balanga": "2100",
  "city of balanga": "2100",
  "mariveles": "2105",
  "dinalupihan": "2110",
  "hermosa": "2111",
  "orani": "2112",
  "limay": "2103",

  // Zambales
  "olongapo": "2200",
  "city of olongapo": "2200",
  "subic": "2209",
  "iba": "2201",
  "castillejos": "2208",
  "san marcelino": "2207",
  "botolan": "2202",

  // Quezon Province
  "lucena": "4301",
  "city of lucena": "4301",
  "tayabas": "4327",
  "city of tayabas": "4327",
  "candelaria": "4323",
  "sariaya": "4322",
  "tiaong": "4325",
  "pagbilao": "4302",
  "lucban": "4328",
  "mauban": "4330",
  "gumaca": "4307",
  "lopez": "4316",

  // Albay / Bicol
  "legazpi": "4500",
  "city of legazpi": "4500",
  "naga": "4400",
  "city of naga": "4400",
  "daraga": "4501",
  "tabaco": "4511",
  "city of tabaco": "4511",
  "ligao": "4504",
  "city of ligao": "4504",
  "iriga": "4431",
  "city of iriga": "4431",
  "sorsogon city": "4700",
  "city of sorsogon": "4700",
  "daet": "4600",

  // Cagayan / Isabela
  "tuguegarao": "3500",
  "city of tuguegarao": "3500",
  "ilagan": "3300",
  "city of ilagan": "3300",
  "santiago": "3311",
  "city of santiago": "3311",
  "cauayan": "3305",
  "city of cauayan": "3305",

  // Ilocos Norte & Sur
  "laoag": "2900",
  "city of laoag": "2900",
  "vigan": "2700",
  "city of vigan": "2700",
  "candon": "2710",
  "city of candon": "2710",
  "san fernando": "2500", // La Union
  "city of san fernando": "2500",

  // Western & Central Visayas
  "roxas city": "5800",
  "city of roxas": "5800",
  "kalibo": "5600",
  "malay": "5608", // Boracay
  "san jose de buenavista": "5700",
  "tagbilaran": "6300",
  "city of tagbilaran": "6300",
  "dumaguete": "6200",
  "city of dumaguete": "6200",
  "bais": "6206",
  "bayawan": "6221",

  // Eastern Visayas
  "tacloban": "6500",
  "city of tacloban": "6500",
  "ormoc": "6541",
  "city of ormoc": "6541",
  "catbalogan": "6700",
  "city of catbalogan": "6700",
  "calbayog": "6710",
  "city of calbayog": "6710",

  // Northern Mindanao & Zamboanga
  "cagayan de oro": "9000",
  "city of cagayan de oro": "9000",
  "iligan": "9200",
  "city of iligan": "9200",
  "zamboanga city": "7000",
  "city of zamboanga": "7000",
  "pagadian": "7016",
  "city of pagadian": "7016",
  "dipolog": "7100",
  "city of dipolog": "7100",
  "valencia": "8709",
  "city of valencia": "8709",
  "malaybalay": "8700",
  "city of malaybalay": "8700",
  "ozamiz": "7200",
  "city of ozamiz": "7200",

  // SOCCSKSARGEN & BARMM
  "general santos": "9500",
  "city of general santos": "9500",
  "koronadal": "9506",
  "city of koronadal": "9506",
  "cotabato city": "9600",
  "city of cotabato": "9600",
  "marawi": "9700",
  "city of marawi": "9700",
  "kidapawan": "9400",
  "city of kidapawan": "9400",
  "tacurong": "9800",
  "city of tacurong": "9800",

  // Caraga
  "butuan": "8600",
  "city of butuan": "8600",
  "surigao city": "8400",
  "city of surigao": "8400",
  "tandag": "8300",
  "city of tandag": "8300",
  "bislig": "8311",
  "city of bislig": "8311",
  "bayugan": "8502",
  "city of bayugan": "8502",
}

/**
 * Normalizes a city/municipality name for lookup.
 * e.g., "City of Makati" -> "city of makati", "Quezon City" -> "quezon city"
 */
function normalizeName(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents (ñ -> n)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
}

/**
 * Looks up the standard postal code for a given city and optional province.
 * Returns empty string if not found.
 */
export function getPostalCode(cityName = "", provinceName = "") {
  if (!cityName) return ""

  const cleanCity = normalizeName(cityName)

  // Direct match
  if (PH_ZIP_CODES[cleanCity]) {
    return PH_ZIP_CODES[cleanCity]
  }

  // Stripped "city of" or "municipality of" match
  const stripped = cleanCity
    .replace(/^city of\s+/, "")
    .replace(/^municipality of\s+/, "")
    .trim()

  if (PH_ZIP_CODES[stripped]) {
    return PH_ZIP_CODES[stripped]
  }

  // Check if any key contains the stripped city or vice versa
  for (const [key, code] of Object.entries(PH_ZIP_CODES)) {
    if (key === stripped || key.includes(stripped) || stripped.includes(key)) {
      return code
    }
  }

  return ""
}

