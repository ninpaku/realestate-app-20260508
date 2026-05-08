import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// ダミーの物件データ
const PROPERTIES = [
  { id: 1, name: 'サンハイツ渋谷', rent: 150000, area: '渋谷区' },
  { id: 2, name: 'グリーンマンション新宿', rent: 120000, area: '新宿区' },
  { id: 3, name: 'ブルースカイ恵比寿', rent: 180000, area: '渋谷区' },
  { id: 4, name: 'パークビュー品川', rent: 95000, area: '品川区' },
  { id: 5, name: 'リバーサイド目黒', rent: 140000, area: '目黒区' },
  { id: 6, name: 'スカイタワー池袋', rent: 85000, area: '豊島区' },
]

function PropertyList() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    // Supabaseからログアウト
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="property-container">
      <header className="property-header">
        <h1 className="property-title">物件一覧</h1>
        <button onClick={handleLogout} className="btn-logout">
          ログアウト
        </button>
      </header>

      <div className="property-grid">
        {PROPERTIES.map((property) => (
          <div key={property.id} className="property-card">
            <h2 className="card-name">{property.name}</h2>
            <p className="card-area">📍 {property.area}</p>
            <p className="card-rent">
              月額 <span className="rent-amount">{property.rent.toLocaleString()}円</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PropertyList
