import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// 未ログインユーザーをログイン画面へリダイレクトするラッパーコンポーネント
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初回マウント時にセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // セッション変更を監視（ログイン・ログアウト時に自動更新）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // セッション確認中はローディング表示
  if (session === undefined) {
    return <div className="loading">読み込み中...</div>
  }

  // 未ログインはログイン画面へ
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
