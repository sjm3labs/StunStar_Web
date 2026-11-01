'use strict';

// Makes the game's web pages at this repository's root (since 2026-10-29; StunStar_Server/static_html for its first hour): the home page (/), the
// privacy policy (/privacy-policy/) from the game's own Data/PrivacyPolicy.xml in all its languages, how to delete an
// account (/delete-account/), the terms of service (/terms/, from tools/terms.txt), and app-ads.txt (with ads.txt beside it) for AdMob. Run again whenever the policy changes:
//
//   node tools/build-static.js [path to the Unity project]      (D:\Workspace\StunStar\StunStar_Unity where none is given)
//
// The pictures in assets/ were made once from the game's Art (scaled down for the web) and are not touched.

const fs = require('fs');
const path = require('path');

const unity = process.argv[2] || 'D:/Workspace/StunStar/StunStar_Unity';
const out = path.join(__dirname, '..');
const policyXml = fs.readFileSync(path.join(unity, 'Assets/_Project/Data/PrivacyPolicy.xml'), 'utf8');

const DEVELOPER = 'suseong kim';
const CONTACT = 'stunstar@sjm3labs.com';
const PUBLISHER = 'pub-2075600345013086';
const PLAY = 'https://play.google.com/store/apps/details?id=com.sjm3labs.stunstar';
const APP_STORE = 'https://apps.apple.com/app/id6826731312';

const LANGS = [
  ['ko', '한국어'], ['en', 'English'], ['ja', '日本語'], ['zh', '中文'], ['es', 'Español'],
  ['hi', 'हिन्दी'], ['fr', 'Français'], ['ru', 'Русский'], ['de', 'Deutsch'], ['pt', 'Português'],
];
const CHARACTERS = [
  ['human', '휴먼', 'Human'], ['robot', '로봇', 'Robot'], ['elf', '엘프', 'Elf'], ['monk', '수도승', 'Monk'],
  ['alien', '외계인', 'Alien'], ['mermaid', '인어공주', 'Mermaid'], ['gladiator', '검투사', 'Gladiator'],
  ['werewolf', '늑대인간', 'Werewolf'], ['chef', '요리사', 'Chef'], ['angel', '천사', 'Angel'],
];

