const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const path = require("path");
const { applyTheme } = require("/root/.claude/skills/synced/7bc4ed8b-45f2-4c74-bc57-c079cf2f2c7f_a5334037-481e-466a-bc23-6925ecb6e687/pptx/scripts/apply_theme.js");

const IMG = path.join(__dirname, "..", "img");
const OUT = process.argv[2] || "deck.pptx";

// ---------- Theme ----------
const HEX = {
  ink: "14213D", orange: "F28C28", teal: "0F7C80", paper: "FFFFFF", mist: "EEF2F7",
  text: "1F2937", muted: "5B6472", code: "1B2333", codeText: "E5E9F0", green: "2E9E5B", red: "C2413B",
};
const THEME = {
  name: "Web Tech Lab",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.text, lt1: HEX.paper, dk2: HEX.ink, lt2: HEX.mist,
    accent1: HEX.orange, accent2: HEX.teal, accent3: HEX.green, accent4: HEX.red,
    accent5: "6C5CE7", accent6: "8A94A6", hlink: HEX.teal, folHlink: "6C5CE7",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "Web Technologies Lab - 2 Hour Session";
pres.author = "MCS-220 Lab";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const MONO = "Courier New";

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.2, w: 11.7, h: 1.8, fontSize: 44, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.2, w: 11.7, h: 1.0, fontSize: 20, color: C.accent1, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "SECTION",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 2.6, y: 2.55, w: 9.9, h: 1.3, fontSize: 40, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 2.6, y: 3.95, w: 9.9, h: 1.2, fontSize: 18, color: "C9D3E3", valign: "top", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.3, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: "8A94A6", align: "right" },
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 10.4, h: 0.85, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: "MCS-220  ·  Web Technologies Lab", options: { x: 0.6, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: "8A94A6", margin: 0 } } },
  ],
  slideNumber: { x: 12.3, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: "8A94A6", align: "right" },
});

// ---------- Helpers ----------
const iconCache = {};
async function icon(name, color = "FFFFFF") {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[name], { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}

let N = 0;
function nm(s) { N += 1; return `${s}-${N}`; }

async function iconCircle(slide, x, y, d, iconName, fill = C.accent1) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: nm("icon-bg") });
  const p = d * 0.25;
  slide.addImage({ data: await icon(iconName), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, altText: iconName, objectName: nm("icon") });
}

function timeTag(slide, label) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 11.25, y: 0.5, w: 1.5, h: 0.48, rectRadius: 0.24, fill: { color: C.background2 }, line: { type: "none" }, objectName: nm("time-pill") });
  slide.addText(label, { x: 11.25, y: 0.5, w: 1.5, h: 0.48, fontSize: 13, bold: true, color: C.accent2, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("time") });
}

function card(slide, x, y, w, h, fill = C.background2) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" }, objectName: nm("card") });
}

// code block: lines -> runs, comments greyed, annotations orange, optional highlight lines
function code(slide, x, y, w, h, src, opts = {}) {
  const fs = opts.fontSize || 13;
  const hl = opts.highlight || [];
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: HEX.code }, line: { type: "none" }, objectName: nm("code-bg") });
  if (opts.label) {
    slide.addText(opts.label, { x: x + 0.25, y: y + 0.12, w: w - 0.5, h: 0.3, fontSize: 11, bold: true, color: HEX.orange, fontFace: "Calibri", margin: 0, isTextBox: true, objectName: nm("code-label") });
  }
  const lines = src.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const runs = lines.map((ln, i) => {
    const t = ln.trim();
    let color = HEX.codeText, bold = false;
    if (t.startsWith("//") || t.startsWith("<!--") || t.startsWith("#") || t.startsWith("<%--") || t.startsWith("*") || t.startsWith("/*")) color = "8A94A6";
    else if (t.startsWith("@")) color = HEX.orange;
    if (hl.includes(i)) { color = "FFD479"; bold = true; }
    return { text: ln.length ? ln : " ", options: { color, bold, fontFace: MONO, fontSize: fs, breakLine: i < lines.length - 1 } };
  });
  const top = opts.label ? 0.45 : 0.18;
  slide.addText(runs, { x: x + 0.25, y: y + top, w: w - 0.4, h: h - top - 0.12, valign: "top", margin: 0, paraSpaceAfter: 0, lineSpacingMultiple: 1.0, isTextBox: true, objectName: nm("code") });
}

function bullets(slide, items, x, y, w, h, fs = 16, color = C.text1) {
  const runs = [];
  items.forEach((it, i) => {
    const last = i === items.length - 1;
    if (typeof it === "string") runs.push({ text: it, options: { bullet: { indent: 18 }, breakLine: !last, color } });
    else {
      runs.push({ text: it.b, options: { bullet: { indent: 18 }, bold: true, color } });
      runs.push({ text: " " + it.t, options: { breakLine: !last, color } });
    }
  });
  slide.addText(runs, { x, y, w, h, fontSize: fs, valign: "top", paraSpaceAfter: 8, margin: 0, isTextBox: true, objectName: nm("bullets") });
}

function flow(slide, steps, x, y, boxW, boxH, gap, fills) {
  steps.forEach((s, i) => {
    const bx = x + i * (boxW + gap);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y, w: boxW, h: boxH, rectRadius: 0.1, fill: { color: fills ? fills[i % fills.length] : C.text2 }, line: { type: "none" }, objectName: nm("flow-box") });
    slide.addText(s, { x: bx + 0.08, y, w: boxW - 0.16, h: boxH, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("flow-text") });
    if (i < steps.length - 1) {
      slide.addShape(pres.shapes.RIGHT_ARROW, { x: bx + boxW + gap * 0.18, y: y + boxH / 2 - 0.16, w: gap * 0.64, h: 0.32, fill: { color: C.accent1 }, line: { type: "none" }, objectName: nm("flow-arrow") });
    }
  });
}

function table(slide, header, rows, x, y, w, colW, fs = 14, rowH = 0.42) {
  const hdr = header.map((h) => ({ text: h, options: { bold: true, color: HEX.paper, fill: { color: HEX.ink }, fontSize: fs } }));
  const body = rows.map((r, ri) => r.map((c, ci) => ({
    text: c, options: { fontSize: fs, color: HEX.text, fill: { color: ri % 2 ? "FFFFFF" : HEX.mist }, fontFace: (ci === 0 && r.mono) ? MONO : undefined, bold: ci === 0 },
  })));
  slide.addTable([hdr, ...body], { x, y, w, colW, rowH, border: { type: "solid", pt: 0.5, color: "D5DCE6" }, valign: "middle", margin: [4, 8, 4, 8], objectName: nm("table") });
}

function S(master, section) { return pres.addSlide({ masterName: master, sectionTitle: section }); }

