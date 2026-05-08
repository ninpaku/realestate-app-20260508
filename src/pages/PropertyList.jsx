import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import PropertyForm from '../components/PropertyForm'

function PropertyList() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null) // 編集中の物件（nullなら新規登録）
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  // Supabaseから自分の物件一覧を取得（RLSにより自分の物件のみ返される）
  const fetchProperties = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // 物件の登録または更新を実行
  const handleSubmit = async (formData) => {
    setFormLoading(true)
    setError('')

    if (editingProperty) {
      // 既存物件の更新（UPDATEポリシーで自分の物件のみ更新可能）
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', editingProperty.id)

      if (error) {
        setError('物件の更新に失敗しました')
      } else {
        await fetchProperties()
        handleCloseForm()
      }
    } else {
      // 新規物件の登録：user_idにログインユーザーのUIDをセット
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })

      if (error) {
        setError('物件の登録に失敗しました')
      } else {
        await fetchProperties()
        handleCloseForm()
      }
    }

    setFormLoading(false)
  }

  // 物件の削除（DELETEポリシーで自分の物件のみ削除可能）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('物件の削除に失敗しました')
    } else {
      // 削除成功後に一覧を再取得
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // 編集ボタン押下：対象物件をセットしてフォームを開く
  const handleEdit = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // 新規登録ボタン押下
  const handleOpenNewForm = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  // フォームを閉じて状態をリセット
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="property-container">
      <header className="property-header">
        <h1 className="property-title">物件一覧</h1>
        <div className="header-actions">
          <button onClick={handleOpenNewForm} className="btn-add">
            ＋ 新規登録
          </button>
          <button onClick={handleLogout} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      {/* 登録・編集フォームパネル（表示・非表示を切り替え） */}
      {showForm && (
        <PropertyForm
          initialData={editingProperty}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          loading={formLoading}
        />
      )}

      {/* 物件一覧表示 */}
      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : properties.length === 0 ? (
        <p className="empty-message">物件が登録されていません。「＋ 新規登録」から追加してください。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <h2 className="card-name">{property.name}</h2>
              <p className="card-area">📍 {property.area}</p>
              <p className="card-floor-plan">🏠 {property.floor_plan}</p>
              <p className="card-rent">
                月額 <span className="rent-amount">{property.rent.toLocaleString()}円</span>
              </p>
              <div className="card-actions">
                <button onClick={() => handleEdit(property)} className="btn-edit">
                  編集
                </button>
                <button onClick={() => handleDelete(property.id)} className="btn-delete">
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyList
