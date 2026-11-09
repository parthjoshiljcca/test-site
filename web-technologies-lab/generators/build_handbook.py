import os, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, Image, KeepTogether, CondPageBreak, NextPageTemplate)
from reportlab.platypus.tableofcontents import TableOfContents
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.abspath(__file__))
SCR = os.path.dirname(ROOT)
CODE = os.path.join(SCR, "code")
IMG = os.path.join(SCR, "img")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "handbook.pdf")

FD = "/usr/share/fonts/truetype/dejavu/"
LD = "/usr/share/fonts/truetype/liberation/"
pdfmetrics.registerFont(TTFont("Sans", LD + "LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold", LD + "LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Oblique", LD + "LiberationSans-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Sans-BoldOblique", LD + "LiberationSans-BoldItalic.ttf"))
pdfmetrics.registerFont(TTFont("Mono", FD + "DejaVuSansMono.ttf"))
pdfmetrics.registerFont(TTFont("Mono-Bold", FD + "DejaVuSansMono-Bold.ttf"))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily("Sans", normal="Sans", bold="Sans-Bold", italic="Sans-Oblique", boldItalic="Sans-BoldOblique")
registerFontFamily("Mono", normal="Mono", bold="Mono-Bold", italic="Mono", boldItalic="Mono-Bold")

INK = colors.HexColor("#14213D"); ORANGE = colors.HexColor("#F28C28"); TEAL = colors.HexColor("#0F7C80")
MIST = colors.HexColor("#EEF2F7"); CODEBG = colors.HexColor("#1B2333"); CODEFG = colors.HexColor("#E5E9F0")
TEXT = colors.HexColor("#1F2937"); MUTED = colors.HexColor("#5B6472"); WARN = colors.HexColor("#FDF1E4"); RED = colors.HexColor("#C2413B")
GREENBG = colors.HexColor("#E6F4EC"); GREEN = colors.HexColor("#2E7D4F")

st = {
    "body": ParagraphStyle("body", fontName="Sans", fontSize=9.5, leading=14, textColor=TEXT, spaceAfter=6),
    "h1": ParagraphStyle("h1", keepWithNext=1, fontName="Sans-Bold", fontSize=20, leading=25, textColor=INK, spaceBefore=4, spaceAfter=10),
    "h2": ParagraphStyle("h2", keepWithNext=1, fontName="Sans-Bold", fontSize=13.5, leading=18, textColor=TEAL, spaceBefore=10, spaceAfter=6),
    "h3": ParagraphStyle("h3", keepWithNext=1, fontName="Sans-Bold", fontSize=11, leading=15, textColor=INK, spaceBefore=8, spaceAfter=4),
    "bullet": ParagraphStyle("bullet", fontName="Sans", fontSize=9.5, leading=14, textColor=TEXT, leftIndent=14, bulletIndent=3, spaceAfter=3),
    "cell": ParagraphStyle("cell", fontName="Sans", fontSize=8.6, leading=11.5, textColor=TEXT),
    "cellb": ParagraphStyle("cellb", fontName="Sans-Bold", fontSize=8.6, leading=11.5, textColor=TEXT),
    "cellh": ParagraphStyle("cellh", fontName="Sans-Bold", fontSize=8.6, leading=11.5, textColor=colors.white),
    "cellm": ParagraphStyle("cellm", fontName="Mono", fontSize=8, leading=11, textColor=INK),
    "code": ParagraphStyle("code", fontName="Mono", fontSize=7.8, leading=10.2, textColor=CODEFG),
    "codelabel": ParagraphStyle("codelabel", fontName="Sans-Bold", fontSize=8, leading=10, textColor=ORANGE),
    "caption": ParagraphStyle("caption", fontName="Sans-Oblique", fontSize=8.5, leading=11, textColor=MUTED, alignment=TA_CENTER, spaceAfter=8),
    "box": ParagraphStyle("box", fontName="Sans", fontSize=9.2, leading=13.2, textColor=TEXT),
    "toc1": ParagraphStyle("toc1", fontName="Sans-Bold", fontSize=10.5, leading=17, textColor=INK, leftIndent=0),
    "toc2": ParagraphStyle("toc2", fontName="Sans", fontSize=9.2, leading=13.5, textColor=TEXT, leftIndent=16),
}

def ic(t):  # inline code
    return f'<font name="Mono" color="#0F5F63">{escape(t)}</font>'

story = []
P = lambda t, s="body": story.append(Paragraph(t, st[s]))

def H1(t):
    story.append(Paragraph(t, st["h1"]))
def H2(t):
    story.append(CondPageBreak(40 * mm)); story.append(Paragraph(t, st["h2"]))
def H3(t):
    story.append(CondPageBreak(30 * mm)); story.append(Paragraph(t, st["h3"]))
def B(items, numbered=False):
    for i, t in enumerate(items, 1):
        story.append(Paragraph(t, st["bullet"], bulletText=(f"{i}." if numbered else "•")))
    story.append(Spacer(1, 4))

def box(text, kind="tip"):
    bg, fg, label = {"tip": (GREENBG, GREEN, "TIP"), "warn": (WARN, RED, "IMPORTANT"), "note": (MIST, TEAL, "NOTE")}[kind]
    t = Table([[Paragraph(f'<font name="Sans-Bold" color="{fg.hexval().replace("0x", "#")}">{label}</font>&nbsp;&nbsp;{text}', st["box"])]], colWidths=[170 * mm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                           ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    story.append(KeepTogether([t, Spacer(1, 8)]))

def code(src, label=None, chunk=44):
    src = src.replace("\t", "    ").rstrip("\n")
    lines = src.split("\n")
    chunks = [lines[i:i + chunk] for i in range(0, len(lines), chunk)]
    for ci, ch in enumerate(chunks):
        cell = []
        if label:
            cell.append(Paragraph(escape(label) + (" (continued)" if ci else ""), st["codelabel"]))
            cell.append(Spacer(1, 3))
        def fmt(l):
            if not l: return "&nbsp;"
            n = len(l) - len(l.lstrip(" "))
            body = escape(l.lstrip(" "))
            body = body.replace("  ", "&nbsp; ")
            return "&nbsp;" * n + body
        txt = "<br/>".join(fmt(l) for l in ch)
        cell.append(Paragraph(txt, st["code"]))
        t = Table([[cell]], colWidths=[170 * mm])
        t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), CODEBG), ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                               ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
        story.append(t)
        story.append(Spacer(1, 3 if ci < len(chunks) - 1 else 9))

def codefile(rel, label=None):
    with open(os.path.join(CODE, rel)) as f:
        code(f.read(), label or rel.split("/")[-1])

def table(header, rows, widths, mono_first=False):
    data = [[Paragraph(h, st["cellh"]) for h in header]]
    for r in rows:
        data.append([Paragraph(escape(c), st["cellm"] if (mono_first and i == 0) else (st["cellb"] if i == 0 else st["cell"])) for i, c in enumerate(r)])
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    sty = [("BACKGROUND", (0, 0), (-1, 0), INK), ("VALIGN", (0, 0), (-1, -1), "TOP"),
           ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D5DCE6")),
           ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]
    for i in range(1, len(data)):
        if i % 2 == 0: sty.append(("BACKGROUND", (0, i), (-1, i), MIST))
    t.setStyle(TableStyle(sty))
    story.append(t); story.append(Spacer(1, 9))

def syntax(rows):
    table(["Code / syntax", "What it means"], rows, [62, 108], mono_first=True)

def output(text, label="Expected output"):
    code(text, label)

def image(path, w_mm, caption):
    from PIL import Image as PI
    w, h = PI.open(path).size
    story.append(KeepTogether([Image(path, width=w_mm * mm, height=w_mm * mm * h / w), Paragraph(caption, st["caption"])]))

# ---------------- Document template ----------------
class Doc(BaseDocTemplate):
    def afterFlowable(self, f):
        if isinstance(f, Paragraph) and f.style.name in ("h1", "h2"):
            lvl = 0 if f.style.name == "h1" else 1
            text = f.getPlainText()
            key = "k%d" % id(f)
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text, key, level=lvl, closed=lvl > 0)
            self.notify("TOCEntry", (lvl, text, self.page, key))