// ================= BUILD =================
(async () => {
  // ---------- 1. Title ----------
  pres.addSection({ title: "Opening" });
  let s = S("TITLE", "Opening");
  await iconCircle(s, 0.8, 0.9, 1.0, "FaJava", C.accent1);
  s.addText("Web Technologies Lab: Servlets → JSP → Spring Boot", { placeholder: "title" });
  s.addText("MCS-220 · Section 2 · A 2-hour hands-on crash session (including doubt solving)", { placeholder: "body" });
  s.addText("Setup  ·  Servlets  ·  JSP  ·  Spring MVC + Bootstrap  ·  Lab roadmap  ·  Q&A", { x: 0.8, y: 6.3, w: 11.7, h: 0.4, fontSize: 14, color: "C9D3E3", margin: 0, isTextBox: true, objectName: "title-strip" });
  s.addNotes("Welcome (2 min). Today's promise: in two hours every student will have installed the toolchain, run a Servlet, a JSP page and a Spring Boot MVC app, and know exactly what to do in the 10 lab sessions. Tell them a printed/PDF handbook covers every step in detail, so they should focus on understanding rather than copying.");

  // ---------- 2. Agenda ----------
  s = S("CONTENT", "Opening");
  s.addText("Our 120-minute plan", { placeholder: "title" });
  const agenda = [
    ["00–10", "Kick-off & the big picture", "FaRoute"],
    ["10–25", "Set up JDK, IDE & Tomcat", "FaTools"],
    ["25–50", "Servlets: request → response", "FaServer"],
    ["50–70", "JSP: HTML with Java inside", "FaFileCode"],
    ["70–100", "Spring Boot MVC + Bootstrap", "FaLeaf"],
    ["100–105", "Lab sessions roadmap", "FaListOl"],
    ["105–120", "Doubt solving & quick quiz", "FaQuestionCircle"],
  ];
  for (let i = 0; i < agenda.length; i++) {
    const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
    const x = 0.6 + col * 6.2, y = 1.5 + row * 1.32;
    card(s, x, y, 5.9, 1.1);
    await iconCircle(s, x + 0.2, y + 0.2, 0.7, agenda[i][2], i === 6 ? C.accent2 : C.accent1);
    s.addText(agenda[i][0] + " min", { x: x + 1.1, y: y + 0.14, w: 4.6, h: 0.36, fontSize: 13, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: nm("ag-time") });
    s.addText(agenda[i][1], { x: x + 1.1, y: y + 0.5, w: 4.6, h: 0.45, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: nm("ag-title") });
  }
  s.addText("Doubt time is protected: park questions on the board during the talk and we answer them all at 105 min.", { x: 6.8, y: 5.55, w: 5.9, h: 1.0, fontSize: 15, italic: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true, objectName: "agenda-note" });
  s.addNotes("1 min. Walk through the timeline. Ask students to write questions on sticky notes or a shared doc ('parking lot') so the flow is not broken; we clear the lot in the final 15 minutes.");

  // ---------- 3. Outcomes ----------
  s = S("CONTENT", "Opening");
  s.addText("By the end of today you will be able to…", { placeholder: "title" });
  const outs = [
    ["FaDownload", "Install & configure", "JDK, JAVA_HOME, NetBeans / Eclipse and Apache Tomcat"],
    ["FaServer", "Write a Servlet", "Read request data and send an HTML response, mapped in web.xml"],
    ["FaFileCode", "Build JSP pages", "Use directives, expressions and implicit objects to show form data"],
    ["FaLeaf", "Run Spring Boot MVC", "Controller + Model + Thymeleaf view, styled with Bootstrap"],
  ];
  for (let i = 0; i < 4; i++) {
    const x = 0.6 + i * 3.08;
    card(s, x, 1.6, 2.88, 4.6);
    await iconCircle(s, x + 0.94, 1.95, 1.0, outs[i][0], i % 2 ? C.accent2 : C.accent1);
    s.addText(outs[i][1], { x: x + 0.2, y: 3.15, w: 2.48, h: 0.8, fontSize: 19, bold: true, color: C.text2, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("out-t") });
    s.addText(outs[i][2], { x: x + 0.2, y: 4.0, w: 2.48, h: 1.9, fontSize: 15, color: C.text1, align: "center", valign: "top", margin: 0, isTextBox: true, objectName: nm("out-b") });
  }
  s.addNotes("2 min. These four outcomes map to the four technical blocks. Mention the 10 lab sessions build on these exact skills.");

  // ---------- 4. Big picture ----------
  s = S("CONTENT", "Opening");
  s.addText("The big picture: how a web request travels", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  flow(s, ["Browser\n(HTML form / URL)", "Web server\nApache Tomcat", "Your Java code\nServlet · JSP · Controller", "HTML response\nback to browser"], 0.6, 1.7, 2.65, 1.35, 0.5, [HEX.ink, HEX.teal, HEX.orange, HEX.ink]);
  const bp = [
    ["Servlet", "A Java class that receives the HTTP request and writes the HTML response itself."],
    ["JSP", "An HTML page with small Java pieces; Tomcat converts it into a servlet for you."],
    ["Spring MVC", "A framework: a Controller handles the request, a template (Thymeleaf) draws the page."],
  ];
  bp.forEach((b, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 3.65, 3.85, 2.3);
    s.addText(b[0], { x: x + 0.3, y: 3.85, w: 3.3, h: 0.5, fontSize: 20, bold: true, color: i === 2 ? C.accent2 : C.accent1, margin: 0, isTextBox: true, objectName: nm("bp-t") });
    s.addText(b[1], { x: x + 0.3, y: 4.45, w: 3.3, h: 1.9, fontSize: 16, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: nm("bp-b") });
  });
  s.addNotes("5 min. Draw this on the board too. Key idea: all three technologies sit in the same place (inside Tomcat) and do the same job (turn a request into a response). They differ only in how much code YOU write. Evolution: Servlet (all Java) -> JSP (mostly HTML) -> Spring MVC (separation of concerns).");

  // ---------- Section: Setup ----------
  pres.addSection({ title: "Environment Setup" });
  s = S("SECTION", "Environment Setup");
  await iconCircle(s, 0.9, 2.75, 1.3, "FaTools", C.accent1);
  s.addText("Part 1 · Setting up the environment", { placeholder: "title" });
  s.addText("10–25 min  ·  JDK → JAVA_HOME → IDE → Tomcat → first project", { placeholder: "body" });
  s.addNotes("Transition. Ideally students installed software before class (send the handbook in advance). In class, demonstrate, don't wait for downloads.");

  // ---------- IDE features ----------
  s = S("CONTENT", "Environment Setup");
  s.addText("Why an IDE? Everything in one window", { placeholder: "title" });
  timeTag(s, "≈ 2 min");
  const ide = [
    ["FaEdit", "Code editor", "Syntax colouring and auto-completion"],
    ["FaCogs", "Compiler", "Turns .java source into runnable bytecode"],
    ["FaBug", "Debugger", "Breakpoints, step-through, watch variables"],
    ["FaHammer", "Builder", "Ant / Maven build & deploy in one click"],
    ["FaSitemap", "Class browser", "Explore classes, methods and objects"],
    ["FaProjectDiagram", "Hierarchy view", "Visualise the project structure"],
  ];
  for (let i = 0; i < 6; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.55 + row * 2.05;
    card(s, x, y, 3.85, 1.8);
    await iconCircle(s, x + 0.25, y + 0.5, 0.8, ide[i][0], i % 2 ? C.accent2 : C.accent1);
    s.addText(ide[i][1], { x: x + 1.25, y: y + 0.3, w: 2.45, h: 0.5, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: nm("ide-t") });
    s.addText(ide[i][2], { x: x + 1.25, y: y + 0.8, w: 2.45, h: 0.85, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: nm("ide-b") });
  }
  s.addText("Popular Java IDEs: Apache NetBeans · Eclipse IDE for Enterprise Java · IntelliJ IDEA", { x: 0.6, y: 5.85, w: 12.1, h: 0.5, fontSize: 16, italic: true, color: C.text1, margin: 0, isTextBox: true, objectName: "ide-foot" });
  s.addNotes("2 min. Before IDEs we used a text editor + javac + manual deployment. The IDE automates compile -> build -> deploy -> run. We'll use NetBeans for Servlet/JSP (simplest Tomcat wiring) and Eclipse (or any IDE) for Spring Boot.");

  // ---------- Toolchain ----------
  s = S("CONTENT", "Environment Setup");
  s.addText("Your toolchain checklist", { placeholder: "title" });
  timeTag(s, "≈ 2 min");
  table(s, ["Tool", "Why you need it", "Recommended version", "Get it from"], [
    ["JDK", "Compiler + runtime for Java", "LTS: 17 or 21", "oracle.com / adoptium.net"],
    ["Apache Tomcat", "Web server that runs Servlets & JSP", "9.0.x (javax code)", "tomcat.apache.org"],
    ["Apache NetBeans", "IDE for Servlet & JSP projects", "Latest release", "netbeans.apache.org"],
    ["Eclipse IDE (EE)", "IDE for Spring projects (+ Spring Tools)", "Latest release", "eclipse.org/downloads"],
    ["Maven", "Downloads libraries, builds the project", "Bundled with the IDEs", "maven.apache.org"],
    ["MySQL", "Database for CRUD labs (sessions 1, 6–10)", "8.x", "dev.mysql.com"],
    ["Web browser", "To test http://localhost:8080", "Chrome / Edge / Firefox", "—"],
  ], 0.6, 1.5, 12.1, [2.4, 4.3, 2.6, 2.8], 15, 0.55);
  s.addText("Tip: the manual's code uses javax.servlet → pair it with Tomcat 9. Tomcat 10+ needs jakarta.servlet imports.", { x: 0.6, y: 6.15, w: 12.1, h: 0.5, fontSize: 15, bold: true, color: C.accent4, margin: 0, isTextBox: true, objectName: "tool-tip" });
  s.addNotes("2 min. IMPORTANT gotcha that causes most 'my servlet gives 404/500' doubts: Tomcat 10 and later renamed javax.* to jakarta.*. The manual's screenshots use Tomcat 10.0.8 but the code imports javax.servlet — that combination fails. Either use Tomcat 9 with javax, or Tomcat 10/11 with jakarta imports (NetBeans generates the right one for the server you choose).");

  // ---------- JDK ----------
  s = S("CONTENT", "Environment Setup");
  s.addText("Step 1–2: Install the JDK and set JAVA_HOME", { placeholder: "title" });
  timeTag(s, "≈ 4 min");
  card(s, 0.6, 1.5, 5.9, 5.1);
  s.addText("Windows 10 / 11", { x: 0.9, y: 1.7, w: 5.3, h: 0.45, fontSize: 20, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "jdk-win-h" });
  s.addText([
    { text: "Check first: java --version in Command Prompt", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Download & run the JDK installer (choose an LTS version)", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Start → “Edit the system environment variables” → Environment Variables…", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "System variables → New: JAVA_HOME = C:\\Program Files\\Java\\jdk-17", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Edit Path → New → %JAVA_HOME%\\bin → OK, OK, OK", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Open a NEW Command Prompt and re-check java --version", options: { bullet: { type: "number" } } },
  ], { x: 0.9, y: 2.3, w: 5.4, h: 4.1, fontSize: 15, color: C.text1, paraSpaceAfter: 8, valign: "top", margin: 0, isTextBox: true, objectName: "jdk-win" });
  s.addText("Linux (Ubuntu) – add to /etc/profile or ~/.bashrc", { x: 6.8, y: 1.55, w: 5.9, h: 0.45, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: "jdk-lin-h" });
  code(s, 6.8, 2.1, 5.9, 2.3, `
$ sudo apt install openjdk-17-jdk
# then add these lines:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
$ source /etc/profile
$ java -version`, { fontSize: 13 });
  s.addText("Expected output", { x: 6.8, y: 4.6, w: 5.9, h: 0.4, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "jdk-out-h" });
  code(s, 6.8, 5.05, 5.9, 1.55, `
C:\\> java --version
java 17.0.x  LTS
Java(TM) SE Runtime Environment ...`, { fontSize: 13 });
  s.addNotes("4 min. Demo on your own machine. Explain JAVA_HOME (where Java lives — used by Tomcat, Maven, IDEs) versus PATH (where Windows looks for the 'java' and 'javac' commands). Common doubt: 'java is not recognized' = PATH not set, or the old Command Prompt window is still open.");

  // ---------- IDEs install ----------
  s = S("CONTENT", "Environment Setup");
  s.addText("Step 3: Install NetBeans and Eclipse", { placeholder: "title" });
  timeTag(s, "≈ 3 min");
  const ideCols = [
    ["Apache NetBeans", C.accent1, ["Download installer from netbeans.apache.org", "Run as administrator → Next", "Accept the licence agreement", "Choose install folder and JDK (Browse…)", "Install → Finish → launch from Start menu", "First project: enable Java Web/EE when asked"]],
    ["Eclipse IDE", C.accent2, ["Download eclipse-inst-jre-win64.exe", "Pick “Eclipse IDE for Enterprise Java and Web Developers”", "Confirm JDK + install folder → INSTALL", "Accept the user agreement (needs internet)", "LAUNCH → choose a workspace folder", "Help → Eclipse Marketplace → install Spring Tools"]],
  ];
  ideCols.forEach((c, i) => {
    const x = 0.6 + i * 6.2;
    card(s, x, 1.5, 5.9, 5.1);
    s.addText(c[0], { x: x + 0.3, y: 1.7, w: 5.3, h: 0.5, fontSize: 21, bold: true, color: c[1], margin: 0, isTextBox: true, objectName: nm("ide-h") });
    s.addText(c[2].map((t, j) => ({ text: t, options: { bullet: { type: "number" }, breakLine: j < c[2].length - 1 } })), { x: x + 0.3, y: 2.35, w: 5.3, h: 4.0, fontSize: 16, color: C.text1, paraSpaceAfter: 10, valign: "top", margin: 0, isTextBox: true, objectName: nm("ide-l") });
  });
  s.addNotes("3 min. Students only need ONE IDE to start; NetBeans is simplest for Servlet/JSP because Tomcat integration is built in. Eclipse + Spring Tools 4 (from Marketplace) gives Spring Boot support. IntelliJ Community also works with Maven projects.");

  // ---------- Create project ----------
  s = S("CONTENT", "Environment Setup");
  s.addText("Create your first web project in NetBeans", { placeholder: "title" });
  timeTag(s, "≈ 4 min");
  const steps = [
    "File → New Project", "Java with Ant → Java Web → Web Application", "Name: MyFirstServletProject",
    "Server: Add… → Apache Tomcat → Browse to Tomcat folder", "Set manager username / password", "Frameworks: leave unticked → Finish",
  ];
  steps.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.55 + row * 1.55;
    card(s, x, y, 3.85, 1.3);
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: y + 0.32, w: 0.66, h: 0.66, fill: { color: C.accent1 }, line: { type: "none" }, objectName: nm("num-bg") });
    s.addText(String(i + 1), { x: x + 0.2, y: y + 0.32, w: 0.66, h: 0.66, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("num") });
    s.addText(t, { x: x + 1.05, y: y + 0.1, w: 2.65, h: 1.1, fontSize: 15, color: C.text2, bold: true, valign: "middle", margin: 0, isTextBox: true, objectName: nm("step") });
  });
  s.addText("Run it", { x: 0.6, y: 4.85, w: 3, h: 0.45, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: "run-h" });
  s.addText("Right-click the project → Run. NetBeans compiles, deploys to Tomcat and opens the browser at:", { x: 0.6, y: 5.3, w: 6.6, h: 0.9, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "run-b" });
  code(s, 7.4, 4.95, 5.3, 1.25, `
http://localhost:8080/MyFirstServletProject
  host      port   context path`, { fontSize: 14, highlight: [0] });
  s.addNotes("4 min. LIVE DEMO. Edit index.html to show 'Welcome to my First Web Application', run, show the browser. Explain the URL: localhost = your machine, 8080 = Tomcat's port, /MyFirstServletProject = the context path (project name).");

  // ---------- Section: Servlets ----------
  pres.addSection({ title: "Servlets" });
  s = S("SECTION", "Servlets");
  await iconCircle(s, 0.9, 2.75, 1.3, "FaServer", C.accent1);
  s.addText("Part 2 · Servlets", { placeholder: "title" });
  s.addText("25–50 min  ·  Lifecycle → RequestServlet → web.xml → form handling → GET vs POST", { placeholder: "body" });
  s.addNotes("Transition to servlets. 25 minutes for this block.");

  // ---------- Servlet lifecycle ----------
  s = S("CONTENT", "Servlets");
  s.addText("What is a Servlet? Its lifecycle", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  s.addText("A Servlet is a Java class that extends HttpServlet. Tomcat (the servlet container) creates it, calls its methods for every request and destroys it on shutdown.", { x: 0.6, y: 1.45, w: 12.1, h: 0.8, fontSize: 17, color: C.text1, margin: 0, isTextBox: true, objectName: "sv-intro" });
  flow(s, ["Class loaded &\nobject created", "init()\nonce", "service()\nevery request", "doGet() / doPost()", "destroy()\nonce"], 0.6, 2.55, 2.0, 1.25, 0.525, [HEX.ink, HEX.teal, HEX.orange, HEX.orange, HEX.ink]);
  card(s, 0.6, 4.25, 5.9, 2.35);
  s.addText("HttpServletRequest", { x: 0.9, y: 4.4, w: 5.3, h: 0.45, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: "req-h" });
  bullets(s, ["getParameter(\"name\") – a form value", "getMethod(), getRequestURI(), getProtocol()", "getRemoteAddr() – client IP address"], 0.9, 4.95, 5.4, 1.6, 15);
  card(s, 6.8, 4.25, 5.9, 2.35);
  s.addText("HttpServletResponse", { x: 7.1, y: 4.4, w: 5.3, h: 0.45, fontSize: 18, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "res-h" });
  bullets(s, ["setContentType(\"text/html\") – what we send", "getWriter() – a PrintWriter to write HTML", "sendRedirect(url) – send browser elsewhere"], 7.1, 4.95, 5.4, 1.6, 15);
  s.addNotes("5 min. Lifecycle: init() runs once (good for opening a DB connection), service() runs per request and dispatches to doGet/doPost according to the HTTP method, destroy() runs once at shutdown. One servlet object serves many requests using threads. Request object = everything that came IN; response object = everything going OUT.");

  // ---------- RequestServlet code ----------
  s = S("CONTENT", "Servlets");
  s.addText("Example 1: RequestServlet.java", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  code(s, 0.6, 1.45, 7.4, 5.25, `
public class RequestServlet extends HttpServlet {

  protected void processRequest(HttpServletRequest request,
          HttpServletResponse response)
          throws ServletException, IOException {
    response.setContentType("text/html;charset=UTF-8");
    try (PrintWriter out = response.getWriter()) {
      out.println("Current Date & Time: " + new java.util.Date());
      out.println("<h3>Request Information Example</h3>");
      out.println("Method: " + request.getMethod() + "<br>");
      out.println("Request URI: " + request.getRequestURI() + "<br>");
      out.println("Protocol: " + request.getProtocol() + "<br>");
      out.println("Remote Address: " + request.getRemoteAddr());
    }
  }
  @Override
  protected void doGet(HttpServletRequest req,
          HttpServletResponse res)
          throws ServletException, IOException {
    processRequest(req, res);   // doPost() does the same
  }
}`, { fontSize: 12, highlight: [0, 5, 6] });
  const ann = [
    ["extends HttpServlet", "makes the class a servlet Tomcat can call"],
    ["setContentType", "tells the browser “this is HTML”"],
    ["try (PrintWriter out …)", "try-with-resources: the writer closes itself"],
    ["out.println(…)", "every line becomes part of the HTML page"],
    ["doGet → processRequest", "GET and POST share one method"],
  ];
  ann.forEach((a, i) => {
    const y = 1.45 + i * 1.07;
    card(s, 8.25, y, 4.45, 0.93);
    s.addText(a[0], { x: 8.45, y: y + 0.08, w: 4.1, h: 0.36, fontSize: 14, bold: true, fontFace: MONO, color: C.accent1, margin: 0, isTextBox: true, objectName: nm("ann-t") });
    s.addText(a[1], { x: 8.45, y: y + 0.45, w: 4.1, h: 0.4, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, objectName: nm("ann-b") });
  });
  s.addNotes("5 min. Walk line by line using the right-hand cards. NetBeans generates this skeleton automatically: right-click Source Packages -> New -> Servlet; tick 'Add information to deployment descriptor (web.xml)'. Imports needed: java.io.IOException, java.io.PrintWriter, javax.servlet.ServletException, javax.servlet.http.* (jakarta.* on Tomcat 10+).");

  // ---------- web.xml ----------
  s = S("CONTENT", "Servlets");
  s.addText("web.xml: connecting a URL to a Servlet", { placeholder: "title" });
  timeTag(s, "≈ 4 min");
  code(s, 0.6, 1.45, 6.6, 4.1, `
<web-app version="3.1" ...>
  <servlet>
    <servlet-name>RequestServlet</servlet-name>
    <servlet-class>RequestServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>RequestServlet</servlet-name>
    <url-pattern>/RequestServlet</url-pattern>
  </servlet-mapping>
  <session-config>
    <session-timeout>30</session-timeout>
  </session-config>
</web-app>`, { fontSize: 13, label: "WEB-INF/web.xml (deployment descriptor)", highlight: [2, 3, 6, 7] });
  flow(s, ["URL\n/RequestServlet", "servlet-name\nRequestServlet", "servlet-class\nRequestServlet"], 7.5, 1.6, 1.55, 1.35, 0.32, [HEX.ink, HEX.teal, HEX.orange]);
  bullets(s, [
    { b: "<servlet>", t: "gives the class a nickname" },
    { b: "<servlet-mapping>", t: "links that nickname to a URL" },
    { b: "<session-timeout>", t: "session expires after 30 idle minutes" },
    { b: "Shortcut:", t: "@WebServlet(\"/RequestServlet\") on the class does the same job without XML" },
  ], 7.5, 3.3, 5.2, 3.3, 15);
  s.addText("Visit:  http://localhost:8080/ServletLab/RequestServlet", { x: 0.6, y: 5.8, w: 6.6, h: 0.5, fontSize: 16, bold: true, fontFace: MONO, color: C.accent2, margin: 0, isTextBox: true, objectName: "wx-url" });
  s.addNotes("4 min. The two names MUST match exactly (case-sensitive) or you get a 404 / deployment error. Mention annotation alternative @WebServlet which modern code prefers; the manual uses web.xml so students should know both.");

  // ---------- Output ----------
  s = S("CONTENT", "Servlets");
  s.addText("Run it: what you should see", { placeholder: "title" });
  timeTag(s, "≈ 2 min");
  code(s, 0.6, 1.45, 6.6, 3.3, `
Current Date & Time: Mon Nov 09 16:07:34 IST 2026
Request Information Example
Method: GET
Request URI: /ServletLab/RequestServlet
Protocol: HTTP/1.1
PathInfo: null
Remote Address: 127.0.0.1`, { fontSize: 14, label: "Browser output (tested)" });
  table(s, ["Line", "Comes from"], [
    ["Method: GET", "Typing a URL in the browser always sends GET"],
    ["Request URI", "context path + servlet URL pattern"],
    ["PathInfo: null", "nothing extra after the mapped URL"],
    ["127.0.0.1", "IPv4 loopback (you may see 0:0:0:0:0:0:0:1)"],
  ], 7.5, 1.45, 5.2, [1.8, 3.4], 14, 0.62);
  card(s, 0.6, 5.05, 12.1, 1.55);
  s.addText([
    { text: "Try it live:  ", options: { bold: true, color: C.accent1 } },
    { text: "add /extra/path to the URL and watch PathInfo stay null (it only fills for wildcard mappings like /RequestServlet/*). Change the mapping to /req/* and try again." },
  ], { x: 0.9, y: 5.15, w: 11.5, h: 1.35, fontSize: 16, color: C.text1, margin: 0, valign: "middle", isTextBox: true, objectName: "out-try" });
  s.addNotes("2 min. Run it live. The output text is exactly what our tested project printed. Encourage students to experiment with the URL mapping — understanding mappings prevents most 404 doubts.");

  // ---------- Form flow ----------
  s = S("CONTENT", "Servlets");
  s.addText("Example 2: a form handled by two Servlets", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  flow(s, ["GET /PersonalInfoFrom\nservlet prints a Bootstrap form", "User fills form\nclicks Submit", "POST /info\nPersonalInfo servlet", "Reads getParameter()\nprints values in a table"], 0.6, 1.5, 2.65, 1.45, 0.5, [HEX.ink, HEX.teal, HEX.orange, HEX.ink]);
  code(s, 0.6, 3.3, 6.0, 3.3, `
<!-- printed by PersonalInfoFrom -->
<form action="info" method="post">
  <input type="text"  name="name">
  <input type="email" name="emailId">
  <select name="state">...</select>
  <button type="submit">Submit</button>
</form>`, { fontSize: 13, label: "The form (HTML)", highlight: [1, 2] });
  code(s, 6.8, 3.3, 5.9, 3.3, `
// inside PersonalInfo.doPost(...)
String name  = request.getParameter("name");
String email = request.getParameter("emailId");
String state = request.getParameter("state");
out.println("<tr><th>Name</th><td>"
            + name + "</td></tr>");`, { fontSize: 13, label: "The handler (Java)", highlight: [1] });
  s.addNotes("5 min. The golden rule: the 'name' attribute in the HTML input must exactly match the string passed to request.getParameter(). action='info' is relative, so it goes to /ServletLab/info, which web.xml maps to PersonalInfo. Bootstrap classes (container, row, col-md-6, form-control, btn btn-primary) only style the page — they don't affect the logic.");

  // ---------- GET vs POST ----------
  s = S("CONTENT", "Servlets");
  s.addText("GET vs POST: which one and when?", { placeholder: "title" });
  timeTag(s, "≈ 3 min");
  table(s, ["", "GET", "POST"], [
    ["Data travels in", "URL: ?name=Asha&city=Pune", "Request body (hidden from URL)"],
    ["Visible / bookmarkable", "Yes", "No"],
    ["Size limit", "Limited by URL length", "Practically no limit"],
    ["Use for", "Search, filters, reading data", "Login, registration, saving data"],
    ["Servlet method", "doGet()", "doPost()"],
  ], 0.6, 1.5, 12.1, [3.2, 4.45, 4.45], 16, 0.62);
  card(s, 0.6, 5.5, 12.1, 1.1);
  await iconCircle(s, 0.85, 5.68, 0.75, "FaLock", C.accent4);
  s.addText("Passwords must never be sent with GET: they end up in browser history and server logs.", { x: 1.85, y: 5.5, w: 10.6, h: 1.1, fontSize: 17, bold: true, color: C.text2, margin: 0, valign: "middle", isTextBox: true, objectName: "gp-warn" });
  s.addNotes("3 min. Demo: change the form method to get, submit, and show the data in the address bar (manual figure 2.36 vs 2.37). Then switch back to post.");

  // ---------- Section: JSP ----------
  pres.addSection({ title: "JSP" });
  s = S("SECTION", "JSP");
  await iconCircle(s, 0.9, 2.75, 1.3, "FaFileCode", C.accent1);
  s.addText("Part 3 · JavaServer Pages (JSP)", { placeholder: "title" });
  s.addText("50–70 min  ·  How JSP works → syntax → the same form, rebuilt in JSP", { placeholder: "body" });
  s.addNotes("Transition: 'Writing HTML inside out.println() was painful, right? JSP flips it around.'");

  // ---------- How JSP works ----------
  s = S("CONTENT", "JSP");
  s.addText("JSP flips the servlet inside out", { placeholder: "title" });
  timeTag(s, "≈ 4 min");
  card(s, 0.6, 1.5, 5.9, 2.2);
  s.addText("Servlet", { x: 0.9, y: 1.65, w: 5.3, h: 0.45, fontSize: 19, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "vs-s-h" });
  s.addText("Java code with HTML inside strings:\nout.println(\"<td>\" + name + \"</td>\");", { x: 0.9, y: 2.15, w: 5.3, h: 1.4, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "vs-s-b" });
  card(s, 6.8, 1.5, 5.9, 2.2);
  s.addText("JSP", { x: 7.1, y: 1.65, w: 5.3, h: 0.45, fontSize: 19, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: "vs-j-h" });
  s.addText("HTML page with small Java pieces:\n<td><%= request.getParameter(\"name\") %></td>", { x: 7.1, y: 2.15, w: 5.3, h: 1.4, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "vs-j-b" });
  s.addText("What Tomcat does with a .jsp file (first request only)", { x: 0.6, y: 4.0, w: 12.1, h: 0.45, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "jsp-life-h" });
  flow(s, ["stdForm.jsp", "Translate →\nstdForm_jsp.java", "Compile →\n.class", "Run as a servlet\n_jspService()"], 0.6, 4.6, 2.65, 1.3, 0.5, [HEX.ink, HEX.teal, HEX.orange, HEX.ink]);
  s.addText("So every JSP IS a servlet. Use JSP for the view (HTML), servlets for logic.", { x: 0.6, y: 6.15, w: 12.1, h: 0.45, fontSize: 16, italic: true, color: C.text1, margin: 0, isTextBox: true, objectName: "jsp-note" });
  s.addNotes("4 min. The first request to a JSP is slower because Tomcat translates and compiles it. Later requests reuse the compiled servlet. JSP lifecycle: jspInit(), _jspService(), jspDestroy().");

  // ---------- JSP syntax cheat sheet ----------
  s = S("CONTENT", "JSP");
  s.addText("JSP syntax cheat sheet", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  table(s, ["Element", "Syntax", "Purpose / example"], [
    ["Directive", "<%@ page ... %>", "Page settings: <%@ page import=\"java.util.Date\" %>"],
    ["Expression", "<%= expr %>", "Print a value: <%= new Date() %>"],
    ["Scriptlet", "<% code %>", "Java statements: <% int x = 5; %>"],
    ["Declaration", "<%! decl %>", "Fields/methods: <%! int count = 0; %>"],
    ["Comment", "<%-- text --%>", "Not sent to the browser"],
    ["Action", "<jsp:include page=\"x.jsp\"/>", "Also jsp:forward, jsp:useBean, setProperty"],
    ["JSTL", "<c:forEach>, <c:if>", "Tag library instead of scriptlets (Session 2)"],
  ], 0.6, 1.5, 12.1, [2.1, 3.6, 6.4], 15, 0.6);
  s.addNotes("5 min. Point out: an expression has NO semicolon (<%= x %>), a scriptlet needs one. Implicit objects (request, response, out, session, application, pageContext, config, page, exception) are available without declaring them — they're asked in Session 2 exercise 6.");

  // ---------- JSP code ----------
  s = S("CONTENT", "JSP");
  s.addText("Example 3: stdForm.jsp → studentView.jsp", { placeholder: "title" });
  timeTag(s, "≈ 6 min");
  code(s, 0.6, 1.45, 5.95, 5.2, `
<%@page contentType="text/html"
        pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<body>
 <form action="studentView.jsp"
       method="post">
   <input type="text"
          name="name">
   <input type="email"
          name="emailId">
   <input type="text"
          name="zipCode">
   <button type="submit">
     Submit</button>
 </form>
</body>
</html>`, { fontSize: 12, label: "stdForm.jsp (Web Pages folder)", highlight: [0, 5] });
  code(s, 6.75, 1.45, 5.95, 5.2, `
<%@page import="java.util.Date"%>
<%@page contentType="text/html"
        pageEncoding="UTF-8"%>
<table class="table">
 <tr><th>Name:</th>
  <td><%= request.getParameter("name") %></td></tr>
 <tr><th>Email Id:</th>
  <td><%= request.getParameter("emailId") %></td></tr>
 <tr><th>Zip Code:</th>
  <td><%= request.getParameter("zipCode") %></td></tr>
 <tr><th>Entry Date:</th>
  <td><%= new Date() %></td></tr>
 <tr><th>IP Address:</th>
  <td><%= request.getRemoteAddr() %></td></tr>
</table>`, { fontSize: 12, label: "studentView.jsp", highlight: [0, 5] });
  s.addNotes("6 min. Create both files under Web Pages in NetBeans (right-click Web Pages -> New -> JSP). Run stdForm.jsp, fill and submit. Note: no web.xml entry is needed — JSPs are reached directly by file name. 'request' is an implicit object. Compare with the servlet version: same result, far less Java.");

  // ---------- JSP implicit objects ----------
  s = S("CONTENT", "JSP");
  s.addText("The 9 implicit objects (ready to use in any JSP)", { placeholder: "title" });
  timeTag(s, "≈ 3 min");
  const imp = [
    ["request", "form data, headers, IP"], ["response", "redirects, headers"], ["out", "write to the page"],
    ["session", "per-user data (login)"], ["application", "data shared by all users"], ["pageContext", "access to all scopes"],
    ["config", "servlet init parameters"], ["page", "this JSP (like this)"], ["exception", "only in error pages"],
  ];
  imp.forEach((o, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.5 + row * 1.7;
    card(s, x, y, 3.85, 1.45, i % 2 ? C.background2 : "FDF1E4");
    s.addText(o[0], { x: x + 0.3, y: y + 0.2, w: 3.3, h: 0.5, fontSize: 20, bold: true, fontFace: MONO, color: C.text2, margin: 0, isTextBox: true, objectName: nm("imp-t") });
    s.addText(o[1], { x: x + 0.3, y: y + 0.75, w: 3.3, h: 0.5, fontSize: 16, color: C.text1, margin: 0, isTextBox: true, objectName: nm("imp-b") });
  });
  s.addNotes("3 min. Quick tour. Most used: request, out, session. Session example: session.setAttribute(\"user\", name) on login, session.getAttribute(\"user\") on other pages. exception requires <%@ page isErrorPage=\"true\" %>.");

  // ---------- Section: Spring ----------
  pres.addSection({ title: "Spring Boot" });
  s = S("SECTION", "Spring Boot");
  await iconCircle(s, 0.9, 2.75, 1.3, "FaLeaf", C.accent2);
  s.addText("Part 4 · Spring Boot MVC + Bootstrap", { placeholder: "title" });
  s.addText("70–100 min  ·  Initializr → pom.xml → Controller → Model → Thymeleaf view → Bootstrap", { placeholder: "body" });
  s.addNotes("Transition. This is the longest block (30 min) because Sessions 3–10 are all Spring.");

  // ---------- Initializr ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("Create the project with Spring Initializr", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  table(s, ["Field on start.spring.io", "Value for our lab"], [
    ["Project / Language", "Maven · Java"],
    ["Spring Boot", "Latest stable (default)"],
    ["Group", "com.ignou.lab.webtechnologies"],
    ["Artifact / Name", "StudentAdmission"],
    ["Packaging · Java", "War (or Jar) · 17"],
    ["Dependencies", "Spring Web, Thymeleaf, DevTools"],
  ], 0.6, 1.5, 6.8, [3.0, 3.8], 15, 0.6);
  s.addText("Then", { x: 7.8, y: 1.5, w: 4.9, h: 0.45, fontSize: 19, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: "init-then" });
  s.addText([
    { text: "Click GENERATE → a .zip downloads", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Extract it into your workspace", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Eclipse: File → Open Projects from File System → select folder", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Wait while Maven downloads libraries (internet needed)", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Right-click → Run As → Spring Boot App", options: { bullet: { type: "number" } } },
  ], { x: 7.8, y: 2.05, w: 4.9, h: 3.4, fontSize: 16, color: C.text1, paraSpaceAfter: 10, valign: "top", margin: 0, isTextBox: true, objectName: "init-steps" });
  card(s, 7.8, 5.5, 4.9, 1.1, "FDF1E4");
  s.addText("Don't add Spring Data JPA yet: without database settings the app fails to start.", { x: 8.0, y: 5.5, w: 4.5, h: 1.1, fontSize: 14, bold: true, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: "init-warn" });
  s.addNotes("5 min. LIVE: open start.spring.io and fill it in. The manual used Boot 2.5.4 + Java 11; Initializr now only offers newer versions (Java 17+), which use jakarta.* imports. If JPA is added, the 'Failed to configure a DataSource' error appears until spring.datasource.* properties are set (manual figure 2.45).");

  // ---------- pom.xml & properties ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("pom.xml and application.properties", { placeholder: "title" });
  timeTag(s, "≈ 4 min");
  code(s, 0.6, 1.45, 6.4, 5.2, `
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>…</version>  <!-- manages all versions -->
</parent>
<dependencies>
  <dependency>  <!-- MVC + embedded Tomcat -->
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>  <!-- HTML templates -->
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>
</dependencies>`, { fontSize: 12, label: "pom.xml (Maven project file)", highlight: [8, 12] });
  code(s, 7.25, 1.45, 5.45, 2.35, `
server.port=8080
server.servlet.context-path=/
# only when you add JPA + MySQL:
spring.datasource.url=jdbc:mysql://
    localhost:3306/Student_Admission
spring.datasource.username=root`, { fontSize: 12, label: "src/main/resources/application.properties" });
  bullets(s, [
    { b: "Starter", t: "= one dependency that brings a whole set of libraries" },
    { b: "After editing pom.xml:", t: "right-click → Maven → Update Project" },
    { b: "Port busy?", t: "change server.port=8082" },
  ], 7.25, 4.05, 5.45, 2.6, 15);
  s.addNotes("4 min. Maven reads pom.xml and downloads jars from Maven Central into ~/.m2. Newer Initializr versions name the web starter 'spring-boot-starter-webmvc' — same purpose. Tip for 'Web server failed to start. Port 8080 was already in use': stop the other app (often Tomcat from NetBeans) or change the port.");

  // ---------- MVC flow ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("How Spring MVC handles a request", { placeholder: "title" });
  timeTag(s, "≈ 4 min");
  flow(s, ["Browser\nGET /stdForm", "DispatcherServlet\n(front controller)", "@Controller method\n@GetMapping", "Model\n(data object)", "View\nstdForm.html"], 0.6, 1.6, 2.06, 1.4, 0.45, [HEX.ink, HEX.teal, HEX.orange, HEX.teal, HEX.ink]);
  const mvc = [
    ["M · Model", "The data: a plain Java class (Student) with fields, getters and setters.", C.accent2],
    ["V · View", "The HTML template (Thymeleaf) in src/main/resources/templates.", C.accent1],
    ["C · Controller", "Java class that maps URLs to methods and returns the view name.", C.text2],
  ];
  mvc.forEach((m, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 3.45, 3.85, 2.4);
    s.addText(m[0], { x: x + 0.3, y: 3.65, w: 3.3, h: 0.5, fontSize: 21, bold: true, color: m[2], margin: 0, isTextBox: true, objectName: nm("mvc-t") });
    s.addText(m[1], { x: x + 0.3, y: 4.25, w: 3.3, h: 2.1, fontSize: 16, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: nm("mvc-b") });
  });
  s.addNotes("4 min. Connect back to servlets: DispatcherServlet IS a servlet — Spring registers one for you and it forwards every request to the right @Controller method. Separation of concerns: data (Model), presentation (View), flow (Controller).");

  // ---------- Controller ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("The Controller: StudentController.java", { placeholder: "title" });
  timeTag(s, "≈ 6 min");
  code(s, 0.6, 1.45, 7.3, 5.2, `
@Controller
public class StudentController {

  @GetMapping("/")
  public String welcome() { return "redirect:/dashboard"; }

  @GetMapping("/dashboard")
  public String mainPage() { return "dashboard"; }

  @GetMapping("/stdForm")
  public String studentInputForm(Model theModel) {
    theModel.addAttribute("student", new Student());
    return "stdForm";
  }

  @PostMapping("/student/view")
  public String viewStdInfo(
        @ModelAttribute("student") Student s,
        Model theModel, HttpServletRequest request) {
    s.setEntryDate(new Date());
    s.setIp(request.getRemoteAddr());
    theModel.addAttribute("student", s);
    return "dashboard";
  }
}`, { fontSize: 12 });
  const cann = [
    ["@Controller", "marks the class as a web controller"],
    ["@GetMapping(\"/x\")", "runs the method for GET /x"],
    ["return \"stdForm\"", "→ templates/stdForm.html"],
    ["\"redirect:/dashboard\"", "tells the browser to go to another URL"],
    ["@ModelAttribute", "copies form fields into a Student object"],
  ];
  cann.forEach((a, i) => {
    const y = 1.45 + i * 1.07;
    card(s, 8.15, y, 4.55, 0.93);
    s.addText(a[0], { x: 8.35, y: y + 0.08, w: 4.2, h: 0.36, fontSize: 14, bold: true, fontFace: MONO, color: C.accent1, margin: 0, isTextBox: true, objectName: nm("cann-t") });
    s.addText(a[1], { x: 8.35, y: y + 0.45, w: 4.2, h: 0.4, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, objectName: nm("cann-b") });
  });
  s.addNotes("6 min. Four methods, four URLs: '/', '/dashboard', '/stdForm', '/student/view'. The empty Student added in studentInputForm is what th:object binds to. In viewStdInfo, Spring creates a Student and calls setName(), setEmailId()… for every matching form field — that's data binding. Note: the manual titles this file 'Student.java (Controller Class)' but the class is StudentController, so the file must be StudentController.java. HttpServletRequest import is jakarta.servlet.http on current Spring Boot.");

  // ---------- Thymeleaf binding ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("Model + Thymeleaf: binding the form", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  code(s, 0.6, 1.45, 5.6, 2.55, `
public class Student {
  private String name;
  private String emailId;
  private String zipCode;
  // + getters and setters
}`, { fontSize: 13, label: "entity/Student.java (Model)" });
  code(s, 0.6, 4.2, 5.6, 2.45, `
<td th:text="\${student?.name}"></td>
<td th:text="\${student?.emailId}"></td>`, { fontSize: 13, label: "dashboard.html (display)" });
  code(s, 6.45, 1.45, 6.25, 2.55, `
<form th:action="@{/student/view}"
      th:object="\${student}" method="post">
  <input type="text"  th:field="*{name}">
  <input type="email" th:field="*{emailId}">
  <button type="submit">Submit</button>
</form>`, { fontSize: 13, label: "templates/stdForm.html (form)" });
  table(s, ["Syntax", "Meaning"], [
    ["@{/student/view}", "builds a URL (adds context path)"],
    ["${student}", "reads a Model attribute"],
    ["*{name}", "field of th:object → name/id/value"],
    ["student?.name", "safe navigation: no error if null"],
  ], 6.45, 4.2, 6.25, [2.4, 3.85], 14, 0.48);
  s.addNotes("5 min. Thymeleaf files need xmlns:th=\"http://www.thymeleaf.org\" on <html>. th:field=\"*{name}\" expands to name=\"name\" id=\"name\" value=\"...\". The '?.' (safe navigation) matters on the dashboard: on first visit there is no student in the model, and without '?' Thymeleaf throws SpelEvaluationException.");

  // ---------- Bootstrap ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("Add Bootstrap, jQuery and Font Awesome", { placeholder: "title" });
  timeTag(s, "≈ 3 min");
  card(s, 0.6, 1.5, 5.9, 5.1);
  s.addText("Option A · WebJars (Maven)", { x: 0.9, y: 1.65, w: 5.3, h: 0.45, fontSize: 19, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "bs-a" });
  s.addText("Add webjars-locator, jquery, bootstrap and font-awesome dependencies to pom.xml, update Maven, then:", { x: 0.9, y: 2.15, w: 5.3, h: 0.95, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "bs-a-b" });
  code(s, 0.85, 3.15, 5.4, 3.25, `
<link th:href="@{/webjars/bootstrap/css/
      bootstrap.min.css}" rel="stylesheet">
