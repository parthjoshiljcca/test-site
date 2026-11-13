/* Nihongo Yatra — course data.
   Kana entries: [kana, romaji, Devanagari pronunciation, memory hint]
   Vocab entries: [japanese, romaji, Devanagari pronunciation, English, Hindi meaning] */

const HIRA = [
['あ','a','अ','A cross with a loop — someone sitting cross-legged says “Aah!” (आह!)'],
['い','i','इ','Two little lines like “ii” — इ'],
['う','u','उ','A mouth pouting “oo” (उ) with a dash on top'],
['え','e','ए','An exotic bird dancing — “Eh?” (ए?)'],
['お','o','ओ','A UFO crashing — “Oh!” (ओह!)'],
['か','ka','क','A kite with a string — “कटी पतंग” starts with क'],
['き','ki','कि','Looks like a key 🔑 — “ki”'],
['く','ku','कु','A bird’s open beak going “कू-कू” like a cuckoo'],
['け','ke','के','A keg standing on a stand — के'],
['こ','ko','को','Two worms co-operating — को'],
['さ','sa','स','Sitar strings with a hook — स for सितार'],
['し','shi','शि','A fishing hook — “she” catches fish; शि as in शिकार'],
['す','su','सु','A swing with a loop — सु'],
['せ','se','से','A mouth with one big fang saying “say” — से'],
['そ','so','सो','A zig-zag snore line — सो (सोना = sleep)'],
['た','ta','त','Looks like the letters “t” + “a” — त (soft, dental like Hindi त)'],
['ち','chi','चि','A cheerleader’s pose, or a reversed 5 — चि'],
['つ','tsu','त्सु','A tsunami wave — त्सु (say त् + सु quickly)'],
['て','te','ते','A tail curling down — ते'],
['と','to','तो','A toe with a thorn stuck in it — तो'],
['な','na','न','A nun praying near a cross — न'],
['に','ni','नि','A knee (नी) next to two lines — नि'],
['ぬ','nu','नु','Noodles held by chopsticks — नु (नूडल्स)'],
['ね','ne','ने','A neko (cat) with a curly tail — ने'],
['の','no','नो','A big “No” sign 🚫 — नो'],
['は','ha','ह','Someone laughing “Ha-ha!” — ह (as a particle it is read “wa”)'],
['ひ','hi','हि','A big smile — “hee hee” हि'],
['ふ','fu','फु','Mount Fuji with clouds — फु (soft, between फ and हु)'],
['へ','he','हे','A small hill — “Hey!” हे'],
['ほ','ho','हो','A ho-ho Santa with a pole — हो'],
['ま','ma','म','Mama with a long braid — म (माँ)'],
['み','mi','मि','Looks like the number 21 — “me, 21” मि'],
['む','mu','मु','A cow saying “moo” — मु'],
['め','me','मे','An eye — and め literally means “eye”! मे'],
['も','mo','मो','A fishing hook with more bait — मो'],
['や','ya','य','A yak with horns — य'],
['ゆ','yu','यु','A unique fish swimming — यु'],
['よ','yo','यो','A yo-yo on a string — यो'],
['ら','ra','र','A rabbit sitting — र (flapped, just like Hindi र!)'],
['り','ri','रि','Reeds by a river — रि'],
['る','ru','रु','A route with a loop at the end — रु'],
['れ','re','रे','Someone running with a ray of light — रे'],
['ろ','ro','रो','Same as る but no loop: an open road — रो'],
['わ','wa','व','A wasp’s body — वा'],
['を','wo','ओ','The object marker; read like ओ — similar to Hindi “को”'],
['ん','n','न्','Like Hindi anusvara ं / half न् — the only lone consonant'],
];

const KATA = [
['ア','a','अ','An axe — “Ah!”'],
['イ','i','इ','An easel leaning — इ'],
['ウ','u','उ','Like う but boxy — उ'],
['エ','e','ए','An I-beam of an elevator — ए'],
['オ','o','ओ','An opera singer with arms out — ओ'],
['カ','ka','क','Like か without the extra stroke — क'],
['キ','ki','कि','A key with two teeth — कि'],
['ク','ku','कु','A cook’s hat / bird beak — कु'],
['ケ','ke','के','A slanted K — के'],
['コ','ko','को','A corner — को'],
['サ','sa','स','A saw with handles — स'],
['シ','shi','शि','A smiling face: two eyes + mouth sweeping UP — शि'],
['ス','su','सु','A sumo wrestler’s legs — सु'],
['セ','se','से','Like せ but sharper — से'],
['ソ','so','सो','Sewing needle drops falling DOWN — सो (compare シ)'],
['タ','ta','त','Like ク with an extra slash — त'],
['チ','chi','चि','A cheerleader with pom-pom — चि'],
['ツ','tsu','त्सु','Tsunami drops falling DOWN from top — त्सु (compare シ)'],
['テ','te','ते','A telephone pole — ते'],
['ト','to','तो','A totem pole with a branch — तो'],
['ナ','na','न','A knife cross — न'],
['ニ','ni','नि','Two lines = 2, and “ni” means 2! — नि'],
['ヌ','nu','नु','Noodles with chopsticks — नु'],
['ネ','ne','ने','A necklace hanging — ने'],
['ノ','no','नो','A single slash: “No!” — नो'],
['ハ','ha','ह','Two lines laughing apart — ह'],
['ヒ','hi','हि','A heel — हि'],
['フ','fu','फु','A hook — फु'],
['ヘ','he','हे','Same as へ — हे'],
['ホ','ho','हो','A holy cross with two legs — हो'],
['マ','ma','म','Mama’s nose — म'],
['ミ','mi','मि','Three lines: “me me me!” — मि'],
['ム','mu','मु','A cow face — मु'],
['メ','me','मे','An X — “मे” (marked)'],
['モ','mo','मो','More lines than ニ — मो'],
['ヤ','ya','य','A yak horn — य'],
['ユ','yu','यु','A U-turn — यु'],
['ヨ','yo','यो','A backwards E — यो'],
['ラ','ra','र','A rabbit’s ear on top — र'],
['リ','ri','रि','Like り — रि'],
['ル','ru','रु','Roots of a tree — रु'],
['レ','re','रे','A lever — रे'],
['ロ','ro','रो','A square road — रो'],
['ワ','wa','व','A wine glass — वा'],
['ヲ','wo','ओ','Rare object marker — ओ'],
['ン','n','न्','Like シ’s cousin, but a single sharp UP stroke — न्'],
];

const HIRA_D = [
['が','ga','ग'],['ぎ','gi','गि'],['ぐ','gu','गु'],['げ','ge','गे'],['ご','go','गो'],
['ざ','za','ज़'],['じ','ji','जि'],['ず','zu','ज़ु'],['ぜ','ze','ज़े'],['ぞ','zo','ज़ो'],
['だ','da','द'],['ぢ','ji','जि'],['づ','zu','ज़ु'],['で','de','दे'],['ど','do','दो'],
['ば','ba','ब'],['び','bi','बि'],['ぶ','bu','बु'],['べ','be','बे'],['ぼ','bo','बो'],
['ぱ','pa','प'],['ぴ','pi','पि'],['ぷ','pu','पु'],['ぺ','pe','पे'],['ぽ','po','पो'],
].map(x=>[...x,'Base letter + ゛(voiced) or ゜(p-sound) — like क → ग in Hindi vargas']);

const KATA_D = [
['ガ','ga','ग'],['ギ','gi','गि'],['グ','gu','गु'],['ゲ','ge','गे'],['ゴ','go','गो'],
['ザ','za','ज़'],['ジ','ji','जि'],['ズ','zu','ज़ु'],['ゼ','ze','ज़े'],['ゾ','zo','ज़ो'],
['ダ','da','द'],['ヂ','ji','जि'],['ヅ','zu','ज़ु'],['デ','de','दे'],['ド','do','दो'],
['バ','ba','ब'],['ビ','bi','बि'],['ブ','bu','बु'],['ベ','be','बे'],['ボ','bo','बो'],
['パ','pa','प'],['ピ','pi','पि'],['プ','pu','पु'],['ペ','pe','पे'],['ポ','po','पो'],
].map(x=>[...x,'Same ゛/゜ rule as hiragana']);

const YOON = [
['きゃ','kya','क्या','Sounds exactly like Hindi “क्या”!'],['きゅ','kyu','क्यु','क्यु'],['きょ','kyo','क्यो','क्यो'],
['しゃ','sha','शा','शा — like शाम'],['しゅ','shu','शु','शु'],['しょ','sho','शो','शो — like शोर'],
['ちゃ','cha','चा','चा — as in चाय! (おちゃ = tea)'],['ちゅ','chu','चु','चु'],['ちょ','cho','चो','चो'],
['にゃ','nya','न्या','न्या — a cat says にゃー'],['ひゃ','hya','ह्या','ह्या'],['みゃ','mya','म्या','म्या'],
['りゃ','rya','र्या','र्या'],['ぎゃ','gya','ग्या','ग्या'],['じゃ','ja','जा','जा — as in जाना'],
['びゃ','bya','ब्या','ब्या'],['ぴゃ','pya','प्या','प्या — like प्यार'],
['っ','(pause)','् + double','Small っ doubles the next consonant: like पक्का, गद्दा'],
];

const KANJI = [
['一','ichi','इचि','One horizontal line = 1 (एक)'],
['二','ni','नि','Two lines = 2 (दो)'],
['三','san','सान','Three lines = 3 (तीन)'],
['人','hito','हितो','A person walking: two legs (व्यक्ति)'],
['日','hi / nichi','हि / निचि','The sun with a line inside (सूरज / दिन)'],
['月','tsuki','त्सुकि','A crescent moon (चाँद / महीना)'],
['山','yama','यामा','Three mountain peaks (पहाड़)'],
['川','kawa','कावा','Three lines of flowing water (नदी)'],
['口','kuchi','कुचि','An open mouth — a square (मुँह)'],
['木','ki','कि','A tree with branches and roots (पेड़)'],
];

/* rows for the kana chart (gojūon order — same order as Sanskrit/Devanagari!) */
const CHART_ROWS = [
 ['あ','い','う','え','お'],['か','き','く','け','こ'],['さ','し','す','せ','そ'],['た','ち','つ','て','と'],
 ['な','に','ぬ','ね','の'],['は','ひ','ふ','へ','ほ'],['ま','み','む','め','も'],['や','','ゆ','','よ'],
 ['ら','り','る','れ','ろ'],['わ','','','','を'],['ん','','','','']
];

const VARGA = `<div class="tbl"><table class="t">
<tr><th>Hindi (Devanagari) order</th><th>Japanese (gojūon) order</th></tr>
<tr><td class="hi">स्वर: अ इ उ ए ओ</td><td class="jp">あ い う え お (a i u e o)</td></tr>
<tr><td class="hi">क-वर्ग: क ख ग घ ङ</td><td class="jp">か row (ka ki ku ke ko)</td></tr>
<tr><td class="hi">च-वर्ग / स: च छ ज … स</td><td class="jp">さ row (sa shi su se so)</td></tr>
<tr><td class="hi">त-वर्ग: त थ द ध न</td><td class="jp">た row → な row</td></tr>
<tr><td class="hi">प-वर्ग: प फ ब भ म</td><td class="jp">は row (old “pa”) → ま row</td></tr>
<tr><td class="hi">अंतःस्थ: य र ल व</td><td class="jp">や → ら → わ rows</td></tr>
</table></div>`;