// What the home page lists, with the game's own names (Texts.cs) and words; the pictures in assets/<folder>/<key>.png.
const BOSSES = [
  ['yeti', '설인', 'Yeti'], ['golem', '골렘', 'Golem'], ['clown', '미친광대', 'Mad Clown'], ['pirate', '해적', 'Pirate'],
  ['dragon', '드래곤', 'Dragon'], ['mummy', '미라', 'Mummy'], ['darkmage', '흑마법사', 'Dark Mage'], ['hydra', '히드라', 'Hydra'],
  ['cyclops', '사이클롭스', 'Cyclops'], ['kraken', '크라켄', 'Kraken'],
];
const ITEMS = [
  ['grow', '확대', 'Grows', '날아가면서 커져서 옆으로 더 넓게 맞습니다.', 'Swells as it flies, so it hits from farther to the side.'],
  ['pierce', '관통', 'Pierce', '날아오는 무기와 부딪혀도 밀리지 않고 그대로 갑니다.', 'Keeps its course when it meets another tool in flight.'],
  ['curve', '커브', 'Curve', '옆벽 쪽으로 크게 휘었다가 돌아와 떨어집니다.', 'Swings out toward the side wall and back before it lands.'],
  ['decoy', '분신', 'Phantoms', '셋으로 보이며 날아갑니다. 그중 하나만 진짜입니다.', 'Flies as three side by side. Only one of them is real.'],
  ['zigzag', '지그재그', 'Zigzag', '좌우로 흔들리며 날아갑니다.', 'Swings from side to side all the way.'],
  ['vanish', '은신', 'Vanish', '날아가는 중간에 사라졌다가 도착 직전에 다시 나타납니다.', 'Is gone through the middle of its flight and shows again just before it lands.'],
  ['doublehit', '2연타', 'Double Hit', '도착해서 한 번, 잠시 뒤에 한 번 더 때립니다.', 'Strikes when it arrives and once more a moment later.'],
  ['teleport', '순간이동', 'Teleport', '날아가지 않고 곧바로 상대 줄에 나타나 잠시 뒤에 때립니다.', 'Does not fly: it is at once at the far row, and strikes a moment later.'],
  ['twinthrow', '쌍발', 'Twin Throw', '가까이 놓인 무기 하나를 함께 던집니다.', 'The tool lying nearest on your row is thrown along with it.'],
  ['homing', '유도', 'Homing', '날아가는 앞부분 동안 상대 쪽으로 방향을 틉니다.', 'Steers toward the opponent for the first part of its flight.'],
];
const COURTS = [
  ['rectangle', '직사각형', 'Rectangle', '곧은 옆벽의 기본 경기장', 'The plain court with straight sides'],
  ['jar', '항아리', 'Jar', '가운데가 넓게 부푼 경기장', 'Wide in the middle'],
  ['hourglass', '모래시계', 'Hourglass', '가운데가 잘록한 경기장', 'Narrow in the middle'],
];
const OBSTACLES = [
  ['pin', '돌멩이', 'Stone', '부딪힌 무기는 튕겨 나가고 스킬이 사라집니다.', 'A tool that hits it bounces off and loses its skill.'],
  ['wall', '벽', 'Wall', '길쭉한 돌벽입니다. 부딪힌 무기는 튕겨 나가고 스킬이 사라집니다.', 'A long stone bar. A tool that hits it bounces off and loses its skill.'],
  ['booster', '부스터', 'Booster', '지나가는 무기가 1.5배 빨라집니다.', 'A tool passing over it flies on half as fast again.'],
  ['swamp', '늪', 'Swamp', '지나가는 무기가 절반 속도로 느려집니다.', 'A tool passing over it flies on at half its speed.'],
  ['blackhole', '블랙홀', 'Black Hole', '무기를 1초 동안 삼켰다가 상대를 향해 다른 각도로 내보냅니다.', "Swallows a tool for a second, then sends it toward the thrower's opponent at a new angle."],
  ['portal', '포탈', 'Portal', '두 개가 한 쌍입니다. 한쪽에 들어간 무기가 다른 쪽에서 나옵니다.', 'Two make a pair: a tool going into one comes out of the other.'],
  ['ice', '얼음', 'Ice', '무기를 2초 동안 멈춰 세웠다가 그대로 보냅니다.', 'Holds a tool still for 2 seconds, then lets it go on as it was.'],
];
const GAMES = [
  ['stun', '기절시키기', 'Stun Practice', '상대를 맞혀 기절시키세요. 맞힐 때마다 별을 얻습니다.', 'Hit the opponent to stun it. Every hit earns stars.'],
  ['pins', '장애물 맞히기', 'Obstacle Shot', '장애물을 맞힐 때마다 별을 얻습니다.', 'Every obstacle you hit earns stars.'],
  ['moving', '움직이는 장애물', 'Moving Obstacles', '돌아다니는 장애물을 맞히세요.', 'Hit the obstacles as they drift about.'],
  ['stars', '별 따기', 'Falling Stars', '별이 내 쪽에 닿기 전에 맞히세요.', 'Hit the stars before they reach your side.'],
  ['dodge', '무기 피하기', 'Dodge the Tools', '떨어지는 무기를 피하세요. 지나간 무기만큼 별을 얻습니다.', 'Keep clear of what comes down. Every tool that gets past earns stars.'],
  ['archery', '양궁', 'Archery', '누르고 있다가 놓으면 던집니다. 과녁 가운데일수록 별이 많습니다.', 'Hold, then let go to throw. The nearer the middle, the more stars.'],
  ['bricks', '벽돌 깨기', 'Brick Break', '무기 하나로 벽돌을 깨세요. 무기는 튕겨 다니다 돌아옵니다.', 'Break the bricks with your one tool as it bounces about.'],
  ['boss', '보스 때리기', 'Boss Bash', '보스를 때리세요. 체력을 깎은 만큼 별을 얻습니다.', 'Hit the boss. The more of its health you take, the more stars.'],
  ['bowling', '볼링', 'Bowling', '누르고 있다가 놓으면 굴러갑니다. 쓰러진 핀만큼 점수!', 'Hold and let go to roll. Score by the pins you knock down.'],
  ['fruit', '과일 짝 맞추기', 'Fruit Match', '같은 과일을 연달아 맞혀 짝을 지우세요.', 'Hit the same fruit twice in a row to clear the pair.'],
];
// The brick game has no picture of its own: three rows of bricks drawn here.
const BRICKS_SVG = '<svg viewBox="0 0 56 56" aria-hidden="true"><g stroke="#16224a" stroke-width="2">'
  + '<rect x="2" y="10" width="25" height="11" fill="#ff5a5a"/><rect x="29" y="10" width="25" height="11" fill="#ff5a5a"/>'
  + '<rect x="2" y="23" width="12" height="11" fill="#ff9f43"/><rect x="16" y="23" width="25" height="11" fill="#ff9f43"/><rect x="43" y="23" width="11" height="11" fill="#ff9f43"/>'
  + '<rect x="2" y="36" width="25" height="11" fill="#ffd866"/><rect x="29" y="36" width="25" height="11" fill="#ffd866"/></g></svg>';

