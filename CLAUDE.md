# Claude Development Workflow

## Git Operations Policy

- **Git commands do not require permission** - Claude can execute all git operations freely
- All development work should follow the feature branch workflow described below

## Development Workflow

### Feature Branch Workflow

1. **Stash current changes** if working on main branch

   ```bash
   git stash push -m "Description of changes"
   ```

2. **Create feature branch** from main

   ```bash
   git checkout -b feature/descriptive-name
   ```

3. **Apply stashed changes** to feature branch

   ```bash
   git stash pop
   ```

4. **Commit changes** with descriptive messages

   ```bash
   git add .
   git commit -m "Clear description of changes"
   ```

5. **Push branch and create PR**
   ```bash
   git push -u origin feature/descriptive-name
   gh pr create --title "Title" --body "Description"
   ```

### Pull Request Guidelines

#### Title Format
- **Language**: English
- **Format**: `[Type] Brief description of changes`
- **Examples**: 
  - `Fix mobile responsive design for iPhone compatibility`
  - `Add dark mode toggle functionality`
  - `Update navigation menu styling`

#### Body Format (Japanese)
**必須セクション**:

```markdown
## 概要
変更の全体的な目的と影響範囲を簡潔に説明

## 何を行ったのか
- 具体的な変更内容をリスト形式で記載
- 追加したファイル、修正したファイル
- 新機能や修正した機能の詳細

## なぜ行ったのか
- 変更の背景や理由
- 解決する問題や改善点
- ユーザーへの影響やメリット

## その他
- 注意点やコメント
- 参考リンク
- 今後のTODO項目
- 関連するissue番号

## 動作確認
- [x] テスト項目1
- [x] テスト項目2
- [ ] 未完了の確認項目
```

### Branch Naming Convention

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable

## Project Structure

- `index.html` - Main portfolio page
- `style.css` - Responsive styles with mobile-first approach
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline
- Auto-deployment to GitHub Pages on main branch

## Development Notes

- Always test responsive design on multiple breakpoints
- Ensure iPhone compatibility for all UI changes
- Follow existing code style and conventions
- Use semantic HTML and accessible design patterns
