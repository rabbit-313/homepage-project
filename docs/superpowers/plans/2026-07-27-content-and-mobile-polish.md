# Services文言・モバイル表示調整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Services セクションの特徴リストの表示形式と本文の文末表現を改善し、モバイル幅でのセクション余白の間延びを解消する。

**Architecture:** 静的サイト（index.html / style.css / main.js のみ、ビルドツールなし）に対する直接編集。自動テストは存在しないため、各タスクの検証は Chrome DevTools MCP でローカルサーバー上の実ページをデスクトップ幅・モバイル幅（375px）でスクリーンショット確認する形で行う。

**Tech Stack:** HTML / CSS（vanilla）、動作確認に Python の `http.server` と Chrome DevTools MCP を使用。

## Global Constraints

- 経歴・スキル・論文などの事実情報は変更しない
- セクションの並び順・構成、Hero の文言は変更しない
- Skills のタグ表示形式（`.skill-tags` / `.skill-tag`）は変更しない
- three.js のパーティクル演出、配色（CSS変数）、フォントは変更しない
- 文言のトーンは「堅実・簡潔」（誇張を避ける）を維持する
- Services の特徴リスト（`<li>` の中身のテキスト）自体は変更しない。変更するのは表示形式のみ

---

### Task 1: Services 特徴リストを縦型リスト表示に変更

**Files:**
- Modify: `style.css:408-424`

**Interfaces:**
- Consumes: なし（独立したCSS変更）
- Produces: `.service-features li::before` が各行頭に表示されるダッシュ記号（Task 4のブラウザ確認で参照）

- [ ] **Step 1: 現在のスタイルを確認する**

`style.css` の408〜424行目が以下であることを確認する。

```css
.service-features {
    list-style: none;
    padding: 0;
}

.service-features li {
    display: inline;
    color: var(--text-muted);
    font-size: 0.85rem;
    font-weight: 300;
}

.service-features li + li::before {
    content: '·';
    margin: 0 0.8rem;
    color: var(--oak-warm);
}
```

- [ ] **Step 2: 縦型リストのスタイルに書き換える**

上記ブロックを以下に置き換える。

```css
.service-features {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.service-features li {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    color: var(--text-muted);
    font-size: 0.85rem;
    font-weight: 300;
}

.service-features li::before {
    content: '–';
    color: var(--oak-warm);
    flex-shrink: 0;
}
```

- [ ] **Step 3: ローカルサーバーを起動する**

Run: `python3 -m http.server 8731`（既に起動済みの場合はこのステップをスキップし、そのポートを使う）

- [ ] **Step 4: ブラウザで確認する**

Chrome DevTools MCP で `http://localhost:8731/index.html` を開き、デスクトップ幅（1280x900程度）で `#services` までスクロールしてスクリーンショットを撮る。

Expected: 各サービスカードの特徴リストが4行の縦並びになり、各行頭に `–` が表示され、行同士が「・」で連結されていないこと。

- [ ] **Step 5: モバイル幅でも確認する**

`emulate` で `375x812x2,mobile,touch` に切り替え、同じ `#services` 部分をスクリーンショットする。

Expected: モバイルでも縦並びリストが崩れず表示されること（横並びが1列に潰れて読みにくくなっていないこと）。

- [ ] **Step 6: コミットする**

```bash
git add style.css
git commit -m "Servicesの特徴リストを縦型リスト表示に変更"
```

---

### Task 2: Services 本文3カ所の文末表現を調整

**Files:**
- Modify: `index.html:71`
- Modify: `index.html:85`
- Modify: `index.html:99`

**Interfaces:**
- Consumes: なし
- Produces: なし（末端タスク）

- [ ] **Step 1: MLモデル開発カードの本文を変更する**

`index.html:71` の以下の行を

```html
<p>推薦システム、画像認識、自然言語処理など、ビジネス課題に最適な機械学習モデルの設計・開発・評価を行います。</p>
```

以下に置き換える。