function faces(list, folder) {
  return list.map(([key, ko, en]) => `<figure style="margin:0;text-align:center"><img src="assets/${folder}/${key}.png" alt="${en}" loading="lazy" style="width:100%;max-width:120px;aspect-ratio:1;object-fit:contain"><figcaption class="muted"><span data-lang="ko">${ko}</span><span data-lang="en">${en}</span></figcaption></figure>`).join('\n');
}

function tiles(list, folder) {
  return list.map(([key, ko, en, koText, enText]) => {
    const picture = folder === 'games' && key === 'bricks' ? BRICKS_SVG : `<img src="assets/${folder}/${key}.png" alt="${en}" loading="lazy">`;
    return `<div class="tile">${picture}<div><b><span data-lang="ko">${ko}</span><span data-lang="en">${en}</span></b>`
      + `<span class="d" data-lang="ko">${koText}</span><span class="d" data-lang="en">${enText}</span></div></div>`;
  }).join('\n');
}

const escape = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const unescapeXml = (text) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

// ---- Shared look ---------------------------------------------------------------------------------------

const CSS = `*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",Roboto,sans-serif;
background:linear-gradient(#16224a,#0b1130) fixed;color:#e8ecf5;line-height:1.65;font-size:16px}
a{color:#35b4e8}
.wrap{max-width:880px;margin:0 auto;padding:20px 18px 48px}
header.top{display:flex;align-items:center;gap:12px;padding:6px 0 18px}
header.top img{width:40px;height:40px;border-radius:10px}
header.top a.home{display:flex;align-items:center;gap:10px;color:#ffd866;font-weight:800;font-size:20px;text-decoration:none}
header.top .langs{margin-left:auto}
select{background:#18203a;color:#e8ecf5;border:1px solid #3a4a7a;border-radius:8px;padding:6px 8px;font-size:15px}
h1{font-size:28px;line-height:1.3;margin:6px 0 4px;color:#ffd866}
h2{font-size:19px;margin:28px 0 8px;color:#ffd866}
.card{background:#18203a;border:1px solid #2a3760;border-radius:16px;padding:18px 18px}
.card>:first-child{margin-top:0}
.card>:last-child{margin-bottom:0}
.muted{color:#8fa0c8;font-size:14px}
ul{padding-left:22px;margin:6px 0}
li{margin:3px 0}
li ul{margin:2px 0}
.button{display:inline-block;padding:12px 18px;border-radius:12px;background:#35b4e8;color:#fff;font-weight:700;text-decoration:none;margin:4px 8px 4px 0}
.button.pink{background:#e8679a}
.button.line{background:transparent;border:1px solid #8fa0c8;color:#e8ecf5}
footer{margin-top:40px;padding-top:16px;border-top:1px solid #2a3760;font-size:14px;color:#8fa0c8}
footer a{margin-right:14px}
[data-lang]:not(.on){display:none}
`;

// Every page has its words in Korean and English (the policy in all ten languages), one shown by the select: the
// device's language first, then what was picked last.
function langScript(codes) {
  return `<script>
(function(){var codes=${JSON.stringify(codes)};
function pick(c){if(codes.indexOf(c)<0)c=codes.indexOf('en')>=0?'en':codes[0];
document.querySelectorAll('[data-lang]').forEach(function(e){e.classList.toggle('on',e.getAttribute('data-lang')===c)});
var s=document.getElementById('lang');if(s)s.value=c;document.documentElement.lang=c;try{localStorage.setItem('lang',c)}catch(e){}}
var saved=null;try{saved=localStorage.getItem('lang')}catch(e){}
var nav=(navigator.language||'en').slice(0,2).toLowerCase();
pick(saved||nav);
var s=document.getElementById('lang');if(s)s.onchange=function(){pick(s.value)};})();
</script>`;
}