def on_page(c, d):
    c.saveState()
    c.setFont("Sans", 7.5); c.setFillColor(MUTED)
    c.drawString(20 * mm, 12 * mm, "Web Technologies Lab Handbook · Installation & Step-by-Step Program Execution")
    c.drawRightString(190 * mm, 12 * mm, str(d.page))
    c.setStrokeColor(colors.HexColor("#D5DCE6")); c.setLineWidth(0.4); c.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
    c.restoreState()

def on_cover(c, d):
    W, H = A4
    c.saveState()
    c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ORANGE); c.circle(30 * mm, H - 40 * mm, 11 * mm, fill=1, stroke=0)
    c.setFillColor(colors.white); c.setFont("Sans-Bold", 15); c.drawCentredString(30 * mm, H - 42.5 * mm, "</>")
    c.setFont("Sans", 11); c.setFillColor(ORANGE); c.drawString(20 * mm, H - 75 * mm, "MCS-220 · SECTION 2 · WEB TECHNOLOGIES LAB")
    c.setFillColor(colors.white); c.setFont("Sans-Bold", 30)
    c.drawString(20 * mm, H - 92 * mm, "Lab Handbook")
    c.setFont("Sans-Bold", 17)
    c.drawString(20 * mm, H - 104 * mm, "Installation Guide &")
    c.drawString(20 * mm, H - 114 * mm, "Step-by-Step Program Execution")
    c.setFont("Sans", 11); c.setFillColor(colors.HexColor("#C9D3E3"))
    y = H - 135 * mm
    for line in ["JDK · JAVA_HOME · Apache Tomcat · NetBeans · Eclipse",
                 "Servlets · web.xml · Form handling · GET vs POST",
                 "JSP directives, expressions & implicit objects",
                 "Spring Boot MVC · Thymeleaf · Bootstrap · WebJars",
                 "Syntax explained line by line · Troubleshooting · Lab sessions 1–10"]:
        c.drawString(20 * mm, y, line); y -= 7 * mm
    c.setFillColor(colors.HexColor("#8A94A6")); c.setFont("Sans", 9)
    c.drawString(20 * mm, 25 * mm, "Companion notes for the 2-hour teaching session. Every program in this handbook was compiled and run before publishing.")
    c.restoreState()

doc = Doc(OUT, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=18 * mm, bottomMargin=20 * mm,
          title="Web Technologies Lab Handbook", author="MCS-220 Lab", subject="Installation guide and step-by-step program execution")
frame = Frame(20 * mm, 20 * mm, 170 * mm, A4[1] - 38 * mm, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="cover", frames=[frame], onPage=on_cover), PageTemplate(id="main", frames=[frame], onPage=on_page)])

story.append(NextPageTemplate("main")); story.append(PageBreak())

# ---------------- Contents ----------------
story.append(Paragraph("Contents", ParagraphStyle("ct", parent=st["h1"])))
toc = TableOfContents(); toc.levelStyles = [st["toc1"], st["toc2"]]; toc.dotsMinLevel = 0
story.append(toc); story.append(PageBreak())

# ================= 1. Intro =================
H1("1. How to use this handbook")
P("This handbook accompanies the two-hour Web Technologies Lab session (MCS-220, Section 2). The slides explain <i>why</i>; "
  "this handbook gives you <i>every step</i> to install the tools and run each program on your own computer, with the syntax explained line by line.")
B(["<b>Chapter 2</b> installs and verifies the full toolchain (JDK, Tomcat, NetBeans, Eclipse).",
   "<b>Chapters 3 to 6</b> are four complete programs. Each one follows the same pattern: <b>Goal → Create → Code → Syntax explained → Run → Expected output → Try this</b>.",
   "<b>Chapter 7</b> shows the two ways to add Bootstrap, jQuery and Font Awesome.",
   "<b>Chapters 8 to 10</b> hold troubleshooting, the ten lab-session exercise lists, and a one-page quick reference."])
H2("1.1 Versions used and tested")
table(["Component", "Version used for testing", "Notes"], [
    ["JDK", "17 or 21 (LTS)", "Spring Boot 3 and later need Java 17+."],
    ["Servlet/JSP programs", "javax.servlet API 4.0 on a Servlet 4 container", "Run on Apache Tomcat 9.0.x exactly as written."],
    ["Spring Boot program", "Spring Boot 4.1.2 (start.spring.io default)", "Uses jakarta.* imports; Java 17."],
    ["Bootstrap / jQuery / Font Awesome", "5.3.3 / 3.7.1 / 6.5.2 (WebJars)", "Any recent version works."],
], [42, 66, 62])
box("<b>javax vs jakarta.</b> The lab manual's servlet code imports <font name='Mono'>javax.servlet.*</font>. "
    "Tomcat 10 and later renamed this package to <font name='Mono'>jakarta.servlet.*</font>. So: use <b>Tomcat 9</b> with the code exactly as printed here, "
    "or, on Tomcat 10/11, replace every <font name='Mono'>javax.servlet</font> with <font name='Mono'>jakarta.servlet</font>. Mixing them causes HTTP 500 / ClassNotFound errors.", "warn")
box("The manual was written for Spring Boot 2.5 and Java 11. Spring Initializr no longer offers those versions, so Chapter 6 uses the current release. "
    "The code is the same except for two details that are pointed out where they occur (jakarta imports and the WebJars locator artifact).", "note")
story.append(PageBreak())

# ================= 2. Installation =================
H1("2. Installation guide")
H2("2.1 Minimum system requirements")
table(["Item", "Requirement"], [
    ["Operating system", "Windows 10/11 (64-bit), Ubuntu 20.04+ or macOS 12+"],
    ["Memory / disk", "8 GB RAM recommended (4 GB minimum); about 3 GB free disk"],
    ["Internet", "Needed for downloads, the Eclipse installer and Maven dependency downloads"],
    ["Admin rights", "Needed to install software and edit system environment variables"],
], [45, 125])

H2("2.2 Step 1: Install the Java Development Kit (JDK)")
H3("Check whether Java is already installed")
P("Open <b>Command Prompt</b> (Windows) or <b>Terminal</b> (Linux/macOS) and type:")
code("java --version\njavac --version", "Command")
P("If both commands print a version of 17 or higher, skip to section 2.3. If you see <i>'java' is not recognized</i>, install the JDK.")
H3("Windows")
B(["Go to <b>oracle.com/java/technologies/downloads</b> (or <b>adoptium.net</b> for the free Eclipse Temurin build).",
   "Choose an <b>LTS</b> version (17 or 21) and download the <b>Windows x64 Installer (.exe or .msi)</b>.",
   "Run the installer as administrator and accept the defaults. Note the install folder, for example <font name='Mono'>C:\\Program Files\\Java\\jdk-17</font>.",
   "Continue with section 2.3 to set JAVA_HOME and PATH."], numbered=True)
H3("Linux (Ubuntu / Debian)")
code("sudo apt update\nsudo apt install openjdk-17-jdk\njava -version", "Terminal")
H3("macOS")
P("Download the macOS <b>.pkg</b> installer (Arm64 for Apple-silicon Macs, x64 for Intel Macs) and double-click it. Or, with Homebrew: " + ic("brew install openjdk@17") + ".")

H2("2.3 Step 2: Set JAVA_HOME and PATH")
P("<b>JAVA_HOME</b> tells tools such as Tomcat, Maven and the IDEs where Java is installed. <b>PATH</b> tells the operating system where to find the " + ic("java") + " and " + ic("javac") + " commands.")
H3("Windows 10 / 11")
B(["Press <b>Start</b>, type <b>environment</b> and open <b>Edit the system environment variables</b>.",
   "In the <b>System Properties</b> window click <b>Environment Variables…</b>.",
   "Under <b>System variables</b> click <b>New…</b>. Variable name: " + ic("JAVA_HOME") + "; Variable value: your JDK folder, e.g. " + ic("C:\\Program Files\\Java\\jdk-17") + " (use <b>Browse Directory…</b> to avoid typing mistakes). Click OK.",
   "Select the <b>Path</b> system variable → <b>Edit…</b> → <b>New</b> → type " + ic("%JAVA_HOME%\\bin") + " → move it to the top → OK.",
   "Click <b>OK</b> in every open window to save.",
   "<b>Close and reopen</b> Command Prompt, then run " + ic("java --version") + " and " + ic("echo %JAVA_HOME%") + "."], numbered=True)
