#!/usr/bin/env node
/**
 * デザイン案 A (Formal) build script.
 *
 * 静的 HTML を出力するだけの最小 build。npm install 不要。
 *   $ node build.mjs
 *
 * 生成: mocks/a-formal/*.html, mocks/a-formal/practice-areas/*.html
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// Site metadata
// ============================================================
const SITE = {
  name: "星ヶ丘法律事務所",
  nameLatin: "HOSHIGAOKA LAW OFFICE",
  established: "Est. 令和",
  lawyerName: "田中 太郎",
  phone: "058-000-0000",
  phoneLabel: "058 (000) 0000",
  hours: "平日 9:00 - 18:00",
  address: "岐阜県○○市○○町 1-2-3 ○○ビル 2 階",
  postcode: "〒000-0000",
  email: "info@example.com",
};

const NAV = [
  { href: "/mocks/a-formal/", label: "トップ", key: "top" },
  { href: "/mocks/a-formal/lawyer.html", label: "弁護士紹介", key: "lawyer" },
  { href: "/mocks/a-formal/practice-areas/", label: "取扱分野", key: "areas" },
  { href: "/mocks/a-formal/flow.html", label: "相談の流れ", key: "flow" },
  { href: "/mocks/a-formal/fee.html", label: "料金", key: "fee" },
  { href: "/mocks/a-formal/faq.html", label: "よくある質問", key: "faq" },
  { href: "/mocks/a-formal/access.html", label: "アクセス", key: "access" },
];

// ============================================================
// Layout
// ============================================================
function layout({ title, description = "", active = "", body, assets = "assets", depth = 0, extraHead = "" }) {
  const activeMatch = active.startsWith("area:") ? "areas" : active;
  const nav = NAV.map(
    (n) =>
      `<a href="${rel(n.href, depth)}"${n.key === activeMatch ? ' class="is-active"' : ""}>${n.label}</a>`,
  ).join("\n        ");
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | ${SITE.name}</title>
  <meta name="description" content="${description}" />
  <link rel="stylesheet" href="${assets}/style.css" />
  ${extraHead}
</head>
<body>
  <header class="site-header">
    <div class="site-header__inner">
      <a href="${rel("/mocks/a-formal/", depth)}" class="brand">
        <span class="brand__mark">H</span>
        <span>
          <span class="brand__name">${SITE.name}</span>
          <span class="brand__sub"> ${SITE.nameLatin}</span>
        </span>
      </a>
      <nav class="nav">
        ${nav}
        <a href="${rel("/mocks/a-formal/access.html", depth)}" class="nav__cta">初回相談 予約</a>
      </nav>
    </div>
  </header>

  <main>
    ${body}
  </main>

  <section class="cta-band">
    <div class="cta-band__inner">
      <p class="section-eyebrow" style="color: var(--gold);">CONSULTATION</p>
      <h2 class="cta-band__title">まずはお電話でご相談ください</h2>
      <p class="cta-band__lead">「相談すべきか迷っている」段階でも構いません。<br />専門用語を使わず、状況を整理するところから始めます。</p>
      <a href="tel:0580000000" class="cta-band__phone">${SITE.phoneLabel}</a>
      <p class="cta-band__hours">${SITE.hours}（土日祝は事前予約で対応）</p>
      <a href="${rel("/mocks/a-formal/access.html", depth)}" class="cta-band__button">お問い合わせ</a>
    </div>
  </section>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="footer-brand">
        <p class="footer-brand__name">${SITE.name}</p>
        <p class="footer-brand__latin">${SITE.nameLatin}</p>
        <p class="footer-brand__addr">
          ${SITE.postcode}<br />
          ${SITE.address}<br />
          TEL ${SITE.phone}　${SITE.hours}
        </p>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">Menu</p>
        <ul>
          ${NAV.map((n) => `<li><a href="${rel(n.href, depth)}">${n.label}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">Practice</p>
        <ul>
          <li><a href="${rel("/mocks/a-formal/practice-areas/inheritance.html", depth)}">相続</a></li>
          <li><a href="${rel("/mocks/a-formal/practice-areas/divorce.html", depth)}">離婚</a></li>
          <li><a href="${rel("/mocks/a-formal/practice-areas/debt.html", depth)}">債務整理</a></li>
          <li><a href="${rel("/mocks/a-formal/practice-areas/traffic.html", depth)}">交通事故</a></li>
          <li><a href="${rel("/mocks/a-formal/practice-areas/guardianship.html", depth)}">成年後見</a></li>
          <li><a href="${rel("/mocks/a-formal/practice-areas/real-estate.html", depth)}">不動産</a></li>
          <li><a href="${rel("/mocks/a-formal/practice-areas/general-civil.html", depth)}">その他一般民事</a></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__base">
      <span>© ${SITE.name} — All rights reserved.</span>
    </div>
  </footer>
</body>
</html>
`;
}

/**
 * Adjust absolute href to relative for on-disk browsing.
 * All NAV hrefs are written as absolute paths starting with /mocks/a-formal/.
 * `depth` = how many directory levels the current page sits below mocks/a-formal/.
 *   0 = mocks/a-formal/*.html (top, lawyer, flow, ...)
 *   1 = mocks/a-formal/practice-areas/*.html
 */
function rel(href, depth = 0) {
  const prefix = "/mocks/a-formal/";
  if (!href.startsWith(prefix)) return href;
  const rest = href.slice(prefix.length);
  const up = "../".repeat(depth);
  if (rest === "") return depth === 0 ? "./" : up;
  return up + rest;
}

// ============================================================
// Pages
// ============================================================

