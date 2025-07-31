<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 学校祭予約システム - GitHub Copilot 指示書

## プロジェクト概要
このプロジェクトは、学校祭での食事予約を管理するシンプルなWebアプリケーションです。

## 技術スタック
- **フロントエンド**: Astro (TypeScript)
- **API**: Vercel Edge Functions
- **デプロイ**: Vercel
- **データ**: JSON ファイル (reservations.json)

## 主な機能
1. **予約フォーム** - 名前、人数、連絡先などの入力
2. **予約確認** - 予約完了後にUUID形式の予約番号を表示
3. **スタッフ管理画面** - 予約一覧の確認機能

## ファイル構造
- `src/pages/index.astro` - メイン予約フォーム
- `src/pages/api/reserve.ts` - 予約API エンドポイント
- `src/pages/api/list.ts` - 予約一覧取得API
- `src/pages/staff.astro` - スタッフ用管理画面
- `public/reservations.json` - 予約データストレージ

## コーディング規約
- TypeScriptを使用し、型安全性を確保する
- APIレスポンスには適切なHTTPステータスコードを使用
- フォームバリデーションを実装する
- シンプルで直感的なUIを心がける
- Vercelデプロイに最適化されたコードを書く