H3("Linux")
P("Edit " + ic("/etc/profile") + " (all users, needs sudo) or " + ic("~/.bashrc") + " (only you) and add at the end:")
code("export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64\nexport PATH=$PATH:$JAVA_HOME/bin\n# optional: extra jars for command-line compiling\nexport CLASSPATH=$CLASSPATH:.", "/etc/profile or ~/.bashrc")
P("Activate and verify:")
code("source /etc/profile        # or: source ~/.bashrc\necho $JAVA_HOME\njava -version", "Terminal")
output("openjdk version \"17.0.x\" ...\nOpenJDK Runtime Environment ...\nOpenJDK 64-Bit Server VM ...")
box("Find the exact JDK folder on Linux with " + ic("readlink -f $(which javac)") + " and remove the trailing " + ic("/bin/javac") + ".", "tip")

H2("2.4 Step 3: Install Apache Tomcat 9")
P("Tomcat is the web server (servlet container) that runs Servlets and JSP pages.")
B(["Open <b>tomcat.apache.org</b> → <b>Download</b> → <b>Tomcat 9</b>.",
   "Under <i>Binary Distributions → Core</i> download the <b>64-bit Windows zip</b> (Windows) or the <b>tar.gz</b> (Linux/macOS).",
   "Extract it to a short path without spaces, for example " + ic("D:\\Apache\\apache-tomcat-9.0.x") + " or " + ic("~/apache-tomcat-9.0.x") + ".",
   "Do not start it by hand yet: NetBeans will start and stop it for you (section 2.5)."], numbered=True)
P("To test Tomcat on its own: run " + ic("bin\\startup.bat") + " (Windows) or " + ic("bin/startup.sh") + " (Linux/macOS), open <b>http://localhost:8080</b> and you should see the Tomcat welcome page. Stop it with " + ic("shutdown.bat") + " / " + ic("shutdown.sh") + ".")
box("The manual's screenshots show Tomcat 10.0.8. If you prefer Tomcat 10 or 11, that is fine, but change the servlet imports to " + ic("jakarta.servlet") + " (see 1.1).", "warn")

H2("2.5 Step 4: Install Apache NetBeans and register Tomcat")
B(["Download the installer for your OS from <b>netbeans.apache.org/download</b>.",
   "Right-click the installer → <b>Run as administrator</b> → Yes. A progress bar shows <i>Configuring the installer…</i>.",
   "On the welcome screen click <b>Next</b> (use <b>Customize…</b> only if you want to change packs).",
   "Tick <b>I accept the terms in the license agreement</b> → Next.",
   "Choose the installation folder (1st Browse button) and the JDK (2nd Browse button) → Next.",
   "Review the summary → <b>Install</b> → wait → <b>Finish</b>.",
   "Launch NetBeans from the Start menu or desktop icon and close the Start Page."], numbered=True)
H3("Register Tomcat in NetBeans (one time)")
B(["<b>Tools → Servers → Add Server…</b> (or use <b>Add…</b> while creating a project).",
   "Select <b>Apache Tomcat or TomEE</b> → Next.",
   "<b>Server Location</b>: Browse to the Tomcat folder from 2.4.",
   "Enter a manager <b>Username</b> and <b>Password</b> (e.g. admin / admin123) and tick <b>Create user if it does not exist</b> → <b>Finish</b>."], numbered=True)
box("The first time you create a web project NetBeans may show <b>Finding Feature</b>. Click <b>Download and Activate</b> to enable Java Web/EE support, then continue.", "note")

H2("2.6 Step 5: Install Eclipse IDE and Spring Tools")
B(["Download the Eclipse Installer from <b>eclipse.org/downloads</b> (" + ic("eclipse-inst-jre-win64.exe") + " on Windows).",
   "Run it as administrator and choose <b>Eclipse IDE for Enterprise Java and Web Developers</b>.",
   "Confirm the <b>Java VM</b> (your JDK) and the <b>Installation Folder</b>; keep <i>create start menu entry</i> and <i>desktop shortcut</i> ticked → <b>INSTALL</b>.",
   "Click <b>Accept Now</b> on the Eclipse Foundation Software User Agreement. Installation downloads files, so stay online.",
   "Click <b>LAUNCH</b>, choose a <b>workspace</b> folder (where your projects are stored) → Launch.",
   "Install Spring support: <b>Help → Eclipse Marketplace…</b> → search <b>Spring</b> → <b>Spring Tools</b> (latest) → Install → Confirm → accept the licence → Finish → <b>Restart</b> Eclipse."], numbered=True)
P("IntelliJ IDEA (Community or Ultimate) also opens Maven/Spring projects directly with <b>File → Open</b>.")

H2("2.7 Optional: MySQL (needed from Session 1 exercise 5 and Sessions 6–10)")
B(["Install <b>MySQL Community Server 8.x</b> and <b>MySQL Workbench</b> from dev.mysql.com (Windows: MySQL Installer).",
   "Set a root password and remember it; it goes into " + ic("application.properties") + " later.",
   "Create the lab database: " + ic("CREATE DATABASE Student_Admission;")], numbered=True)

H2("2.8 Verification checklist")
table(["Check", "Command / action", "Expected result"], [
    ["Java runtime", "java --version", "17 or higher"],
    ["Java compiler", "javac --version", "Same version as java"],
    ["JAVA_HOME", "echo %JAVA_HOME%  /  echo $JAVA_HOME", "Your JDK folder"],
    ["Tomcat", "startup.bat → http://localhost:8080", "Tomcat welcome page"],
    ["NetBeans", "Tools → Servers", "Apache Tomcat listed"],
    ["Eclipse", "Help → About", "Spring Tools listed in installed features"],
], [32, 70, 68])
story.append(PageBreak())

# ================= 3. Program 1 =================
H1("3. Program 1: Display request information with a Servlet")
H2("3.1 Goal")
P("Write a servlet that prints the current date and time and details of the incoming HTTP request (method, URI, protocol, path info and client IP address). This is Example 1 of the lab manual and covers Session 1 exercises 1 and 3.")
H2("3.2 Create the project in NetBeans")
B(["<b>File → New Project</b>.",
   "Categories: <b>Java with Ant → Java Web</b>; Projects: <b>Web Application</b> → Next.",
   "Project Name: " + ic("ServletLab") + "; keep the default location → Next.",
   "Server: <b>Apache Tomcat</b> (registered in 2.5); Java EE version: <b>Java EE 8 Web</b> (or Java EE 7 Web); Context Path: " + ic("/ServletLab") + " → Next.",
   "Frameworks: leave everything unticked → <b>Finish</b>.",
   "Right-click <b>Source Packages → New → Servlet…</b>. Class Name: " + ic("RequestServlet") + " → Next.",
   "Tick <b>Add information to deployment descriptor (web.xml)</b>. URL Pattern: " + ic("/RequestServlet") + " → <b>Finish</b>."], numbered=True)
