# Mock A: 重厚・格式型 (Formal)

Issue #5 対応。3 案比較用のうち「重厚・格式型」。

## デザイン方針

| 項目 | 採用 |
|---|---|
| 配色 | 濃紺 (`#0d1b2a`) × アイボリー (`#fdfcf7`) × 金 (`#b08d57`) |
| タイポ | Shippori Mincho B1 (見出し) / Noto Serif JP (本文) / Cormorant Garamond (英字) |
| レイアウト | 大きな hero、余白多め、細いゴールド罫、番号は英字イタリック |
| 印象 | 格式・信頼・重厚 |

参考事例 (Issue #5):
- 一色法律事務所 https://isshiki-law.com
- 早川総合法律事務所 https://hayakawa-lawoffice.com
- 東雲法律会計事務所 https://www.shinonome-law.com

## 見方

各 HTML ファイルをブラウザで直接開けば OK。

```
open mocks/a-formal/index.html
```

## 再生成

コンテンツを変更した場合は build 実行:

```
cd mocks/a-formal
node build.mjs
```

npm install 不要（Node 標準モジュールのみ）。生成物 (`*.html`) は commit 対象。

## ファイル構成

```
mocks/a-formal/
  build.mjs           # 静的 HTML 生成スクリプト
  assets/style.css    # 共通スタイル
  index.html          # トップ
  lawyer.html         # 弁護士紹介
  practice-areas/     # 取扱分野 (index + 7 分野)
  flow.html           # 相談の流れ
  fee.html            # 料金
  faq.html            # よくある質問
  access.html         # アクセス
```

## Trade-off メモ

- 要件 (元公務員 × 高齢者 × わかりやすさ) との整合性は 3 案中もっとも低い。格式が過剰に映る可能性あり (特に高齢の方が萎縮しないか)
- 反面「弁護士としての信頼感」は最も強く出せる。「相談してもいい相手か」を最初の 3 秒で判断してもらう素材としてはこの型が最強
- クライアントに 3 案並べて比較する目的で作成