const DAYS = [
/* ================= WEEK 1: HIRAGANA ================= */
{d:1, title:'Vowels あいうえお', kind:'kana', chars:['あ','い','う','え','お'],
 lesson:`
<p><b>स्वागत है! Welcome to Day 1.</b> Japanese uses <b>three scripts</b>:</p>
<ul>
<li><b>Hiragana (ひらがな)</b> — 46 rounded letters for native Japanese words &amp; grammar. <i>We start here.</i></li>
<li><b>Katakana (カタカナ)</b> — 46 angular letters for foreign words (like コーヒー “coffee”).</li>
<li><b>Kanji (漢字)</b> — meaning-symbols borrowed from Chinese (日 = sun/day).</li>
</ul>
<div class="hi-box"><b class="h">🇮🇳 हिंदी कनेक्शन — you already know the system!</b>
Hiragana is a <b>syllabary</b>, exactly like Devanagari: each letter = one sound (क = ka). And the Japanese alphabet order (a-i-u-e-o, then k, s, t, n, h, m, y, r, w) was arranged by Buddhist monks who studied <b>Sanskrit</b>. That’s why it follows the same logic as our <span class="hi">वर्णमाला</span>: vowels first, then consonants from throat to lips.
${VARGA}</div>
<h3>The 5 vowels</h3>
<p>Japanese has only <b>5 pure vowels</b> — they sound just like Hindi short vowels:</p>
<div class="tbl"><table class="t"><tr><th>Japanese</th><th>Sound</th><th>Hindi</th><th>Say it like…</th></tr>
<tr><td class="jp">あ</td><td>a</td><td class="hi">अ</td><td class="hi">“अब” का अ (but open, like आ short)</td></tr>
<tr><td class="jp">い</td><td>i</td><td class="hi">इ</td><td class="hi">“इधर” का इ</td></tr>
<tr><td class="jp">う</td><td>u</td><td class="hi">उ</td><td class="hi">“उधर” का उ (lips relaxed, not rounded)</td></tr>
<tr><td class="jp">え</td><td>e</td><td class="hi">ए</td><td class="hi">“एक” का ए</td></tr>
<tr><td class="jp">お</td><td>o</td><td class="hi">ओ</td><td class="hi">“ओर” का ओ</td></tr></table></div>
<div class="tip"><b>💡 Big advantage for Hindi speakers:</b> English speakers struggle because English vowels are messy. Your Hindi vowels are already “pure” like Japanese. Just never stretch them unless the word has a long vowel.</div>
<div class="hi-box"><b class="h">🕉️ Did you know? Sanskrit words live in Japanese!</b>
Buddhism carried Sanskrit words to Japan: <span class="jp">ダルマ</span> (Daruma doll) ← <span class="hi">धर्म</span>, <span class="jp">えんま</span> (Enma, king of the dead) ← <span class="hi">यम</span>, <span class="jp">なむ</span> (namu, in prayers) ← <span class="hi">नमः</span>, <span class="jp">しゃり</span> (shari, sushi rice) ← <span class="hi">शरीर</span> (relics), <span class="jp">だんな</span> (danna, husband/patron) ← <span class="hi">दान</span>.</div>
<p><b>How to study each day:</b> 📖 Learn → 🃏 Flashcards → 👂 Listening quiz → 📜 Reading → 🗣️ Speaking → ✍️ Writing. Finish all 6 to complete the day and earn stars!</p>`,
 hi:'नमस्ते! आज हम जापानी के पाँच स्वर सीखेंगे: आ, इ, उ, ए, ओ। जापानी वर्णमाला भी हिंदी की तरह है — पहले स्वर, फिर व्यंजन। हर अक्षर एक ध्वनि है, बिल्कुल देवनागरी की तरह।',
 vocab:[['あい','ai','आइ','love','प्यार'],['あお','ao','आओ','blue','नीला'],['いえ','ie','इए','house','घर'],['うえ','ue','उए','up / above','ऊपर'],['いいえ','iie','ईए','no','नहीं'],['おい','oi','ओइ','hey!','अरे!']],
 read:[['あい','ai','आइ','love — प्यार'],['あお','ao','आओ','blue — नीला (sounds like Hindi “आओ”!)'],['いえ','ie','इए','house — घर'],['うえ','ue','उए','above — ऊपर'],['いいえ','iie','ईए','no — नहीं']],
 write:'あいうえお'},

{d:2, title:'K-row か + G-sounds が', kind:'kana', chars:['か','き','く','け','こ','が','ぎ','ぐ','げ','ご'],
 lesson:`
<p>Now we add a consonant. Japanese letters = consonant + vowel, exactly like Hindi <span class="hi">क + ा = का</span>.</p>
<div class="hi-box"><b class="h">🇮🇳 हिंदी कनेक्शन — the बारहखड़ी trick</b>
In Hindi you learned <span class="hi">क, कि, कु, के, को</span>. Japanese has the same thing — but each one is a <b>separate letter</b>: <span class="jp">か き く け こ</span> = <span class="hi">क कि कु के को</span>. Think of it as a बारहखड़ी with only 5 मात्राएँ.</div>
<h3>Dakuten ゛ — the two little dots</h3>
<p>Add two dots (<b>゛</b>, called <i>dakuten</i>) to か and it becomes <b>voiced</b>: か ka → が ga.</p>
<div class="hi-box"><b class="h">🇮🇳 Same as क → ग!</b>
In the क-वर्ग, <span class="hi">क</span> is unvoiced and <span class="hi">ग</span> is voiced. Japanese does the same with two dots: <span class="jp">か→が, き→ぎ, く→ぐ, け→げ, こ→ご</span>. Japanese has <b>no aspirated sounds</b> (no ख, घ) — so keep your breath light.</div>
<div class="tip"><b>Pronunciation:</b> Japanese “k” is softer than English “k” — somewhere between Hindi क and a light ख. Don’t puff air.</div>
<p><b>Words today:</b> <span class="jp">かお</span> kao (face), <span class="jp">えき</span> eki (station), <span class="jp">かぎ</span> kagi (key — sounds a bit like <span class="hi">काग़ज़</span>, but means key!), <span class="jp">ごご</span> gogo (afternoon).</p>`,
 hi:'आज हम क वर्ग सीखेंगे: का, कि, कु, के, को। दो छोटे बिंदु लगाने से क की ध्वनि ग बन जाती है, ठीक वैसे ही जैसे हिंदी में क और ग।',
 vocab:[['かお','kao','काओ','face','चेहरा'],['えき','eki','एकि','station','स्टेशन'],['かぎ','kagi','कागि','key','चाबी'],['あき','aki','आकि','autumn','पतझड़'],['いけ','ike','इके','pond','तालाब'],['ごご','gogo','गोगो','afternoon','दोपहर']],
 read:[['かお','kao','काओ','face — चेहरा'],['えき','eki','एकि','station — स्टेशन'],['かぎ','kagi','कागि','key — चाबी'],['あかい','akai','आकाइ','red — लाल'],['ごご','gogo','गोगो','afternoon — दोपहर']],
 write:'かきくけこがぎぐげご'},

{d:3, title:'S-row さ + Z-sounds ざ', kind:'kana', chars:['さ','し','す','せ','そ','ざ','じ','ず','ぜ','ぞ'],
 lesson:`
<p>The さ row is mostly <span class="hi">स</span> — with one surprise:</p>
<div class="tbl"><table class="t"><tr><th>Kana</th><th>Romaji</th><th>Hindi</th></tr>
<tr><td class="jp">さ</td><td>sa</td><td class="hi">स</td></tr>
<tr><td class="jp">し</td><td><b>shi</b> (not si!)</td><td class="hi">शि</td></tr>
<tr><td class="jp">す</td><td>su</td><td class="hi">सु</td></tr>
<tr><td class="jp">せ</td><td>se</td><td class="hi">से</td></tr>
<tr><td class="jp">そ</td><td>so</td><td class="hi">सो</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 हिंदी कनेक्शन</b>
Hindi has both <span class="hi">स</span> and <span class="hi">श</span>. Japanese uses स for most of the row, but <span class="jp">し</span> is always <span class="hi">शि</span>. With dots: <span class="jp">ざ</span> = <span class="hi">ज़</span> (nukta sound like in ज़मीन), and <span class="jp">じ</span> = <span class="hi">जि</span>.</div>
<div class="tip"><b>💡 Silent “u”:</b> In す at the end of words (like です, ます) the “u” almost disappears: <i>desu</i> sounds like <span class="hi">देस्</span>. Just like Hindi drops the final अ in “कमल” (kamal, not kamala)!</div>
<p><b>Fun word:</b> <span class="jp">すし</span> sushi — now you can read it!</p>`,
 hi:'आज स वर्ग: सा, शि, सु, से, सो। ध्यान दें, शि हमेशा श से बोला जाता है। बिंदु लगाने पर ज़ की ध्वनि बनती है।',
 vocab:[['すし','sushi','सुशि','sushi','सुशी'],['あさ','asa','आसा','morning','सुबह'],['かさ','kasa','कासा','umbrella','छाता'],['いす','isu','इसु','chair','कुर्सी'],['かぜ','kaze','काज़े','wind / a cold','हवा / ज़ुकाम'],['うそ','uso','उसो','lie','झूठ'],['すこし','sukoshi','सुकोशि','a little','थोड़ा']],
 read:[['あさ','asa','आसा','morning — सुबह'],['すし','sushi','सुशि','sushi — सुशी'],['かさ','kasa','कासा','umbrella — छाता'],['いす','isu','इसु','chair — कुर्सी'],['すこし','sukoshi','सुकोशि','a little — थोड़ा']],
 write:'さしすせそざじずぜぞ'},

{d:4, title:'T-row た + D-sounds だ', kind:'kana', chars:['た','ち','つ','て','と','だ','ぢ','づ','で','ど'],
 lesson:`
<div class="hi-box"><b class="h">🇮🇳 Your Hindi tongue is perfect for this row</b>
English speakers say “t” with the tongue up (<span class="hi">ट</span>). Japanese “t” is <b>dental</b> — tongue touching the teeth — exactly like Hindi <span class="hi">त</span> and <span class="hi">द</span>. So say <span class="jp">た</span> like <span class="hi">त</span> in <span class="hi">तारा</span>, not ट in टमाटर.</div>
<div class="tbl"><table class="t"><tr><th>Kana</th><th>Romaji</th><th>Hindi</th><th>Note</th></tr>
<tr><td class="jp">た</td><td>ta</td><td class="hi">त</td><td></td></tr>
<tr><td class="jp">ち</td><td><b>chi</b></td><td class="hi">चि</td><td>not “ti”</td></tr>
<tr><td class="jp">つ</td><td><b>tsu</b></td><td class="hi">त्सु</td><td>new sound — त् + सु fast, like “cats”</td></tr>
<tr><td class="jp">て</td><td>te</td><td class="hi">ते</td><td></td></tr>
<tr><td class="jp">と</td><td>to</td><td class="hi">तो</td><td></td></tr></table></div>
<p>With dakuten: <span class="jp">だ で ど</span> = <span class="hi">द दे दो</span>. <span class="jp">ぢ</span> and <span class="jp">づ</span> sound the same as じ and ず and are rare.</p>
<div class="tip"><b>Practice つ:</b> say “<span class="hi">पत्सु</span>” — the middle part is つ. Words: <span class="jp">くつ</span> kutsu (shoes), <span class="jp">つき</span> tsuki (moon).</div>`,
 hi:'आज त वर्ग सीखेंगे। जापानी त हिंदी के त जैसा है, दाँतों पर जीभ लगाकर। ची और त्सु दो खास ध्वनियाँ हैं। बिंदु लगाने पर त से द बनता है।',
 vocab:[['くつ','kutsu','कुत्सु','shoes','जूते'],['て','te','ते','hand','हाथ'],['そと','soto','सोतो','outside','बाहर'],['ちず','chizu','चिज़ु','map','नक्शा'],['たこ','tako','ताको','octopus','ऑक्टोपस'],['だいがく','daigaku','दाइगाकु','university','विश्वविद्यालय'],['つき','tsuki','त्सुकि','moon','चाँद']],
 read:[['くつ','kutsu','कुत्सु','shoes — जूते'],['そと','soto','सोतो','outside — बाहर'],['ちず','chizu','चिज़ु','map — नक्शा'],['つくえ','tsukue','त्सुकुए','desk — मेज़'],['だいがく','daigaku','दाइगाकु','university — विश्वविद्यालय']],
 write:'たちつてとだぢづでど'},

{d:5, title:'N-row な + H-row は', kind:'kana', chars:['な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'],
 lesson:`
<p>Two easy rows today: <span class="jp">な</span> = <span class="hi">न</span> row and <span class="jp">は</span> = <span class="hi">ह</span> row.</p>
<div class="tbl"><table class="t"><tr><th>な row</th><th class="hi">हिंदी</th><th>は row</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">な na</td><td class="hi">न</td><td class="jp">は ha</td><td class="hi">ह</td></tr>
<tr><td class="jp">に ni</td><td class="hi">नि</td><td class="jp">ひ hi</td><td class="hi">हि</td></tr>
<tr><td class="jp">ぬ nu</td><td class="hi">नु</td><td class="jp">ふ <b>fu</b></td><td class="hi">फु (soft)</td></tr>
<tr><td class="jp">ね ne</td><td class="hi">ने</td><td class="jp">へ he</td><td class="hi">हे</td></tr>
<tr><td class="jp">の no</td><td class="hi">नो</td><td class="jp">ほ ho</td><td class="hi">हो</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 ふ — between फ and ह</b>
<span class="jp">ふ</span> is made by blowing gently through rounded lips — not the hard English “f”. It sits between Hindi <span class="hi">फ</span> and <span class="hi">हु</span>. Think of blowing on hot चाय: “फ़ू…”.</div>
<div class="warn"><b>⚠️ Special rule:</b> When <span class="jp">は</span> is used as a grammar word (particle), it is read <b>“wa”</b>. Example: <span class="jp">こんにちは</span> = kon-ni-chi-<b>wa</b>. Similarly <span class="jp">へ</span> as a particle (“towards”) is read <b>“e”</b>.</div>
<p><b>Cute word:</b> <span class="jp">ねこ</span> neko = cat 🐱, <span class="jp">いぬ</span> inu = dog 🐶.</p>`,
 hi:'आज न और ह वर्ग। ना, नि, नु, ने, नो और हा, हि, फु, हे, हो। याद रखें, जब हा व्याकरण के शब्द की तरह आता है तो उसे वा पढ़ते हैं।',
 vocab:[['ねこ','neko','नेको','cat','बिल्ली'],['いぬ','inu','इनु','dog','कुत्ता'],['はな','hana','हाना','flower / nose','फूल / नाक'],['ひと','hito','हितो','person','व्यक्ति'],['ふね','fune','फुने','boat','नाव'],['ほし','hoshi','होशि','star','तारा'],['にく','niku','निकु','meat','मांस']],
 read:[['ねこ','neko','नेको','cat — बिल्ली'],['いぬ','inu','इनु','dog — कुत्ता'],['はな','hana','हाना','flower — फूल'],['ほし','hoshi','होशि','star — तारा'],['ひと','hito','हितो','person — व्यक्ति']],
 write:'なにぬねのはひふへほ'},

{d:6, title:'M-row ま + B/P sounds', kind:'kana', chars:['ま','み','む','め','も','ば','び','ぶ','べ','ぼ','ぱ','ぴ','ぷ','ぺ','ぽ'],
 lesson:`
<p>The <span class="jp">ま</span> row = <span class="hi">म</span> row: <span class="jp">ま み む め も</span> = <span class="hi">म मि मु मे मो</span>.</p>
<h3>Two marks on the は row</h3>
<p>The は row has <b>two</b> special marks:</p>
<ul><li><b>゛ dakuten</b> → は becomes <span class="jp">ば</span> ba (<span class="hi">ब</span>)</li>
<li><b>゜ handakuten</b> (a small circle) → は becomes <span class="jp">ぱ</span> pa (<span class="hi">प</span>)</li></ul>
<div class="hi-box"><b class="h">🇮🇳 हिंदी कनेक्शन — the प-वर्ग</b>
Hindi’s lip-sounds are <span class="hi">प फ ब भ म</span>. In old Japanese, は was actually pronounced “pa”! So the は row, ば, ぱ and ま together form Japan’s own <span class="hi">प-वर्ग</span>: <span class="jp">ぱ (प) · ふ (फ) · ば (ब) · ま (म)</span>.</div>
<div class="hi-box"><b class="h">🇮🇳 Doubled sound-words — just like Hindi!</b>
Hindi loves <span class="hi">चमचम, टपटप, धकधक, खटखट</span>. Japanese does the same: <span class="jp">ぴかぴか</span> pika-pika (shiny, <span class="hi">चमचम</span>), <span class="jp">どきどき</span> doki-doki (heart beating, <span class="hi">धकधक</span>), <span class="jp">ぽたぽた</span> pota-pota (dripping, <span class="hi">टपटप</span>).</div>`,
 hi:'आज म वर्ग और प वर्ग। मा, मि, मु, मे, मो। हा पर दो बिंदु लगाने से बा, और छोटा गोला लगाने से पा बनता है। जापानी में भी चमचम जैसे दोहरे शब्द होते हैं, जैसे पिकापिका।',
 vocab:[['まど','mado','मादो','window','खिड़की'],['みみ','mimi','मिमि','ear','कान'],['むし','mushi','मुशि','insect','कीड़ा'],['め','me','मे','eye','आँख'],['もも','momo','मोमो','peach','आड़ू'],['ぴかぴか','pikapika','पिकापिका','shiny','चमचम'],['どきどき','dokidoki','दोकिदोकि','heart pounding','धकधक']],
 read:[['まど','mado','मादो','window — खिड़की'],['みみ','mimi','मिमि','ear — कान'],['ぴかぴか','pikapika','पिकापिका','shiny — चमचम'],['どきどき','dokidoki','दोकिदोकि','heart pounding — धकधक'],['ぶた','buta','बुता','pig — सूअर']],
 write:'まみむめもばびぶべぼぱぴぷぺぽ'},

{d:7, title:'Y, R, W rows + ん', kind:'kana', chars:['や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん'],
 lesson:`
<p>The last rows! These match the Hindi <span class="hi">अंतःस्थ</span> letters <span class="hi">य र व</span>.</p>
<div class="tbl"><table class="t"><tr><th>Row</th><th>Kana</th><th class="hi">हिंदी</th></tr>
<tr><td>Y</td><td class="jp">や ゆ よ</td><td class="hi">य यु यो</td></tr>
<tr><td>R</td><td class="jp">ら り る れ ろ</td><td class="hi">र रि रु रे रो</td></tr>
<tr><td>W</td><td class="jp">わ を</td><td class="hi">वा ओ</td></tr>
<tr><td>N</td><td class="jp">ん</td><td class="hi">न् / ं</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Japanese “r” = Hindi र 🎉</b>
English speakers find Japanese R very hard. But it is a quick tongue-tap — <b>exactly Hindi <span class="hi">र</span></b>. Say <span class="jp">さくら</span> (cherry blossom) like <span class="hi">साकुरा</span> and it’s perfect.</div>
<div class="hi-box"><b class="h">🇮🇳 ん = अनुस्वार / half न्</b>
<span class="jp">ん</span> is the only consonant that stands alone, like <span class="hi">न्</span> or the <span class="hi">ं</span> in <span class="hi">हिंदी</span>. Before b/p/m it sounds like म्: <span class="jp">さんぽ</span> sampo (walk) — just like <span class="hi">संपर्क</span> is said “सम्पर्क”.</div>
<p><b>を (wo)</b> is only used as a grammar particle and is read “o”. It marks the object — like Hindi <span class="hi">को</span>. You’ll use it on Day 18!</p>
<div class="tip">🎉 <b>You now know all 46 hiragana!</b> Check the <a href="#" onclick="go('chart');return false">Kana Chart</a> tab to see them together.</div>`,
 hi:'आज आखिरी पंक्तियाँ: या, यु, यो। रा, रि, रु, रे, रो। वा, ओ, और न्। जापानी र बिल्कुल हिंदी के र जैसा है। बधाई हो, आपने सारे हिरागाना सीख लिए!',
 vocab:[['やま','yama','यामा','mountain','पहाड़'],['ゆき','yuki','युकि','snow','बर्फ़'],['よる','yoru','योरु','night','रात'],['さくら','sakura','साकुरा','cherry blossom','चेरी का फूल'],['りんご','ringo','रिंगो','apple','सेब'],['くるま','kuruma','कुरुमा','car','गाड़ी'],['わたし','watashi','वाताशि','I / me','मैं'],['にほん','nihon','निहोन','Japan','जापान']],
 read:[['やま','yama','यामा','mountain — पहाड़'],['さくら','sakura','साकुरा','cherry blossom'],['りんご','ringo','रिंगो','apple — सेब'],['わたし','watashi','वाताशि','I — मैं'],['にほん','nihon','निहोन','Japan — जापान'],['ほん','hon','होन','book — किताब']],
 write:'やゆよらりるれろわをん'},

/* ================= WEEK 2: HIRAGANA PRO + KATAKANA ================= */
{d:8, title:'Combo sounds & long vowels', kind:'kana', chars:['きゃ','きゅ','きょ','しゃ','しゅ','しょ','ちゃ','ちゅ','ちょ','にゃ','ひゃ','みゃ','りゃ','ぎゃ','じゃ','びゃ','ぴゃ','っ'],
 lesson:`
<h3>1. Small ゃ ゅ ょ = आधा अक्षर (half letter)</h3>
<p>Write a <b>small</b> や/ゆ/よ after an “i” letter and they blend: き + ゃ = <span class="jp">きゃ</span> kya.</p>
<div class="hi-box"><b class="h">🇮🇳 Just like संयुक्त अक्षर!</b>
In Hindi, <span class="hi">क् + य = क्य</span> as in <span class="hi">क्या</span>. Japanese does the same: <span class="jp">きゃ</span> literally sounds like <span class="hi">“क्या”</span>! <span class="jp">ちゃ</span> = <span class="hi">चा</span> (as in चाय — and <span class="jp">おちゃ</span> means tea! Both words come from Chinese “cha”). <span class="jp">じゃ</span> = <span class="hi">जा</span>, <span class="jp">しゃ</span> = <span class="hi">शा</span>.</div>
<h3>2. Small っ = double consonant (हलंत pause)</h3>
<p>A small <span class="jp">っ</span> means “pause and double the next consonant”.</p>
<div class="hi-box"><b class="h">🇮🇳 Same as पक्का vs पका!</b>
<span class="hi">पका</span> (cooked) vs <span class="hi">पक्का</span> (sure) — the doubled क changes the meaning. Japanese: <span class="jp">きて</span> kite (come!) vs <span class="jp">きって</span> kitte (stamp) = <span class="hi">कित्ते</span>. <span class="jp">がっこう</span> gakkou = <span class="hi">गक्को</span> (school).</div>
<h3>3. Long vowels = मात्रा लंबी करना</h3>
<p>Repeat a vowel to make it long: <span class="jp">おばさん</span> obasan (aunt) vs <span class="jp">おばあさん</span> obaasan (grandmother).</p>
<div class="hi-box"><b class="h">🇮🇳 Like दिन vs दीन, कम vs काम</b>
Hindi already teaches you that short vs long vowels change meaning. In Japanese: <b>え+い</b> is usually read long “ē” (<span class="jp">せんせい</span> sensei = <span class="hi">सेन्से</span>), and <b>お+う</b> is long “ō” (<span class="jp">ありがとう</span> = <span class="hi">अरिगातो</span>, <span class="jp">とうきょう</span> = <span class="hi">तोक्यो</span>).</div>`,
 hi:'आज संयुक्त ध्वनियाँ। छोटा या, यु, यो जोड़ने से क्या, क्यु, क्यो बनते हैं, बिल्कुल हिंदी के संयुक्त अक्षरों की तरह। छोटा त्सु अगली ध्वनि को दोहरा करता है, जैसे पक्का में।',
 vocab:[['おちゃ','ocha','ओचा','tea','चाय'],['しゃしん','shashin','शाशिन','photo','तस्वीर'],['でんしゃ','densha','देनशा','train','ट्रेन'],['きっぷ','kippu','किप्पु','ticket','टिकट'],['がっこう','gakkou','गक्को','school','स्कूल'],['おかあさん','okaasan','ओकासान','mother','माँ'],['とうきょう','toukyou','तोक्यो','Tokyo','टोक्यो']],
 read:[['おちゃ','ocha','ओचा','tea — चाय'],['でんしゃ','densha','देनशा','train — ट्रेन'],['きっぷ','kippu','किप्पु','ticket — टिकट'],['がっこう','gakkou','गक्को','school — स्कूल'],['おばあさん','obaasan','ओबासान','grandmother — दादी/नानी'],['とうきょう','toukyou','तोक्यो','Tokyo']],
 write:['きゃ','しゃ','ちゃ','じゃ','きっ','がっこう']},

{d:9, title:'Hiragana review + first words', kind:'review', chars:HIRA.map(x=>x[0]),
 lesson:`
<p><b>Review day!</b> Today’s quiz picks from <b>all 46 hiragana</b>. Then you learn 10 everyday nouns.</p>
<div class="tip"><b>🧠 Memory method:</b> Look at the hint on each flashcard, say the sound aloud, and <b>write it once on paper</b>. Writing + speaking together locks it into memory (like how we learned <span class="hi">क से कबूतर</span>).</div>
<div class="hi-box"><b class="h">🇮🇳 Many letters look alike — just like Hindi</b>
Hindi learners mix up <span class="hi">ध / घ</span>, <span class="hi">भ / म</span>, <span class="hi">ख / रव</span>. Japanese has similar pairs:
<ul><li><span class="jp">さ / ち</span> — sa faces right, chi faces left</li>
<li><span class="jp">ぬ / め</span> — nu has a loop at the end, me doesn’t</li>
<li><span class="jp">ね / れ / わ</span> — ne has a loop, re kicks out, wa curls in</li>
<li><span class="jp">る / ろ</span> — ru has a loop, ro doesn’t</li>
<li><span class="jp">は / ほ</span> — ho has an extra line on top</li></ul></div>
<p>Print the <b>full hiragana worksheet</b> from the ✍️ Writing step and complete one row every day.</p>`,
 hi:'आज दोहराने का दिन है। सारे छियालीस हिरागाना का क्विज़ होगा। मिलते जुलते अक्षरों पर ध्यान दें, जैसे हिंदी में ध और घ।',
 vocab:[['いぬ','inu','इनु','dog','कुत्ता'],['ねこ','neko','नेको','cat','बिल्ली'],['さかな','sakana','साकाना','fish','मछली'],['みず','mizu','मिज़ु','water','पानी'],['やま','yama','यामा','mountain','पहाड़'],['かわ','kawa','कावा','river','नदी'],['はな','hana','हाना','flower','फूल'],['て','te','ते','hand','हाथ'],['め','me','मे','eye','आँख'],['くち','kuchi','कुचि','mouth','मुँह']],
 read:[['いぬと ねこ','inu to neko','इनु तो नेको','a dog and a cat — कुत्ता और बिल्ली'],['やまと かわ','yama to kawa','यामा तो कावा','mountain and river — पहाड़ और नदी'],['みずと さかな','mizu to sakana','मिज़ु तो साकाना','water and fish — पानी और मछली'],['めと くち','me to kuchi','मे तो कुचि','eye and mouth — आँख और मुँह']],
 write:'さちぬめねれわるろはほ'},

{d:10, title:'Greetings & manners', kind:'vocab',
 lesson:`
<p>Today you learn the <b>10 phrases you’ll use every single day</b> in Japan.</p>
<div class="tbl"><table class="t"><tr><th>Japanese</th><th>Romaji</th><th>Meaning</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">おはよう ございます</td><td>ohayou gozaimasu</td><td>Good morning</td><td class="hi">सुप्रभात</td></tr>
<tr><td class="jp">こんにちは</td><td>konnichiwa</td><td>Hello / Good afternoon</td><td class="hi">नमस्ते</td></tr>
<tr><td class="jp">こんばんは</td><td>konbanwa</td><td>Good evening</td><td class="hi">शुभ संध्या</td></tr>
<tr><td class="jp">さようなら</td><td>sayounara</td><td>Goodbye</td><td class="hi">अलविदा</td></tr>
<tr><td class="jp">ありがとう ございます</td><td>arigatou gozaimasu</td><td>Thank you (polite)</td><td class="hi">धन्यवाद</td></tr>
<tr><td class="jp">すみません</td><td>sumimasen</td><td>Excuse me / Sorry</td><td class="hi">माफ़ कीजिए / सुनिए</td></tr>
<tr><td class="jp">はい / いいえ</td><td>hai / iie</td><td>Yes / No</td><td class="hi">हाँ / नहीं</td></tr>
<tr><td class="jp">おやすみなさい</td><td>oyasuminasai</td><td>Good night</td><td class="hi">शुभ रात्रि</td></tr>
<tr><td class="jp">いただきます</td><td>itadakimasu</td><td>(before eating)</td><td class="hi">भोजन से पहले आभार</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Respect levels — you already understand this!</b>
Hindi has <span class="hi">तू / तुम / आप</span>. Japanese also changes words by politeness. <span class="jp">ありがとう</span> = casual “thanks” (like <span class="hi">थैंक्स यार</span>), <span class="jp">ありがとう ございます</span> = polite (like <span class="hi">आपका बहुत धन्यवाद</span>). Adding <span class="jp">ございます</span> = adding <span class="hi">“जी / आप”</span> respect.</div>
<div class="hi-box"><b class="h">🙏 Bowing = हाथ जोड़ना</b>
Japanese bow (<span class="jp">おじぎ</span>) while greeting, just as we join hands for <span class="hi">नमस्ते</span>. A deeper bow shows more respect — like touching elders’ feet shows more than a नमस्ते.</div>
<div class="tip">Remember: in <span class="jp">こんにちは</span> and <span class="jp">こんばんは</span> the final <span class="jp">は</span> is read <b>wa</b>.</div>`,
 hi:'आज अभिवादन सीखेंगे। कोन्निचिवा मतलब नमस्ते। अरिगातो गोज़ाइमास मतलब धन्यवाद। सुमिमासेन मतलब माफ़ कीजिए। जापानी में भी हिंदी की तरह आदर के अलग अलग स्तर होते हैं, जैसे तुम और आप।',
 vocab:[['おはよう ございます','ohayou gozaimasu','ओहायो गोज़ाइमास','Good morning','सुप्रभात'],['こんにちは','konnichiwa','कोन्निचिवा','Hello','नमस्ते'],['こんばんは','konbanwa','कोम्बानवा','Good evening','शुभ संध्या'],['さようなら','sayounara','सायोनारा','Goodbye','अलविदा'],['ありがとう ございます','arigatou gozaimasu','अरिगातो गोज़ाइमास','Thank you','धन्यवाद'],['すみません','sumimasen','सुमिमासेन','Excuse me / Sorry','माफ़ कीजिए'],['はい','hai','हाइ','Yes','हाँ'],['いいえ','iie','ईए','No','नहीं'],['おやすみなさい','oyasuminasai','ओयासुमिनासाइ','Good night','शुभ रात्रि'],['いただきます','itadakimasu','इतादाकिमास','Thanks for the food (before eating)','भोजन से पहले आभार']],
 read:[['A: おはよう ございます。','A: ohayou gozaimasu.','ओहायो गोज़ाइमास','Good morning. — सुप्रभात।'],['B: おはよう ございます！','B: ohayou gozaimasu!','ओहायो गोज़ाइमास','Good morning! — सुप्रभात!'],['A: すみません。','A: sumimasen.','सुमिमासेन','Excuse me. — सुनिए।'],['B: はい。','B: hai.','हाइ','Yes? — जी?'],['A: ありがとう ございます。','A: arigatou gozaimasu.','अरिगातो गोज़ाइमास','Thank you. — धन्यवाद।'],['B: さようなら。','B: sayounara.','सायोनारा','Goodbye. — अलविदा।']],
 write:['ありがとう','こんにちは','はい','いいえ'],
 speakAlt:{'こんにちは':['今日は'],'ありがとう ございます':['ありがとうございます','有難うございます'],'おはよう ございます':['おはようございます'],'さようなら':['さよなら'],'おやすみなさい':['お休みなさい']}},

{d:11, title:'Katakana ア〜ソ', kind:'kana', set:'k', chars:['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ'],
 lesson:`
<p><b>Katakana</b> = the same 46 sounds, written with sharp, straight strokes. It is used for <b>foreign words, names, and sound effects</b>.</p>
<div class="hi-box"><b class="h">🇮🇳 हिंदी कनेक्शन — English words in Hindi</b>
We write English words in Devanagari: <span class="hi">स्कूल, बस, कंप्यूटर</span>. Japanese writes foreign words in katakana: <span class="jp">スクール</span>, <span class="jp">バス</span>, <span class="jp">コンピューター</span>. Even <b>your name</b> will be written in katakana — e.g. Priya = <span class="jp">プリヤ</span>, India = <span class="jp">インド</span>!</div>
<div class="tip"><b>💡 Many katakana look like a piece of the hiragana:</b> か→カ, き→キ, せ→セ, へ→ヘ, り→リ. Use what you already know!</div>
<div class="warn"><b>⚠️ The famous trap: シ vs ツ, ソ vs ン</b><br>
<span class="jp" style="font-size:1.4rem">シ</span> shi — dots side by side, last stroke goes <b>UP</b> from bottom-left (like a smile).<br>
<span class="jp" style="font-size:1.4rem">ツ</span> tsu — dots on top, last stroke goes <b>DOWN</b> from top.<br>
<span class="jp" style="font-size:1.4rem">ソ</span> so — stroke goes DOWN; <span class="jp" style="font-size:1.4rem">ン</span> n — stroke goes UP.</div>
<p><b>The long-vowel bar ー</b>: katakana uses a dash for long sounds, like a <span class="hi">ा मात्रा</span>: <span class="jp">ケーキ</span> = <span class="hi">के-की</span> (cake).</p>`,
 hi:'आज से कताकाना शुरू। ये वही ध्वनियाँ हैं, पर सीधी रेखाओं में लिखी जाती हैं। जैसे हम अंग्रेज़ी शब्द देवनागरी में लिखते हैं, जापानी विदेशी शब्द कताकाना में लिखते हैं।',
 vocab:[['アイス','aisu','आइसु','ice cream','आइसक्रीम'],['ケーキ','keeki','केकि','cake','केक'],['ココア','kokoa','कोकोआ','cocoa','कोको'],['スキー','sukii','सुकी','ski','स्की'],['キス','kisu','किसु','kiss','चुंबन'],['ソース','soosu','सोसु','sauce','सॉस']],
 read:[['アイス','aisu','आइसु','ice (cream)'],['ケーキ','keeki','केकि','cake — केक'],['ココア','kokoa','कोकोआ','cocoa'],['スキー','sukii','सुकी','ski'],['ソース','soosu','सोसु','sauce — सॉस']],
 write:'アイウエオカキクケコサシスセソ'},

{d:12, title:'Katakana タ〜ホ', kind:'kana', set:'k', chars:['タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ'],
 lesson:`
<p>Fifteen more katakana. Same sounds as the hiragana you know — only the shapes are new.</p>
<div class="tbl"><table class="t"><tr><th>Katakana</th><th>Hiragana twin</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">タ チ ツ テ ト</td><td class="jp">た ち つ て と</td><td class="hi">त चि त्सु ते तो</td></tr>
<tr><td class="jp">ナ ニ ヌ ネ ノ</td><td class="jp">な に ぬ ね の</td><td class="hi">न नि नु ने नो</td></tr>
<tr><td class="jp">ハ ヒ フ ヘ ホ</td><td class="jp">は ひ ふ へ ほ</td><td class="hi">ह हि फु हे हो</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 How Japanese “adapts” English — like Hindi does</b>
Hindi turns “station” into <span class="hi">इस्टेशन</span> and “school” into <span class="hi">इस्कूल</span> by adding a vowel. Japanese also adds vowels because almost every letter ends in a vowel: “tennis” → <span class="jp">テニス</span> te-ni-su, “taxi” → <span class="jp">タクシー</span> ta-ku-shii. Once you notice this pattern, katakana words become easy to guess!</div>
<div class="tip"><b>Shape twins:</b> <span class="jp">ニ</span> looks like two lines and means “two” (二)! <span class="jp">ヘ</span> is identical in both scripts.</div>`,
 hi:'आज ता से हो तक कताकाना। जैसे हिंदी में स्टेशन को इस्टेशन बोलते हैं, जापानी भी अंग्रेज़ी शब्दों में स्वर जोड़ देती है, जैसे टेनिस को तेनिसु।',
 vocab:[['テニス','tenisu','तेनिसु','tennis','टेनिस'],['タクシー','takushii','ताकुशी','taxi','टैक्सी'],['ノート','nooto','नोतो','notebook','कॉपी'],['ハート','haato','हातो','heart','दिल'],['ナイフ','naifu','नाइफु','knife','चाकू'],['チキン','chikin','चिकिन','chicken','चिकन']],
 read:[['テニス','tenisu','तेनिसु','tennis — टेनिस'],['タクシー','takushii','ताकुशी','taxi — टैक्सी'],['ノート','nooto','नोतो','notebook — कॉपी'],['ハート','haato','हातो','heart — दिल'],['チキン','chikin','चिकिन','chicken — चिकन']],
 write:'タチツテトナニヌネノハヒフヘホ'},

{d:13, title:'Katakana マ〜ン', kind:'kana', set:'k', chars:['マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン'],
 lesson:`
<p>The last 16 katakana! After today you can read menus, shop signs and train boards in Japan.</p>
<div class="tbl"><table class="t"><tr><th>Katakana</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">マ ミ ム メ モ</td><td class="hi">म मि मु मे मो</td></tr>
<tr><td class="jp">ヤ ユ ヨ</td><td class="hi">य यु यो</td></tr>
<tr><td class="jp">ラ リ ル レ ロ</td><td class="hi">र रि रु रे रो</td></tr>
<tr><td class="jp">ワ ヲ ン</td><td class="hi">वा ओ न्</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 L and R are the same in Japanese</b>
Japanese has no separate <span class="hi">ल</span>. Both “L” and “R” become the ら row (<span class="hi">र</span>): “lemon” → <span class="jp">レモン</span> remon, “hotel” → <span class="jp">ホテル</span> hoteru, “Delhi” → <span class="jp">デリー</span> derii. So Delhi is “देरी” in Japanese! 😄</div>
<div class="tip"><b>Shape tips:</b> <span class="jp">ミ</span> = 3 lines (“me me me”), <span class="jp">ロ</span> = a box, <span class="jp">ル</span> = roots, <span class="jp">レ</span> = a lever.</div>`,
 hi:'आज कताकाना की आखिरी पंक्तियाँ। जापानी में ल और र एक ही हैं, इसलिए लेमन को रेमोन और दिल्ली को देरी कहते हैं।',
 vocab:[['ホテル','hoteru','होतेरु','hotel','होटल'],['カメラ','kamera','कामेरा','camera','कैमरा'],['ミルク','miruku','मिरुकु','milk','दूध'],['ラーメン','raamen','रामेन','ramen noodles','रामेन नूडल्स'],['レモン','remon','रेमोन','lemon','नींबू'],['メモ','memo','मेमो','memo / note','नोट'],['デリー','derii','देरी','Delhi','दिल्ली']],
 read:[['ホテル','hoteru','होतेरु','hotel — होटल'],['カメラ','kamera','कामेरा','camera — कैमरा'],['ミルク','miruku','मिरुकु','milk — दूध'],['ラーメン','raamen','रामेन','ramen'],['レモン','remon','रेमोन','lemon — नींबू']],
 write:'マミムメモヤユヨラリルレロワヲン'},

{d:14, title:'Katakana dakuten + loanwords', kind:'kana', set:'k', chars:KATA_D.map(x=>x[0]),
 lesson:`
<p>The ゛ and ゜ marks work exactly the same in katakana: <span class="jp">カ→ガ, サ→ザ, タ→ダ, ハ→バ, ハ→パ</span>.</p>
<div class="hi-box"><b class="h">🇮🇳 Words Hindi and Japanese both borrowed from Portuguese!</b>
Portuguese traders reached both India and Japan in the 1500s. So some words are cousins:
<ul><li>Portuguese <i>pão</i> (bread) → Hindi <span class="hi">पाव</span> (as in पाव भाजी) and Japanese <span class="jp">パン</span> pan</li>
<li>Portuguese <i>tabaco</i> → Hindi <span class="hi">तंबाकू</span> and Japanese <span class="jp">タバコ</span> tabako</li>
<li>Portuguese <i>botão</i> → Hindi <span class="hi">बटन</span> and Japanese <span class="jp">ボタン</span> botan</li></ul></div>
<p><b>Everyday katakana words:</b> <span class="jp">コーヒー</span> (coffee), <span class="jp">テレビ</span> (TV), <span class="jp">バス</span> (bus), <span class="jp">カレー</span> (curry — Japan loves curry!), <span class="jp">インド</span> (India).</p>
<div class="tip">🎉 <b>You can now read both kana scripts!</b> Next week: real sentences.</div>`,
 hi:'आज कताकाना में बिंदु वाले अक्षर। मज़ेदार बात, पाव और पान, तंबाकू और ताबाको, बटन और बोतान, ये सब पुर्तगाली भाषा से आए हैं, हिंदी और जापानी दोनों में।',
 vocab:[['コーヒー','koohii','कोही','coffee','कॉफ़ी'],['テレビ','terebi','तेरेबि','TV','टीवी'],['バス','basu','बासु','bus','बस'],['カレー','karee','कारे','curry','करी'],['パン','pan','पान','bread','पाव / ब्रेड'],['タバコ','tabako','ताबाको','tobacco','तंबाकू'],['ボタン','botan','बोतान','button','बटन'],['インド','indo','इंदो','India','भारत']],
 read:[['コーヒー','koohii','कोही','coffee — कॉफ़ी'],['テレビ','terebi','तेरेबि','TV — टीवी'],['カレーパン','karee pan','कारे पान','curry bread — करी पाव'],['インド','indo','इंदो','India — भारत'],['ボタン','botan','बोतान','button — बटन']],
 write:'ガギグゲゴザジズゼゾダデドバビブベボパピプペポ'},

/* ================= WEEK 3: SENTENCES ================= */
{d:15, title:'Introduce yourself', kind:'vocab',
 lesson:`
<h3>The magic pattern: A は B です</h3>
<p><span class="jp">わたし は プリヤ です。</span> <i>watashi wa Puriya desu</i> = I am Priya.</p>
<div class="hi-box"><b class="h">🇮🇳 Japanese word order = Hindi word order!</b>
<div class="tbl"><table class="t"><tr><td class="jp">わたし</td><td class="jp">は</td><td class="jp">プリヤ</td><td class="jp">です</td></tr>
<tr><td class="hi">मैं</td><td class="hi">(तो)</td><td class="hi">प्रिया</td><td class="hi">हूँ</td></tr></table></div>
English puts “am” in the middle (I <b>am</b> Priya). Hindi and Japanese both put the verb at the <b>end</b> (<span class="hi">मैं प्रिया <b>हूँ</b></span>). <span class="jp">です</span> = <span class="hi">है / हूँ / हैं</span>. And <span class="jp">は</span> (read “wa”) marks the topic — like saying <span class="hi">“मैं तो…”</span>.</div>
<h3>Self-introduction script</h3>
<div class="tbl"><table class="t">
<tr><td class="jp">はじめまして。</td><td>hajimemashite</td><td class="hi">पहली बार मिलकर खुशी हुई।</td></tr>
<tr><td class="jp">わたしは ___ です。</td><td>watashi wa ___ desu</td><td class="hi">मैं ___ हूँ।</td></tr>
<tr><td class="jp">インドじん です。</td><td>indojin desu</td><td class="hi">मैं भारतीय हूँ।</td></tr>
<tr><td class="jp">がくせい です。</td><td>gakusei desu</td><td class="hi">मैं छात्र/छात्रा हूँ।</td></tr>
<tr><td class="jp">よろしく おねがいします。</td><td>yoroshiku onegaishimasu</td><td class="hi">आपसे मिलकर अच्छा लगा (कृपा बनाए रखें)।</td></tr></table></div>
<div class="tip"><b>💡 ~じん (jin) = nationality</b>, like Hindi <span class="hi">~ई / ~वासी</span>: インド<b>じん</b> = भारत<b>ीय</b>, にほん<b>じん</b> = जापानी व्यक्ति.<br>
<b>Tip:</b> Japanese often drop <span class="jp">わたしは</span> when it’s obvious — just like Hindi drops “मैं” in <span class="hi">“भारतीय हूँ”</span>.</div>`,
 hi:'आज अपना परिचय देना सीखेंगे। वाताशि वा प्रिया देस मतलब मैं प्रिया हूँ। जापानी में भी हिंदी की तरह क्रिया वाक्य के अंत में आती है। देस का मतलब है हूँ या है।',
 vocab:[['はじめまして','hajimemashite','हाजिमेमाशिते','Nice to meet you','पहली बार मिलकर खुशी हुई'],['わたし','watashi','वाताशि','I','मैं'],['です','desu','देस्','am / is / are','हूँ / है'],['インドじん','indojin','इंदोजिन','Indian (person)','भारतीय'],['がくせい','gakusei','गाकुसे','student','छात्र'],['かいしゃいん','kaishain','काइशाइन','company employee','कर्मचारी'],['よろしく おねがいします','yoroshiku onegaishimasu','योरोशिकु ओनेगाइशिमास','Pleased to meet you','कृपा बनाए रखें'],['おなまえは？','onamae wa?','ओनामाए वा?','Your name?','आपका नाम?']],
 read:[['はじめまして。','hajimemashite.','हाजिमेमाशिते','Nice to meet you. — पहली बार मिलकर खुशी हुई।'],['わたしは プリヤ です。','watashi wa Puriya desu.','वाताशि वा पुरिया देस्','I am Priya. — मैं प्रिया हूँ।'],['インドじん です。','indojin desu.','इंदोजिन देस्','I am Indian. — मैं भारतीय हूँ।'],['がくせい です。','gakusei desu.','गाकुसे देस्','I am a student. — मैं छात्रा हूँ।'],['よろしく おねがいします。','yoroshiku onegaishimasu.','योरोशिकु ओनेगाइशिमास','Pleased to meet you.']],
 speak:[['はじめまして','hajimemashite','हाजिमेमाशिते','Nice to meet you'],['わたしは インドじん です','watashi wa indojin desu','वाताशि वा इंदोजिन देस्','I am Indian'],['がくせい です','gakusei desu','गाकुसे देस्','I am a student'],['よろしく おねがいします','yoroshiku onegaishimasu','योरोशिकु ओनेगाइशिमास','Pleased to meet you']],
 speakAlt:{'わたしは インドじん です':['私はインド人です','わたしはインド人です'],'がくせい です':['学生です'],'よろしく おねがいします':['よろしくお願いします'],'はじめまして':['初めまして']},
 write:['わたし','です','インド','がくせい']},

{d:16, title:'Numbers 0–10', kind:'vocab',
 lesson:`
<p>Japanese numbers come from Chinese and are short and simple.</p>
<div class="tbl"><table class="t"><tr><th>#</th><th>Japanese</th><th>Romaji</th><th class="hi">उच्चारण</th><th>Memory hook (हिंदी)</th></tr>
<tr><td>0</td><td class="jp">ゼロ / れい</td><td>zero / rei</td><td class="hi">ज़ेरो / रे</td><td>Same as English</td></tr>
<tr><td>1</td><td class="jp">いち</td><td>ichi</td><td class="hi">इचि</td><td class="hi">“एक इच्छा” — one wish</td></tr>
<tr><td>2</td><td class="jp">に</td><td>ni</td><td class="hi">नि</td><td class="hi">दो “knee” (घुटने)</td></tr>
<tr><td>3</td><td class="jp">さん</td><td>san</td><td class="hi">सान</td><td class="hi">तीन “संत”</td></tr>
<tr><td>4</td><td class="jp">よん / し</td><td>yon / shi</td><td class="hi">योन / शि</td><td class="hi">चार पैरों वाला “योद्धा” घोड़ा</td></tr>
<tr><td>5</td><td class="jp">ご</td><td>go</td><td class="hi">गो</td><td class="hi">पाँच उंगलियाँ — “Go!”</td></tr>
<tr><td>6</td><td class="jp">ろく</td><td>roku</td><td class="hi">रोकु</td><td class="hi">छह बजे “रुको”</td></tr>
<tr><td>7</td><td class="jp">なな / しち</td><td>nana / shichi</td><td class="hi">नाना / शिचि</td><td class="hi">सात फेरे — “नाना” जी</td></tr>
<tr><td>8</td><td class="jp">はち</td><td>hachi</td><td class="hi">हाचि</td><td class="hi">आठ पैरों वाला “हाथी”? 🐙 (octopus!)</td></tr>
<tr><td>9</td><td class="jp">きゅう</td><td>kyuu</td><td class="hi">क्यू</td><td class="hi">नौ — “क्यूँ?”</td></tr>
<tr><td>10</td><td class="jp">じゅう</td><td>juu</td><td class="hi">जू</td><td class="hi">दस जानवर “ज़ू” में</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Why two words for 4, 7 and 9?</b>
<span class="jp">し</span> (4) sounds like the word for death, and <span class="jp">く</span> (9) sounds like “suffering”. So people prefer <span class="jp">よん, なな, きゅう</span> — similar to how some Indian buildings skip unlucky numbers or people avoid certain dates (<span class="hi">अशुभ</span>). Hospitals in Japan often skip room 4!</div>`,
 hi:'आज गिनती सीखेंगे: इचि, नि, सान, योन, गो, रोकु, नाना, हाचि, क्यू, जू। चार का शि मृत्यु जैसा सुनाई देता है, इसलिए लोग योन बोलना पसंद करते हैं।',
 vocab:[['いち','ichi','इचि','one (1)','एक'],['に','ni','नि','two (2)','दो'],['さん','san','सान','three (3)','तीन'],['よん','yon','योन','four (4)','चार'],['ご','go','गो','five (5)','पाँच'],['ろく','roku','रोकु','six (6)','छह'],['なな','nana','नाना','seven (7)','सात'],['はち','hachi','हाचि','eight (8)','आठ'],['きゅう','kyuu','क्यू','nine (9)','नौ'],['じゅう','juu','जू','ten (10)','दस']],
 read:[['いち、に、さん','ichi, ni, san','इचि, नि, सान','1, 2, 3 — एक, दो, तीन'],['よん、ご、ろく','yon, go, roku','योन, गो, रोकु','4, 5, 6'],['なな、はち、きゅう、じゅう','nana, hachi, kyuu, juu','नाना, हाचि, क्यू, जू','7, 8, 9, 10']],
 speakAlt:{'いち':['1','一'],'に':['2','二'],'さん':['3','三'],'よん':['4','四'],'ご':['5','五'],'ろく':['6','六'],'なな':['7','七'],'はち':['8','八'],'きゅう':['9','九'],'じゅう':['10','十']},
 write:['いち','に','さん','よん','ご']},

{d:17, title:'Numbers 11–10,000', kind:'vocab',
 lesson:`
<p>Good news: Japanese numbers are <b>pure logic</b>.</p>
<div class="hi-box"><b class="h">🇮🇳 Easier than Hindi!</b>
In Hindi every number from 1–100 has its own name: <span class="hi">ग्यारह, बारह … इक्यावन, बावन, नवासी</span> — you had to memorise 100 words! Japanese just builds them:
<ul><li>11 = 10 + 1 = <span class="jp">じゅう いち</span> juu-ichi</li>
<li>20 = 2 × 10 = <span class="jp">に じゅう</span> ni-juu</li>
<li>35 = 3 × 10 + 5 = <span class="jp">さんじゅう ご</span> san-juu-go</li>
<li>99 = <span class="jp">きゅうじゅう きゅう</span> kyuu-juu-kyuu</li></ul></div>
<div class="tbl"><table class="t"><tr><th>Number</th><th>Japanese</th><th>Romaji</th></tr>
<tr><td>100</td><td class="jp">ひゃく</td><td>hyaku</td></tr>
<tr><td>1,000</td><td class="jp">せん</td><td>sen</td></tr>
<tr><td>10,000</td><td class="jp">まん</td><td>man</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Lakh & crore vs man!</b>
English groups numbers by thousands (million). India groups by <span class="hi">लाख, करोड़</span>. Japan groups by <b>10,000</b> (<span class="jp">まん</span>)! So 1,00,000 (एक लाख) = <span class="jp">じゅうまん</span> (10 man). Indians already know that “other” number systems exist — you’ll adapt fast.</div>
<div class="tip"><b>Age:</b> add <span class="jp">さい</span> (sai, years old): <span class="jp">にじゅうご さい です</span> = <span class="hi">मैं 25 साल का/की हूँ</span>.</div>`,
 hi:'जापानी गिनती बहुत आसान है। ग्यारह मतलब दस और एक, जू इचि। बीस मतलब दो दस, नि जू। सौ है ह्याकु, हज़ार है सेन, और दस हज़ार है मान।',
 vocab:[['じゅういち','juuichi','जूइचि','eleven (11)','ग्यारह'],['にじゅう','nijuu','निजू','twenty (20)','बीस'],['さんじゅうご','sanjuugo','सानजूगो','thirty-five (35)','पैंतीस'],['ひゃく','hyaku','ह्याकु','hundred (100)','सौ'],['せん','sen','सेन','thousand (1000)','हज़ार'],['まん','man','मान','ten thousand','दस हज़ार'],['〜さい','~sai','साइ','~ years old','~ साल']],
 read:[['じゅういち','juuichi','जूइचि','11 (10+1)'],['にじゅう','nijuu','निजू','20 (2×10)'],['にじゅうご さい です。','nijuugo sai desu.','निजूगो साइ देस्','I am 25 years old. — मैं 25 साल का हूँ।'],['ひゃく、せん、まん','hyaku, sen, man','ह्याकु, सेन, मान','100, 1000, 10000']],
 speakAlt:{'じゅういち':['11','十一'],'にじゅう':['20','二十'],'さんじゅうご':['35','三十五'],'ひゃく':['100','百'],'せん':['1000','千'],'まん':['万','10000']},
 write:['じゅう','ひゃく','せん','まん']},

{d:18, title:'Sentence order & particles', kind:'vocab',
 lesson:`
<h3>The biggest Hindi superpower: SOV order</h3>
<div class="hi-box"><b class="h">🇮🇳 Japanese grammar is almost a mirror of Hindi</b>
<div class="tbl"><table class="t">
<tr><td class="jp">わたしは</td><td class="jp">りんごを</td><td class="jp">たべます。</td></tr>
<tr><td class="hi">मैं (तो)</td><td class="hi">सेब (को)</td><td class="hi">खाता हूँ।</td></tr>
<tr><td>Subject</td><td>Object</td><td>Verb</td></tr></table></div>
English: “I <b>eat</b> an apple” (S-V-O). Hindi &amp; Japanese: S-O-<b>V</b>. You can translate word by word!</div>
<h3>Particles = Hindi postpositions (परसर्ग)</h3>
<p>Hindi has <span class="hi">ने, को, में, से, का</span> <b>after</b> nouns. Japanese has <b>particles</b> that also come after nouns:</p>
<div class="tbl"><table class="t"><tr><th>Particle</th><th>Job</th><th class="hi">हिंदी जैसा</th><th>Example</th></tr>
<tr><td class="jp">は (wa)</td><td>topic</td><td class="hi">तो / (ने)</td><td class="jp">わたしは…</td></tr>
<tr><td class="jp">を (o)</td><td>object</td><td class="hi">को</td><td class="jp">みずを のみます</td></tr>
<tr><td class="jp">に (ni)</td><td>to / at (time)</td><td class="hi">को / में / पर</td><td class="jp">がっこうに いきます</td></tr>
<tr><td class="jp">で (de)</td><td>at (action) / by</td><td class="hi">में / से</td><td class="jp">バスで いきます</td></tr>
<tr><td class="jp">の (no)</td><td>possession</td><td class="hi">का / की / के</td><td class="jp">わたしの ほん</td></tr>
<tr><td class="jp">と (to)</td><td>and / with</td><td class="hi">और / के साथ</td><td class="jp">ともだちと</td></tr>
<tr><td class="jp">も (mo)</td><td>also</td><td class="hi">भी</td><td class="jp">わたしも</td></tr></table></div>
<div class="tip"><b>💡 の is even easier than का/की/के:</b> Hindi changes it by gender (<span class="hi">मेरा भाई, मेरी बहन</span>). Japanese never changes: <span class="jp">わたしの</span> for everything!</div>`,
 hi:'जापानी वाक्य की बनावट हिंदी जैसी है: कर्ता, कर्म, क्रिया। वाताशि वा रिंगो ओ ताबेमास, मतलब मैं सेब खाता हूँ। ओ का मतलब को, नो का मतलब का की के, मो का मतलब भी।',
 vocab:[['を','o','ओ','object marker','को'],['に','ni','नि','to / at','को / में'],['で','de','दे','at / by means of','में / से'],['の','no','नो','of (\'s)','का / की / के'],['と','to','तो','and / with','और / के साथ'],['も','mo','मो','also','भी'],['たべます','tabemasu','ताबेमास','eat','खाना'],['のみます','nomimasu','नोमिमास','drink','पीना'],['いきます','ikimasu','इकिमास','go','जाना']],
 read:[['わたしは りんごを たべます。','watashi wa ringo o tabemasu.','वाताशि वा रिंगो ओ ताबेमास','I eat an apple. — मैं सेब खाता हूँ।'],['わたしは みずを のみます。','watashi wa mizu o nomimasu.','वाताशि वा मिज़ु ओ नोमिमास','I drink water. — मैं पानी पीता हूँ।'],['わたしは がっこうに いきます。','watashi wa gakkou ni ikimasu.','वाताशि वा गक्को नि इकिमास','I go to school. — मैं स्कूल जाता हूँ।'],['バスで いきます。','basu de ikimasu.','बासु दे इकिमास','I go by bus. — बस से जाता हूँ।'],['わたしも いきます。','watashi mo ikimasu.','वाताशि मो इकिमास','I also go. — मैं भी जाता हूँ।'],['ともだちの ほん','tomodachi no hon','तोमोदाचि नो होन','friend’s book — दोस्त की किताब']],
 speak:[['りんごを たべます','ringo o tabemasu','रिंगो ओ ताबेमास','I eat an apple'],['みずを のみます','mizu o nomimasu','मिज़ु ओ नोमिमास','I drink water'],['がっこうに いきます','gakkou ni ikimasu','गक्को नि इकिमास','I go to school'],['わたしも いきます','watashi mo ikimasu','वाताशि मो इकिमास','I also go']],
 speakAlt:{'りんごを たべます':['リンゴを食べます','りんごを食べます'],'みずを のみます':['水を飲みます'],'がっこうに いきます':['学校に行きます'],'わたしも いきます':['私も行きます']},
 write:['を','に','で','の','も']},

{d:19, title:'Questions: か, this & that', kind:'vocab',
 lesson:`
<h3>Make a question with か</h3>
<p>Add <span class="jp">か</span> (ka) at the end of a sentence and it becomes a question. That’s it!</p>
<div class="hi-box"><b class="h">🇮🇳 か = Hindi “क्या”</b>
Hindi: <span class="hi">आप भारतीय हैं।</span> → <span class="hi"><b>क्या</b> आप भारतीय हैं?</span><br>
Japanese: <span class="jp">インドじん です。</span> → <span class="jp">インドじん です<b>か</b>？</span><br>
Hindi puts “क्या” at the start; Japanese puts “か” at the end. Same idea — a spoken question mark.</div>
<h3>こ・そ・あ・ど — the “यह/वह/कौन” system</h3>
<div class="hi-box"><b class="h">🇮🇳 Exactly like य-/व-/क- words in Hindi!</b>
Hindi has a pattern: <span class="hi">यहाँ / वहाँ / कहाँ</span>, <span class="hi">इधर / उधर / किधर</span>. Japanese has a 4-part pattern:
<div class="tbl"><table class="t"><tr><th></th><th>こ (near me)</th><th>そ (near you)</th><th>あ (far)</th><th>ど (which?)</th></tr>
<tr><td>thing</td><td class="jp">これ<br><span class="hi">यह</span></td><td class="jp">それ<br><span class="hi">वह (आपके पास)</span></td><td class="jp">あれ<br><span class="hi">वह (दूर)</span></td><td class="jp">どれ<br><span class="hi">कौन-सा</span></td></tr>
<tr><td>place</td><td class="jp">ここ<br><span class="hi">यहाँ</span></td><td class="jp">そこ<br><span class="hi">वहाँ</span></td><td class="jp">あそこ<br><span class="hi">वहाँ (दूर)</span></td><td class="jp">どこ<br><span class="hi">कहाँ</span></td></tr></table></div></div>
<h3>Question words</h3>
<p><span class="jp">なに/なん</span> = <span class="hi">क्या</span>, <span class="jp">だれ</span> = <span class="hi">कौन</span>, <span class="jp">どこ</span> = <span class="hi">कहाँ</span>, <span class="jp">いつ</span> = <span class="hi">कब</span>, <span class="jp">いくら</span> = <span class="hi">कितने का</span>.</p>`,
 hi:'वाक्य के अंत में का लगाने से सवाल बन जाता है, जैसे हिंदी में क्या लगाते हैं। कोरे मतलब यह, सोरे मतलब वह, आरे मतलब वह दूर वाला, डोरे मतलब कौन सा। कोको यहाँ, डोको कहाँ।',
 vocab:[['これ','kore','कोरे','this','यह'],['それ','sore','सोरे','that (near you)','वह'],['あれ','are','आरे','that (far)','वह (दूर)'],['ここ','koko','कोको','here','यहाँ'],['どこ','doko','दोको','where','कहाँ'],['なん','nan','नान','what','क्या'],['だれ','dare','दारे','who','कौन'],['いつ','itsu','इत्सु','when','कब'],['トイレ','toire','तोइरे','toilet','शौचालय']],
 read:[['これは なん ですか。','kore wa nan desu ka.','कोरे वा नान देस् का','What is this? — यह क्या है?'],['それは ほん です。','sore wa hon desu.','सोरे वा होन देस्','That is a book. — वह किताब है।'],['トイレは どこ ですか。','toire wa doko desu ka.','तोइरे वा दोको देस् का','Where is the toilet? — शौचालय कहाँ है?'],['あそこ です。','asoko desu.','आसोको देस्','Over there. — वहाँ है।'],['あの ひとは だれ ですか。','ano hito wa dare desu ka.','आनो हितो वा दारे देस् का','Who is that person? — वह व्यक्ति कौन है?']],
 speak:[['これは なんですか','kore wa nan desu ka','कोरे वा नान देस् का','What is this?'],['トイレは どこですか','toire wa doko desu ka','तोइरे वा दोको देस् का','Where is the toilet?'],['インドじん ですか','indojin desu ka','इंदोजिन देस् का','Are you Indian?'],['あそこ です','asoko desu','आसोको देस्','Over there']],
 speakAlt:{'これは なんですか':['これは何ですか'],'トイレは どこですか':['トイレはどこですか'],'インドじん ですか':['インド人ですか'],'あそこ です':['あそこです']},
 write:['これ','それ','あれ','どこ','か']},

{d:20, title:'Verbs: ます & ません', kind:'vocab',
 lesson:`
<p>Polite Japanese verbs end in <span class="jp">〜ます</span> (masu, said “मास्”). To say “don’t”, change it to <span class="jp">〜ません</span> (masen).</p>
<div class="tbl"><table class="t"><tr><th>Do</th><th>Don’t</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">たべます</td><td class="jp">たべません</td><td class="hi">खाता हूँ / नहीं खाता</td></tr>
<tr><td class="jp">のみます</td><td class="jp">のみません</td><td class="hi">पीता हूँ / नहीं पीता</td></tr>
<tr><td class="jp">いきます</td><td class="jp">いきません</td><td class="hi">जाता हूँ / नहीं जाता</td></tr>
<tr><td class="jp">みます</td><td class="jp">みません</td><td class="hi">देखता हूँ / नहीं देखता</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Much easier than Hindi verbs!</b>
Hindi verbs change for gender and person: <span class="hi">मैं खाता हूँ, मैं खाती हूँ, वे खाते हैं, तुम खाते हो</span>… Japanese <b>never</b> changes for he/she/I/they: <span class="jp">たべます</span> works for everyone! Also “not” goes at the end inside the verb (<span class="jp">ません</span>), the way Hindi puts <span class="hi">नहीं</span> right before the verb.</div>
<div class="hi-box"><b class="h">🇮🇳 Vegetarian? Useful sentence!</b>
<span class="jp">にくを たべません。</span> niku o tabemasen = <span class="hi">मैं मांस नहीं खाता/खाती।</span><br>
<span class="jp">おさけを のみません。</span> osake o nomimasen = <span class="hi">मैं शराब नहीं पीता।</span></div>`,
 hi:'जापानी क्रियाएँ मास पर खत्म होती हैं। नहीं कहने के लिए मासेन लगाते हैं। ताबेमास मतलब खाता हूँ, ताबेमासेन मतलब नहीं खाता। हिंदी की तरह लिंग से क्रिया नहीं बदलती, इसलिए बहुत आसान है।',
 vocab:[['たべます','tabemasu','ताबेमास','eat','खाना'],['のみます','nomimasu','नोमिमास','drink','पीना'],['いきます','ikimasu','इकिमास','go','जाना'],['きます','kimasu','किमास','come','आना'],['みます','mimasu','मिमास','see / watch','देखना'],['ききます','kikimasu','किकिमास','listen','सुनना'],['はなします','hanashimasu','हानाशिमास','speak','बोलना'],['よみます','yomimasu','योमिमास','read','पढ़ना'],['かきます','kakimasu','काकिमास','write','लिखना'],['たべません','tabemasen','ताबेमासेन','don’t eat','नहीं खाना']],
 read:[['にくを たべません。','niku o tabemasen.','निकु ओ ताबेमासेन','I don’t eat meat. — मैं मांस नहीं खाता।'],['やさいを たべます。','yasai o tabemasu.','यासाइ ओ ताबेमास','I eat vegetables. — मैं सब्ज़ियाँ खाता हूँ।'],['テレビを みます。','terebi o mimasu.','तेरेबि ओ मिमास','I watch TV. — मैं टीवी देखता हूँ।'],['にほんごを はなします。','nihongo o hanashimasu.','निहोंगो ओ हानाशिमास','I speak Japanese. — मैं जापानी बोलता हूँ।']],
 speak:[['にくを たべません','niku o tabemasen','निकु ओ ताबेमासेन','I don’t eat meat'],['にほんごを はなします','nihongo o hanashimasu','निहोंगो ओ हानाशिमास','I speak Japanese'],['テレビを みます','terebi o mimasu','तेरेबि ओ मिमास','I watch TV'],['いきません','ikimasen','इकिमासेन','I won’t go']],
 speakAlt:{'にくを たべません':['肉を食べません'],'にほんごを はなします':['日本語を話します'],'テレビを みます':['テレビを見ます'],'いきません':['行きません']},
 write:['たべます','のみます','ません']},

{d:21, title:'Past tense & time words', kind:'vocab',
 lesson:`
<p>Past tense is one small swap:</p>
<div class="tbl"><table class="t"><tr><th></th><th>Present</th><th>Past</th><th class="hi">हिंदी</th></tr>
<tr><td>Positive</td><td class="jp">たべます</td><td class="jp">たべ<b>ました</b></td><td class="hi">खाया</td></tr>
<tr><td>Negative</td><td class="jp">たべません</td><td class="jp">たべ<b>ませんでした</b></td><td class="hi">नहीं खाया</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Hindi’s “कल” problem — solved!</b>
Hindi uses <span class="hi">कल</span> for both yesterday and tomorrow (we guess from the verb). Japanese has separate words:
<span class="jp">きのう</span> kinou = <span class="hi">कल (बीता हुआ)</span>, <span class="jp">きょう</span> kyou = <span class="hi">आज</span>, <span class="jp">あした</span> ashita = <span class="hi">कल (आने वाला)</span>.</div>
<div class="hi-box"><b class="h">🇮🇳 Same trick as Hindi “था”</b>
Hindi adds <span class="hi">था</span> for past: <span class="hi">है → था</span>. Japanese: <span class="jp">です → でした</span>. <span class="jp">いい てんき でした</span> = <span class="hi">मौसम अच्छा था</span>.</div>`,
 hi:'भूतकाल के लिए मास को माशिता बना दें। ताबेमाशिता मतलब खाया। हिंदी में कल दोनों के लिए होता है, पर जापानी में किनो मतलब बीता कल और आशिता मतलब आने वाला कल।',
 vocab:[['たべました','tabemashita','ताबेमाशिता','ate','खाया'],['いきました','ikimashita','इकिमाशिता','went','गया'],['みました','mimashita','मिमाशिता','saw / watched','देखा'],['たべませんでした','tabemasen deshita','ताबेमासेन देशिता','didn’t eat','नहीं खाया'],['きのう','kinou','किनो','yesterday','कल (बीता)'],['きょう','kyou','क्यो','today','आज'],['あした','ashita','आशिता','tomorrow','कल (आने वाला)'],['でした','deshita','देशिता','was','था']],
 read:[['きのう えいがを みました。','kinou eiga o mimashita.','किनो एगा ओ मिमाशिता','Yesterday I watched a movie. — कल मैंने फ़िल्म देखी।'],['きょう がっこうに いきます。','kyou gakkou ni ikimasu.','क्यो गक्को नि इकिमास','Today I go to school. — आज मैं स्कूल जाता हूँ।'],['あした とうきょうに いきます。','ashita toukyou ni ikimasu.','आशिता तोक्यो नि इकिमास','Tomorrow I go to Tokyo. — कल मैं टोक्यो जाऊँगा।'],['あさごはんを たべませんでした。','asagohan o tabemasen deshita.','आसागोहान ओ ताबेमासेन देशिता','I didn’t eat breakfast. — नाश्ता नहीं किया।']],
 speak:[['きのう いきました','kinou ikimashita','किनो इकिमाशिता','I went yesterday'],['あした いきます','ashita ikimasu','आशिता इकिमास','I will go tomorrow'],['たべました','tabemashita','ताबेमाशिता','I ate'],['いい てんき でした','ii tenki deshita','ई तेनकि देशिता','The weather was nice']],
 speakAlt:{'きのう いきました':['昨日行きました'],'あした いきます':['明日行きます'],'たべました':['食べました'],'いい てんき でした':['いい天気でした']},
 write:['きのう','きょう','あした','ました']},

/* ================= WEEK 4: DAILY LIFE ================= */
{d:22, title:'Family & respect', kind:'vocab',
 lesson:`
<div class="hi-box"><b class="h">🇮🇳 〜さん = 〜जी</b>
Add <span class="jp">さん</span> after names to be polite: <span class="jp">たなかさん</span> = <span class="hi">तनाका जी</span>. Just like in Hindi, <b>never</b> add it to your own name (you don’t introduce yourself as “शर्मा जी”!).</div>
<h3>Two words for every family member</h3>
<p>Japanese uses a <b>humble</b> word for <i>your own</i> family and a <b>respectful</b> word for <i>someone else’s</i>.</p>
<div class="tbl"><table class="t"><tr><th>English</th><th>My (humble)</th><th>Your (respectful)</th><th class="hi">हिंदी</th></tr>
<tr><td>father</td><td class="jp">ちち</td><td class="jp">おとうさん</td><td class="hi">पिता / पिताजी</td></tr>
<tr><td>mother</td><td class="jp">はは</td><td class="jp">おかあさん</td><td class="hi">माँ / माताजी</td></tr>
<tr><td>elder brother</td><td class="jp">あに</td><td class="jp">おにいさん</td><td class="hi">भैया</td></tr>
<tr><td>elder sister</td><td class="jp">あね</td><td class="jp">おねえさん</td><td class="hi">दीदी</td></tr>
<tr><td>younger brother</td><td class="jp">おとうと</td><td class="jp">おとうとさん</td><td class="hi">छोटा भाई</td></tr>
<tr><td>younger sister</td><td class="jp">いもうと</td><td class="jp">いもうとさん</td><td class="hi">छोटी बहन</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Elder vs younger — Indians get this instantly</b>
English has just “brother”. Hindi separates <span class="hi">भैया</span> (elder) from <span class="hi">छोटा भाई</span>; Japanese too! And just as we say <span class="hi">“आपके पिताजी”</span> but <span class="hi">“मेरे पापा”</span>, Japanese says <span class="jp">おとうさん</span> for yours and <span class="jp">ちち</span> for mine. Grandparents: <span class="jp">おじいさん</span> (<span class="hi">दादा/नाना</span>), <span class="jp">おばあさん</span> (<span class="hi">दादी/नानी</span>).</div>`,
 hi:'सान लगाना हिंदी के जी जैसा है, जैसे तनाका सान मतलब तनाका जी। जापानी में भी भैया और छोटा भाई के लिए अलग शब्द हैं। अपने परिवार के लिए विनम्र शब्द, और दूसरों के लिए आदर वाले शब्द।',
 vocab:[['かぞく','kazoku','काज़ोकु','family','परिवार'],['ちち','chichi','चिचि','(my) father','मेरे पिता'],['はは','haha','हाहा','(my) mother','मेरी माँ'],['おとうさん','otousan','ओतोसान','(your) father','आपके पिताजी'],['おかあさん','okaasan','ओकासान','(your) mother','आपकी माताजी'],['おにいさん','oniisan','ओनीसान','elder brother','भैया'],['おねえさん','oneesan','ओनेसान','elder sister','दीदी'],['おとうと','otouto','ओतोतो','younger brother','छोटा भाई'],['いもうと','imouto','इमोतो','younger sister','छोटी बहन']],
 read:[['わたしの かぞくは よにん です。','watashi no kazoku wa yonin desu.','वाताशि नो काज़ोकु वा योनिन देस्','My family has 4 people. — मेरे परिवार में चार लोग हैं।'],['ちちと ははと あねが います。','chichi to haha to ane ga imasu.','चिचि तो हाहा तो आने गा इमास','I have a father, mother and elder sister. — पिता, माँ और दीदी हैं।'],['たなかさんの おかあさんは せんせい です。','Tanaka-san no okaasan wa sensei desu.','तानाका सान नो ओकासान वा सेन्से देस्','Tanaka-ji’s mother is a teacher.']],
 speak:[['わたしの かぞく','watashi no kazoku','वाताशि नो काज़ोकु','my family'],['おかあさん','okaasan','ओकासान','mother'],['おにいさん','oniisan','ओनीसान','elder brother'],['たなかさん','Tanaka-san','तानाका सान','Mr/Ms Tanaka']],
 speakAlt:{'わたしの かぞく':['私の家族'],'おかあさん':['お母さん'],'おにいさん':['お兄さん'],'たなかさん':['田中さん']},
 write:['ちち','はは','かぞく','さん']},

{d:23, title:'Food & restaurant', kind:'vocab',
 lesson:`
<h3>The most useful word: ください (kudasai)</h3>
<p><span class="jp">〜を ください</span> = “Please give me ~”.</p>
<div class="hi-box"><b class="h">🇮🇳 ください = “दीजिए”</b>
<span class="jp">みずを ください。</span> = <span class="hi">पानी दीजिए।</span> Same order: <span class="hi">पानी</span> (<span class="jp">みず</span>) + को (<span class="jp">を</span>) + <span class="hi">दीजिए</span> (<span class="jp">ください</span>).</div>
<div class="hi-box"><b class="h">🍵 चाय = ちゃ</b>
Both Hindi <span class="hi">चाय</span> and Japanese <span class="jp">おちゃ</span> come from the Chinese word “cha”. <span class="jp">お</span> in front just makes it polite — like saying <span class="hi">“चाय जी”</span>. 😄</div>
<div class="hi-box"><b class="h">🙏 Meal manners</b>
Before eating: <span class="jp">いただきます</span> (I humbly receive) — like saying a small <span class="hi">प्रार्थना / धन्यवाद</span> before <span class="hi">भोजन</span>. After eating: <span class="jp">ごちそうさまでした</span> (thank you for the feast).</div>
<div class="tip"><b>For vegetarians:</b> <span class="jp">ベジタリアン です。</span> (bejitarian desu = मैं शाकाहारी हूँ) and <span class="jp">にくと さかなを たべません。</span> (I don’t eat meat and fish).</div>`,
 hi:'आज खाने के शब्द। कुदासाइ मतलब दीजिए। मिज़ु ओ कुदासाइ मतलब पानी दीजिए। ओचा मतलब चाय। खाने से पहले इतादाकिमास, और बाद में गोचिसोसामा देशिता बोलते हैं।',
 vocab:[['ください','kudasai','कुदासाइ','please give','दीजिए'],['みず','mizu','मिज़ु','water','पानी'],['ごはん','gohan','गोहान','rice / meal','चावल / खाना'],['やさい','yasai','यासाइ','vegetables','सब्ज़ियाँ'],['たまご','tamago','तामागो','egg','अंडा'],['おいしい','oishii','ओइशी','delicious','स्वादिष्ट'],['からい','karai','काराइ','spicy','तीखा'],['ベジタリアン','bejitarian','बेजितारियान','vegetarian','शाकाहारी'],['ごちそうさまでした','gochisousama deshita','गोचिसोसामा देशिता','thanks for the meal','भोजन के लिए धन्यवाद']],
 read:[['すみません、メニューを ください。','sumimasen, menyuu o kudasai.','सुमिमासेन, मेन्यू ओ कुदासाइ','Excuse me, the menu please. — मेन्यू दीजिए।'],['みずを ください。','mizu o kudasai.','मिज़ु ओ कुदासाइ','Water please. — पानी दीजिए।'],['わたしは ベジタリアン です。','watashi wa bejitarian desu.','वाताशि वा बेजितारियान देस्','I am vegetarian. — मैं शाकाहारी हूँ।'],['この カレーは からい ですか。','kono karee wa karai desu ka.','कोनो कारे वा काराइ देस् का','Is this curry spicy? — क्या यह करी तीखी है?'],['とても おいしい です！','totemo oishii desu!','तोतेमो ओइशी देस्','Very delicious! — बहुत स्वादिष्ट!']],
 speak:[['みずを ください','mizu o kudasai','मिज़ु ओ कुदासाइ','Water please'],['ベジタリアン です','bejitarian desu','बेजितारियान देस्','I am vegetarian'],['おいしい です','oishii desu','ओइशी देस्','It is delicious'],['いただきます','itadakimasu','इतादाकिमास','(before eating)']],
 speakAlt:{'みずを ください':['水をください','水を下さい'],'おいしい です':['美味しいです','おいしいです'],'ベジタリアン です':['ベジタリアンです']},
 write:['みず','ください','おちゃ']},

{d:24, title:'Time & days of the week', kind:'vocab',
 lesson:`
<h3>What time is it?</h3>
<p><span class="jp">いま なんじ ですか。</span> ima nanji desu ka = <span class="hi">अभी कितने बजे हैं?</span><br>
Answer: number + <span class="jp">じ</span> (ji) = <span class="hi">बजे</span>. <span class="jp">さんじ です</span> = <span class="hi">तीन बजे हैं</span>. Half past: <span class="jp">はん</span> (= <span class="hi">साढ़े</span>): <span class="jp">さんじ はん</span> = <span class="hi">साढ़े तीन</span>.</p>
<div class="warn">Irregular: 4 o’clock = <span class="jp">よじ</span> (yoji), 7 = <span class="jp">しちじ</span>, 9 = <span class="jp">くじ</span>.</div>
<h3>🤯 The days of the week are the SAME as Hindi!</h3>
<div class="hi-box"><b class="h">🇮🇳 Both are named after the same planets</b>
Japanese weekdays use the <b>same 7 heavenly bodies</b> as our <span class="hi">सोम, मंगल, बुध…</span>:
<div class="tbl"><table class="t"><tr><th>Japanese</th><th>Element/planet</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">げつようび 月</td><td>Moon</td><td class="hi">सोमवार (सोम = चंद्र)</td></tr>
<tr><td class="jp">かようび 火</td><td>Fire → Mars</td><td class="hi">मंगलवार (मंगल)</td></tr>
<tr><td class="jp">すいようび 水</td><td>Water → Mercury</td><td class="hi">बुधवार (बुध)</td></tr>
<tr><td class="jp">もくようび 木</td><td>Wood → Jupiter</td><td class="hi">गुरुवार (बृहस्पति)</td></tr>
<tr><td class="jp">きんようび 金</td><td>Gold/metal → Venus</td><td class="hi">शुक्रवार (शुक्र)</td></tr>
<tr><td class="jp">どようび 土</td><td>Earth → Saturn</td><td class="hi">शनिवार (शनि)</td></tr>
<tr><td class="jp">にちようび 日</td><td>Sun</td><td class="hi">रविवार (रवि)</td></tr></table></div>
Learn Hindi’s planet → Japanese element, and you’ll never forget them!</div>`,
 hi:'इमा नान जि देस का मतलब अभी कितने बजे हैं। जि मतलब बजे, हान मतलब साढ़े। सबसे मज़ेदार बात, जापानी सप्ताह के दिन भी हमारी तरह ग्रहों पर हैं: गेत्सुयोबि सोमवार, कायोबि मंगलवार, निचियोबि रविवार।',
 vocab:[['いま','ima','इमा','now','अभी'],['なんじ','nanji','नानजि','what time','कितने बजे'],['〜じ','~ji','जि','~ o’clock','~ बजे'],['はん','han','हान','half past','साढ़े'],['げつようび','getsuyoubi','गेत्सुयोबि','Monday','सोमवार'],['かようび','kayoubi','कायोबि','Tuesday','मंगलवार'],['すいようび','suiyoubi','सुइयोबि','Wednesday','बुधवार'],['もくようび','mokuyoubi','मोकुयोबि','Thursday','गुरुवार'],['きんようび','kin\'youbi','किन्योबि','Friday','शुक्रवार'],['どようび','doyoubi','दोयोबि','Saturday','शनिवार'],['にちようび','nichiyoubi','निचियोबि','Sunday','रविवार']],
 read:[['いま なんじ ですか。','ima nanji desu ka.','इमा नानजि देस् का','What time is it now? — अभी कितने बजे हैं?'],['さんじ はん です。','sanji han desu.','सानजि हान देस्','It is 3:30. — साढ़े तीन बजे हैं।'],['きょうは げつようび です。','kyou wa getsuyoubi desu.','क्यो वा गेत्सुयोबि देस्','Today is Monday. — आज सोमवार है।'],['にちようびに やすみます。','nichiyoubi ni yasumimasu.','निचियोबि नि यासुमिमास','I rest on Sunday. — मैं रविवार को आराम करता हूँ।']],
 speak:[['いま なんじですか','ima nanji desu ka','इमा नानजि देस् का','What time is it?'],['さんじ はん です','sanji han desu','सानजि हान देस्','It’s 3:30'],['きょうは げつようび です','kyou wa getsuyoubi desu','क्यो वा गेत्सुयोबि देस्','Today is Monday'],['にちようび','nichiyoubi','निचियोबि','Sunday']],
 speakAlt:{'いま なんじですか':['今何時ですか'],'さんじ はん です':['3時半です','三時半です'],'きょうは げつようび です':['今日は月曜日です'],'にちようび':['日曜日']},
 write:['げつ','か','すい','もく','きん','ど','にち']},

{d:25, title:'Describing things (adjectives)', kind:'vocab',
 lesson:`
<p>Japanese adjectives come <b>before</b> the noun — same as Hindi: <span class="jp">おおきい いえ</span> = <span class="hi">बड़ा घर</span>.</p>
<div class="hi-box"><b class="h">🇮🇳 But no gender headache!</b>
Hindi: <span class="hi">बड़ा घर, बड़ी गाड़ी, बड़े लोग</span> — the adjective changes. Japanese: <span class="jp">おおきい</span> stays the same for everything! <span class="jp">とても</span> (totemo) = <span class="hi">बहुत</span>.</div>
<div class="tbl"><table class="t"><tr><th>Japanese</th><th>English</th><th class="hi">हिंदी</th><th>Opposite</th></tr>
<tr><td class="jp">おおきい</td><td>big</td><td class="hi">बड़ा</td><td class="jp">ちいさい (छोटा)</td></tr>
<tr><td class="jp">あつい</td><td>hot (weather)</td><td class="hi">गरम</td><td class="jp">さむい (ठंडा)</td></tr>
<tr><td class="jp">たかい</td><td>expensive / tall</td><td class="hi">महँगा / ऊँचा</td><td class="jp">やすい (सस्ता)</td></tr>
<tr><td class="jp">あたらしい</td><td>new</td><td class="hi">नया</td><td class="jp">ふるい (पुराना)</td></tr>
<tr><td class="jp">いい</td><td>good</td><td class="hi">अच्छा</td><td class="jp">わるい (बुरा)</td></tr></table></div>
<h3>“How are you?”</h3>
<p><span class="jp">おげんき ですか。</span> ogenki desu ka = <span class="hi">आप कैसे हैं?</span> → <span class="jp">はい、げんき です。</span> = <span class="hi">जी, ठीक हूँ।</span></p>
<div class="tip"><span class="jp">きれい</span> (kirei) = beautiful <i>and</i> clean — like <span class="hi">“सुंदर और साफ़”</span> in one word.</div>`,
 hi:'विशेषण संज्ञा से पहले आते हैं, जैसे हिंदी में बड़ा घर, ओओकी इए। पर जापानी में लिंग से विशेषण नहीं बदलता। तोतेमो मतलब बहुत। ओगेनकि देस का मतलब आप कैसे हैं।',
 vocab:[['おおきい','ookii','ओओकी','big','बड़ा'],['ちいさい','chiisai','चीसाइ','small','छोटा'],['あつい','atsui','आत्सुइ','hot','गरम'],['さむい','samui','सामुइ','cold','ठंडा'],['たかい','takai','ताकाइ','expensive / tall','महँगा / ऊँचा'],['やすい','yasui','यासुइ','cheap','सस्ता'],['きれい','kirei','किरे','beautiful / clean','सुंदर / साफ़'],['とても','totemo','तोतेमो','very','बहुत'],['げんき','genki','गेनकि','healthy / fine','स्वस्थ / ठीक']],
 read:[['おげんき ですか。','ogenki desu ka.','ओगेनकि देस् का','How are you? — आप कैसे हैं?'],['はい、げんき です。','hai, genki desu.','हाइ, गेनकि देस्','Yes, I’m fine. — जी, ठीक हूँ।'],['きょうは とても あつい です。','kyou wa totemo atsui desu.','क्यो वा तोतेमो आत्सुइ देस्','Today is very hot. — आज बहुत गर्मी है।'],['ふじさんは たかい です。','fujisan wa takai desu.','फुजिसान वा ताकाइ देस्','Mt. Fuji is tall. — फ़ूजी पर्वत ऊँचा है।'],['さくらは きれい です。','sakura wa kirei desu.','साकुरा वा किरे देस्','Cherry blossoms are beautiful.']],
 speak:[['おげんき ですか','ogenki desu ka','ओगेनकि देस् का','How are you?'],['げんき です','genki desu','गेनकि देस्','I’m fine'],['とても あつい です','totemo atsui desu','तोतेमो आत्सुइ देस्','It’s very hot'],['きれい です','kirei desu','किरे देस्','It’s beautiful']],
 speakAlt:{'おげんき ですか':['お元気ですか'],'げんき です':['元気です'],'とても あつい です':['とても暑いです','とても熱いです'],'きれい です':['綺麗です','きれいです']},
 write:['おおきい','ちいさい','いい']},

{d:26, title:'Where is it? (あります・います)', kind:'vocab',
 lesson:`
<p>Japanese has <b>two verbs for “there is”</b>:</p>
<ul><li><span class="jp">あります</span> — for <b>non-living</b> things (books, a station)</li>
<li><span class="jp">います</span> — for <b>living</b> things (people, cats)</li></ul>
<div class="hi-box"><b class="h">🇮🇳 Word-by-word identical to Hindi!</b>
<div class="tbl"><table class="t">
<tr><td class="jp">ねこは</td><td class="jp">つくえ</td><td class="jp">の</td><td class="jp">うえ</td><td class="jp">に</td><td class="jp">います</td></tr>
<tr><td class="hi">बिल्ली</td><td class="hi">मेज़</td><td class="hi">के</td><td class="hi">ऊपर</td><td class="hi">(पर)</td><td class="hi">है</td></tr></table></div>
“<span class="hi">मेज़ के ऊपर</span>” = <span class="jp">つくえの うえ</span> — the exact same order! English flips it (“on top of the desk”), but Hindi and Japanese don’t.</div>
<div class="tbl"><table class="t"><tr><th>Japanese</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">うえ</td><td class="hi">ऊपर</td></tr><tr><td class="jp">した</td><td class="hi">नीचे</td></tr>
<tr><td class="jp">なか</td><td class="hi">अंदर</td></tr><tr><td class="jp">まえ</td><td class="hi">सामने / आगे</td></tr>
<tr><td class="jp">うしろ</td><td class="hi">पीछे</td></tr><tr><td class="jp">となり</td><td class="hi">बगल में</td></tr></table></div>`,
 hi:'जापानी में है के लिए दो शब्द हैं: अरिमास निर्जीव चीज़ों के लिए और इमास जीवित प्राणियों के लिए। नेको वा त्सुकुए नो उए नि इमास, मतलब बिल्ली मेज़ के ऊपर है। शब्दों का क्रम बिल्कुल हिंदी जैसा है।',
 vocab:[['あります','arimasu','अरिमास','there is (things)','है (निर्जीव)'],['います','imasu','इमास','there is (living)','है (सजीव)'],['うえ','ue','उए','on / above','ऊपर'],['した','shita','शिता','under / below','नीचे'],['なか','naka','नाका','inside','अंदर'],['まえ','mae','माए','in front','सामने'],['うしろ','ushiro','उशिरो','behind','पीछे'],['となり','tonari','तोनारि','next to','बगल में'],['つくえ','tsukue','त्सुकुए','desk','मेज़']],
 read:[['ねこは つくえの うえに います。','neko wa tsukue no ue ni imasu.','नेको वा त्सुकुए नो उए नि इमास','The cat is on the desk. — बिल्ली मेज़ के ऊपर है।'],['ほんは かばんの なかに あります。','hon wa kaban no naka ni arimasu.','होन वा काबान नो नाका नि अरिमास','The book is in the bag. — किताब बैग के अंदर है।'],['えきの まえに ぎんこうが あります。','eki no mae ni ginkou ga arimasu.','एकि नो माए नि गिंको गा अरिमास','There’s a bank in front of the station.'],['いぬは いすの したに います。','inu wa isu no shita ni imasu.','इनु वा इसु नो शिता नि इमास','The dog is under the chair. — कुत्ता कुर्सी के नीचे है।']],
 speak:[['ねこが います','neko ga imasu','नेको गा इमास','There is a cat'],['ほんが あります','hon ga arimasu','होन गा अरिमास','There is a book'],['つくえの うえ','tsukue no ue','त्सुकुए नो उए','on the desk'],['えきの まえ','eki no mae','एकि नो माए','in front of the station']],
 speakAlt:{'ねこが います':['猫がいます'],'ほんが あります':['本があります'],'つくえの うえ':['机の上'],'えきの まえ':['駅の前']},
 write:['うえ','した','なか','まえ']},

{d:27, title:'Shopping', kind:'vocab',
 lesson:`
<h3>Key phrases</h3>
<div class="tbl"><table class="t">
<tr><td class="jp">いらっしゃいませ！</td><td>Welcome! (shop staff)</td><td class="hi">आइए, आइए!</td></tr>
<tr><td class="jp">これは いくら ですか。</td><td>How much is this?</td><td class="hi">यह कितने का है?</td></tr>
<tr><td class="jp">〜えん です。</td><td>It’s ~ yen.</td><td class="hi">~ येन है।</td></tr>
<tr><td class="jp">これを ください。</td><td>I’ll take this.</td><td class="hi">यह दे दीजिए।</td></tr>
<tr><td class="jp">カードで いいですか。</td><td>Is card OK?</td><td class="hi">कार्ड से चलेगा?</td></tr></table></div>
<div class="hi-box"><b class="h">🇮🇳 Shopkeeper’s “आइए जी!”</b>
Every Japanese shop greets you with <span class="jp">いらっしゃいませ</span> — like an Indian shopkeeper calling <span class="hi">“आइए, आइए, क्या चाहिए?”</span>. You don’t need to reply — a small nod is enough.</div>
<div class="hi-box"><b class="h">💴 No bargaining!</b>
Unlike our bazaars where <span class="hi">मोलभाव</span> is an art, prices in Japan are fixed. Saying <span class="jp">たかい ですね</span> (“expensive, huh”) is fine as small talk, but don’t ask for a discount. Also, there is <b>no tipping</b>.</div>
<div class="tip"><b>Money:</b> 100 yen = <span class="jp">ひゃくえん</span>, 1,000 yen = <span class="jp">せんえん</span>, 10,000 yen = <span class="jp">いちまんえん</span>.</div>`,
 hi:'खरीदारी के वाक्य: कोरे वा इकुरा देस का, मतलब यह कितने का है। कोरे ओ कुदासाइ, मतलब यह दे दीजिए। दुकानदार इरास्शाइमासे कहते हैं, जैसे हमारे यहाँ आइए आइए। जापान में मोलभाव नहीं होता।',
 vocab:[['いらっしゃいませ','irasshaimase','इरास्शाइमासे','Welcome (shop)','आइए आइए'],['いくら','ikura','इकुरा','how much','कितने का'],['〜えん','~en','एन','~ yen','~ येन'],['みせ','mise','मिसे','shop','दुकान'],['かいます','kaimasu','काइमास','buy','खरीदना'],['げんきん','genkin','गेनकिन','cash','नकद'],['カード','kaado','कादो','card','कार्ड'],['ふくろ','fukuro','फुकुरो','bag','थैला']],
 read:[['A: いらっしゃいませ！','A: irasshaimase!','इरास्शाइमासे','Welcome! — आइए!'],['B: これは いくら ですか。','B: kore wa ikura desu ka.','कोरे वा इकुरा देस् का','How much is this? — यह कितने का है?'],['A: さんびゃく えん です。','A: sanbyaku en desu.','सानब्याकु एन देस्','300 yen. — तीन सौ येन।'],['B: じゃあ、これを ください。','B: jaa, kore o kudasai.','जा, कोरे ओ कुदासाइ','Then I’ll take this. — तो यह दे दीजिए।'],['A: ありがとう ございます！','A: arigatou gozaimasu!','अरिगातो गोज़ाइमास','Thank you! — धन्यवाद!']],
 speak:[['これは いくら ですか','kore wa ikura desu ka','कोरे वा इकुरा देस् का','How much is this?'],['これを ください','kore o kudasai','कोरे ओ कुदासाइ','I’ll take this'],['カードで いいですか','kaado de ii desu ka','कादो दे ई देस् का','Is card OK?'],['ふくろは いりません','fukuro wa irimasen','फुकुरो वा इरिमासेन','I don’t need a bag']],
 speakAlt:{'これは いくら ですか':['これはいくらですか'],'これを ください':['これをください','これを下さい'],'カードで いいですか':['カードでいいですか'],'ふくろは いりません':['袋はいりません','袋は要りません']},
 write:['いくら','えん','ください']},

{d:28, title:'Directions & travel', kind:'vocab',
 lesson:`
<div class="hi-box"><b class="h">🇮🇳 から = से, まで = तक</b>
<span class="hi">दिल्ली <b>से</b> मुंबई <b>तक</b></span> = <span class="jp">デリー<b>から</b> ムンバイ<b>まで</b></span>. Same order, same logic. <span class="jp">うちから えきまで あるきます</span> = <span class="hi">घर से स्टेशन तक पैदल जाता हूँ</span>.</div>
<div class="tbl"><table class="t"><tr><th>Japanese</th><th>English</th><th class="hi">हिंदी</th></tr>
<tr><td class="jp">みぎ</td><td>right</td><td class="hi">दाएँ</td></tr>
<tr><td class="jp">ひだり</td><td>left</td><td class="hi">बाएँ</td></tr>
<tr><td class="jp">まっすぐ</td><td>straight</td><td class="hi">सीधे</td></tr>
<tr><td class="jp">ちかい / とおい</td><td>near / far</td><td class="hi">पास / दूर</td></tr>
<tr><td class="jp">えき</td><td>station</td><td class="hi">स्टेशन</td></tr>
<tr><td class="jp">でんしゃ</td><td>train</td><td class="hi">ट्रेन</td></tr>
<tr><td class="jp">ひこうき</td><td>airplane</td><td class="hi">हवाई जहाज़</td></tr></table></div>
<p><b>Ask for directions:</b> <span class="jp">すみません、えきは どこ ですか。</span> = <span class="hi">सुनिए, स्टेशन कहाँ है?</span><br>
<b>Answer:</b> <span class="jp">まっすぐ いって、みぎです。</span> = <span class="hi">सीधे जाकर दाएँ है।</span></p>
<div class="tip"><b>💡 〜て いって</b> (“go and then…”) works like Hindi <span class="hi">“जाकर”</span> — it joins two actions.</div>`,
 hi:'कारा मतलब से, और मादे मतलब तक। देरी कारा मुम्बाइ मादे, दिल्ली से मुंबई तक। मिगि दाएँ, हिदारि बाएँ, मास्सुगु सीधे। एकि वा दोको देस का, स्टेशन कहाँ है?',
 vocab:[['みぎ','migi','मिगि','right','दाएँ'],['ひだり','hidari','हिदारि','left','बाएँ'],['まっすぐ','massugu','मास्सुगु','straight','सीधे'],['ちかい','chikai','चिकाइ','near','पास'],['とおい','tooi','तोई','far','दूर'],['から','kara','कारा','from','से'],['まで','made','मादे','until / to','तक'],['ひこうき','hikouki','हिकोकि','airplane','हवाई जहाज़'],['でんしゃ','densha','देनशा','train','ट्रेन']],
 read:[['すみません、えきは どこ ですか。','sumimasen, eki wa doko desu ka.','सुमिमासेन, एकि वा दोको देस् का','Excuse me, where is the station? — स्टेशन कहाँ है?'],['まっすぐ いって、みぎ です。','massugu itte, migi desu.','मास्सुगु इत्ते, मिगि देस्','Go straight, it’s on the right. — सीधे जाकर दाएँ।'],['とおい ですか。','tooi desu ka.','तोई देस् का','Is it far? — क्या दूर है?'],['いいえ、ちかい です。','iie, chikai desu.','ईए, चिकाइ देस्','No, it’s near. — नहीं, पास है।'],['デリーから とうきょうまで ひこうきで いきます。','derii kara toukyou made hikouki de ikimasu.','देरी कारा तोक्यो मादे हिकोकि दे इकिमास','I go from Delhi to Tokyo by plane.']],
 speak:[['えきは どこですか','eki wa doko desu ka','एकि वा दोको देस् का','Where is the station?'],['みぎ です','migi desu','मिगि देस्','It’s on the right'],['まっすぐ','massugu','मास्सुगु','straight'],['とおい ですか','tooi desu ka','तोई देस् का','Is it far?']],
 speakAlt:{'えきは どこですか':['駅はどこですか'],'みぎ です':['右です'],'まっすぐ':['真っ直ぐ','まっすぐ'],'とおい ですか':['遠いですか']},
 write:['みぎ','ひだり','から','まで']},

/* ================= FINAL: KANJI + GRADUATION ================= */
{d:29, title:'Your first 10 kanji', kind:'kanji', chars:KANJI.map(x=>x[0]),
 lesson:`
<p><b>Kanji</b> are meaning-symbols. Each one shows an <i>idea</i>, not just a sound. Many began as pictures.</p>
<div class="hi-box"><b class="h">🇮🇳 You already use “kanji-like” symbols!</b>
<span class="hi">₹</span>, <span class="hi">ॐ</span>, <span class="hi">卐</span>, ✓, ♥, 🚫 — you read them as <i>meanings</i>, not letters. Kanji work the same way. Fun fact: the swastika <span class="hi">卐</span> also exists in Japanese as <span class="jp">卍</span> (manji) — it marks Buddhist temples on Japanese maps!</div>
<div class="hi-box"><b class="h">🇮🇳 Three scripts in one sentence — like Hinglish texting</b>
A Japanese sentence mixes kanji + hiragana + katakana: <span class="jp">私はインド人です。</span> Indians mix scripts too: “मैं office जा रहा हूँ, ETA 10 min”. You already read mixed text every day!</div>
<div class="tbl"><table class="t"><tr><th>Kanji</th><th>Picture</th><th>Meaning</th><th>Reading</th></tr>
<tr><td class="jp" style="font-size:1.5rem">一 二 三</td><td>lines</td><td>1, 2, 3</td><td>ichi, ni, san</td></tr>
<tr><td class="jp" style="font-size:1.5rem">人</td><td>a walking person</td><td>person (<span class="hi">व्यक्ति</span>)</td><td>hito / jin</td></tr>
<tr><td class="jp" style="font-size:1.5rem">日</td><td>the sun</td><td>sun, day (<span class="hi">सूरज, दिन</span>)</td><td>hi / nichi</td></tr>
<tr><td class="jp" style="font-size:1.5rem">月</td><td>crescent moon</td><td>moon, month (<span class="hi">चाँद, महीना</span>)</td><td>tsuki / getsu</td></tr>
<tr><td class="jp" style="font-size:1.5rem">山</td><td>three peaks</td><td>mountain (<span class="hi">पहाड़</span>)</td><td>yama / san</td></tr>
<tr><td class="jp" style="font-size:1.5rem">川</td><td>flowing water</td><td>river (<span class="hi">नदी</span>)</td><td>kawa</td></tr>
<tr><td class="jp" style="font-size:1.5rem">口</td><td>open mouth</td><td>mouth (<span class="hi">मुँह</span>)</td><td>kuchi</td></tr>
<tr><td class="jp" style="font-size:1.5rem">木</td><td>a tree</td><td>tree (<span class="hi">पेड़</span>)</td><td>ki</td></tr></table></div>
<div class="tip">Now you can read: <span class="jp">日本</span> (nihon = Japan, “sun’s origin” — <span class="hi">उगते सूरज का देश</span>!), <span class="jp">日本人</span> (Japanese person), <span class="jp">月曜日</span> (Monday) and <span class="jp">富士山</span> (Mt. Fuji — the last 山 is “san”).</div>`,
 hi:'कांजी अर्थ के चिन्ह हैं, जैसे रुपये का चिन्ह या ओम। इचि मतलब एक, हितो मतलब व्यक्ति, हि मतलब सूरज, यामा मतलब पहाड़। निहोन का अर्थ है उगते सूरज का देश।',
 vocab:[['日本','nihon','निहोन','Japan','जापान'],['日本人','nihonjin','निहोनजिन','Japanese person','जापानी व्यक्ति'],['人','hito','हितो','person','व्यक्ति'],['山','yama','यामा','mountain','पहाड़'],['川','kawa','कावा','river','नदी'],['月','tsuki','त्सुकि','moon','चाँद'],['木','ki','कि','tree','पेड़'],['口','kuchi','कुचि','mouth','मुँह']],
 read:[['日本','nihon','निहोन','Japan — sun-origin — जापान'],['インド人','indojin','इंदोजिन','Indian person — भारतीय'],['山と 川','yama to kawa','यामा तो कावा','mountain and river — पहाड़ और नदी'],['一、二、三','ichi, ni, san','इचि, नि, सान','1, 2, 3'],['月曜日','getsuyoubi','गेत्सुयोबि','Monday — सोमवार']],
 speakAlt:{'日本':['にほん','にっぽん'],'日本人':['にほんじん'],'人':['ひと'],'山':['やま'],'川':['かわ'],'月':['つき'],'木':['き'],'口':['くち']},
 write:'一二三人日月山川口木'},

{d:30, title:'Graduation conversation 🎓', kind:'final',
 lesson:`
<p><b>おめでとう！ (omedetou — बधाई हो!)</b> On the last day you combine everything into a real conversation. Read it aloud, then take the <b>final exam</b> (questions from all 30 days).</p>
<div class="hi-box"><b class="h">🇮🇳 What you learned in 30 days</b>
<ul><li>✅ 46 hiragana + 46 katakana + combo sounds (like Devanagari’s varnamala & संयुक्त अक्षर)</li>
<li>✅ 10 kanji (meaning-symbols like ₹ and ॐ)</li>
<li>✅ SOV grammar with particles — your Hindi परसर्ग superpower</li>
<li>✅ Greetings, numbers, time, family, food, shopping, directions</li></ul></div>
<h3>Conversation: Priya meets Tanaka</h3>
<p>Go to 📜 <b>Read</b> to see the full dialogue with audio. Then 🗣️ <b>Speak</b> Priya’s lines.</p>
<div class="tip"><b>What next?</b> 1) Repeat any day whose stars are below ⭐⭐⭐. 2) Print a full hiragana + katakana sheet each week. 3) Aim for <b>JLPT N5</b> — the beginner exam — in 3–6 months. <span class="hi">लगे रहो! がんばって！ (ganbatte)</span></div>`,
 hi:'बधाई हो! आज आखिरी दिन है। आज हम सब कुछ मिलाकर एक असली बातचीत करेंगे। फिर अंतिम परीक्षा देंगे। गानबात्ते, मतलब लगे रहो!',
 vocab:[],
 read:[['たなか: こんにちは。はじめまして。','Tanaka: konnichiwa. hajimemashite.','कोन्निचिवा। हाजिमेमाशिते।','Hello. Nice to meet you.'],['プリヤ: はじめまして。わたしは プリヤ です。','Puriya: hajimemashite. watashi wa Puriya desu.','हाजिमेमाशिते। वाताशि वा पुरिया देस्।','Nice to meet you. I am Priya.'],['たなか: おくには どちら ですか。','Tanaka: okuni wa dochira desu ka.','ओकुनि वा दोचिरा देस् का','Which country are you from? — आप किस देश से हैं?'],['プリヤ: インドの デリーから きました。','Puriya: indo no derii kara kimashita.','इंदो नो देरी कारा किमाशिता','I came from Delhi, India. — मैं भारत की दिल्ली से आई हूँ।'],['たなか: にほんごが じょうず ですね！','Tanaka: nihongo ga jouzu desu ne!','निहोंगो गा जोज़ु देस् ने','Your Japanese is good! — आपकी जापानी अच्छी है!'],['プリヤ: いいえ、まだまだ です。','Puriya: iie, madamada desu.','ईए, मादामादा देस्','No, not yet. — नहीं, अभी बहुत सीखना है।'],['たなか: カレーが すき ですか。','Tanaka: karee ga suki desu ka.','कारे गा सुकि देस् का','Do you like curry? — क्या आपको करी पसंद है?'],['プリヤ: はい、だいすき です！','Puriya: hai, daisuki desu!','हाइ, दाइसुकि देस्','Yes, I love it! — हाँ, बहुत पसंद है!'],['たなか: じゃあ、いっしょに たべましょう。','Tanaka: jaa, issho ni tabemashou.','जा, इश्शो नि ताबेमाशो','Then let’s eat together. — तो चलिए साथ खाते हैं।'],['プリヤ: ありがとう ございます！','Puriya: arigatou gozaimasu!','अरिगातो गोज़ाइमास','Thank you! — धन्यवाद!']],
 speak:[['はじめまして','hajimemashite','हाजिमेमाशिते','Nice to meet you'],['インドの デリーから きました','indo no derii kara kimashita','इंदो नो देरी कारा किमाशिता','I came from Delhi, India'],['いいえ、まだまだ です','iie, madamada desu','ईए, मादामादा देस्','No, not yet'],['はい、だいすき です','hai, daisuki desu','हाइ, दाइसुकि देस्','Yes, I love it'],['ありがとう ございます','arigatou gozaimasu','अरिगातो गोज़ाइमास','Thank you']],
 speakAlt:{'インドの デリーから きました':['インドのデリーから来ました'],'いいえ、まだまだ です':['いいえまだまだです'],'はい、だいすき です':['はい大好きです'],'ありがとう ございます':['ありがとうございます'],'はじめまして':['初めまして']},
 write:['ありがとう','にほんご','がんばって']},
];