P("NetBeans now generates a servlet skeleton and adds it to <b>WEB-INF/web.xml</b>. Replace the generated class with the code below.")
P("<b>Project structure</b> (NetBeans <i>Projects</i> view):")
code("ServletLab\n├── Web Pages\n│   ├── WEB-INF\n│   │   └── web.xml            <- deployment descriptor\n│   ├── index.html\n│   ├── stdForm.jsp            <- Program 3\n│   └── studentView.jsp        <- Program 3\n├── Source Packages\n│   └── <default package>\n│       ├── RequestServlet.java    <- Program 1\n│       ├── PersonalInfoFrom.java  <- Program 2\n│       └── PersonalInfo.java      <- Program 2\n└── Libraries  (JDK + Apache Tomcat)", "Directory layout")
H2("3.3 Source code: RequestServlet.java")
codefile("ServletLab/src/main/java/RequestServlet.java", "Source Packages/RequestServlet.java")
H2("3.4 Syntax explained")
syntax([
    ["import javax.servlet.*", "Brings in the Servlet API classes. They are supplied by Tomcat, so nothing extra needs downloading. (Tomcat 10+: jakarta.servlet.*)"],
    ["public class RequestServlet extends HttpServlet", "Our class inherits from HttpServlet, which is what makes it a servlet that Tomcat can create and call."],
    ["processRequest(request, response)", "A helper method NetBeans generates. Both doGet() and doPost() call it so GET and POST behave the same."],
    ["throws ServletException, IOException", "Declares the two checked exceptions a servlet may raise; Tomcat handles them and shows an error page."],
    ["response.setContentType(\"text/html;charset=UTF-8\")", "Sets the Content-Type header: the browser will render the body as HTML using UTF-8 characters. Call it before getWriter()."],
    ["try (PrintWriter out = response.getWriter())", "try-with-resources: gets a writer connected to the response body and closes it automatically at the end of the block."],
    ["out.println(\"...\")", "Writes text into the response. HTML tags such as <h3> and <br> are interpreted by the browser."],
    ["new java.util.Date()", "Creates an object holding the current date and time; toString() formats it, e.g. Mon Nov 09 16:07:34 IST 2026."],
    ["request.getMethod()", "HTTP method used: GET (typing a URL / link) or POST (a form with method=\"post\")."],
    ["request.getRequestURI()", "The path part of the URL: context path + servlet path, e.g. /ServletLab/RequestServlet."],
    ["request.getProtocol()", "Protocol and version, normally HTTP/1.1."],
    ["request.getPathInfo()", "Extra path after the servlet mapping. null for an exact mapping such as /RequestServlet."],
    ["request.getRemoteAddr()", "IP address of the client. 127.0.0.1 or 0:0:0:0:0:0:0:1 when the browser runs on the same machine."],
    ["@Override", "Tells the compiler we are replacing a method of the parent class; a typo in the method name becomes a compile error."],
    ["doGet(...) / doPost(...)", "Called by Tomcat (through service()) for GET and POST requests respectively."],
    ["getServletInfo()", "Optional: returns a short description of the servlet."],
])
H2("3.5 Deployment descriptor: WEB-INF/web.xml")
P("This is the complete web.xml for the project. It maps all three servlets used in Programs 1 and 2.")
codefile("ServletLab/src/main/webapp/WEB-INF/web.xml", "Web Pages/WEB-INF/web.xml")
syntax([
    ["<web-app version=\"3.1\" ...>", "Root element; the namespace and schema tell Tomcat which servlet specification the file follows."],
    ["<servlet>", "Declares a servlet: gives the Java class a logical name."],
    ["<servlet-name>", "The logical name (any text). Must be identical in <servlet> and <servlet-mapping>."],
    ["<servlet-class>", "Fully qualified class name. With a package it would be e.g. com.lab.RequestServlet."],
    ["<servlet-mapping>", "Connects a servlet name to a URL pattern."],
    ["<url-pattern>/info</url-pattern>", "The URL (after the context path) that triggers the servlet: http://localhost:8080/ServletLab/info."],
    ["<session-timeout>30</session-timeout>", "An HttpSession expires after 30 minutes without requests."],
])
box("Instead of web.xml you can annotate the class with " + ic("@WebServlet(\"/RequestServlet\")") + ". Use one approach per servlet, not both, or Tomcat reports a duplicate mapping.", "tip")
H2("3.6 Run the program")
B(["Save all files (<b>Ctrl+Shift+S</b>).",
   "Right-click the project → <b>Clean and Build</b>. The Output window should end with <b>BUILD SUCCESSFUL</b>.",
   "Right-click the project → <b>Run</b>. NetBeans starts Tomcat, deploys the app and opens " + ic("http://localhost:8080/ServletLab/") + ".",
   "In the browser address bar open " + ic("http://localhost:8080/ServletLab/RequestServlet") + "."], numbered=True)
H2("3.7 Expected output")
output("Current Date & Time: Mon Nov 09 16:07:34 IST 2026\nRequest Information Example\nMethod: GET\nRequest URI: /ServletLab/RequestServlet\nProtocol: HTTP/1.1\nPathInfo: null\nRemote Address: 127.0.0.1", "Browser (verified output; your date and IP will differ)")
H2("3.8 Try this")
B(["Change the mapping to " + ic("/RequestServlet/*") + ", then open " + ic("/ServletLab/RequestServlet/abc") + ". PathInfo now shows " + ic("/abc") + ".",
   "Print " + ic("request.getHeader(\"User-Agent\")") + " to see which browser made the request.",
   "Session 1 exercise 1: also print " + ic("System.currentTimeMillis()") + " as a timestamp."])
story.append(PageBreak())

# ================= 4. Program 2 =================
H1("4. Program 2: Capture a form with two Servlets")
H2("4.1 Goal")
P("Servlet <b>PersonalInfoFrom</b> sends a Bootstrap-styled HTML form to the browser. When the user clicks <b>Submit</b>, the form is POSTed to " + ic("/info") + ", where servlet <b>PersonalInfo</b> reads every field with " + ic("request.getParameter()") + " and displays the values in a table. This is Example 2 of the manual (Session 1 exercise 2).")
code("Browser ──GET /PersonalInfoFrom──▶ PersonalInfoFrom.doGet()  ──▶ HTML form\nBrowser ──POST /info (form data)──▶ PersonalInfo.doPost()    ──▶ HTML table of values", "Request flow")
H2("4.2 Create the servlets")
B(["In the same ServletLab project: right-click <b>Source Packages → New → Servlet…</b>, name " + ic("PersonalInfoFrom") + ", URL pattern " + ic("/PersonalInfoFrom") + ", tick <i>Add information to web.xml</i> → Finish.",
   "Repeat for " + ic("PersonalInfo") + " with URL pattern " + ic("/info") + ".",
   "Replace the generated code with the listings below. The web.xml from 3.5 already contains both mappings."], numbered=True)
box("The manual builds the HTML with one very long concatenated string. The listings below produce the same page but use one " + ic("out.println") + " per element so they are easier to read and debug. Single quotes inside the HTML avoid escaping double quotes (\\\").", "note")
H2("4.3 Source code: PersonalInfoFrom.java (shows the form)")
codefile("ServletLab/src/main/java/PersonalInfoFrom.java", "Source Packages/PersonalInfoFrom.java")
H2("4.4 Source code: PersonalInfo.java (handles the submission)")
codefile("ServletLab/src/main/java/PersonalInfo.java", "Source Packages/PersonalInfo.java")
H2("4.5 Syntax explained")
syntax([
    ["<link rel='stylesheet' href='...bootstrap.min.css'>", "Loads Bootstrap's CSS from a CDN (needs internet). It only changes the look of the page."],
    ["<form action='info' method='post'>", "On submit, the browser sends the fields to the relative URL info (= /ServletLab/info) using POST."],
    ["<input type='text' name='name'>", "A text box. The name attribute becomes the parameter name on the server."],
    ["<input type='email'> / type='password'", "Email boxes get browser validation; password boxes hide what is typed."],
    ["<select name='state'><option>…", "Drop-down list. The selected option's text (or value attribute) is sent."],
    ["class='row g-3', 'col-md-6'", "Bootstrap grid: a row of 12 columns; col-md-6 takes half the width on medium and larger screens; g-3 adds gaps."],
    ["class='form-control' / 'form-select'", "Bootstrap styling for inputs and drop-downs (full width, rounded borders)."],
    ["class='btn btn-primary'", "Bootstrap blue button."],
    ["request.getParameter(\"emailId\")", "Returns the value typed into the field whose name is emailId, as a String; null if no such field was sent."],
    ["doPost(...) only", "PersonalInfo overrides only doPost, so opening /info directly in the address bar (a GET) gives HTTP 405 Method Not Allowed. That is expected."],
])
box("The string in " + ic("getParameter(\"...\")") + " must match the input's " + ic("name") + " attribute exactly, including upper/lower case. A mismatch is the number-one cause of <i>null</i> values.", "warn")
H2("4.6 Run the program")
B(["Run the project (it is redeployed automatically).",
   "Open " + ic("http://localhost:8080/ServletLab/PersonalInfoFrom") + ".",
   "Fill in the form and click <b>Submit</b>. The URL changes to " + ic("/ServletLab/info") + " and the table appears."], numbered=True)
