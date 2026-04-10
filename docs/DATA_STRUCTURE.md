# データ構造説明書

## 概要

本アプリの学習コンテンツはすべて `src/data/` 配下の JSON ファイルとして管理されています。
これにより、コード改修なしでコンテンツの更新・差し替えが可能です。

## ファイル一覧

### rules_overview.json

制度の基本情報を格納。

| フィールド | 型 | 説明 |
|-----------|------|------|
| system_name | string | 制度名 |
| effective_date | string | 施行日 |
| summary | string | 制度概要 |
| target_age | string | 対象年齢 |
| target_age_detail | string | 対象年齢の詳細説明 |
| basic_policy | string | 取り締まりの基本方針 |
| how_it_works | string[] | 制度の流れ |
| key_points | string[] | 重要ポイント |
| source | string | 出典 |
| updated_at | string | 更新日 |

### violations.json

違反類型の一覧。各項目の構造:

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | 一意識別子（例: "v001"） |
| category | ViolationCategory | カテゴリ |
| title | string | 違反名 |
| short_description | string | 短い説明 |
| legal_basis_optional | string | 根拠法令 |
| penalty_amount | number | 反則金額（円） |
| severity | "low"/"medium"/"high"/"critical" | 危険度 |
| is_priority_for_learning | boolean | 学習優先度が高いか |
| tags | string[] | タグ |
| related_scenarios | string[] | 関連シナリオID |
| explanation | string | 詳細説明 |
| why_dangerous | string | なぜ危険か |
| common_misunderstanding | string | よくある誤解 |
| mnemonic | string | 覚え方のコツ |
| updated_at | string | 更新日 |

### ViolationCategory の定義

- system_basics: 制度の基本
- traffic_position: 通行位置
- intersection: 交差点
- signal: 信号
- stop_sign: 一時停止
- sidewalk: 歩道通行
- road_shoulder: 路側帯
- right_side: 右側通行
- night_riding: 夜間走行
- smartphone: スマホ使用
- safe_driving: 安全運転義務
- railroad: 踏切
- signal_turn: 合図
- parking: 駐停車
- maintenance: 整備不良
- loading: 積載
- other_danger: その他の危険行為
- penalty_understanding: 反則金の理解
- exceptions: 例外・誤解しやすい論点

### scenarios.json

シナリオ問題の一覧。各項目の構造:

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | 一意識別子（例: "s001"） |
| title | string | シナリオタイトル |
| scene_type | string | 場面タイプ |
| description | string | 状況説明 |
| choices | Choice[] | 選択肢（通常4択） |
| correct_choice_id | string | 正解の選択肢ID |
| explanation | string | 解説 |
| linked_violation_ids | string[] | 関連する違反ID |
| difficulty | 1-4 | 難易度 |
| risk_level | string | リスクレベル |
| updated_at | string | 更新日 |

Choice の構造:
- id: string（例: "c1"）
- text: string（選択肢テキスト）
- is_correct: boolean

### glossary.json

用語集。各項目: id, term, reading, definition, related_terms, category

### faq.json

よくある質問。各項目: id, question, answer, category, related_violation_ids

### version.json

データバージョン情報。data_version, last_updated, change_log, source, disclaimer

## データ更新手順

1. 対象の JSON ファイルを編集
2. `version.json` の `data_version` をインクリメント
3. `version.json` の `change_log` に更新内容を追記
4. `last_updated` を更新日に変更
5. ビルド＆デプロイ

## 拡張時の注意

- 新しいカテゴリを追加する場合は `src/types/index.ts` の `ViolationCategory` にも追記
- シナリオの `linked_violation_ids` は既存の violations.json の ID と整合させること
- difficulty は 1（初級）〜 4（実戦）の整数値