const WEEKS = [
 {name:'Week 1 · Hiragana', tag:'ひらがな', hi:'पहला सप्ताह: हिरागाना', days:[1,7]},
 {name:'Week 2 · Combos & Katakana', tag:'カタカナ', hi:'दूसरा सप्ताह: कताकाना', days:[8,14]},
 {name:'Week 3 · Sentences', tag:'ぶんぽう', hi:'तीसरा सप्ताह: वाक्य', days:[15,21]},
 {name:'Week 4 · Daily life', tag:'せいかつ', hi:'चौथा सप्ताह: रोज़मर्रा', days:[22,28]},
 {name:'Graduation', tag:'そつぎょう', hi:'दीक्षांत', days:[29,30]},
];

const BADGES = [
 {id:'first', e:'🌱', n:'First Step', d:'Complete any lesson step'},
 {id:'day1', e:'🎌', n:'はじめまして', d:'Finish Day 1'},
 {id:'hira', e:'🌸', n:'Hiragana Hero', d:'Finish Day 9 (all hiragana)'},
 {id:'kata', e:'⚡', n:'Katakana Ninja', d:'Finish Day 14 (all katakana)'},
 {id:'half', e:'🗻', n:'Halfway to Fuji', d:'Finish 15 days'},
 {id:'grad', e:'🎓', n:'Graduate', d:'Finish all 30 days'},
 {id:'streak3', e:'🔥', n:'On Fire', d:'3-day streak'},
 {id:'streak7', e:'🏮', n:'Week Warrior', d:'7-day streak'},
 {id:'perfect', e:'💯', n:'Perfect Ear', d:'100% on a listening quiz'},
 {id:'speaker', e:'🗣️', n:'Speaker', d:'10 speaking attempts'},
 {id:'brush', e:'🖌️', n:'Calligrapher', d:'20 traced letters with ⭐⭐+'},
 {id:'xp1000', e:'💎', n:'1000 XP', d:'Earn 1,000 XP'},
];

const LEVELS = ['初心者 Beginner','見習い Apprentice','学生 Student','旅人 Traveller','侍 Samurai','忍者 Ninja','先生 Sensei','名人 Master'];