H2("4.7 Expected output")
output("Personal Information\nName   Asha\nEmail  a@x.in\nCity   Pune\nState  UP\nZip    411001", "Browser after submitting (verified)")
H2("4.8 Try this: GET vs POST")
P("Change " + ic("method='post'") + " to " + ic("method='get'") + " in PersonalInfoFrom and rename " + ic("doPost") + " to " + ic("doGet") + " in PersonalInfo. Submit again and look at the address bar:")
code("http://localhost:8080/ServletLab/info?name=Asha&emailId=a%40x.in&pwd=secret&city=Pune&state=UP&zip=411001", "Address bar with GET")
P("With GET every field, including the password, is visible in the URL, browser history and server logs. That is why login and registration forms always use POST.")
table(["", "GET", "POST"], [
    ["Data location", "URL query string", "Request body"],
    ["Visible / bookmarkable", "Yes", "No"],
    ["Length limit", "Limited by URL length", "No practical limit"],
    ["Typical use", "Search, filters, links", "Login, registration, saving data"],
    ["Servlet method", "doGet()", "doPost()"],
], [40, 65, 65])
story.append(PageBreak())

# ================= 5. Program 3 =================
H1("5. Program 3: The same form with JSP")
H2("5.1 Goal")
P("Rebuild Program 2 with two JSP pages. " + ic("stdForm.jsp") + " is plain HTML; " + ic("studentView.jsp") + " uses JSP expressions to print the submitted values, the entry date and the client IP. Notice how much less Java is needed.")
H2("5.2 How a JSP runs")
B(["The first time a JSP is requested, Tomcat <b>translates</b> it into a Java servlet source file (e.g. " + ic("studentView_jsp.java") + ").",
   "Tomcat <b>compiles</b> that file into a .class file.",
   "Tomcat <b>runs</b> it like any servlet: " + ic("jspInit()") + " once, " + ic("_jspService()") + " for every request, " + ic("jspDestroy()") + " at shutdown.",
   "Later requests reuse the compiled class until the .jsp file changes."], numbered=True)
H2("5.3 Create the pages")
B(["Use the ServletLab project or create a new Web Application (File → New Project → Java with Ant → Java Web → Web Application → name → server → Finish).",
   "Right-click <b>Web Pages → New → JSP…</b>, File Name " + ic("stdForm") + " → Finish. Replace the content with the listing below.",
   "Repeat for " + ic("studentView") + ".",
   "No web.xml entries are needed: a JSP is reached directly by its file name."], numbered=True)
H2("5.4 Source code: stdForm.jsp")
codefile("ServletLab/src/main/webapp/stdForm.jsp", "Web Pages/stdForm.jsp")
H2("5.5 Source code: studentView.jsp")
codefile("ServletLab/src/main/webapp/studentView.jsp", "Web Pages/studentView.jsp")
H2("5.6 Syntax explained")
syntax([
    ["<%@page contentType=\"text/html\" pageEncoding=\"UTF-8\"%>", "Page directive: the response is HTML and the .jsp file itself is saved as UTF-8."],
    ["<%@page import=\"java.util.Date\"%>", "Page directive that imports a Java class so we can write new Date() instead of new java.util.Date()."],
    ["action=\"studentView.jsp\"", "The form posts to the other JSP page in the same folder."],
    ["<%= request.getParameter(\"name\") %>", "Expression tag: evaluates the Java expression and writes the result into the page. No semicolon inside."],
    ["request", "Implicit object of type HttpServletRequest: available in every JSP without declaring it."],
    ["<%= new Date() %>", "Prints the current date/time (the Entry Date)."],
    ["<%= request.getRemoteAddr() %>", "Prints the client's IP address."],
    ["<%-- comment --%>", "JSP comment: removed on the server, never sent to the browser (unlike <!-- -->)."],
])
H3("Other JSP elements you will need in Session 2")
table(["Element", "Syntax", "Example"], [
    ["Scriptlet", "<% java statements; %>", "<% for (int i = 1; i <= 3; i++) { %> Row <%= i %><br> <% } %>"],
    ["Declaration", "<%! declaration %>", "<%! int hits = 0; %>  then  <%= ++hits %>"],
    ["Include directive", "<%@ include file=\"x.jsp\" %>", "Copies the file in at translation time"],
    ["Include action", "<jsp:include page=\"x.jsp\"/>", "Includes the output at request time"],
    ["Forward action", "<jsp:forward page=\"y.jsp\"/>", "Hands the request to another page"],
    ["useBean", "<jsp:useBean id=\"s\" class=\"lab.Student\"/>", "With <jsp:setProperty name=\"s\" property=\"*\"/>"],
    ["JSTL", "<%@ taglib prefix=\"c\" uri=\"…/jsp/jstl/core\" %>", "<c:if>, <c:forEach>, <c:choose>, <c:out>, <c:url>, <c:redirect>"],
], [30, 62, 78])
table(["Implicit object", "Type", "Typical use"], [
    ["request", "HttpServletRequest", "Form parameters, headers, client IP"],
    ["response", "HttpServletResponse", "sendRedirect(), headers, cookies"],
    ["out", "JspWriter", "out.println() inside scriptlets"],
    ["session", "HttpSession", "Store the logged-in user: session.setAttribute(\"user\", n)"],
    ["application", "ServletContext", "Data shared by all users (e.g. visitor counter)"],
    ["pageContext", "PageContext", "Access attributes in any scope"],
    ["config", "ServletConfig", "Init parameters from web.xml"],
    ["page", "Object", "The current JSP instance (like this)"],
    ["exception", "Throwable", "Only in pages with <%@ page isErrorPage=\"true\" %>"],
], [32, 45, 93])
H2("5.7 Run the program")
B(["Right-click " + ic("stdForm.jsp") + " → <b>Run File</b>, or open " + ic("http://localhost:8080/ServletLab/stdForm.jsp") + ".",
   "Fill the form and click <b>Submit</b>."], numbered=True)
output("Personal Information\nName:        Ravi\nEmail Id:    r@x.in\nCity:        Patna\nState:       Bihar\nZip Code:    800001\nEntry Date:  Mon Nov 09 16:07:34 IST 2026\nIP Address:  127.0.0.1", "Expected output (verified)")
H2("5.8 Try this")
B(["Change the form to " + ic("method=\"get\"") + ": the page still works (JSP handles both) and the data appears in the URL (manual Figure 2.36).",
   "Add " + ic("<meta http-equiv=\"refresh\" content=\"5\">") + " to a JSP that prints " + ic("<%= new Date() %>") + ": an auto-refreshing clock (Session 2 exercise 1)."])
story.append(PageBreak())

# ================= 6. Program 4 =================
H1("6. Program 4: Spring Boot MVC form with Thymeleaf and Bootstrap")
H2("6.1 Goal")
P("Build the <b>StudentAdmission</b> application: a dashboard page, a student form bound to a Java object, and a controller that receives the form, adds the entry date and client IP, and shows the result on the dashboard. This is section 2.6 / 2.6.2 of the manual and the base project for Sessions 3–10.")
H2("6.2 Generate the project with Spring Initializr")
B(["Open <b>https://start.spring.io</b>.",
   "Fill in the fields as in the table below.",
   "Click <b>ADD DEPENDENCIES…</b> and add <b>Spring Web</b>, <b>Thymeleaf</b> and <b>Spring Boot DevTools</b>.",
   "Click <b>GENERATE</b>. A file " + ic("StudentAdmission.zip") + " downloads.",
   "Extract it into your Eclipse workspace folder."], numbered=True)
