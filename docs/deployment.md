# Deployment

5 案比較 mock を Vercel に public 公開している。

## URL

- **landing**: https://hoshigaoka.vercel.app
- 案 A 重厚・格式型: https://hoshigaoka.vercel.app/mocks/a-formal/
- 案 B 編集・雑誌型: https://hoshigaoka.vercel.app/mocks/b-editorial/
- 案 C 地域密着型 (第1推奨): https://hoshigaoka.vercel.app/mocks/c-friendly/
- 案 D ミニマル・企業型: https://hoshigaoka.vercel.app/mocks/d-minimal/
- 案 E 情緒・詩的型 (第2推奨): https://hoshigaoka.vercel.app/mocks/e-emotive/

## 構成

- **ホスティング**: Vercel (無料枠 / Hobby プラン)
- **プロジェクト名**: `hoshigaoka`
- **フレームワーク**: なし (素の静的 HTML)
- **ビルド**: なし (`vercel.json` で cleanUrls / trailingSlash のみ設定)
- **公開範囲**: public (`noindex,nofollow` メタタグで検索除外)

## Deploy 対象外 (`.vercelignore`)

- `docs/` — 内部方針・要件整理
- `content/` — ダミー原稿 (mock で HTML 化済)
- `.claude/` — Claude Code の作業ディレクトリ
- `.git/`, `scratchpad/`
- `*.md` (repo root の md ファイル)

## Re-deploy 手順

```
cd /Users/navi/git/shurijoc/hoshigaoka
vercel --prod --yes
```

初回のみ `vercel login` が必要。

## 変更フロー

1. `mocks/<案>/` を編集 or `index.html` (landing) を編集
2. `git commit`
3. `vercel --prod --yes` で本番反映

GitHub 連携は現状未設定。CLI 直 deploy のみ。連携する場合は Vercel dashboard から `shurijoc/hoshigaoka-law` を import。