function langSelect(codes) {
  return `<div class="langs"><select id="lang" aria-label="Language">${LANGS.filter(([c]) => codes.includes(c))
    .map(([c, name]) => `<option value="${c}">${name}</option>`).join('')}</select></div>`;
}

function page(title, description, codes, body, root) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:image" content="${root}assets/icon.png">
<link rel="icon" href="${root}assets/favicon.png">
<link rel="stylesheet" href="${root}assets/site.css">
</head>
<body>
<div class="wrap">
<header class="top"><a class="home" href="${root}"><img src="${root}assets/icon.png" alt="">StunStar</a>${langSelect(codes)}</header>
${body}
<footer>
<a href="${root}">Home</a><a href="${root}privacy-policy/"><span data-lang="ko">개인정보처리방침</span><span data-lang="en">Privacy Policy</span>${codes.length > 2 ? codes.filter((c) => c !== 'ko' && c !== 'en').map((c) => `<span data-lang="${c}">Privacy Policy</span>`).join('') : ''}</a><a href="${root}terms/"><span data-lang="ko">이용약관</span><span data-lang="en">Terms of Service</span>${codes.length > 2 ? codes.filter((c) => c !== 'ko' && c !== 'en').map((c) => `<span data-lang="${c}">Terms of Service</span>`).join('') : ''}</a><a href="${root}delete-account/"><span data-lang="ko">계정 삭제</span><span data-lang="en">Delete account</span>${codes.length > 2 ? codes.filter((c) => c !== 'ko' && c !== 'en').map((c) => `<span data-lang="${c}">Delete account</span>`).join('') : ''}</a><a href="mailto:${CONTACT}">${CONTACT}</a>
<div style="margin-top:8px">© 2026 ${escape(DEVELOPER)} (sjm3labs)</div>
</footer>
</div>
${langScript(codes)}
</body>
</html>
`;
}

// ---- Home ------------------------------------------------------------------------------------------------

function home() {
  const characters = CHARACTERS.map(([key, ko, en]) => `<figure style="margin:0;text-align:center"><img src="assets/${key}.png" alt="${en}" loading="lazy" style="width:100%;max-width:120px;aspect-ratio:1;object-fit:contain"><figcaption class="muted"><span data-lang="ko">${ko}</span><span data-lang="en">${en}</span></figcaption></figure>`).join('\n');
  const body = `<style>