table(["Field", "Value", "Meaning"], [
    ["Project", "Maven", "Build tool that downloads libraries listed in pom.xml"],
    ["Language", "Java", ""],
    ["Spring Boot", "Latest stable (default)", "Tested with 4.1.2"],
    ["Group", "com.ignou.lab.webtechnologies", "Reverse domain name of the organisation"],
    ["Artifact / Name", "StudentAdmission", "Project and jar/war name"],
    ["Description", "Lab Project for Student Admission using Spring Boot", ""],
    ["Package name", "com.ignou.lab.webtechnologies.studentadmission", "Base Java package"],
    ["Packaging", "War (Jar also works)", "War can also be deployed to an external Tomcat"],
    ["Java", "17", "Must not be higher than your installed JDK"],
], [32, 70, 68])
box("Add <b>Spring Data JPA</b> and <b>MySQL Driver</b> only when you need a database (Session 6). With JPA on the classpath and no " + ic("spring.datasource.*") + " settings, the app stops with <i>Failed to configure a DataSource</i> (manual Figure 2.45).", "warn")
H2("6.3 Open the project in Eclipse")
B(["<b>File → Open Projects from File System…</b> → <b>Directory…</b> → select the extracted " + ic("StudentAdmission") + " folder → <b>Finish</b>.",
   "Wait while Maven downloads all dependencies (progress bar at the bottom right). Internet is required the first time.",
   "If you later edit pom.xml and Eclipse shows errors: right-click the project → <b>Maven → Update Project…</b> → tick <i>Force Update of Snapshots/Releases</i> → OK."], numbered=True)
H2("6.4 Final project structure")
code("StudentAdmission\n├── pom.xml\n└── src/main\n    ├── java/com/ignou/lab/webtechnologies/studentadmission\n    │   ├── StudentAdmissionApplication.java   (generated: main class)\n    │   ├── ServletInitializer.java            (generated: for war packaging)\n    │   ├── controller/StudentController.java  (you create)\n    │   └── entity/Student.java                (you create)\n    └── resources\n        ├── application.properties\n        ├── static/css/master.css               (you create)\n        └── templates\n            ├── dashboard.html                   (you create)\n            └── stdForm.html                     (you create)", "Directory layout")
P("Create packages with right-click on the base package → <b>New → Package</b> (" + ic("…studentadmission.controller") + " and " + ic("…studentadmission.entity") + "), classes with <b>New → Class</b>, and HTML files with <b>New → File</b> inside " + ic("src/main/resources/templates") + ".")
H2("6.5 pom.xml")
P("Generated by Initializr; the four WebJars dependencies (Bootstrap, jQuery, Font Awesome and the locator) were added by hand.")
codefile("StudentAdmission/pom.xml", "pom.xml")
syntax([
    ["<parent> spring-boot-starter-parent", "Inherits sensible defaults and the tested version of every Spring library, so most dependencies need no <version>."],
    ["<groupId>, <artifactId>, <version>", "The project's coordinates (identity) in the Maven world."],
    ["<packaging>war</packaging>", "Build a .war file. It still runs stand-alone with java -jar because Tomcat is embedded."],
    ["<java.version>17</java.version>", "Compile for Java 17."],
    ["spring-boot-starter-webmvc", "Spring MVC + embedded Tomcat + JSON support. (Spring Boot 2.x/3.x call it spring-boot-starter-web.)"],
    ["spring-boot-starter-thymeleaf", "The Thymeleaf template engine for the HTML views."],
    ["webjars-locator-lite + org.webjars:*", "Bootstrap, jQuery and Font Awesome packaged as jars and served at /webjars/... The locator lets the URLs omit version numbers. (Boot 2.x: artifact webjars-locator, as in the manual.)"],
    ["spring-boot-devtools (runtime, optional)", "Automatic restart when you save a file; never included in production builds."],
    ["spring-boot-starter-tomcat (provided)", "Tomcat is available when running, but not bundled when deploying the war to an external Tomcat."],
    ["<scope>test</scope>", "Only used when running unit tests."],
    ["spring-boot-maven-plugin", "Builds an executable jar/war and provides mvn spring-boot:run."],
])
H2("6.6 application.properties")
codefile("StudentAdmission/src/main/resources/application.properties", "src/main/resources/application.properties")
P("Every line is " + ic("key=value") + "; lines starting with " + ic("#") + " are comments. " + ic("server.port") + " changes the port (e.g. 8082 if 8080 is busy). " + ic("server.servlet.context-path=/") + " means the app is at the root: http://localhost:8080/.")
P("When you add a database in Session 6, append the settings from the manual:")
code("spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver\nspring.datasource.url=jdbc:mysql://localhost:3306/Student_Admission\nspring.datasource.username=root\nspring.datasource.password=your_password\nspring.jpa.show-sql=true\nspring.jpa.hibernate.ddl-auto=update", "Database settings (Session 6 onwards)")
H2("6.7 The Model: entity/Student.java")
codefile("StudentAdmission/src/main/java/com/ignou/lab/webtechnologies/studentadmission/entity/Student.java", "entity/Student.java")
syntax([
    ["package ...entity;", "Must match the folder the file is in."],
    ["private String name;", "Fields are private (encapsulation); other classes use getters and setters."],
    ["public Student() { }", "No-argument constructor. Spring needs it to create an empty Student before filling it from the form."],
    ["getName() / setName(...)", "JavaBean accessors. Thymeleaf reads values through getters; Spring's data binding writes form values through setters. Names must follow the getXxx/setXxx pattern exactly."],
    ["Date entryDate, String ip", "Not on the form; the controller fills them in."],
])
box("In Eclipse you don't have to type getters and setters: right-click inside the class → <b>Source → Generate Getters and Setters…</b> → Select All → Generate.", "tip")
H2("6.8 The Controller: controller/StudentController.java")
codefile("StudentAdmission/src/main/java/com/ignou/lab/webtechnologies/studentadmission/controller/StudentController.java", "controller/StudentController.java")
box("The manual labels this listing <i>Student.java (Controller Class)</i>, but the class is named StudentController, so the file must be <b>StudentController.java</b>. Also, with Spring Boot 3 or later the import is " + ic("jakarta.servlet.http.HttpServletRequest") + " (Boot 2.x: javax).", "warn")
syntax([
    ["@Controller", "Marks the class as a Spring MVC controller. Spring finds it automatically because it is inside the main application's package."],
    ["@GetMapping(\"/\")", "This method handles HTTP GET requests for the URL /."],
    ["return \"redirect:/dashboard\"", "Sends HTTP 302 to the browser, which then requests /dashboard. URL in the address bar changes."],
    ["return \"dashboard\"", "A view name. Thymeleaf renders src/main/resources/templates/dashboard.html."],
    ["Model theModel", "A map of data handed to the view. Spring creates it and passes it in."],
    ["theModel.addAttribute(\"student\", new Student())", "Puts an empty Student into the model under the name student; the form binds to it with th:object=\"${student}\"."],
    ["@PostMapping(\"/student/view\")", "Handles the POST sent by the form's th:action=\"@{/student/view}\"."],
    ["@ModelAttribute(\"student\") Student theStudent", "Data binding: Spring creates a Student and calls setName(), setEmailId(), … for each form field whose name matches a property."],
    ["HttpServletRequest request", "The same request object as in servlets; any controller method can ask for it."],
    ["setEntryDate(new Date()), setIp(...)", "Add server-side information that the user did not type."],
])
H2("6.9 The Views: templates/stdForm.html and templates/dashboard.html")
codefile("StudentAdmission/src/main/resources/templates/stdForm.html", "src/main/resources/templates/stdForm.html")
codefile("StudentAdmission/src/main/resources/templates/dashboard.html", "src/main/resources/templates/dashboard.html")
codefile("StudentAdmission/src/main/resources/static/css/master.css", "src/main/resources/static/css/master.css")
syntax([
    ["xmlns:th=\"http://www.thymeleaf.org\"", "Declares the th: prefix so the IDE recognises Thymeleaf attributes."],
    ["th:href=\"@{/webjars/bootstrap/css/bootstrap.min.css}\"", "@{...} is a link expression: Thymeleaf builds the URL and adds the context path if there is one."],
    ["th:action=\"@{/student/view}\"", "Form target URL, matched by @PostMapping(\"/student/view\")."],
    ["th:object=\"${student}\"", "Selects the model attribute student as the form-backing object."],
    ["th:field=\"*{name}\"", "*{...} is a selection expression on th:object. Generates id=\"name\" name=\"name\" value=\"(current value)\"."],
    ["<select th:field=\"*{state}\">", "Also marks the option matching the current value as selected."],
    ["th:text=\"${student?.name}\"", "Replaces the cell's content with the value. ?. is safe navigation: if student is null (first visit to /dashboard) nothing is printed instead of throwing SpelEvaluationException."],
    ["th:src=\"@{/webjars/jquery/jquery.min.js}\"", "Loads jQuery from the WebJar. Scripts go just before </body>."],
    ["<i class=\"fas fa-save\"></i>", "A Font Awesome icon (solid style, floppy-disk)."],
    ["static/css/master.css", "Files in src/main/resources/static are served as-is, at /css/master.css."],
])
H2("6.10 Run the application")
H3("From Eclipse")
B(["Right-click the project → <b>Run As → Spring Boot App</b> (or open StudentAdmissionApplication.java → Run As → Java Application).",
   "Watch the Console. Success looks like the lines below.",
   "Open " + ic("http://localhost:8080/") + " in the browser."], numbered=True)