// -- TOP --------------------------------------------------------
const topPage = () => layout({
  title: "難しい法律を、わかりやすい言葉で",
  description: "岐阜県○○市の星ヶ丘法律事務所。元公務員の弁護士が、地域の相続・離婚・債務整理などのご相談を、専門用語を使わず丁寧にお伺いします。",
  active: "top",
  body: `
    <section class="hero">
      <div class="hero__inner">
        <p class="hero__label">Est. 令和 ・ Gifu, Japan</p>
        <h1 class="hero__title">
          難しい法律を、<br />
          わかりやすい<em>言葉</em>で。
        </h1>
        <p class="hero__lead">
          「弁護士に相談する」と聞くと、身構えてしまう方が多いと思います。<br />
          星ヶ丘法律事務所は、専門用語をできるだけ使わず、いま起きていることと、<br />
          これから起き得ることを、ふつうの言葉でお伝えします。
        </p>
        <a href="./access.html" class="hero__cta">初回相談のご予約</a>
        <a href="./lawyer.html" class="hero__cta">弁護士紹介</a>
      </div>
      <div class="hero__meta">
        <span>HOSHIGAOKA LAW OFFICE</span>
        <span>NO.001 — TRUST / CLARITY</span>
      </div>
    </section>

    <section class="section section--alt">
      <div class="section__inner">
        <p class="section-eyebrow">Our Stance</p>
        <h2 class="section-title">私たちが守る、三つの姿勢</h2>
        <div class="divider"></div>
        <p class="section-lead">
          地域の皆さまが安心して相談できる法律事務所を目指します。<br />
          そのために、私たちは次の三つを大切にしています。
        </p>

        <div class="stances">
          <article class="stance">
            <div class="stance__num">01</div>
            <h3 class="stance__title">難しい言葉を<br />使いません</h3>
            <p class="stance__body">
              法律用語（専門的な言い回し）は、必ず日常の言葉に置き換えてご説明します。「わからないまま話が進んでしまった」ということが起きないようにします。
            </p>
          </article>
          <article class="stance">
            <div class="stance__num">02</div>
            <h3 class="stance__title">良いことも、悪いことも、<br />正直にお伝えします</h3>
            <p class="stance__body">
              依頼を受ける前に、見込まれる結果だけでなく、想定される費用・時間・不利になり得る点も先にお話しします。「思っていたのと違った」を減らすためです。
            </p>
          </article>
          <article class="stance">
            <div class="stance__num">03</div>
            <h3 class="stance__title">元公務員としての<br />誠実さ</h3>
            <p class="stance__body">
              代表弁護士は、弁護士になる前に○○市役所で X 年間勤務していました。地域の方の相談を受けてきた経験を、そのまま法律相談の場に持ち込みます。
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <p class="section-eyebrow">Practice Areas</p>
        <h2 class="section-title">取扱分野</h2>
        <div class="divider"></div>
        <p class="section-lead">
          地域の方から寄せられる一般民事の案件を、幅広くお受けしています。<br />
          企業法務・刑事事件のように高度に専門化された分野は、必要に応じて他事務所をご紹介します。
        </p>

        <div class="areas">
          ${areaTile("01", "相続", "遺産分割 / 遺言書作成 / 相続放棄", "practice-areas/inheritance.html")}
          ${areaTile("02", "離婚", "協議離婚 / 調停 / 慰謝料 / 親権 / 養育費", "practice-areas/divorce.html")}
          ${areaTile("03", "債務整理", "任意整理 / 個人再生 / 自己破産", "practice-areas/debt.html")}
          ${areaTile("04", "交通事故", "示談交渉 / 後遺障害等級 / 損害賠償", "practice-areas/traffic.html")}
          ${areaTile("05", "成年後見", "法定後見 / 任意後見 / 財産管理", "practice-areas/guardianship.html")}
          ${areaTile("06", "不動産", "借地借家 / 境界 / 売買トラブル", "practice-areas/real-estate.html")}
        </div>
        <div style="text-align:center; margin-top:48px;">
          <a href="./practice-areas/" class="hero__cta" style="color: var(--navy); border-color: var(--gold);">分野一覧をすべて見る</a>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="section__inner two-col">
        <div>
          <p class="section-eyebrow">Representative</p>
          <h2 class="section-title" style="color: var(--paper);">代表弁護士のご挨拶</h2>
          <div class="divider"></div>
          <p style="font-family: var(--font-mincho); font-size: 16px; line-height: 2.15; color: rgba(253,252,247,0.85); letter-spacing: 0.05em;">
            「弁護士に相談する」のは、多くの方にとって一生に何度もあることではありません。<br /><br />
            だからこそ最初の一回で「相談してよかった」と感じていただけるよう、<br />
            丁寧にお話を伺います。ご相談内容が当事務所の対応範囲外だった場合も、<br />
            その旨をはっきりお伝えします。
          </p>
          <p style="margin-top: 40px; font-family: var(--font-mincho); letter-spacing: 0.14em; color: var(--gold);">
            弁護士　${SITE.lawyerName}
          </p>
        </div>
        <div class="lawyer__photo" style="max-width: 360px; justify-self: end; width: 100%;"></div>
      </div>
    </section>
  `,
});

function areaTile(num, title, ex, href) {
  return `
          <a class="area" href="./${href}">
            <p class="area__num">No. ${num}</p>
            <h3 class="area__title">${title}</h3>
            <p class="area__ex">${ex}</p>
            <span class="area__more">Read More</span>
          </a>`;
}