```html
<p>推薦システム、画像認識、自然言語処理など、ビジネス課題に応じて機械学習モデルを設計・開発・評価します。</p>
```

- [ ] **Step 2: MLインフラ構築カードの本文を変更する**

`index.html:85` の以下の行を

```html
<p>MLモデルを本番環境で安定して運用するためのパイプライン設計、インフラ構築、MLOpsの導入を支援します。</p>
```

以下に置き換える。

```html
<p>MLパイプラインの設計からクラウドインフラ構築、MLOps導入まで、本番環境で安定運用できる仕組みをつくります。</p>
```

- [ ] **Step 3: 技術コンサルティングカードの本文を変更する**

`index.html:99` の以下の行を

```html
<p>ML/AIの導入検討から技術選定、チーム立ち上げまで、技術的な意思決定をサポートします。</p>
```

以下に置き換える。

```html
<p>ML/AI導入の技術検証から技術選定、チーム立ち上げまで、意思決定に必要な判断材料を整理します。</p>
```

- [ ] **Step 4: ブラウザで確認する**

Chrome DevTools MCP で `http://localhost:8731/index.html` をリロードし、`#services` セクションをスクリーンショットする。

Expected: 3カードの本文がそれぞれ異なる文末表現になっており、内容（何をするか）は変わっていないこと。

- [ ] **Step 5: コミットする**

```bash
git add index.html
git commit -m "Servicesセクションの本文の文末表現を調整"
```

---

### Task 3: モバイル幅でのセクション余白を修正

**Files:**
- Modify: `style.css:843-845`

**Interfaces:**
- Consumes: なし
- Produces: なし（末端タスク）

- [ ] **Step 1: 現在のスタイルを確認する**

`style.css` の `@media (max-width: 768px)` 内、843〜845行目が以下であることを確認する。

```css
    .section {
        padding: 5rem 0;
    }
```

- [ ] **Step 2: min-height:auto を追加する**

以下に置き換える。

```css
    .section {
        padding: 5rem 0;
        min-height: auto;
    }
```

- [ ] **Step 3: モバイル幅でセクション間の余白を確認する**

Chrome DevTools MCP で `emulate` を `375x812x2,mobile,touch` にし、`http://localhost:8731/index.html` をリロードする。`#services` の末尾から `#about` の先頭にかけてスクリーンショットを撮る。

Expected: Task 1実施前に確認した「技術コンサルティングカードの後に大きな空白があり、その下にABOUTラベルが来る」状態が解消され、カードの直後に近い位置でABOUTセクションが始まること。

- [ ] **Step 4: 他のセクションも一通り確認する**

`#hero`, `#skills`, `#publications`, `#contact` についても同様にモバイル幅でスクリーンショットし、意図しない崩れ（要素の重なり、極端な余白）がないことを確認する。

- [ ] **Step 5: コミットする**

```bash
git add style.css
git commit -m "モバイル幅でセクションのmin-height:100vh指定を解除"
```

---

### Task 4: 最終確認とローカルサーバーの後片付け

**Files:**
- なし（確認のみ）

**Interfaces:**
- Consumes: Task 1〜3 の変更結果
- Produces: なし

- [ ] **Step 1: 全体差分を確認する**

Run: `git log --oneline -5` および `git diff main --stat`

Expected: Task 1〜3の3コミットに加え、既存の会社名匿名化コミットが含まれていること。意図しないファイルが含まれていないこと。

- [ ] **Step 2: デスクトップ幅で全セクションを通しで確認する**

Chrome DevTools MCP で `emulate` の viewport を解除（または `1280x900` 程度に設定）し、`http://localhost:8731/index.html` の全セクションをスクロールしながらスクリーンショットする。

Expected: デスクトップ表示が崩れていないこと（Task 1〜3はモバイル特有の変更を含むため、デスクトップ側の見た目も壊れていないか必ず確認する）。

- [ ] **Step 3: ローカルサーバーを停止する**

Run: `lsof -ti:8731 | xargs kill` （手順3で起動したプロセスを終了する）