output("Tomcat started on port 8080 (http) with context path '/'\nStarted StudentAdmissionApplication in 1.377 seconds", "Console (verified)")
H3("From the command line (any OS)")
code("cd StudentAdmission\n./mvnw spring-boot:run          # Linux / macOS\nmvnw.cmd spring-boot:run        # Windows\n\n# or build and run the war\n./mvnw package\njava -jar target/StudentAdmission-0.0.1-SNAPSHOT.war", "Terminal")
H3("URLs to test")
table(["URL", "Handled by", "Result"], [
    ["GET /", "welcome()", "Redirects (HTTP 302) to /dashboard"],
    ["GET /dashboard", "mainPage()", "Dashboard with an empty table and a Student Form button"],
    ["GET /stdForm", "studentInputForm()", "The Personal Information Form"],
    ["POST /student/view", "viewStdInfo()", "Dashboard filled with the submitted values, entry date and IP"],
], [38, 40, 92])
story.append(CondPageBreak(110 * mm))
H2("6.11 Expected output")
image(os.path.join(IMG, "spring_form.png"), 130, "Figure 1: http://localhost:8080/stdForm, filled in (screenshot from the tested project)")
image(os.path.join(IMG, "spring_dashboard.png"), 130, "Figure 2: after Submit, POST /student/view returns the dashboard with the bound values")
H2("6.12 Try this")
B(["Change a template and save: DevTools restarts the app; refresh the browser to see the change.",
   "Add a " + ic("<textarea th:field=\"*{address2}\">") + " and a checkbox bound to a new " + ic("boolean hostel") + " field (Session 4 exercise 4).",
   "Add " + ic("required") + " and " + ic("pattern=\"[0-9]{6}\"") + " to the Zip input for client-side validation (Session 5 exercise 1)."])
story.append(PageBreak())

# ================= 7. Bootstrap =================
H1("7. Adding Bootstrap, jQuery and Font Awesome")
H2("7.1 Method 1: WebJars through Maven (works offline)")
B(["Add the dependencies to pom.xml (exactly as in 6.5).",
   "Right-click project → <b>Maven → Update Project…</b> → OK.",
   "Put the CSS links between " + ic("<head>") + " and " + ic("</head>") + ", and the scripts just before " + ic("</body>") + "."], numbered=True)
code("<!-- in <head> -->\n<link th:href=\"@{/webjars/bootstrap/css/bootstrap.min.css}\" rel=\"stylesheet\">\n<link th:href=\"@{/webjars/font-awesome/css/all.css}\" rel=\"stylesheet\">\n\n<!-- just before </body> -->\n<script th:src=\"@{/webjars/jquery/jquery.min.js}\"></script>\n<script th:src=\"@{/webjars/bootstrap/js/bootstrap.bundle.min.js}\"></script>", "HTML (Thymeleaf)")
P("In a plain (non-Thymeleaf) HTML file use " + ic("href=\"/webjars/...\"") + " and " + ic("src=\"/webjars/...\"") + " instead of th:href / th:src.")
H2("7.2 Method 2: CDN links (needs internet when the page loads)")
P("Copy the <b>Starter template</b> from <b>getbootstrap.com → Docs → Getting started</b>. Its essential parts:")
code("<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n  <title>Hello, world!</title>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>\n</body>\n</html>", "index.html")
P("For Font Awesome via CDN, register at <b>fontawesome.com</b> to get a personal <i>kit</i> script (" + ic("<script src=\"https://kit.fontawesome.com/xxxx.js\" crossorigin=\"anonymous\"></script>") + ") and place it in " + ic("<head>") + ". Then use icons such as " + ic("<i class=\"fas fa-thumbs-up fa-5x\"></i>") + ".")
H2("7.3 Bootstrap classes used in the lab")
table(["Class", "Effect"], [
    ["container", "Centred, responsive page width"],
    ["row, col-12, col-md-6, col-md-4, col-md-2", "12-column grid; md = applies from medium screens up"],
    ["g-3, mt-4", "Gutter (gap) between columns; margin-top"],
    ["form-label, form-control, form-select", "Styled labels, inputs and drop-downs"],
    ["btn btn-primary", "Primary (blue) button"],
    ["table, table-responsive", "Styled table; horizontal scroll on small screens"],
    ["text-center, text-primary", "Centre text; blue text"],
], [70, 100], mono_first=True)
story.append(PageBreak())

# ================= 8. Troubleshooting =================
H1("8. Troubleshooting")
table(["Symptom", "Likely cause", "Fix"], [
    ["'java' is not recognized as an internal or external command", "PATH does not contain the JDK bin folder, or the Command Prompt was opened before the change", "Add %JAVA_HOME%\\bin to Path (2.3) and open a new Command Prompt"],
    ["NetBeans: No servers are registered", "Tomcat not added", "Tools → Servers → Add Server (2.5)"],
    ["HTTP 404 – Not Found", "URL does not match url-pattern / @GetMapping, wrong context path, or wrong case", "Compare the URL with web.xml or the annotation character by character"],
    ["HTTP 405 – Method Not Allowed", "Servlet only overrides doPost but the browser sent GET (or vice versa)", "Use the matching form method, or implement both doGet and doPost"],
    ["HTTP 500 / ClassNotFoundException: javax.servlet...", "javax code deployed to Tomcat 10+", "Use Tomcat 9, or change imports to jakarta.servlet"],
    ["Form values print as null", "name attribute ≠ getParameter() string", "Make them identical (case-sensitive)"],
    ["Port 8080 was already in use", "Tomcat from NetBeans or another app is running", "Stop it, or set server.port=8082 in application.properties"],
    ["Failed to configure a DataSource", "Spring Data JPA dependency without database settings", "Add spring.datasource.* properties or remove the JPA dependency"],
    ["Communications link failure (MySQL)", "MySQL not running, wrong port/database name", "Start MySQL; check the URL jdbc:mysql://localhost:3306/Student_Admission"],
    ["TemplateInputException: template might not exist", "View name returned by the controller has no matching file", "Place dashboard.html / stdForm.html in src/main/resources/templates"],
    ["SpelEvaluationException: property 'name' cannot be found on null", "Model attribute missing on first page load", "Use the safe navigation operator: ${student?.name}"],
    ["Bootstrap styles not applied", "WebJar missing / Maven not updated / no internet for CDN", "Maven → Update Project; open the CSS URL directly to check for 404"],
    ["Eclipse: red errors right after import", "Dependencies still downloading or outdated", "Wait for the build; then Maven → Update Project (Force Update)"],
    ["Changes not visible", "Old deployment or browser cache", "Clean and Build, redeploy; hard refresh with Ctrl+F5"],
], [52, 58, 60])
story.append(PageBreak())

