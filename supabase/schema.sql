-- =============================================
-- 不動産管理アプリ：propertiesテーブル定義
-- Supabaseのダッシュボード > SQL Editor で実行する
-- =============================================

-- propertiesテーブルの作成
CREATE TABLE properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,              -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent >= 0), -- 家賃（円）
  area        TEXT        NOT NULL,              -- エリア名
  floor_plan  TEXT        NOT NULL,              -- 間取り（例：1LDK）
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- 登録ユーザー
  created_at  TIMESTAMPTZ DEFAULT NOW()          -- 登録日時
);

-- =============================================
-- Row Level Security（RLS）の設定
-- 自分が登録した物件のみ操作可能にする
-- =============================================

-- RLSを有効化（有効にするとポリシーがないと誰もアクセスできない）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT：自分の物件のみ参照可能
CREATE POLICY "自分の物件のみ参照可能" ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT：user_idが自分のUIDである物件のみ登録可能
CREATE POLICY "自分の物件のみ登録可能" ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE：自分の物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能" ON properties
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE：自分の物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能" ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
