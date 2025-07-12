# Ru Portfolio Website

Ruのポートフォリオサイトです。機械学習エンジニアとしての経歴、技術スキル、研究成果を紹介しています。

## 🌟 ライブサイト

**🔗 [https://rabbit-313.github.io/ru-portfolio/](https://rabbit-313.github.io/ru-portfolio/)**

## 📋 概要

このサイトは推薦システムを専門とする機械学習エンジニア **Ru Ito** のポートフォリオサイトです。

### 掲載内容
- **プロフィール**: 推薦システム専門エンジニアとしての背景
- **スキル・専門分野**: 機械学習、深層学習、推薦システム、A/Bテスト等
- **学歴**: 千葉大学工学部・大学院での深層学習研究
- **職歴**: 現在の推薦システム開発業務
- **研究成果**: 超解像技術に関する国際共同研究論文
- **連絡先**: LinkedIn、GitHub、X(Twitter)

## 🛠 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript
- **デザイン**: レスポンシブデザイン、Apple風アニメーション
- **アイコン**: Font Awesome
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions (自動デプロイ)

## ✨ 特徴

### デザイン
- **現代的なUI**: 紫・青・シアンのグラデーションカラーパレット
- **インタラクティブ**: ホバーエフェクト、クリック可能なナビゲーションカード
- **アニメーション**: スクロール視差効果、フェードイン・アップアニメーション
- **レスポンシブ**: iPhone、タブレット、デスクトップ対応

### 機能
- **スムーススクロール**: セクション間の滑らかな移動
- **ハンバーガーメニュー**: モバイル向けナビゲーション
- **パララックス効果**: スクロールに応じた動的な背景
- **自動デプロイ**: mainブランチへのpush時に自動更新

## 🚀 開発・デプロイ

### ローカル開発
```bash
# リポジトリのクローン
git clone https://github.com/rabbit-313/ru-portfolio.git
cd ru-portfolio

# ローカルサーバーで確認（例：Python）
python -m http.server 8000
# または
npx serve .
```

### デプロイメント
- **自動デプロイ**: mainブランチへのpushで自動的にGitHub Pagesに反映
- **PR型開発**: feature/xxxブランチでの開発 → PR → mainマージの流れ

## 📁 プロジェクト構造

```
ru-portfolio/
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions設定
├── .gitignore          # Git無視ファイル設定
├── CLAUDE.md           # 開発ワークフローガイド
└── README.md           # このファイル
```

## 🔧 開発ワークフロー

1. **ブランチ作成**: `git checkout -b feature/new-feature`
2. **開発・テスト**: 変更を実装
3. **PR作成**: 日本語でのPR説明（概要・変更内容・理由・動作確認）
4. **レビュー・マージ**: mainブランチにマージ
5. **自動デプロイ**: GitHub Actionsが自動でサイト更新

詳細な開発ガイドラインは [CLAUDE.md](./CLAUDE.md) を参照してください。

## 📞 お問い合わせ

- **LinkedIn**: [伊藤瑠海](https://linkedin.com/in/伊藤瑠海)
- **GitHub**: [@rabbit-313](https://github.com/rabbit-313)
- **X (Twitter)**: [@rabbit_x86](https://x.com/rabbit_x86)

---

*このポートフォリオサイトは継続的に更新されています。最新情報は上記ライブサイトをご確認ください。*