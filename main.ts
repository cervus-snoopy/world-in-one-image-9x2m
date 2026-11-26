// news-image-20261126 — "The World in One Image"
// Sums up Thursday 26 November 2026 in a single 1024x1024 PNG.
// Pure Node.js stdlib: no network, no dependencies, no external files.
// Every story below happened, or was first reported, on 26 November 2026
// in some time zone. Stories first reported on 24-25 Nov were excluded
// (Cairo tanker fire, Pakistani astronaut, Sooryavanshi double century).
// Drawn with a 5x7 bitmap font and a hand-rolled PNG encoder.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const W = 1024;
const H = 1024;
const PAPER = [246, 241, 227];
const INK = [20, 20, 20];
const RED = [163, 22, 33];
const BLUE = [29, 78, 137];
const GREY = [110, 104, 92];
const LINE = [178, 168, 148];

// ---------------------------------------------------------------- font 5x7
const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  ",": ["00000", "00000", "00000", "00000", "01100", "00100", "01000"],
  ":": ["00000", "01100", "01100", "00000", "01100", "01100", "00000"],
  ";": ["00000", "01100", "01100", "00000", "01100", "00100", "01000"],
  "'": ["00100", "00100", "01000", "00000", "00000", "00000", "00000"],
  '"': ["01010", "01010", "00000", "00000", "00000", "00000", "00000"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
  "?": ["01110", "10001", "00001", "00110", "00100", "00000", "00100"],
  "-": ["00000", "00000", "00000", "01110", "00000", "00000", "00000"],
  "(": ["00010", "00100", "01000", "01000", "01000", "00100", "00010"],
  ")": ["01000", "00100", "00010", "00010", "00010", "00100", "01000"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
  $: ["00100", "01111", "10100", "01110", "00101", "11110", "00100"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
  "+": ["00000", "00100", "00100", "01110", "00100", "00100", "00000"],
  "=": ["00000", "00000", "11111", "00000", "11111", "00000", "00000"],
  "*": ["00000", "10101", "01110", "11111", "01110", "10101", "00000"],
  "#": ["01010", "01010", "11111", "01010", "11111", "01010", "01010"],
  "@": ["01110", "10001", "10111", "10101", "10110", "10000", "01110"],
  _: ["00000", "00000", "00000", "00000", "00000", "00000", "11111"],
};
const BLANK = ["00000", "00000", "00000", "00000", "00000", "00000", "00000"];
const CHAR_W = 5;
const CHAR_H = 7;

// ------------------------------------------------------------- the 50 stories
// head: one-line headline (ALL CAPS, <= 77 chars). sub: lead detail line.
// region / field drive the masthead counts, computed from this data.
const LEADS = [
  {
    head: "HOUTHI DRONES HIT SAUDI RAS TANURA REFINERY; BRENT TOPS $94",
    sub: "FIRES AT THE WORLD'S LARGEST OIL TERMINAL; TANKERS HIT MINES IN HORMUZ",
    region: "MIDDLE EAST",
    field: "ENERGY",
  },
  {
    head: "TRUMP UNVEILS TARIFF PLAN ON 14 TRADING PARTNERS",
    sub: "TAIWAN ANSWERS ON THE 26TH: 15 PERCENT, LOWEST TIER; CHIP STOCKS SLIDE",
    region: "NORTH AMERICA",
    field: "TRADE",
  },
  {
    head: "EU LEADERS OPEN TWO-DAY SUMMIT ON BUDGET, UKRAINE CASH",
    sub: "EURO SUMMIT MEETS IN BRUSSELS AS WAR SPILLS INTO POLAND",
    region: "EUROPE",
    field: "POLITICS",
  },
];
const REST = [
  ["TWO OIL TANKERS HIT NAVAL MINES IN THE STRAIT OF HORMUZ", "MIDDLE EAST", "ENERGY"],
  ["ISRAEL STRIKES HAMAS COLONEL IN GAZA; CEASEFIRE UNDER STRAIN", "MIDDLE EAST", "CONFLICT"],
  ["UKRAINE HITS TWO RUSSIAN REFINERIES OVERNIGHT; PUTIN VOWS REPLY", "EUROPE", "CONFLICT"],
  ["RUSSIA'S OWN FIGURES: NEARLY 500,000 LOST IN UKRAINE WAR", "EUROPE", "CONFLICT"],
  ["POLAND ASKS NATO TO DOWN RUSSIAN MISSILES OVER UKRAINE", "EUROPE", "DEFENCE"],
  ["FRANCE OFFERS ENVOY TO MOSCOW IF EUROPE GETS FULL SEAT AT TALKS", "EUROPE", "DIPLOMACY"],
  ["BANK OF KOREA DECIDES LAST RATES CALL OF 2026; HIKE EXPECTED", "EAST ASIA", "CENTRAL BANKS"],
  ["BOJ'S TAMURA TALKS HAWKISH BEFORE DECEMBER RATE DECISION", "EAST ASIA", "CENTRAL BANKS"],
  ["US TIGHTENS REMOTE AI CHIP ACCESS; NVIDIA B300 CHIPS SEEK BUYERS", "NORTH AMERICA", "TECH"],
  ["ECONOMISTS WARN AI BUBBLE BURST COULD TOP THE DOT-COM CRASH", "GLOBAL", "MARKETS"],
  ["ASIAN MARKETS STEADY: ASX UP, GOLD $3,570, BRENT $94.65", "OCEANIA", "MARKETS"],
  ["US MARKETS SHUT FOR THANKSGIVING; BOND MARKET CLOSED TOO", "NORTH AMERICA", "MARKETS"],
  ["NOR'EASTER SLAMS US EAST COAST ON THANKSGIVING; 250M IN ITS PATH", "NORTH AMERICA", "WEATHER"],
  ["US ATTORNEY GENERAL DODGES QUESTIONS ON NVIDIA PROBE", "NORTH AMERICA", "JUSTICE"],
  ["BEPICOLOMBO REACHES MERCURY ORBIT AFTER EIGHT-YEAR JOURNEY", "GLOBAL", "SPACE"],
  ["CLOSE-UP IMAGES OF ASTEROID HIT TO TEST EARTH DEFENCE REVEALED", "GLOBAL", "SCIENCE"],
  ["DURAN DURAN GUITARIST ANDY TAYLOR DIES AT 65", "GLOBAL", "CULTURE"],
  ["GUKESH HELD TO 20-MOVE DRAW BY SINDAROV IN WORLD CHESS FINAL", "SOUTH ASIA", "SPORT"],
  ["IPL 2027 AUCTION DRAWS 1,220 PLAYER REGISTRATIONS", "SOUTH ASIA", "SPORT"],
  ["INDIA A FACE SRI LANKA A IN RISING STARS SEMI-FINAL IN DOHA", "SOUTH ASIA", "SPORT"],
  ["INDIA MARKS CONSTITUTION DAY AND 18 YEARS SINCE 26/11 ATTACKS", "SOUTH ASIA", "ANNIVERSARY"],
  ["IITS TO ADD 6,000 SEATS IN ROBOTICS, AI AND SPACE TECHNOLOGY", "SOUTH ASIA", "EDUCATION"],
  ["INDIA'S SPACE ECONOMY TO GROW FROM $9BN TO $45BN IN A DECADE", "SOUTH ASIA", "SPACE"],
  ["INDIA ANNOUNCES RS15,000-CRORE PACKAGE FOR NEPAL AFTER MODI TALKS", "SOUTH ASIA", "DIPLOMACY"],
  ["INDIA URGES HUMAN CONTROL OVER AI IN MILITARY OPERATIONS", "SOUTH ASIA", "TECH"],
  ["FLIPKART CEO KALYAN KRISHNAMURTHY TO STEP DOWN IN DECEMBER", "SOUTH ASIA", "BUSINESS"],
  ["TWO INDIANS HURT IN RIYADH TOWER ATTACK; INDIA CONDEMNS STRIKE", "MIDDLE EAST", "CONFLICT"],
  ["SHEIKH HASINA SEEKS RETURN TO BANGLADESH ON DECEMBER 16", "SOUTH ASIA", "POLITICS"],
  ["BANGLADESH RAISES GARMENT MINIMUM WAGE BY 36 PERCENT", "SOUTH ASIA", "LABOUR"],
  ["BANGLADESH DEPLOYS 108 BORDER GUARD PLATOONS AMID UNREST FEARS", "SOUTH ASIA", "SECURITY"],
  ["NORTH KOREA ORDERS SWITZERLAND TO CLOSE PYONGYANG OFFICE", "EAST ASIA", "DIPLOMACY"],
  ["SOLOMON ISLANDS AND AUSTRALIA SIGN HISTORIC SECURITY TREATY", "OCEANIA", "DIPLOMACY"],
  ["COLOMBIA POLICE STORM SUPERMARKET, FREE 20 HELD HOSTAGE 17 HOURS", "LATIN AMERICA", "CRIME"],
  ["UN CHIEF PRAISES COLOMBIA'S DECADE OF PEACE PROGRESS", "LATIN AMERICA", "DIPLOMACY"],
  ["BRAZIL MOSQUITOES CUT VIRAL INFECTIONS BY 68 PERCENT", "LATIN AMERICA", "HEALTH"],
  ["ISLAND SCHOOL LETS FAMILIES PAY TUITION WITH COCONUTS", "GLOBAL", "HUMAN INTEREST"],
  ["EMIRATES TOPS GLOBAL AIRLINE RANKINGS", "MIDDLE EAST", "TRANSPORT"],
  ["TURKISH MILITARY HELICOPTER CRASHES IN TRAINING; FIVE KILLED", "EUROPE", "DEFENCE"],
  ["GOOGLE FACES $146M LEGAL ACTION IN MALAYSIA", "SOUTHEAST ASIA", "TECH"],
  ["US INTELLIGENCE AGENCIES SUSPECTED OF HACKING; TRACE POINTS TO CHINA", "NORTH AMERICA", "SECURITY"],
  ["US AIR FORCE UNVEILS F-15EX FIGHTERS AT KADENA, OKINAWA", "EAST ASIA", "DEFENCE"],
  ["TWO CHILDREN AMONG SIX DEAD IN PLANE CRASH OFF MISSISSIPPI COAST", "NORTH AMERICA", "TRANSPORT"],
  ["TEMPUS TO ACQUIRE PERSONALIS IN $600M MERGER DEAL", "NORTH AMERICA", "BUSINESS"],
  ["RAMAYANA BOX OFFICE DAY 20: SECOND RS1,000-CRORE BOLLYWOOD FILM", "SOUTH ASIA", "ENTERTAINMENT"],
  ["ECOWAS UNVEILS ROADMAP FOR JOINT SECURITY UNIT BY END 2027", "AFRICA", "DEFENCE"],
  ["SAUDI NATIONAL FREED FROM SUSPECTED IS CAPTORS IN NIGER", "AFRICA", "SECURITY"],
  ["XI GRAFT PROBE OF SHANGHAI RISING STAR UPENDS PATH TO POWER", "EAST ASIA", "POLITICS"],
];
const STORIES = [...LEADS, ...REST.map(([head, region, field]) => ({ head, region, field }))];
if (STORIES.length !== 50) throw new Error("expected 50 stories, got " + STORIES.length);

// UTC timeline anchors, all verified times on 26 Nov 2026.
const TIMELINE = [
  ["00:27Z", "POLAND ASKS NATO: DOWN MISSILES"],
  ["01:00Z", "BANK OF KOREA DECIDES ITS RATES"],
  ["01:00Z", "BOJ HAWK TAMURA SPEAKS"],
  ["01:27Z", "FRANCE OFFERS ENVOY TO MOSCOW"],
  ["05:00Z", "THANKSGIVING DAWNS ACROSS THE US"],
  ["07:15Z", "EU LEADERS ARRIVE IN BRUSSELS"],
  ["09:00Z", "EURO SUMMIT OPENS ON BUDGET"],
  ["12:00Z", "GERMAN, ROMANIAN FMS IN BERLIN"],
];

// ------------------------------------------------------------------- canvas
const buf = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  buf[i * 3] = PAPER[0];
  buf[i * 3 + 1] = PAPER[1];
  buf[i * 3 + 2] = PAPER[2];
}
function px(x, y, c) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const o = (y * W + x) * 3;
  buf[o] = c[0];
  buf[o + 1] = c[1];
  buf[o + 2] = c[2];
}
function rect(x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) px(i, j, c);
}
function hline(x, y, w, c, th = 1) {
  rect(x, y, w, th, c);
}
function line(x0, y0, x1, y1, c) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    px(x, y, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}
function circle(cx, cy, r, c) {
  let x = r, y = 0, err = 0;
  while (x >= y) {
    px(cx + x, cy + y, c); px(cx + y, cy + x, c); px(cx - y, cy + x, c); px(cx - x, cy + y, c);
    px(cx - x, cy - y, c); px(cx - y, cy - x, c); px(cx + y, cy - x, c); px(cx + x, cy - y, c);
    y += 1;
    if (err <= 0) { err += 2 * y + 1; }
    if (err > 0) { x -= 1; err -= 2 * x + 1; }
  }
}
// Small vector pictograms for the three lead stories.
function drawFlame(x, y, c) {
  line(x + 17, y + 1, x + 26, y + 13, c);
  line(x + 26, y + 13, x + 30, y + 24, c);
  line(x + 30, y + 24, x + 22, y + 34, c);
  line(x + 22, y + 34, x + 12, y + 34, c);
  line(x + 12, y + 34, x + 4, y + 24, c);
  line(x + 4, y + 24, x + 8, y + 13, c);
  line(x + 8, y + 13, x + 17, y + 1, c);
  line(x + 17, y + 12, x + 22, y + 20, c);
  line(x + 22, y + 20, x + 21, y + 28, c);
  line(x + 21, y + 28, x + 13, y + 28, c);
  line(x + 13, y + 28, x + 12, y + 20, c);
  line(x + 12, y + 20, x + 17, y + 12, c);
}
function drawChip(x, y, c) {
  rect(x + 9, y + 9, 16, 16, c);
  rect(x + 12, y + 12, 10, 10, PAPER);
  rect(x + 15, y + 15, 4, 4, c);
  for (let i = 0; i < 3; i++) {
    hline(x + 11 + i * 6, y + 4, 4, c, 2);
    hline(x + 11 + i * 6, y + 30, 4, c, 2);
    rect(x + 4, y + 11 + i * 6, 4, 2, c);
    rect(x + 30, y + 11 + i * 6, 4, 2, c);
  }
}
function drawSummit(x, y, c) {
  line(x + 2, y + 12, x + 17, y + 2, c);
  line(x + 17, y + 2, x + 32, y + 12, c);
  hline(x + 2, y + 12, 31, c, 2);
  rect(x + 6, y + 15, 4, 14, c);
  rect(x + 15, y + 15, 4, 14, c);
  rect(x + 24, y + 15, 4, 14, c);
  hline(x + 2, y + 30, 31, c, 2);
  hline(x + 2, y + 33, 31, c, 2);
}
function text(str, x, y, scale, c) {
  const s = String(str).toUpperCase();
  let cx = x;
  for (const ch of s) {
    const g = FONT[ch] || BLANK;
    for (let r = 0; r < CHAR_H; r++) {
      for (let col = 0; col < CHAR_W; col++) {
        if (g[r][col] === "1") rect(cx + col * scale, y + r * scale, scale, scale, c);
      }
    }
    cx += (CHAR_W + 1) * scale;
  }
  return cx;
}
function textW(str, scale) {
  return String(str).length * (CHAR_W + 1) * scale - scale;
}
function fit(str, maxChars) {
  const s = String(str);
  return s.length <= maxChars ? s : s.slice(0, maxChars);
}

