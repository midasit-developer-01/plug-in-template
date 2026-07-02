<h1 align="center">Plug in Template</h1>

# AI プラグイン開発環境 セットアップガイド

MIDAS Civil / Gen 向けプラグインを、AI ツール（Claude / Gemini / GPT）を使って開発・ビルド・アップロードするための手順です。

---

## 1. AI ツールのインストール

使用するプログラムはどれでも構いません。

### Claude
- ダウンロード: https://claude.com/ja/download
- ログイン情報は開発者にお問い合わせください。

### Gemini
- ダウンロード: https://antigravity.google/

### GPT（Codex）
- ダウンロード: https://openai.com/ja-JP/index/introducing-the-codex-app/

---

## 2. サンプルファイルのダウンロード

下のリンクからファイルをダウンロードします。

- https://github.com/midasit-developer-01/plug-in-template.git
<img width="943" height="469" alt="image" src="https://github.com/user-attachments/assets/c1931e36-f2e5-48b6-a1ee-b53579c5a849" />

---

## 3. 初期設定（Git のインストール）

1. `plug-in-template.zip` を解凍して開きます。
2. `install-git.bat` ファイルをダブルクリックします。
   - `install-git.bat` は **Git** というプログラムをインストールします。
<img width="419" height="615" alt="image" src="https://github.com/user-attachments/assets/e70150e8-1ea4-4241-bc7f-032aae9cf6e2" />

---

## 4. 各 AI プログラムでプロジェクトを読み込む

### Claude
1. **Code** のところで **＋New Session** をクリックします。
2. フォルダ選択で、ダウンロードした `plug-in-template` を指定します。
<img width="1280" height="1041" alt="image" src="https://github.com/user-attachments/assets/45a9658e-bf6c-4a58-9daa-ddd1778a4254" />

### Gemini
1. **File** → **Create Project** をクリックします。
<img width="591" height="227" alt="image" src="https://github.com/user-attachments/assets/c30b5710-b28c-4969-bd3a-a32bf2f7f4d2" />
2. **Add Folder** のところで、ダウンロードした `plug-in-template` を指定します。
<img width="696" height="240" alt="image" src="https://github.com/user-attachments/assets/ab9bedb8-bf29-48ee-9b11-ea76185857e5" />

### GPT（＝ Codex）
1. **New Chat（New Session）** をクリックします。
2. 「プロジェクトで作業」をクリックし、「既存のフォルダを選択」でダウンロードした `plug-in-template` を指定します。
<img width="1280" height="789" alt="image" src="https://github.com/user-attachments/assets/693fb534-71cc-46f7-a6ad-ebc315130cfe" />
3. まれに「Codex がほかの Agent の設定を探しました」といった趣旨のメッセージが出た場合は、黒いボタンをクリックすれば問題ありません。
<img width="757" height="378" alt="image" src="https://github.com/user-attachments/assets/11edf5e1-6394-4c0f-8222-c08e9957a49d" />

---

## 5. 共通作業（ビルドとアップロード）

1. 完成した作業は、AI に **ビルド（build）** するよう依頼します。
<img width="1498" height="842" alt="image" src="https://github.com/user-attachments/assets/0d54cd22-2887-450e-b2a0-aa7d8e2b4daf" />

2. 生成された **build ファイルを圧縮**します。
   - ⚠️ **注意：build フォルダの「内部のデータのみ」を圧縮してください！**（build フォルダごと圧縮しない）
   <img width="1036" height="787" alt="image" src="https://github.com/user-attachments/assets/19bb46c5-a58f-4571-943a-91b66170d372" />

3. Civil / Gen で **Plug In** を開き、**My Work** カテゴリを選択した後、**アップロード（雲アイコン）** を選択します。
<img width="329" height="559" alt="image" src="https://github.com/user-attachments/assets/85e73dd5-fc89-4536-98bf-2016a210d5ac" />

4. **タイプ（new / update）**、**タイトル**、**説明** をそれぞれ入力します。
<img width="784" height="379" alt="image" src="https://github.com/user-attachments/assets/13509f2f-7077-4bec-bcd6-6d65b2c66f49" />
<img width="322" height="240" alt="image" src="https://github.com/user-attachments/assets/b4130b73-0657-4c78-aef3-ed578acb74b0" />

5. **Select Zip File** を選択して、圧縮したファイルをアップロードします。
6. **Run** ボタンを押すと、作業した Plug In の実行を確認できます。
   - UI のサイズ調整やタイトル（Title）の修正をしたい場合は、`manifest.json` ファイルを調整するよう AI に依頼してください。
