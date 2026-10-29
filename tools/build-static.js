'use strict';

// Makes the game's web pages at this repository's root (since 2026-10-29; StunStar_Server/static_html for its first hour): the home page (/), the
// privacy policy (/privacy-policy/) from the game's own Data/PrivacyPolicy.xml in all its languages, how to delete an
// account (/delete-account/), and app-ads.txt (with ads.txt beside it) for AdMob. Run again whenever the policy changes:
//
//   node tools/build-static.js [path to the Unity project]      (D:\Workspace\StunStar where none is given)
//
// The pictures in assets/ were made once from the game's Art (scaled down for the web) and are not touched.

const fs = require('fs');
const path = require('path');

const unity = process.argv[2] || 'D:/Workspace/StunStar';
const out = path.join(__dirname, '..');
const policyXml = fs.readFileSync(path.join(unity, 'Assets/_Project/Data/PrivacyPolicy.xml'), 'utf8');

const DEVELOPER = 'suseong kim';
const CONTACT = 'sjm3labs@gmail.com';
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
<a href="${root}">Home</a><a href="${root}privacy-policy/"><span data-lang="ko">개인정보처리방침</span><span data-lang="en">Privacy Policy</span>${codes.length > 2 ? codes.filter((c) => c !== 'ko' && c !== 'en').map((c) => `<span data-lang="${c}">Privacy Policy</span>`).join('') : ''}</a><a href="${root}delete-account/"><span data-lang="ko">계정 삭제</span><span data-lang="en">Delete account</span>${codes.length > 2 ? codes.filter((c) => c !== 'ko' && c !== 'en').map((c) => `<span data-lang="${c}">Delete account</span>`).join('') : ''}</a><a href="mailto:${CONTACT}">${CONTACT}</a>
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
@media (max-width:560px){.chars{grid-template-columns:repeat(3,1fr)}.hero{justify-content:center}}
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
fs.writeFileSync(path.join(out, 'assets', 'site.css'), CSS);
fs.writeFileSync(path.join(out, 'index.html'), home());
fs.writeFileSync(path.join(out, 'privacy-policy', 'index.html'), privacy());
fs.writeFileSync(path.join(out, 'delete-account', 'index.html'), deleteAccount());
// AdMob's line for the app (app-ads.txt is what it reads for apps; ads.txt, for websites, is the same line).
const adsLine = `google.com, ${PUBLISHER}, DIRECT, f08c47fec0942fa0\n`;
fs.writeFileSync(path.join(out, 'app-ads.txt'), adsLine);
fs.writeFileSync(path.join(out, 'ads.txt'), adsLine);
console.log('made ' + out + ' (privacy policy dated ' + ((/<date>([^<]*)<\/date>/.exec(policyXml) || [])[1]) + ')');