// ---------------------------------------------------------------- PNG encode
const CRC_TABLE = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(b) {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}
function encodePNG() {
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 3 + 1)] = 0;
    buf.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --------------------------------------------------------------------- draw
const regions = new Set(STORIES.map((s) => s.region));
const fields = new Set(STORIES.map((s) => s.field));

function draw() {
  // masthead
  hline(24, 14, 976, RED, 3);
  const title = "THE WORLD IN ONE IMAGE";
  text(title, (W - textW(title, 4)) / 2, 24, 4, INK);
  const date = "THURSDAY 26 NOVEMBER 2026";
  text(date, (W - textW(date, 3)) / 2, 58, 3, INK);
  const sub = `${STORIES.length} STORIES - ${regions.size} REGIONS - ${fields.size} FIELDS - ALL FIRST REPORTED 26 NOV 2026`;
  text(sub, (W - textW(sub, 2)) / 2, 88, 2, RED);
  hline(24, 108, 976, INK, 2);

  // three lead stories
  let ly = 118;
  LEADS.forEach((lead, i) => {
    rect(24, ly - 2, 26, 30, RED);
    text(String(i + 1), 24 + 13 - Math.floor(textW(String(i + 1), 2) / 2), ly + 2, 2, [255, 255, 255]);
    if (i === 0) drawFlame(60, ly - 2, RED);
    else if (i === 1) drawChip(60, ly - 2, BLUE);
    else drawSummit(60, ly - 2, INK);
    text(fit(lead.head, 74), 102, ly, 2, INK);
    text(fit(lead.sub, 74), 102, ly + 17, 2, GREY);
    ly += 38;
  });
  hline(24, 236, 976, LINE, 1);

  // UTC timeline, four columns, compact labels
  text("UTC TIMELINE - THURSDAY 26 NOV 2026", 24, 242, 2, INK);
  TIMELINE.forEach(([t, label], i) => {
    const col = 24 + (i % 4) * 244;
    const row = Math.floor(i / 4);
    const y = 262 + row * 8;
    text(t, col, y, 1, RED);
    text(fit(label, 32), col + textW("00:00Z ", 1), y, 1, INK);
  });
  hline(24, 281, 976, INK, 2);

  // the full list: stories 4 to 50, one line each
  let y = 287;
  for (let i = 3; i < STORIES.length; i++) {
    const num = String(i + 1).padStart(2, "0") + ". ";
    text(num, 24, y, 2, RED);
    text(fit(STORIES[i].head, 77), 24 + textW(num, 2), y, 2, INK);
    y += 15;
  }

  // footer: sources
  hline(24, 996, 976, LINE, 1);
  text("SOURCES: REUTERS, USA TODAY, THE HINDU, BBC, AP, EU PRESS CLUB, MORNINGSTAR, FOX WEATHER", 24, 1000, 1, GREY);
  text("DATE CHECK: EVERY STORY HAPPENED OR WAS FIRST REPORTED ON 26 NOV 2026 (ANY TIME ZONE). 24-25 NOV STORIES EXCLUDED.", 24, 1010, 1, GREY);
}

// --------------------------------------------------------------------- main
function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "output";
  fs.mkdirSync(outDir, { recursive: true });
  draw();
  const png = encodePNG();
  const out = path.join(outDir, "entry.png");
  fs.writeFileSync(out, png);
  fs.chmodSync(out, 0o644);
  console.log(`wrote ${out} (${png.length} bytes, ${W}x${H}, ${STORIES.length} stories, ${regions.size} regions, ${fields.size} fields)`);
}

main();
