import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/api'

const POLL_MS = 30000

const TYPE_ICONS = {
  BOOKING_APPROVED: '✅',
  BOOKING_REJECTED: '❌',
  TICKET_STATUS_CHANGED: '🛠️',
  TICKET_COMMENT: '💬',
}

export default function NotificationPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const panelRef = useRef(null)

  // Poll the unread badge while logged in
  useEffect(() => {
    if (!user) return
    let active = true
    const fetchCount = () =>
      getUnreadNotificationCount()
        .then((res) => active && setUnread(res.data.count ?? 0))
        .catch(() => {})
    fetchCount()
    const id = setInterval(fetchCount, POLL_MS)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [user])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const togglePanel = async () => {
    const next = !open
    setOpen(next)
    if (next) {
      setLoading(true)
      try {
        const res = await getNotifications()
        setItems(res.data || [])
      } catch (err) {
        console.error('Failed to load notifications:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClick = async (n) => {
    if (!n.read) {
      try {
        await markNotificationRead(n.id)
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
        setUnread((c) => Math.max(0, c - 1))
      } catch (err) {
        console.error('Failed to mark notification read:', err)
      }
    }
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead()
      setItems((prev) => prev.map((x) => ({ ...x, read: true })))
      setUnread(0)
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  if (!user) return null

  return (
    <div ref={panelRef} style={styles.wrap}>
      <button onClick={togglePanel} style={styles.bellBtn} aria-label="Notifications">
        <span style={{ fontSize: 20 }}>🔔</span>
        {unread > 0 && <span style={styles.badge}>{unread > 99 ? '99+' : unread}</span>}
      </button>

      {open && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <strong style={{ fontSize: 14 }}>Notifications</strong>
            {items.some((n) => !n.read) && (
              <button onClick={handleMarkAll} style={styles.markAllBtn}>
                Mark all read
              </button>
            )}
          </div>

          <div style={styles.list}>
            {loading ? (
              <div style={styles.empty}>Loading...</div>
            ) : items.length === 0 ? (
              <div style={styles.empty}>No notifications yet.</div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    ...styles.item,
                    background: n.read ? 'transparent' : 'rgba(139, 92, 246, 0.08)',
                    cursor: n.link ? 'pointer' : 'default',
                  }}
                >
                  <span style={styles.itemIcon}>{TYPE_ICONS[n.type] || '📩'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-main, #1a1a2e)', fontWeight: n.read ? 400 : 600 }}>
                      {n.message}
                    </div>
                    <div style={styles.timeAgo}>{formatTime(n.createdAt)}</div>
                  </div>
                  {!n.read && <span style={styles.unreadDot} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

const styles = {
  wrap: { position: 'relative', display: 'inline-block' },
  bellBtn: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    padding: 8,
    borderRadius: 8,
    cursor: 'pointer',
    color: 'inherit',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    background: '#EF4444',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 99,
    minWidth: 16,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  panel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 360,
    maxHeight: 480,
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 12,
    boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    color: '#1a1a2e',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f2f5',
  },
  markAllBtn: {
    background: 'transparent',
    border: 'none',
    color: '#0f3460',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  list: { overflowY: 'auto', flex: 1 },
  empty: { padding: '32px 16px', color: '#888', fontSize: 13, textAlign: 'center' },
  item: {
    display: 'flex',
    gap: 10,
    padding: '12px 16px',
    borderBottom: '1px solid #f6f8fa',
    alignItems: 'flex-start',
    transition: 'background 0.15s',
  },
  itemIcon: { fontSize: 18, flexShrink: 0, marginTop: 1 },
  timeAgo: { fontSize: 11, color: '#999', marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#8b5cf6',
    flexShrink: 0,
    marginTop: 6,
  },
}