.hero{display:flex;gap:24px;align-items:center;flex-wrap:wrap}
.hero img.art{width:100%;max-width:360px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.hero .text{flex:1;min-width:260px}
.chars{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.tile{display:flex;gap:12px;align-items:center;background:#18203a;border:1px solid #2a3760;border-radius:14px;padding:10px 12px}
.tile img,.tile svg{width:56px;height:56px;object-fit:contain;flex:none}
.tile b{display:block;color:#ffd866;font-size:15px}
.tile span.d{color:#c9d2ea;font-size:13px;line-height:1.45}
.tile span.d.on{display:block}
@media (max-width:560px){.chars{grid-template-columns:repeat(3,1fr)}.hero{justify-content:center}.tiles{grid-template-columns:1fr}}
</style>
<section class="hero">
<img class="art" src="assets/intro.jpg" alt="StunStar">
<div class="text">
<div data-lang="ko">
<h1>던지고 기절시켜라!<br>1:1 대전</h1>
<p>내 쪽의 무기를 모두 상대 진영으로 던져 넘기면 승리! 상대를 맞혀 기절시키고, 그 틈에 몰아 던지세요. 한 손으로도 즐길 수 있는 빠르고 짜릿한 던지기 대전입니다.</p>
</div>
<div data-lang="en">
<h1>Throw, Stun &amp; Win!<br>1v1 battles</h1>
<p>Send every one of your tools over to the other side to win. Hit your rival to stun them, then throw everything while they are down. A fast, thrilling throwing battle you can play with one hand.</p>
</div>
<p>
<a class="button" href="${PLAY}">Google Play</a>
<a class="button pink" href="${APP_STORE}">App Store</a>
</p>
</div>
</section>

<h2><span data-lang="ko">게임 특징</span><span data-lang="en">Features</span></h2>
<div class="card">
<ul data-lang="ko">
<li>각자 다른 무기와 스킬을 가진 캐릭터 10명</li>
<li>설인, 골렘, 드래곤, 크라켄 등 보스와 다양한 장애물이 기다리는 모험 모드</li>
<li>볼링, 양궁, 벽돌 깨기 등 보너스 게임</li>
<li>같은 와이파이에서 즐기는 로컬 대전과 전 세계 플레이어와 겨루는 온라인 대전</li>
<li>모험·온라인 대전 주간 랭킹과 보상, 일일 미션과 출석 보상</li>
</ul>
<ul data-lang="en">
<li>10 characters, each with its own tool and skill</li>
<li>An adventure of bosses such as the Yeti, the Golem, the Dragon and the Kraken, with obstacles on the court</li>
<li>Bonus games: bowling, archery, bricks and more</li>
<li>Local matches on the same Wi-Fi, and online matches with players around the world</li>
<li>Weekly rankings for adventure and online matches with rewards, daily missions and attendance rewards</li>
</ul>
</div>

<h2><span data-lang="ko">캐릭터</span><span data-lang="en">Characters</span></h2>
<div class="chars">
${characters}
</div>

<h2><span data-lang="ko">보스</span><span data-lang="en">Bosses</span></h2>
<p class="muted"><span data-lang="ko">스테이지마다 마지막 판에 등장하고, 100레벨마다 크라켄이 기다립니다.</span><span data-lang="en">Each stage ends with a boss, and the Kraken waits at every hundredth level.</span></p>
<div class="chars">
${faces(BOSSES, 'bosses')}
</div>

<h2><span data-lang="ko">스킬 아이템</span><span data-lang="en">Skill items</span></h2>
<p class="muted"><span data-lang="ko">경기 전에 골라 넣으면 내 무기 하나에 그 스킬이 붙습니다.</span><span data-lang="en">Pick them before a game and each puts its skill on one of your tools.</span></p>
<div class="tiles">
${tiles(ITEMS, 'items')}
</div>

<h2><span data-lang="ko">경기장</span><span data-lang="en">Courts</span></h2>
<div class="tiles">
${tiles(COURTS, 'courts')}
</div>

<h2><span data-lang="ko">장애물</span><span data-lang="en">Obstacles</span></h2>
<p class="muted"><span data-lang="ko">레벨이 오를수록 경기장 가운데에 여러 장애물이 놓이고, 가만히 있거나 움직입니다.</span><span data-lang="en">As the levels go up, obstacles stand in the middle of the court, still or on the move.</span></p>
<div class="tiles">
${tiles(OBSTACLES, 'obstacles')}
</div>

<h2><span data-lang="ko">보너스 게임</span><span data-lang="en">Bonus games</span></h2>
<p class="muted"><span data-lang="ko">보스를 이긴 다음 레벨은 지지 않는 보너스 게임입니다. 점수만큼 별을 받습니다.</span><span data-lang="en">The level after each boss is a bonus game you cannot lose, paying stars for your score.</span></p>
<div class="tiles">
${tiles(GAMES, 'games')}
</div>

<h2><span data-lang="ko">문의</span><span data-lang="en">Contact</span></h2>
<p><a href="mailto:${CONTACT}">${CONTACT}</a></p>`;
  return page('StunStar', 'Throw, stun and win! A 1v1 throwing battle game. 던지고 기절시켜라! 1:1 대전 게임', ['ko', 'en'], body, './');
}

// ---- Privacy policy ------------------------------------------------------------------------------------

// One language's policy as HTML: "1. ..." a heading, "- " an item (indented, one level in), anything else a paragraph.
function policyHtml(text) {
  const lines = text.split(/\r?\n/);
  const html = [];
  let depth = 0;
  const close = (to) => {
    while (depth > to) {
      html.push(depth === 2 ? '</ul></li>' : '</ul>');
      depth--;
    }
  };
  for (const raw of lines) {
    if (raw.trim() === '') continue;
    const item = /^(\s*)-\s+(.*)$/.exec(raw);
    if (item) {
      const want = item[1].length >= 2 ? 2 : 1;
      if (want > depth) {
        while (depth < want) {
          if (depth === 1) {
            const last = html.pop();
            html.push(last.replace(/<\/li>$/, ''));
          }
          html.push('<ul>');
          depth++;
        }
      } else close(want);
      html.push(`<li>${escape(item[2])}</li>`);
      continue;
    }
    close(0);
    if (/^\d+\.\s/.test(raw.trim())) html.push(`<h2>${escape(raw.trim())}</h2>`);
    else html.push(`<p>${escape(raw.trim())}</p>`);
  }
  close(0);
  return html.join('\n');
}

function privacy() {
  const date = (/<date>([^<]*)<\/date>/.exec(policyXml) || [])[1] || '';
  const codes = [];
  const sections = [];
  const labels = { ko: '시행일', en: 'Effective date', ja: '施行日', zh: '生效日期', es: 'Fecha de entrada en vigor', hi: 'प्रभावी तिथि', fr: "Date d'entrée en vigueur", ru: 'Дата вступления в силу', de: 'Gültig ab', pt: 'Data de vigência' };
  const titles = { ko: 'StunStar 개인정보처리방침', en: 'StunStar Privacy Policy', ja: 'StunStar プライバシーポリシー', zh: 'StunStar 隐私政策', es: 'Política de privacidad de StunStar', hi: 'StunStar गोपनीयता नीति', fr: 'Politique de confidentialité de StunStar', ru: 'Политика конфиденциальности StunStar', de: 'Datenschutzerklärung von StunStar', pt: 'Política de Privacidade do StunStar' };
  for (const [code] of LANGS) {
    const m = new RegExp(`<${code}>([\\s\\S]*?)</${code}>`).exec(policyXml);
    if (!m || !m[1].trim() || /^\s*\.+\s*$/.test(m[1])) continue;
    codes.push(code);
    sections.push(`<article data-lang="${code}">
<h1>${escape(titles[code])}</h1>
<p class="muted">${escape(labels[code])}: ${escape(date)}</p>
<div class="card">
${policyHtml(unescapeXml(m[1]).replace(/^\n+|\s+$/g, ''))}
</div>
</article>`);
  }
  return page('StunStar Privacy Policy', 'StunStar privacy policy / 개인정보처리방침', codes, sections.join('\n'), '../');
}

// ---- Terms of service -----------------------------------------------------------------------------------

// tools/terms.txt, Korean then English, the two parts split by a line of dashes. In each the first line is the
// title, the second the effective date, "제N조" (Korean) or "N." (English) a heading, an address a link, anything else a paragraph.
function termsPart(text, code) {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l !== '');
  const html = [`<article data-lang="${code}">`, `<h1>${escape(lines[0])}</h1>`, `<p class="muted">${escape(lines[1])}</p>`, '<div class="card">'];
  for (const line of lines.slice(2)) {
    if ((code === 'ko' ? /^제\d+조 \(/ : /^\d+\.\s/).test(line)) html.push(`<h2>${escape(line)}</h2>`);
    else if (/^https?:\/\//.test(line)) html.push(`<p><a href="${escape(line)}">${escape(line)}</a></p>`);
    else html.push(`<p>${escape(line).replace(CONTACT, `<a href="mailto:${CONTACT}">${CONTACT}</a>`)}</p>`);
  }
  html.push('</div>', '</article>');
  return html.join('\n');
}

function terms() {
  const text = fs.readFileSync(path.join(__dirname, 'terms.txt'), 'utf8').replace(/\r\n/g, '\n');
  const [ko, en] = text.split(/\n-{10,}\n/);
  return page('StunStar Terms of Service', 'StunStar terms of service / 이용약관', ['ko', 'en'], termsPart(ko, 'ko') + '\n' + termsPart(en, 'en'), '../');
}

// ---- Account deletion ----------------------------------------------------------------------------------

function deleteAccount() {
  const body = `<article data-lang="ko">
<h1>StunStar 계정 삭제</h1>
<p>StunStar 계정과 관련 데이터는 게임 안에서 직접 삭제할 수 있습니다.</p>
<h2>게임 안에서 삭제하기</h2>
<div class="card"><ol>
<li>StunStar를 실행합니다.</li>
<li>오른쪽 위 <b>메뉴(≡)</b> → <b>약관</b>을 엽니다.</li>
<li>아래의 <b>계정 삭제</b>를 누르고, 확인 창에서 <b>삭제</b>를 누릅니다.</li>
</ol>
<p class="muted">삭제가 끝나면 게임이 처음 상태로 다시 시작됩니다.</p></div>
<h2>삭제되는 데이터</h2>
<div class="card"><ul>
<li>게임 계정(플레이어 ID)과 계정 연동 정보</li>
<li>클라우드에 저장된 게임 진행 데이터와 보상 기록</li>
<li>주간 랭킹 기록</li>
<li>기기에 저장된 게임 데이터</li>
</ul>
<p class="muted">서버 운영 기록(플레이어 ID 없이, IP 일부를 가린 형태)은 최대 30일 보관 후 삭제되며, 그 밖의 보관 기간은 <a href="../privacy-policy/">개인정보처리방침</a>을 따릅니다.</p></div>
<h2>게임을 실행할 수 없는 경우</h2>
<div class="card"><p>앱을 지웠거나 실행할 수 없다면 <a href="mailto:${CONTACT}?subject=StunStar%20account%20deletion">${CONTACT}</a>로 삭제를 요청해 주세요. 게임 안 <b>메뉴 → 약관</b>에 표시되는 <b>플레이어 ID</b>를 함께 보내 주시면 더 빠르게 처리됩니다. 요청은 확인 후 30일 이내에 처리합니다.</p></div>
</article>
<article data-lang="en">
<h1>Delete your StunStar account</h1>
<p>You can delete your StunStar account and its data yourself, in the game.</p>
<h2>In the game</h2>
<div class="card"><ol>
<li>Open StunStar.</li>
<li>Tap the <b>menu (≡)</b> at the top right, then <b>Terms</b>.</li>
<li>Tap <b>Delete account</b> at the bottom, then <b>Delete</b> to confirm.</li>
</ol>
<p class="muted">Once it is done, the game starts again from the beginning.</p></div>
<h2>What is deleted</h2>
<div class="card"><ul>
<li>Your game account (player ID) and any linked sign-in</li>
<li>Your game progress and reward records saved in the cloud</li>
<li>Your weekly ranking records</li>
<li>The game data on your device</li>
</ul>
<p class="muted">Server operating records (without your player ID, IP addresses only in part) are kept for up to 30 days and then deleted; anything else is kept only as the <a href="../privacy-policy/">privacy policy</a> says.</p></div>
<h2>If you cannot open the game</h2>
<div class="card"><p>If you have removed the app or cannot open it, email <a href="mailto:${CONTACT}?subject=StunStar%20account%20deletion">${CONTACT}</a> to ask for deletion. Including your <b>player ID</b>, shown in the game under <b>Menu → Terms</b>, helps us find your account. Requests are handled within 30 days.</p></div>
</article>`;
  return page('Delete your StunStar account', 'How to delete a StunStar account and its data / StunStar 계정 삭제 방법', ['ko', 'en'], body, '../');
}

// ---- Write ---------------------------------------------------------------------------------------------

fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.mkdirSync(path.join(out, 'privacy-policy'), { recursive: true });
fs.mkdirSync(path.join(out, 'delete-account'), { recursive: true });
fs.mkdirSync(path.join(out, 'terms'), { recursive: true });
fs.writeFileSync(path.join(out, 'assets', 'site.css'), CSS);
fs.writeFileSync(path.join(out, 'index.html'), home());
fs.writeFileSync(path.join(out, 'privacy-policy', 'index.html'), privacy());
fs.writeFileSync(path.join(out, 'delete-account', 'index.html'), deleteAccount());
fs.writeFileSync(path.join(out, 'terms', 'index.html'), terms());
// AdMob's line for the app (app-ads.txt is what it reads for apps; ads.txt, for websites, is the same line).
const adsLine = `google.com, ${PUBLISHER}, DIRECT, f08c47fec0942fa0\n`;
fs.writeFileSync(path.join(out, 'app-ads.txt'), adsLine);
fs.writeFileSync(path.join(out, 'ads.txt'), adsLine);
console.log('made ' + out + ' (privacy policy dated ' + ((/<date>([^<]*)<\/date>/.exec(policyXml) || [])[1]) + ')');
