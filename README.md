# 🎪 学園祭予約システム

シンプルなWebベースの食事予約システムです。学校祭やイベントでの食事注文を管理できます。

## ✨ 機能

- **🍽️ 予約フォーム**: お客様が名前、人数、メニューなどを入力して予約
- **🎫 予約番号発行**: 予約完了時にUUID形式の予約番号を自動生成
- **👨‍💼 スタッフ管理画面**: パスワード認証付きの予約一覧・管理機能
- **📊 統計情報**: 予約状況の可視化
- **📱 レスポンシブ対応**: モバイル・デスクトップ両対応

## 🚀 技術スタック

- **フロントエンド**: [Astro](https://astro.build/) + TypeScript
- **API**: Vercel Edge Functions
- **データベース**: JSON ファイル (シンプル実装)
- **デプロイ**: [Vercel](https://vercel.com/)
- **スタイリング**: Pure CSS

## 📁 プロジェクト構造

```text
/
├── public/
│   ├── reservations.json     # 予約データ
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # 共通レイアウト
│   └── pages/
│       ├── api/
│       │   ├── reserve.ts    # 予約API
│       │   └── list.ts       # 予約一覧API
│       ├── index.astro       # メイン予約フォーム
│       └── staff.astro       # スタッフ管理画面
├── .github/
│   └── copilot-instructions.md
├── astro.config.mjs          # Astro設定
├── vercel.json              # Vercel設定
└── package.json
```

## 🛠️ セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーは `http://localhost:4321` で起動します。

### ビルド

```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview
```

## 🔧 設定

### スタッフパスワード

スタッフ管理画面のパスワードは `src/pages/api/list.ts` で設定されています：

```typescript
const STAFF_PASSWORD = 'school2024'; // 本番環境では環境変数を使用
```

本番環境では環境変数 `STAFF_PASSWORD` を設定することを推奨します。

### メニュー設定

メニューは `src/pages/index.astro` で設定されています：

```html
<option value="yakisoba">焼きそば (¥500)</option>
<option value="takoyaki">たこ焼き (¥400)</option>
<!-- ... -->
```

## 🚀 Vercelでのデプロイ

1. [Vercel](https://vercel.com/) にアカウント作成
2. プロジェクトをGitHubリポジトリにプッシュ
3. Vercelでリポジトリをインポート
4. 自動でデプロイが開始されます

### 環境変数（推奨）

Vercelの環境変数設定で以下を追加：

```
STAFF_PASSWORD=your_secure_password
```

## 📖 使用方法

### お客様の予約手順

1. メインページで予約フォームに必要事項を入力
2. 「予約する」ボタンをクリック
3. 予約番号を確認・保存

### スタッフの管理手順

1. `/staff` ページにアクセス
2. パスワードを入力してログイン
3. 予約一覧・統計情報を確認
4. 必要に応じて予約をキャンセル

## 🔐 セキュリティ

- スタッフページはパスワード認証
- 入力値のバリデーション実装済み
- XSS対策済み

## 🧞 コマンド

プロジェクトルートで実行するコマンド：

| コマンド                | 動作                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 依存関係をインストール                            |
| `npm run dev`             | ローカル開発サーバーを `localhost:4321` で起動      |
| `npm run build`           | 本番用サイトを `./dist/` にビルド          |
| `npm run preview`         | ビルドしたサイトをローカルでプレビュー     |
| `npm run astro ...`       | `astro add`, `astro check` などのCLIコマンドを実行 |
| `npm run astro -- --help` | Astro CLIのヘルプを表示                     |

## 🤝 貢献

Issues や Pull Requests を歓迎します！

## 📄 ライセンス

MIT License

---

*学校祭やイベントでの食事予約管理を簡単に！*