<link th:href="@{/webjars/font-awesome/
      css/all.css}" rel="stylesheet">
...
<script th:src="@{/webjars/jquery/
      jquery.min.js}"></script>`, { fontSize: 12 });
  card(s, 6.8, 1.5, 5.9, 5.1);
  s.addText("Option B · CDN link", { x: 7.1, y: 1.65, w: 5.3, h: 0.45, fontSize: 19, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: "bs-b" });
  s.addText("Copy the starter template from getbootstrap.com and paste the <link> into <head>. Needs internet when the page loads.", { x: 7.1, y: 2.15, w: 5.3, h: 0.95, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "bs-b-b" });
  code(s, 7.05, 3.15, 5.4, 1.6, `
<link rel="stylesheet" href=
 "https://cdn.jsdelivr.net/npm/
  bootstrap@5.x/dist/css/bootstrap.min.css">`, { fontSize: 12 });
  bullets(s, ["Classes used: container, row, col-md-6, form-control, form-select, btn btn-primary, table", "Icons: <i class=\"fas fa-save\"></i>"], 7.1, 4.95, 5.3, 1.6, 14);
  s.addNotes("3 min. WebJars work offline once downloaded — better for exam labs. The locator lets you omit the version in the URL. On Spring Boot 3.4+/4.x use the 'webjars-locator-lite' artifact (version managed by Boot); older Boot 2.x uses 'webjars-locator' as in the manual. CSS at <head>, JS just before </body>.");

  // ---------- Output screenshots ----------
  s = S("CONTENT", "Spring Boot");
  s.addText("Run it: Run As → Spring Boot App", { placeholder: "title" });
  timeTag(s, "≈ 3 min");
  s.addImage({ path: path.join(IMG, "spring_form.png"), x: 0.6, y: 1.45, w: 5.95, h: 4.11, altText: "Student form at /stdForm, filled in", objectName: "shot-form" });
  s.addImage({ path: path.join(IMG, "spring_dashboard.png"), x: 6.75, y: 1.45, w: 5.95, h: 4.11, altText: "Dashboard showing submitted student details", objectName: "shot-dash" });
  s.addText("1 · localhost:8080/stdForm: fill and Submit", { x: 0.6, y: 5.7, w: 5.95, h: 0.4, fontSize: 14, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "cap1" });
  s.addText("2 · POST /student/view → dashboard shows values + date + IP", { x: 6.75, y: 5.7, w: 5.95, h: 0.4, fontSize: 14, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "cap2" });
  s.addText("Screenshots from the tested lab project. Console shows: “Tomcat started on port 8080”.", { x: 0.6, y: 6.2, w: 12.1, h: 0.4, fontSize: 13, italic: true, color: C.text1, margin: 0, isTextBox: true, objectName: "cap3" });
  s.addNotes("3 min. LIVE: run the app, open http://localhost:8080 — '/' redirects to /dashboard (empty table), click Student Form, fill, submit, and the dashboard shows the data. DevTools restarts the app automatically when you save a file.");

  // ---------- Section: Roadmap ----------
  pres.addSection({ title: "Lab Roadmap" });
  s = S("CONTENT", "Lab Roadmap");
  s.addText("Your 10 lab sessions at a glance", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  const sess = [
    ["1", "Servlet basics", "date/time, form, client IP, sessions & cookies, CRUD"],
    ["2", "JSP", "tags, JSTL, JDBC, actions, implicit objects"],
    ["3", "Maven & frameworks", "Initializr, Spring MVC, Hibernate/JPA, IoC"],
    ["4", "DI & Controller", "dependency injection, @Get/@PostMapping"],
    ["5", "Validation & CSS", "client + server validation, Bootstrap"],
    ["6", "Hibernate / JPA", "entities, CRUD, batch update"],
    ["7", "Boot & REST", "repositories, JSON responses"],
    ["8", "REST, Security, Actuator", "CRUD API, default login"],
    ["9", "Spring Security", "user table, custom login, logout"],
    ["10", "Roles & CSRF", "role-based access, CSRF tokens"],
  ];
  sess.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2, y = 1.45 + row * 1.06;
    card(s, x, y, 5.9, 0.92, i < 2 ? "FDF1E4" : C.background2);
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.13, w: 0.66, h: 0.66, fill: { color: i < 2 ? C.accent1 : i < 6 ? C.accent2 : C.text2 }, line: { type: "none" }, objectName: nm("ses-c") });
    s.addText(r[0], { x: x + 0.15, y: y + 0.13, w: 0.66, h: 0.66, fontSize: 18, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("ses-n") });
    s.addText([{ text: r[1], options: { bold: true, color: C.text2, breakLine: true, fontSize: 16 } }, { text: r[2], options: { color: C.text1, fontSize: 14 } }], { x: x + 1.0, y: y + 0.04, w: 4.8, h: 0.84, valign: "middle", margin: 0, isTextBox: true, objectName: nm("ses-t") });
  });
  s.addNotes("5 min. Today's material directly covers Sessions 1–2 and the foundation of 3–5. Orange = what we did today. Teal = Spring MVC core. Navy = security & REST. Each session builds on the previous one's project, so keep your StudentAdmission project and database.");

  // ---------- Section: Doubts ----------
  pres.addSection({ title: "Doubt Solving" });
  s = S("SECTION", "Doubt Solving");
  await iconCircle(s, 0.9, 2.75, 1.3, "FaQuestionCircle", C.accent1);
  s.addText("Part 5 · Doubt solving", { placeholder: "title" });
  s.addText("105–120 min  ·  Common errors → quick quiz → your questions", { placeholder: "body" });
  s.addNotes("Clear the parking lot. Start with the common-errors slide since it answers most typical doubts.");

  // ---------- Common errors ----------
  s = S("CONTENT", "Doubt Solving");
  s.addText("Top errors students hit (and the fix)", { placeholder: "title" });
  timeTag(s, "≈ 5 min");
  table(s, ["Symptom", "Likely cause", "Fix"], [
    ["'java' is not recognized", "PATH not set / old terminal", "Add %JAVA_HOME%\\bin to Path, open new window"],
    ["HTTP 404 Not Found", "URL ≠ url-pattern or context path", "Check web.xml / @GetMapping spelling and case"],
    ["ClassNotFound / 500 on servlet", "javax code on Tomcat 10+", "Use Tomcat 9, or change imports to jakarta.*"],
    ["Port 8080 already in use", "Another server running", "Stop it, or set server.port=8082"],
    ["Form value shows null", "name attribute ≠ getParameter()", "Make both strings identical"],
    ["Failed to configure a DataSource", "JPA added, no DB settings", "Add spring.datasource.* or remove JPA"],
    ["Template not found", "HTML not in templates/", "Put views in src/main/resources/templates"],
  ], 0.6, 1.5, 12.1, [3.4, 3.9, 4.8], 14, 0.6);
  s.addNotes("5 min. Go through each row quickly, then take questions from the parking lot that aren't covered here.");

  // ---------- Quiz ----------
  s = S("CONTENT", "Doubt Solving");
  s.addText("Quick quiz: 5 questions, 3 minutes", { placeholder: "title" });
  timeTag(s, "≈ 3 min");
  const qs = [
    "Which servlet method runs only once, when the servlet is first loaded?",
    "In web.xml, which tag links a URL to a servlet name?",
    "What is the difference between <%= %> and <% %> in JSP?",
    "What does return \"redirect:/dashboard\" do in a Spring controller?",
    "Why use POST instead of GET for a login form?",
  ];
  for (let i = 0; i < 5; i++) {
    const y = 1.5 + i * 1.0;
    card(s, 0.6, y, 12.1, 0.82);
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: y + 0.11, w: 0.6, h: 0.6, fill: { color: C.accent1 }, line: { type: "none" }, objectName: nm("q-c") });
    s.addText("Q" + (i + 1), { x: 0.8, y: y + 0.11, w: 0.6, h: 0.6, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("q-n") });
    s.addText(qs[i], { x: 1.65, y, w: 10.8, h: 0.82, fontSize: 17, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: nm("q-t") });
  }
  s.addNotes("ANSWERS: Q1 init(). Q2 <servlet-mapping> (with <url-pattern>). Q3 <%= %> prints the value of an expression (no semicolon); <% %> runs Java statements and prints nothing by itself. Q4 sends an HTTP 302 telling the browser to make a new GET request to /dashboard. Q5 POST sends data in the request body, so the password is not visible in the URL, history or server logs.");

  // ---------- Q&A ----------
  s = S("CONTENT", "Doubt Solving");
  s.addText("Your questions", { placeholder: "title" });
  timeTag(s, "≈ 7 min");
  await iconCircle(s, 0.9, 1.9, 2.2, "FaComments", C.accent2);
  s.addText("Open floor: parking-lot questions first, then anything else.", { x: 3.5, y: 1.9, w: 9.2, h: 1.0, fontSize: 22, bold: true, color: C.text2, margin: 0, valign: "middle", isTextBox: true, objectName: "qa-h" });
  s.addText("Good prompts if the room is quiet:", { x: 3.5, y: 3.0, w: 9.2, h: 0.45, fontSize: 17, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "qa-p" });
  bullets(s, [
    "When would I still write a plain servlet instead of using Spring?",
    "Where does session data live, and how do cookies track it?",
    "How does the Student object get filled without me calling setName()?",
    "What changes when we connect MySQL with JPA in Session 6?",
  ], 3.5, 3.55, 9.2, 3.0, 17);
  s.addNotes("Remaining time. If a question needs code, open the handbook's relevant chapter rather than live-coding from scratch.");

  // ---------- Summary ----------
  s = S("TITLE", "Doubt Solving");
  s.addText("Key takeaways", { placeholder: "title" });
  s.addText("One request → one response. Servlets write it in Java, JSP writes it in HTML, Spring MVC splits it into Model, View and Controller.", { placeholder: "body" });
  s.addText("Before the next lab: install everything using the PDF handbook, run all four example programs, then start Session 1 exercises.", { x: 0.8, y: 5.6, w: 11.7, h: 0.9, fontSize: 16, color: "C9D3E3", margin: 0, isTextBox: true, objectName: "next" });
  s.addNotes("1 min wrap-up. Point students to the handbook (installation + step-by-step execution of every example with syntax explanation) as their homework companion.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