# ================= 9. Lab sessions =================
H1("9. Lab assignments (session-wise)")
P("The exercises below are from section 2.7 of the lab manual. Use NetBeans or Eclipse. The programs in this handbook give you a working starting point for the first exercises of Sessions 1–5.")
sessions = [
    ("Session 1: Basics of Servlet", [
        "Write a Servlet program to print the current date and time along with the timestamp.",
        "Create an HTML form with the input of student information using HTTP protocol and method, then display the input information using a Servlet.",
        "Write a servlet program to capture client IPs and display them.",
        "Write a servlet program for session management using HttpSession along with tracking, and also use a cookie for session tracking.",
        "Write a CRUD (Create/Save, Read, Edit/Update, Delete) application using servlets. Create a database named IGNOU and a table named Student which captures student information (basics, contact, enrolment details along with courses). Make the necessary assumptions."]),
    ("Session 2: JSP", [
        "Write a JSP program to print the current date and time along with a timestamp; implement auto-refresh of the page.",
        "Create a JSP page and implement a scripting tag, expression tag and declaration tag.",
        "Import the JSTL library in a JSP page and use its tags: (a) out (b) if (c) forEach (d) choose, when and otherwise (e) url and redirect.",
        "Create a JSP page for database connectivity using JDBC and show the student details from the database created in Session 1 exercise 5.",
        "Write a JSP application using the action elements: (a) jsp:forward (b) jsp:include (c) setProperty and getProperty (d) jsp:useBean.",
        "Write a JSP program using the implicit objects out, request, response, session, pageContext and exception with an example.",
        "Create a JSP project implementing all the Session 1 and Session 2 concepts: login form, CRUD of student details, session management with exception handling using Servlet and JSP."]),
    ("Session 3: Maven, framework for J2EE", [
        "Create a Maven-based project using Spring Initializr.",
        "Create a Maven-based J2EE application for Spring MVC.",
        "Create a Maven-based J2EE application for Hibernate and JPA, using the database from Session 1 exercise 5.",
        "Define a new implementation of a Teacher interface for his/her favourite course in Spring using Inversion of Control, and retrieve the information from the new teacher implementation."]),
    ("Session 4: Dependency injection, controller", [
        "Write a class and implement it using dependency injection.",
        "Write a service interface with a getRandom() method, define 3 courses in an array, and inject it using dependency injection into the Teacher interface (Session 3 exercise 4). Test and verify retrieval of random courses.",
        "Write a program using Spring Framework to create a controller and display the response in a view using @GetMapping().",
        "Create a form to capture student admission information using Spring form tags (text, textarea, dropdown, date picker, true/false and checkbox) and write a controller using @PostMapping() to display the form information."]),
    ("Session 5: Form validation, Bootstrap and CSS", [
        "Apply client-side validation to the form from Session 4 exercise 4, along with server-side validation.",
        "Write a program to bind form objects with an entity bean in Spring MVC.",
        "Configure Bootstrap in Spring MVC and use default styling classes in the forms and views created above.",
        "Apply custom styling to your pages in Spring MVC."]),
    ("Session 6: Hibernate, JPA", [
        "Create a database for the student admission lifecycle and configure Hibernate and JPA with the Spring MVC project along with all table entities.",
        "Retrieve student information using Hibernate and print the values in the console.",
        "Create CRUD (Create/Save, Read/Fetch, Edit/Update, Delete) using Spring MVC and Hibernate.",
        "Apply a batch update for students' admission approval using Spring MVC and Hibernate."]),
    ("Session 7: Spring Boot and REST controller", [
        "Create a Spring Boot application using Spring Initializr. Add these dependencies manually: Spring MVC, Hibernate, JPA, Thymeleaf, DevTools, Actuator, and a MySQL/MSSQL/Oracle/MongoDB driver (your choice).",
        "Configure database settings through the property file in Spring Boot.",
        "Create JPA repositories for all entities used in the student admission lifecycle.",
        "Create a REST controller to fetch student information using a JPA repository; the response should be displayed in JSON format."]),
    ("Session 8: REST API, Spring Security, Actuator", [
        "Add the Actuator dependency in Spring Boot and test all available Actuator endpoints.",
        "Create a REST API for CRUD operations using Spring Boot and Hibernate/JPA using annotations.",
        "Create a REST API for CRUD operations using Spring Boot and Hibernate/JPA using XML configuration.",
        "Add the Spring Security dependency to the application from Session 8 exercise 2 and configure the default login."]),
    ("Session 9: Spring Security", [
        "Create a User table in the database and bind the user entity with Spring Security for login.",
        "Create a custom login page in HTML and authenticate using Spring Security in Spring Boot.",
        "Implement logout functionality in Spring Security.",
        "Create a user registration form and validate it. Once the information is validated and saved, auto-login using Spring Security."]),
    ("Session 10: Bootstrap, role-based authentication and CSRF", [
        "Add Bootstrap styling to the login and registration pages from Session 9.",
        "Create a Role table in the database and configure it with Spring Boot, Security and Hibernate.",
        "Write code for role-based authentication using Spring Security.",
        "Display the current logged-in user's details on the dashboard along with client IP, date-time and the user's current role.",
        "Add CSRF functionality to the authentication.",
        "Restrict role-based access to views in Spring Boot Security."]),
]
for title, ex in sessions:
    H3(title)
    B(ex, numbered=True)
story.append(PageBreak())

# ================= 10. Quick reference =================
H1("10. Quick reference")
H2("10.1 Servlet API")
table(["Call", "Returns / does"], [
    ["request.getParameter(\"n\")", "Value of one form field (String or null)"],
    ["request.getParameterValues(\"n\")", "All values of a multi-select / checkbox group (String[])"],
    ["request.getSession()", "Current HttpSession (creates one if needed)"],
    ["session.setAttribute(\"k\", v) / getAttribute(\"k\")", "Store / read per-user data"],
    ["response.addCookie(new Cookie(\"k\", \"v\"))", "Send a cookie to the browser"],
    ["request.getCookies()", "Cookies sent by the browser (Cookie[])"],
    ["response.sendRedirect(\"url\")", "Tell the browser to load another URL"],
    ["request.getRequestDispatcher(\"x.jsp\").forward(req, res)", "Hand the request to a JSP/servlet on the server"],
], [85, 85], mono_first=True)
H2("10.2 Spring MVC annotations")
table(["Annotation", "Purpose"], [
    ["@SpringBootApplication", "Main class: enables auto-configuration and component scanning"],
    ["@Controller", "Web controller that returns view names"],
    ["@RestController", "Controller whose return values are written as JSON (Session 7)"],
    ["@GetMapping / @PostMapping", "Map HTTP GET / POST on a URL to a method"],
    ["@RequestParam(\"n\")", "Bind one request parameter to a method argument"],
    ["@PathVariable", "Bind part of the URL, e.g. /student/{id}"],
    ["@ModelAttribute", "Bind form fields to an object"],
    ["@Autowired", "Dependency injection (Session 4)"],
    ["@Entity, @Id, @GeneratedValue", "JPA entity mapping (Session 6)"],
], [70, 100], mono_first=True)
H2("10.3 Thymeleaf")
table(["Syntax", "Meaning"], [
    ["${attr}", "Variable expression: read a model attribute"],
    ["*{field}", "Selection expression on th:object"],
    ["@{/path}", "Link URL expression"],
    ["th:text, th:field, th:object", "Set text, bind a form field, choose form object"],
    ["th:if=\"${cond}\", th:each=\"s : ${list}\"", "Condition and loop"],
], [70, 100], mono_first=True)
H2("10.4 Useful HTTP status codes")
table(["Code", "Meaning"], [
    ["200 OK", "Success"], ["302 Found", "Redirect (e.g. redirect:/dashboard)"], ["400 Bad Request", "Invalid input / binding error"],
    ["403 Forbidden", "Not allowed (Spring Security, missing CSRF token)"], ["404 Not Found", "No mapping for the URL"],
    ["405 Method Not Allowed", "Wrong HTTP method for the mapping"], ["500 Internal Server Error", "Exception in your code; read the server log"],
], [50, 120], mono_first=True)
H2("10.5 Official links")
B(["JDK: oracle.com/java/technologies/downloads · adoptium.net",
   "Java PATH and CLASSPATH: docs.oracle.com/javase/tutorial/essential/environment/paths.html",
   "Apache NetBeans: netbeans.apache.org/download · Eclipse: eclipse.org/downloads",
   "Apache Tomcat: tomcat.apache.org · Spring Initializr: start.spring.io",
   "Maven Repository (search dependencies): mvnrepository.com",
   "Bootstrap: getbootstrap.com · Font Awesome: fontawesome.com · Thymeleaf: thymeleaf.org"])

doc.multiBuild(story)
print("wrote", OUT)
