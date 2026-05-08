import { useState } from 'react'

// 空フォームの初期値
const EMPTY_FORM = { name: '', rent: '', area: '', floor_plan: '' }

// 物件の登録・編集で共用するフォームコンポーネント
// initialData が渡された場合は編集モード、なければ新規登録モード
function PropertyForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(
    initialData
      ? {
          name: initialData.name,
          rent: initialData.rent,
          area: initialData.area,
          floor_plan: initialData.floor_plan,
        }
      : EMPTY_FORM
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // rentは文字列で入力されるため数値に変換してから渡す
    onSubmit({ ...formData, rent: parseInt(formData.rent, 10) })
  }

  return (
    <div className="form-panel">
      <h2 className="form-panel-title">
        {initialData ? '物件を編集' : '物件を新規登録'}
      </h2>
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="例：サンハイツ渋谷"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              name="rent"
              type="number"
              value={formData.rent}
              onChange={handleChange}
              placeholder="例：120000"
              min={0}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="area">エリア名</label>
            <input
              id="area"
              name="area"
              type="text"
              value={formData.area}
              onChange={handleChange}
              placeholder="例：渋谷区"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="floor_plan">間取り</label>
            <input
              id="floor_plan"
              name="floor_plan"
              type="text"
              value={formData.floor_plan}
              onChange={handleChange}
              placeholder="例：1LDK"
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '保存中...' : initialData ? '更新する' : '登録する'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

export default PropertyForm