// -- LAWYER -----------------------------------------------------
const lawyerPage = () => layout({
  title: "弁護士紹介",
  description: "代表弁護士 田中 太郎の経歴・志望動機・大切にしていること。元公務員として、市民の相談を受けてきた経験を法律相談の現場に持ち込みます。",
  active: "lawyer",
  body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Lawyer Profile</p>
        <h1 class="page-hero__title">弁護士紹介</h1>
        <p class="page-hero__sub">代表弁護士 ${SITE.lawyerName}</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="lawyer">
          <div class="lawyer__photo"></div>
          <div class="lawyer__meta">
            <p class="lawyer__name">${SITE.lawyerName}</p>
            <p class="lawyer__title">Representative — Attorney at Law</p>

            <table class="table">
              <tr><th>氏名</th><td>${SITE.lawyerName}</td></tr>
              <tr><th>所属</th><td>岐阜県弁護士会</td></tr>
              <tr><th>登録番号</th><td>第 000000 号</td></tr>
              <tr><th>出身</th><td>岐阜県○○市</td></tr>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt section--tight">
      <div class="section__inner section__inner--narrow">
        <p class="section-eyebrow">Career History</p>
        <h2 class="section-title">経歴</h2>
        <div class="divider"></div>
        <ul class="prose" style="list-style: none; padding-left: 0;">
          <li style="padding: 18px 0; border-bottom: 1px solid var(--hair); display: grid; grid-template-columns: 200px 1fr; gap: 24px;"><span class="mono-latin" style="color: var(--gold-deep);">平成 XX 年 3 月</span><span>○○大学法学部 卒業</span></li>
          <li style="padding: 18px 0; border-bottom: 1px solid var(--hair); display: grid; grid-template-columns: 200px 1fr; gap: 24px;"><span class="mono-latin" style="color: var(--gold-deep);">平成 XX 年 4 月</span><span>○○市役所 ○○課 入庁</span></li>
          <li style="padding: 18px 0; border-bottom: 1px solid var(--hair); display: grid; grid-template-columns: 200px 1fr; gap: 24px;"><span class="mono-latin" style="color: var(--gold-deep);">平成 XX 年 3 月</span><span>○○市役所 退職（勤続 X 年）</span></li>
          <li style="padding: 18px 0; border-bottom: 1px solid var(--hair); display: grid; grid-template-columns: 200px 1fr; gap: 24px;"><span class="mono-latin" style="color: var(--gold-deep);">平成 XX 年 X 月</span><span>司法試験 合格</span></li>
          <li style="padding: 18px 0; border-bottom: 1px solid var(--hair); display: grid; grid-template-columns: 200px 1fr; gap: 24px;"><span class="mono-latin" style="color: var(--gold-deep);">令和 XX 年 X 月</span><span>弁護士登録（岐阜県弁護士会）</span></li>
          <li style="padding: 18px 0; display: grid; grid-template-columns: 200px 1fr; gap: 24px;"><span class="mono-latin" style="color: var(--gold-deep);">令和 XX 年 X 月</span><span>星ヶ丘法律事務所 開設</span></li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="section__inner section__inner--narrow prose">
        <p class="section-eyebrow">Why I Chose Law</p>
        <h2 style="border: none; padding: 0; margin: 0 0 24px;">弁護士を志した理由</h2>
        <div class="divider"></div>
        <p>市役所で市民の方の相談を受けていた X 年間、「制度の壁の手前で困っている人」に何度も出会いました。相談窓口では「これは弁護士さんに」とお伝えするしかない場面が多く、そのたびに「自分で最後まで力になれたら」と考えるようになりました。</p>
        <p>役所を退職して勉強を始めたのは決して早い挑戦ではありませんでしたが、市民の方に近い立場で働いてきた経験は、いまも法律相談の現場でそのまま役に立っています。</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="section__inner">
        <p class="section-eyebrow">Values</p>
        <h2 class="section-title">大切にしていること</h2>
        <div class="divider"></div>
        <div class="stances">
          <article class="stance">
            <div class="stance__num">01</div>
            <h3 class="stance__title">「わかった気」で<br />終わらせない</h3>
            <p class="stance__body">
              法律相談は、専門用語をひととおり並べれば「説明した」ことになってしまいがちです。しかし、相談者の方が納得して次の一歩を選べなければ、意味がありません。ご説明のあと、必ず「ここまでで分かりにくかった点はありませんか」とお聞きします。
            </p>
          </article>
          <article class="stance">
            <div class="stance__num">02</div>
            <h3 class="stance__title">費用と見通しは<br />先に出す</h3>
            <p class="stance__body">
              「やってみないとわかりません」で受任することはしません。着手金・報酬・実費の目安、想定される期間、勝訴・和解・敗訴それぞれの見込みを、依頼を受ける前にお伝えします。
            </p>
          </article>
          <article class="stance">
            <div class="stance__num">03</div>
            <h3 class="stance__title">断ることも<br />仕事のうち</h3>
            <p class="stance__body">
              弁護士に依頼するより、話し合い・行政窓口・他士業（司法書士 / 税理士 / 社労士）のほうが向いている案件もあります。その場合は率直にお伝えし、必要に応じて紹介します。
            </p>
          </article>
        </div>
      </div>
    </section>
  `,
});

// -- PRACTICE INDEX ---------------------------------------------
const practiceIndexPage = () => layout({
  title: "取扱分野",
  description: "相続・離婚・債務整理・交通事故・成年後見・不動産・その他一般民事を扱います。星ヶ丘法律事務所の取扱分野一覧。",
  active: "areas",
  assets: "../assets",
  depth: 1,
  body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Practice Areas</p>
        <h1 class="page-hero__title">取扱分野</h1>
        <p class="page-hero__sub">地域の方から寄せられる一般民事を、幅広くお受けしています。</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <p class="section-lead">
          企業法務・刑事事件のように高度に専門化された分野は、必要に応じて他事務所をご紹介します。<br />
          対応範囲外だった場合も、その旨を初回のご相談ではっきりお伝えします。
        </p>

        <div class="areas">
          ${areaTile2("01", "相続", "遺産分割 / 遺言書作成 / 相続放棄", "inheritance.html")}
          ${areaTile2("02", "離婚", "協議離婚 / 調停 / 慰謝料 / 親権 / 養育費", "divorce.html")}
          ${areaTile2("03", "債務整理", "任意整理 / 個人再生 / 自己破産", "debt.html")}
          ${areaTile2("04", "交通事故", "示談交渉 / 後遺障害等級 / 損害賠償", "traffic.html")}
          ${areaTile2("05", "成年後見", "法定後見 / 任意後見 / 財産管理", "guardianship.html")}
          ${areaTile2("06", "不動産", "借地借家 / 境界 / 売買トラブル", "real-estate.html")}
          ${areaTile2("07", "その他一般民事", "貸金 / 労働 / 消費者トラブル 他", "general-civil.html")}
        </div>
      </div>
    </section>

    <section class="section section--alt section--tight">
      <div class="section__inner section__inner--narrow prose">
        <p class="section-eyebrow">Notice</p>
        <h2 style="border: none; padding: 0; margin: 0 0 24px;">お受けしない・慎重に判断する案件</h2>
        <div class="divider"></div>
        <p>以下は、単独開業のため十分な体制で対応できない可能性があるものです。ご相談の段階で率直にお伝えします。</p>
        <ul>
          <li>大規模な企業法務（M&amp;A / 上場対応 等）</li>
          <li>重大な刑事事件で長期の身柄拘束を伴うもの</li>
          <li>医療・特許など高度な専門分野が中心の事件</li>
        </ul>
        <p>これらは提携先または他事務所をご紹介します。</p>
      </div>
    </section>
  `,
});

function areaTile2(num, title, ex, href) {
  return `
          <a class="area" href="./${href}">
            <p class="area__num">No. ${num}</p>
            <h3 class="area__title">${title}</h3>
            <p class="area__ex">${ex}</p>
            <span class="area__more">Read More</span>
          </a>`;
}

// ============================================================
// Practice sub-pages
// ============================================================
function practiceSubPage({ slug, num, latin, title, sub, exampleItems, meritItems, cautionItems, flowItems, outlookItems, extras = "" }) {
  const cautionHtml = cautionItems.map(c => `<li><strong>${c.bold}</strong>${c.rest}</li>`).join("\n            ");
  return layout({
    title,
    description: sub,
    active: `area:${slug}`,
    assets: "../assets",
    depth: 1,
    body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Practice ${num}</p>
        <h1 class="page-hero__title">${title}</h1>
        <p class="page-hero__sub">${sub}</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner section__inner--narrow prose">
        <h2>こんなご相談を受けています</h2>
        <ul>
          ${exampleItems.map(i => `<li>${i}</li>`).join("\n            ")}
        </ul>

        <h2>弁護士に依頼するメリット</h2>
        <ul>
          ${meritItems.map(i => `<li>${i}</li>`).join("\n            ")}
        </ul>

        <div class="callout">
          <p class="callout__label">Notice — 依頼前に知っておいていただきたい点</p>
          <ul style="margin: 0; padding-left: 1.2em;">
            ${cautionHtml}
          </ul>
        </div>

        ${flowItems ? `<h2>対応の流れ</h2>
        <ol>
          ${flowItems.map(i => `<li>${i}</li>`).join("\n            ")}
        </ol>` : ""}

        ${outlookItems ? `<h2>見通しの目安</h2>
        <ul>
          ${outlookItems.map(i => `<li>${i}</li>`).join("\n            ")}
        </ul>` : ""}

        ${extras}
      </div>
    </section>
  `,
  });
}

// -- FLOW -------------------------------------------------------
const flowPage = () => layout({
  title: "相談の流れ",
  description: "初めての方でも安心してご利用いただけるよう、お問い合わせから解決まで 5 つのステップに分けてご案内します。",
  active: "flow",
  body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Consultation Flow</p>
        <h1 class="page-hero__title">相談の流れ</h1>
        <p class="page-hero__sub">お問い合わせから解決まで、5 つのステップに分けてご案内します。</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner section__inner--narrow">
        <div class="flow">
          <div class="flow__step">
            <div class="flow__num">01<small>Contact</small></div>
            <div class="flow__body">
              <h3>お問い合わせ</h3>
              <p>お電話またはお問い合わせフォームでご連絡ください。ご相談の概要と、ご希望の日時を 2〜3 候補お知らせいただけるとスムーズです。</p>
              <ul>
                <li>電話: ${SITE.phone} / ${SITE.hours}</li>
                <li>お問い合わせフォーム: 24 時間受付</li>
              </ul>
            </div>
          </div>
          <div class="flow__step">
            <div class="flow__num">02<small>Meeting</small></div>
            <div class="flow__body">
              <h3>ご相談</h3>
              <p>初回のご相談は、事務所へお越しいただくか、電話・ビデオ通話でも対応します。ご来所が難しい方は出張相談もご相談ください。</p>
              <ul>
                <li>時間: 約 60 分</li>
                <li>費用: 料金ページをご覧ください</li>
              </ul>
            </div>
          </div>
          <div class="flow__step">
            <div class="flow__num">03<small>Proposal</small></div>
            <div class="flow__body">
              <h3>方針のご説明</h3>
              <p>お話を伺ったうえで、想定される進め方（交渉 / 調停 / 訴訟 等）、見込まれる期間、費用の目安、想定されるリスクを、その場でお伝えします。</p>
              <p>その日のうちにお決めいただく必要はありません。持ち帰ってご検討ください。</p>
            </div>
          </div>
          <div class="flow__step">
            <div class="flow__num">04<small>Retainer</small></div>
            <div class="flow__body">
              <h3>ご依頼</h3>
              <p>方針にご納得いただけたら、委任契約書を取り交わします。着手金のお支払いは、契約の際にお願いしています。</p>
            </div>
          </div>
          <div class="flow__step">
            <div class="flow__num">05<small>Resolution</small></div>
            <div class="flow__body">
              <h3>解決・ご報告</h3>
              <p>事件の進捗は随時ご報告します。解決後は、報酬金の精算と、記録の返却を行います。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt section--tight">
      <div class="section__inner section__inner--narrow prose">
        <p class="section-eyebrow">Bring With You</p>
        <h2 style="border: none; padding: 0; margin: 0 0 24px;">ご相談時にお持ちいただくと便利なもの</h2>
        <div class="divider"></div>
        <ul>
          <li>相手方とのやり取り（メール / 手紙 / メッセージのスクリーンショット）</li>
          <li>契約書・請求書などの関係書類</li>
          <li>ご印鑑・身分証明書（依頼まで進む場合）</li>
        </ul>
        <p>わからない場合は、そのままお越しいただいて構いません。</p>
      </div>
    </section>
  `,
});

// -- FEE --------------------------------------------------------
const feePage = () => layout({
  title: "料金",
  description: "初回相談料・着手金・報酬金の考え方、分野別の目安。日本弁護士連合会 (旧) 報酬基準を参考に、事案に応じて個別お見積りをお出しします。",
  active: "fee",
  body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Fee Schedule</p>
        <h1 class="page-hero__title">料金</h1>
        <p class="page-hero__sub">すべて税込・目安金額です。ご依頼前に必ず個別のお見積りをお出しします。</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner section__inner--narrow prose">
        <h2>相談料</h2>
        <table>
          <tr><th>内容</th><th>料金</th></tr>
          <tr><td>初回相談（60 分まで）</td><td>5,500 円</td></tr>
          <tr><td>継続相談（30 分ごと）</td><td>2,750 円</td></tr>
        </table>
        <p>※初回無料とするかは、ヒアリング後に確定。</p>

        <h2>着手金・報酬金の考え方</h2>
        <p>日本弁護士連合会の（旧）報酬基準を参考に、以下の目安で算定します。</p>
        <table>
          <tr><th>経済的利益</th><th>着手金</th><th>報酬金</th></tr>
          <tr><td>300 万円以下</td><td>8%（最低 11 万円）</td><td>16%</td></tr>
          <tr><td>300 万円超〜3,000 万円以下</td><td>5% + 9 万円</td><td>10% + 18 万円</td></tr>
          <tr><td>3,000 万円超〜3 億円以下</td><td>3% + 69 万円</td><td>6% + 138 万円</td></tr>
        </table>
        <p>※事案の複雑さ・見込みによって上下します。</p>

        <h2>実費・日当</h2>
        <ul>
          <li><strong>実費</strong>: 収入印紙 / 郵券 / 交通費 / コピー代 等の実額</li>
          <li><strong>日当</strong>: 遠方出張の際、半日 33,000 円 / 1 日 55,000 円</li>
        </ul>

        <h2>分野別の目安（参考）</h2>
        <table>
          <tr><th>分野</th><th>着手金の目安</th></tr>
          <tr><td>遺産分割</td><td>33 万円〜</td></tr>
          <tr><td>離婚交渉</td><td>22 万円〜</td></tr>
          <tr><td>離婚調停</td><td>33 万円〜</td></tr>
          <tr><td>任意整理</td><td>1 社 3.3 万円〜</td></tr>
          <tr><td>個人再生</td><td>33 万円〜</td></tr>
          <tr><td>自己破産</td><td>22 万円〜</td></tr>
          <tr><td>交通事故（示談）</td><td>弁護士費用特約利用可</td></tr>
        </table>

        <div class="callout">
          <p class="callout__label">Legal Aid — 費用のご負担が難しい場合</p>
          <p>法テラス（日本司法支援センター）の民事法律扶助制度を利用できる場合があります。ご相談時にお申し出ください。</p>
        </div>
      </div>
    </section>
  `,
});

// -- FAQ --------------------------------------------------------
const FAQS = [
  { q: "相談だけでも大丈夫ですか？", a: "はい、相談のみでも構いません。ご相談内容を伺ったうえで、依頼が必要かどうかも含めてお話しします。「弁護士に頼むほどではない」と判断した場合は、その旨をお伝えします。" },
  { q: "どんな服装で行けばよいですか？", a: "普段着で構いません。かしこまった服装でお越しいただく必要はありません。" },
  { q: "家族や友人と一緒に相談してもいいですか？", a: "はい、可能です。特にご高齢の方の場合、ご家族の同席をおすすめすることもあります。ただし、相談内容によっては、途中でご本人だけとお話しする時間を設けさせていただく場合があります。" },
  { q: "相談内容が誰かに漏れることはありませんか？", a: "弁護士には、法律で厳格な守秘義務が課されています。ご相談いただいた内容が、ご本人の同意なく外部に伝わることはありません。" },
  { q: "依頼した場合、費用はいつ払いますか？", a: "着手金は契約時にお支払いいただきます。報酬金は事件の解決後にお支払いいただきます。分割払いのご相談も可能です。" },
  { q: "事務所まで行くのが難しいのですが、対応してもらえますか？", a: "はい、ご高齢の方・入院中の方・お仕事で時間が取れない方向けに、出張相談・ビデオ通話相談も承っています。詳しくはお電話でお問い合わせください。" },
  { q: "対応できない相談はありますか？", a: "大規模な企業法務、重大な刑事事件、医療過誤など高度に専門化した分野は、当事務所単独では十分な体制を組めない場合があります。その際は他事務所をご紹介します。" },
];

const faqPage = () => layout({
  title: "よくある質問",
  description: "相談・費用・対応可能な範囲についてのよくあるご質問。",
  active: "faq",
  body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Questions</p>
        <h1 class="page-hero__title">よくある質問</h1>
        <p class="page-hero__sub">初めてご相談される方から多くいただくご質問をまとめました。</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner section__inner--narrow">
        <div class="faq">
          ${FAQS.map(f => `
          <div class="faq__item">
            <p class="faq__q">${f.q}</p>
            <p class="faq__a">${f.a}</p>
          </div>`).join("")}
        </div>
      </div>
    </section>
  `,
});

// -- ACCESS -----------------------------------------------------
const accessPage = () => layout({
  title: "アクセス",
  description: `所在地: ${SITE.address}。電車・バス・お車でのアクセス、営業時間、出張相談についてご案内します。`,
  active: "access",
  body: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Access</p>
        <h1 class="page-hero__title">アクセス</h1>
        <p class="page-hero__sub">${SITE.postcode} ${SITE.address}</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="access-grid">
          <div class="access-info">
            <p class="section-eyebrow">Contact</p>
            <h2 class="section-title" style="font-size: 24px;">お問い合わせ</h2>
            <div class="divider"></div>
            <dl>
              <dt>Address</dt>
              <dd>${SITE.postcode}<br />${SITE.address}</dd>
              <dt>Tel</dt>
              <dd>${SITE.phone}</dd>
              <dt>Fax</dt>
              <dd>058-000-0001</dd>
              <dt>Email</dt>
              <dd>${SITE.email}</dd>
              <dt>Business Hours</dt>
              <dd>平日 9:00〜18:00<br />土日祝: 定休（事前予約で対応可）</dd>
            </dl>
          </div>
          <div>
            <p class="section-eyebrow">Location</p>
            <h2 class="section-title" style="font-size: 24px;">地図</h2>
            <div class="divider"></div>
            <div class="access-map">Google Maps — 実装時に埋め込み</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt section--tight">
      <div class="section__inner section__inner--narrow prose">
        <p class="section-eyebrow">Directions</p>
        <h2 style="border: none; padding: 0; margin: 0 0 24px;">交通アクセス</h2>
        <div class="divider"></div>
        <ul>
          <li><strong>電車</strong>: JR ○○線「○○駅」 徒歩 X 分</li>
          <li><strong>バス</strong>: ○○バス「○○停留所」 徒歩 X 分</li>
          <li><strong>お車</strong>: 東海環状自動車道「○○IC」より約 X 分 / 提携駐車場あり</li>
        </ul>

        <h2>出張相談</h2>
        <p>ご高齢・ご病気・お仕事の都合等でご来所が難しい方は、出張相談を承ります。</p>
        <ul>
          <li>対応エリア: 岐阜県内全域 / 愛知県一部</li>
          <li>出張料: 距離に応じて別途（料金ページ参照）</li>
        </ul>
      </div>
    </section>
  `,
});

// ============================================================
// Practice sub-pages content
// ============================================================
const practicePages = {
  inheritance: practiceSubPage({
    slug: "inheritance",
    num: "01",
    latin: "Inheritance",
    title: "相続",
    sub: "遺産分割 / 遺言書作成 / 相続放棄 / 遺留分請求 など",
    exampleItems: [
      "親が亡くなったが、兄弟の間で分け方の話がまとまらない",
      "遺言書が出てきたが、書き方に問題がありそう",
      "借金のほうが多いので相続を放棄したい（期限は原則 3 か月以内）",
      "「寄与分」（親の介護をした分を多めに受け取る主張）が認められるか知りたい",
      "遺留分（法律上、必ず一定額もらえる取り分）を請求したい",
    ],
    meritItems: [
      "話し合いの窓口を弁護士が引き受けるため、親族と直接やり取りしなくてよくなる",
      "法定相続分・遺留分の計算、必要書類（戸籍・不動産評価・預金調査）を代行できる",
      "調停・審判に進んだ場合の書類作成と出席をそのまま任せられる",
    ],
    cautionItems: [
      { bold: "弁護士費用がかかる", rest: ": 相続財産の総額が少ない場合、費用倒れになることがあります。目安は<a href='../fee.html'>料金</a>をご確認ください" },
      { bold: "時間がかかる", rest: ": 遺産分割調停は、月 1 回のペースで進み、決着まで半年〜1 年以上かかることも珍しくありません" },
      { bold: "親族関係が悪化することがある", rest: ": 代理人を立てた時点で「争いになった」と受け止められがちです。まず話し合いで進める方が良い場合もあります" },
      { bold: "相続放棄は期限が厳しい", rest: ": 原則、亡くなったことを知ってから 3 か月以内。過ぎると原則放棄できません" },
    ],
    flowItems: [
      "相続関係の整理（誰が相続人か）",
      "財産の調査（不動産 / 預金 / 借金）",
      "分け方の方針決め",
      "話し合い → まとまらなければ調停 → それでもまとまらなければ審判",
    ],
    outlookItems: [
      "話し合いで済む場合: 数か月",
      "調停に進む場合: 半年〜1 年半",
      "審判まで進む場合: 1〜2 年以上",
    ],
    extras: `<p>いずれも「必ずこの通り」ではありません。事案によって変わります。</p>`,
  }),
  divorce: practiceSubPage({
    slug: "divorce",
    num: "02",
    latin: "Divorce",
    title: "離婚",
    sub: "協議離婚 / 調停 / 慰謝料 / 親権 / 養育費 / 婚姻費用",
    exampleItems: [
      "話し合いで離婚したいが、条件（慰謝料 / 財産分与 / 養育費）が折り合わない",
      "相手が離婚に応じてくれない",
      "親権（子どもをどちらが引き取るか）を争いたい",
      "DV・モラハラを受けており、まず身を守りたい",
      "別居中の生活費（婚姻費用）を請求したい",
    ],
    meritItems: [
      "相手や相手の代理人と直接やり取りしなくてよくなる",
      "慰謝料・財産分与・養育費の相場を踏まえた条件を組み立てられる",
      "調停・裁判に進んだ場合の書類・出頭を任せられる",
      "DV 事案では、住所秘匿・保護命令（裁判所が相手に接近禁止を命じる制度）の手続きを一緒に進められる",
    ],
    cautionItems: [
      { bold: "感情面の負担は残る", rest: ": 弁護士が窓口になっても、争点整理のために過去のやり取りを詳しく話していただく必要があります" },
      { bold: "時間がかかる", rest: ": 協議離婚が最短ですが、調停に進むと半年〜1 年、裁判まで行くと 1〜2 年になることがあります" },
      { bold: "希望通りの結論が出るとは限らない", rest: ": 特に親権は、これまでの監護実績（どちらが主に子どもの世話をしてきたか）が重視されます" },
      { bold: "費用がかかる", rest: ": 経済的に余裕がない場合は、法テラス（国が設けた無料相談・費用立替制度）の利用もご案内します" },
    ],
    flowItems: [
      "現状の整理（別居の有無 / 子ども / 財産 / DV の有無）",
      "方針決め（協議 / 調停 / 裁判）",
      "協議書または調停申立ての作成",
      "まとまらなければ裁判へ",
    ],
    outlookItems: [
      "協議離婚: 数週間〜数か月",
      "調停離婚: 半年〜1 年",
      "裁判離婚: 1〜2 年",
    ],
    extras: `<p>親権・面会交流を強く争う場合は、上記より長引く傾向があります。</p>`,
  }),
  debt: practiceSubPage({
    slug: "debt",
    num: "03",
    latin: "Debt",
    title: "債務整理",
    sub: "任意整理 / 個人再生 / 自己破産 / 過払い金請求",
    exampleItems: [
      "毎月の返済が生活費を圧迫している",
      "取り立ての電話が止まらない",
      "住宅は残したまま借金を減らしたい",
      "過去の高金利取引で払い過ぎがあった可能性がある",
    ],
    meritItems: [
      "依頼した日から、業者からの取り立て・督促電話が止まります（受任通知の効果）",
      "過払い金（払い過ぎた利息）がある場合、取り戻せる可能性があります",
      "個人再生・自己破産の複雑な書類作成をそのまま任せられます",
    ],
    cautionItems: [
      { bold: "信用情報（いわゆるブラックリスト）に登録される", rest: ": 任意整理で 5 年程度、個人再生・自己破産で 5〜10 年程度、新たな借入・クレジットカード作成が難しくなります" },
      { bold: "自己破産では一部の職業が制限される", rest: ": 手続き中、警備員・保険募集人・宅建業など特定の職業に就けなくなる期間があります（免責後は元に戻ります）" },
      { bold: "自己破産では原則、価値のある財産を手放す", rest: ": 自宅・車（時価が高いもの）は原則処分対象です" },
      { bold: "家族・保証人への影響", rest: ": 保証人が付いている借金は、本人が整理すると保証人に請求が行きます" },
    ],
    flowItems: null,
    outlookItems: [
      "任意整理: 交渉 3〜6 か月 + 返済 3〜5 年",
      "個人再生: 手続き 6 か月〜1 年 + 返済 3〜5 年",
      "自己破産: 手続き 6 か月〜1 年（財産の状況で変動）",
    ],
    extras: `
      <h2>3 つの方法</h2>
      <table>
        <tr><th>方法</th><th>内容</th><th>向いている方</th></tr>
        <tr><td>任意整理</td><td>弁護士が業者と交渉し、将来の利息をカットして分割払いに直す</td><td>収入があり、3〜5 年で完済できる見込みがある方</td></tr>
        <tr><td>個人再生</td><td>裁判所を通し、借金を大幅に（原則 5 分の 1 程度に）減らす。住宅ローン特則で自宅を残せる場合あり</td><td>借金が多く、任意整理では返せないが、住宅を残したい方</td></tr>
        <tr><td>自己破産</td><td>裁判所に免責（借金をゼロにしてもらう決定）を求める</td><td>収入や資産では返済の見込みが立たない方</td></tr>
      </table>

      <h2>相談時に用意していただけると助かるもの</h2>
      <ul>
        <li>借入先の一覧（業者名・借入残高・返済状況）</li>
        <li>直近の給与明細・家計収支のわかるもの</li>
        <li>過去に借りていた業者があれば、その情報（過払い金調査の手掛かりになります）</li>
      </ul>
    `,
  }),
  traffic: practiceSubPage({
    slug: "traffic",
    num: "04",
    latin: "Traffic",
    title: "交通事故",
    sub: "示談交渉 / 後遺障害等級認定 / 損害賠償",
    exampleItems: [
      "保険会社から示談金の提示があったが、金額が妥当か知りたい",
      "後遺症が残ったが、後遺障害の等級認定（症状の重さを 1〜14 級で認定する仕組み）をどう進めればいいかわからない",
      "過失割合（どちらにどれだけ非があるかの割合）に納得できない",
      "相手が任意保険に入っておらず、賠償が受けられない",
    ],
    meritItems: [
      "慰謝料の算定基準を、自賠責基準 → 任意保険基準 → 弁護士基準へ引き上げられる場合があります（弁護士基準がもっとも高額になりやすい）",
      "後遺障害の等級認定に必要な医証（診断書 / 検査結果）の整え方をアドバイスできます",
      "保険会社との交渉窓口を任せられます",
    ],
    cautionItems: [
      { bold: "必ず増額するとは限らない", rest: ": すでに保険会社が高めの提示をしていた場合、増額の余地が小さいことがあります" },
      { bold: "弁護士費用特約の有無で費用感が大きく変わる", rest: ": ご自身または家族の自動車保険に「弁護士費用特約」が付いていれば、費用の多くが保険から出ます。まずお手元の保険証券をご確認ください" },
      { bold: "時間がかかる", rest: ": 症状固定（これ以上治療しても回復が見込めない状態）を待ってから示談交渉に入るため、事故から 1 年前後かかることがあります" },
      { bold: "医学的に因果関係が認められないと厳しい", rest: ": 「事故のせいで痛みが続いている」とご本人が感じていても、画像・検査で裏付けができないと後遺障害等級は認定されにくいのが実情です" },
    ],
    flowItems: [
      "事故状況・治療状況の整理",
      "（継続治療中の場合）症状固定まで治療継続をサポート",
      "後遺障害の等級申請（必要な場合）",
      "示談交渉 → まとまらなければ ADR（紛争解決機関）または訴訟",
    ],
    outlookItems: [
      "物損のみ: 数か月",
      "人身・示談で済む場合: 事故から半年〜1 年半",
      "訴訟に進む場合: さらに 1 年前後",
    ],
  }),
  guardianship: practiceSubPage({
    slug: "guardianship",
    num: "05",
    latin: "Guardianship",
    title: "成年後見",
    sub: "法定後見 / 任意後見 / 財産管理支援",
    exampleItems: [
      "親が認知症になり、預金の引き出しや不動産の売却ができなくて困っている",
      "介護施設の入所契約を家族が代わりに結びたい",
      "一人暮らしの高齢の親のために、任意後見を検討したい",
      "現在の後見人（家族）が使い込んでいるのではないかと不安",
    ],
    meritItems: [
      "家庭裁判所への申立て書類・診断書の準備を代行できます",
      "親族間で「誰が後見人になるか」でもめている場合、中立的に整理できます",
      "任意後見契約の内容を、本人の希望に沿って設計できます",
    ],
    cautionItems: [
      { bold: "後見人が就くと、本人が自由にお金を使いにくくなる", rest: ": 家庭裁判所への定期報告が必要で、大きな出費（自宅の売却 / 高額商品の購入）は事前相談が必要になります" },
      { bold: "一度始めると原則やめられない", rest: ": 判断能力が回復しない限り、本人が亡くなるまで続きます" },
      { bold: "専門職後見人には毎月報酬が発生する", rest: ": 家庭裁判所の相場で月 2〜6 万円程度（財産額に応じる）" },
      { bold: "家族が後見人になれるとは限らない", rest: ": 財産が多い / 親族間で対立があるといった事情があると、家庭裁判所は専門職を選ぶ傾向があります" },
    ],
    flowItems: null,
    outlookItems: [
      "法定後見の申立て: 診断書取得〜審判まで 2〜4 か月",
      "任意後見契約: 契約書作成 + 公証役場での手続きで 1〜2 か月",
    ],
    extras: `
      <h2>2 種類の後見</h2>
      <p>認知症・知的障害・精神障害などで判断能力が十分でない方に代わって、財産管理や契約手続きを支援する制度です。大きく分けて 2 種類あります。</p>
      <table>
        <tr><th>種類</th><th>いつ使うか</th><th>誰が後見人になるか</th></tr>
        <tr><td>法定後見</td><td>すでに判断能力が低下しているとき、家庭裁判所が後見人を選任</td><td>家庭裁判所が親族または専門職（弁護士・司法書士）から選ぶ</td></tr>
        <tr><td>任意後見</td><td>まだ元気なうちに、将来に備えて自分で後見人と契約しておく</td><td>本人があらかじめ選んだ人</td></tr>
      </table>
    `,
  }),
  "real-estate": practiceSubPage({
    slug: "real-estate",
    num: "06",
    latin: "Real Estate",
    title: "不動産",
    sub: "借地借家 / 明渡し / 境界 / 売買トラブル / 契約不適合責任",
    exampleItems: [
      "貸している部屋の家賃を滞納されている / 明渡しを求めたい",
      "大家から突然の立ち退きを求められた",
      "隣地との境界がはっきりせず、話し合いが進まない",
      "中古住宅を買ったが、雨漏りなど契約で聞いていなかった不具合が見つかった（契約不適合責任）",
      "相続した実家を売りたいが、名義変更や共有者との調整が必要",
    ],
    meritItems: [
      "内容証明郵便による正式な通知（督促 / 契約解除 / 損害賠償請求）を作成・送付できます",
      "明渡し訴訟・強制執行までを一貫して任せられます",
      "境界確定は、土地家屋調査士との連携が必要になるため、窓口を弁護士が引き受けて調整できます",
      "売買トラブルは、契約書と重要事項説明書を精査し、業者・売主への請求方針を立てます",
    ],
    cautionItems: [
      { bold: "明渡しは時間がかかる", rest: ": 交渉 → 訴訟 → 判決 → 強制執行まで進めると、半年〜1 年以上かかります" },
      { bold: "強制執行には費用がかかる", rest: ": 執行官への予納金・引越し費用の立替えが必要で、家賃滞納額と比べて回収の見込みが立たない場合があります" },
      { bold: "境界紛争は隣人関係が長く残る", rest: ": 判決で決着しても、隣に住み続ける以上、関係修復のコストは残ります。話し合いでの解決を優先する場合が多いです" },
      { bold: "契約不適合責任は「知らなかった」証明が難しい", rest: ": 買主側で、購入時に不具合を認識していなかったこと・売主が告知しなかったことの立証が必要になります" },
    ],
    flowItems: null,
    outlookItems: [
      "明渡し（交渉）: 数か月",
      "明渡し（訴訟〜強制執行）: 半年〜1 年半",
      "境界確定: 話し合いで済めば数か月、筆界特定・訴訟に進むと 1〜2 年",
    ],
  }),
  "general-civil": practiceSubPage({
    slug: "general-civil",
    num: "07",
    latin: "General Civil",
    title: "その他一般民事",
    sub: "貸金 / 労働 / 消費者トラブル / 名誉毀損 / 近隣トラブル 他",
    exampleItems: [
      "個人間で貸したお金が返ってこない",
      "取引先が代金を払ってくれない",
      "未払い残業代を請求したい / 不当解雇を争いたい",
      "訪問販売で結んでしまった契約を取り消したい（クーリング・オフ）",
      "ネット上に誹謗中傷を書かれ、投稿者を特定して損害賠償を請求したい",
      "騒音・悪臭・ペットに関する近隣トラブル",
    ],
    meritItems: [
      "個人での交渉が難しい相手（法人 / 業者 / 匿名の投稿者）にも、法的な手続きで正面から請求できます",
      "内容証明郵便・訴訟提起・強制執行までを一貫して任せられます",
    ],
    cautionItems: [
      { bold: "少額の請求では費用倒れになりやすい", rest: ": 請求額が数十万円以下の場合、弁護士費用のほうが高くなることがあります。少額訴訟（60 万円以下・原則 1 回で判決）やご自身での対応をおすすめする場合もあります" },
      { bold: "相手に支払い能力がないと回収できない", rest: ": 判決が出ても、相手に財産がなければ実際にお金を取り戻すのは困難です。事前に見通しをお伝えします" },
      { bold: "発信者情報開示は時間がかかる", rest: ": SNS 投稿者の特定は、プロバイダへの手続きを段階的に進めるため、半年前後かかることがあります" },
    ],
    flowItems: null,
    outlookItems: null,
    extras: `
      <h2>対応する主な分野</h2>
      <h3>貸金・売掛金の回収</h3>
      <ul>
        <li>個人間で貸したお金が返ってこない</li>
        <li>取引先が代金を払ってくれない</li>
      </ul>
      <h3>労働問題（労働者側）</h3>
      <ul>
        <li>未払い残業代を請求したい</li>
        <li>不当解雇を争いたい</li>
        <li>パワハラ・セクハラを受けている</li>
      </ul>
      <h3>消費者トラブル</h3>
      <ul>
        <li>訪問販売・電話勧誘で結んでしまった契約を取り消したい（クーリング・オフ）</li>
        <li>悪質な業者から返金を受けたい</li>
        <li>インターネット通販のトラブル</li>
      </ul>
      <h3>名誉毀損・SNS 上のトラブル</h3>
      <ul>
        <li>ネット上に誹謗中傷を書かれた</li>
        <li>投稿者を特定して損害賠償を請求したい（発信者情報開示）</li>
      </ul>
      <h3>近隣トラブル</h3>
      <ul>
        <li>騒音・悪臭</li>
        <li>ペットに関するトラブル</li>
      </ul>

      <h2>対応が難しい・お断りする場合</h2>
      <ul>
        <li>高度に専門化された分野（特許 / 医療過誤 の一部 など）</li>
        <li>大規模な企業法務・国際案件</li>
      </ul>
      <p>これらは、必要に応じて他の専門事務所をご紹介します。</p>
    `,
  }),
};

// ============================================================
// Write files
// ============================================================
async function writeFile(rel, content) {
  const abs = path.join(__dirname, rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, "utf-8");
  console.log(`✓ wrote ${rel}`);
}

async function main() {
  await writeFile("index.html", topPage());
  await writeFile("lawyer.html", lawyerPage());
  await writeFile("flow.html", flowPage());
  await writeFile("fee.html", feePage());
  await writeFile("faq.html", faqPage());
  await writeFile("access.html", accessPage());
  await writeFile("practice-areas/index.html", practiceIndexPage());
  for (const [slug, html] of Object.entries(practicePages)) {
    await writeFile(`practice-areas/${slug}.html`, html);
  }
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
