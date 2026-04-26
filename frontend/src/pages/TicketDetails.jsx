import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TicketDetails() {
  const { id } = useParams(); 
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Technician Workflow State
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Admin/Assignment State
  const [technicianName, setTechnicianName] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  // NEW: Comment Edit State
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Determine the current user's "Author Name" for ownership rules
  const currentUserAuthorName = userRole === 'TECHNICIAN' ? '🛠️ Tech Support' : '🎓 Student User';

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/tickets/${id}`);
      setTicket(response.data);
      setNewStatus(response.data.status || 'OPEN');
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setStatusMessage('Failed to load ticket details.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(`http://localhost:8082/api/tickets/${id}/comments`, {
        content: commentText,
        author: currentUserAuthorName
      });
      
      setCommentText('');
      fetchTicketDetails(); 
    } catch (error) {
      console.error('Error adding comment:', error);
      setStatusMessage('Failed to add comment.');
    }
  };

  // NEW: Handle Deleting a Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`http://localhost:8082/api/comments/${commentId}`);
      fetchTicketDetails();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setStatusMessage('Failed to delete comment.');
    }
  };

  // NEW: Handle Saving an Edited Comment
  const handleSaveEdit = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      await axios.put(`http://localhost:8082/api/comments/${commentId}`, {
        content: editCommentText
      });
      setEditingCommentId(null);
      fetchTicketDetails();
    } catch (error) {
      console.error('Error editing comment:', error);
      setStatusMessage('Failed to edit comment.');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8082/api/tickets/${id}/status`, null, {
        params: { status: newStatus, notes: resolutionNotes }
      });
      setStatusMessage('Ticket updated successfully! 🎉');
      fetchTicketDetails(); 
    } catch (error) {
      console.error('Error updating status:', error);
      setStatusMessage('Failed to update ticket.');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!technicianName.trim()) return;
    try {
      await axios.put(`http://localhost:8082/api/tickets/${id}/assign`, null, {
        params: { technician: technicianName }
      });
      setStatusMessage('Technician assigned successfully! 👨‍🔧');
      fetchTicketDetails();
      setTechnicianName('');
    } catch (error) {
      console.error('Error assigning technician:', error);
      setStatusMessage('Failed to assign technician.');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setStatusMessage('Please provide a reason for rejection.');
      return;
    }
    try {
      await axios.put(`http://localhost:8082/api/tickets/${id}/reject`, null, {
        params: { reason: rejectionReason }
      });
      setStatusMessage('Ticket rejected. ❌');
      fetchTicketDetails();
      setShowRejectBox(false);
    } catch (error) {
      console.error('Error rejecting ticket:', error);
      setStatusMessage('Failed to reject ticket.');
    }
  };

  if (!ticket) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Glass...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(userRole === 'TECHNICIAN' ? '/dashboard' : '/my-tickets')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to {userRole === 'TECHNICIAN' ? 'Master Dashboard' : 'My Tickets'}
        </button>

        <span className="feedback-glass" style={{ padding: '6px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', fontWeight: 'bold', 
          color: ticket.status === 'RESOLVED' ? '#10B981' : ticket.status === 'REJECTED' ? '#EF4444' : '#F59E0B' }}>
          {ticket.status || 'OPEN'}
        </span>
      </div>

      {/* Ticket Main Details */}
      <div className="card animate-fade-in">
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>#{ticket.id}: {ticket.title}</h2>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
          <span><strong>Category:</strong> {ticket.category}</span> | 
          <span><strong>Priority:</strong> <span style={{ color: ticket.priority === 'High' ? '#EF4444' : 'inherit' }}>{ticket.priority}</span></span> | 
          <span><strong>Location:</strong> {ticket.location}</span>
        </div>

        <div style={{ marginBottom: '24px', padding: '12px', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: ticket.rejectionReason ? '8px' : '0' }}>
            <strong>Assigned Technician:</strong> {ticket.assignedTechnician ? <span style={{ color: 'var(--primary-accent)', fontWeight: '600' }}>{ticket.assignedTechnician}</span> : <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
          </div>
          {ticket.status === 'REJECTED' && ticket.rejectionReason && (
            <div style={{ color: '#EF4444' }}>
              <strong>Rejection Reason:</strong> {ticket.rejectionReason}
            </div>
          )}
        </div>

        <h3 className="form-section">Description</h3>
        <p style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
          {ticket.description}
        </p>

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 className="form-section">Attached Evidence</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {ticket.attachments.map(attachment => (
                <img 
                  key={attachment.id}
                  src={`http://localhost:8082/api/attachments/${attachment.id}`} 
                  alt="Evidence"
                  style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Left Column: Comments */}
        <div className="card" style={{ flex: '1 1 400px' }}>
          <h3 className="form-section" style={{ marginTop: '0' }}>Communication Log</h3>
          
          <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '8px' }}>
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((c) => {
                const isOwner = c.author === currentUserAuthorName;
                const isEditing = editingCommentId === c.id;

                return (
                  <div key={c.id} style={{ 
                    background: c.author.includes('Tech') ? 'rgba(139, 92, 246, 0.15)' : 'var(--input-bg)', 
                    border: c.author.includes('Tech') ? '1px solid rgba(139, 92, 246, 0.3)' : 'none',
                    padding: '12px', 
                    borderRadius: 'var(--radius-sm)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.85rem', color: c.author.includes('Tech') ? '#A78BFA' : 'var(--primary-accent)' }}>
                        {c.author}
                      </strong>
                      
                      {/* OWNERSHIP RULES: Only show Edit/Delete if it's their comment */}
                      {isOwner && !isEditing && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.content); }} style={{ background: 'transparent', border: 'none', color: '#60A5FA', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                          <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                        </div>
                      )}
                    </div>

                    {/* Show Edit Input OR Normal Text */}
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                        <textarea 
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="input-field"
                          rows="2"
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleSaveEdit(c.id)} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Save</button>
                          <button onClick={() => setEditingCommentId(null)} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.95rem', margin: '0' }}>{c.content}</p> 
                    )}
                  </div>
                );
              })
            ) : (
              <span className="helper-text">No updates yet.</span>
            )}
          </div>

          {ticket.status !== 'REJECTED' && ticket.status !== 'CLOSED' && (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" className="input-field" value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                placeholder={userRole === 'TECHNICIAN' ? "Provide an update..." : "Ask for an update..."} 
              />
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px' }}>Send</button>
            </form>
          )}
        </div>

        {/* Right Column: Technician Workflow (HIDDEN FROM STUDENTS) */}
        {userRole === 'TECHNICIAN' && (
          <div className="card" style={{ flex: '1 1 300px', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {ticket.status !== 'REJECTED' && ticket.status !== 'CLOSED' && (
              <div>
                <h3 className="form-section" style={{ marginTop: '0', color: '#F59E0B' }}>Technician Controls</h3>
                <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Update Status</label>
                    <select className="input-field" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Resolution Notes</label>
                    <textarea 
                      className="input-field" value={resolutionNotes} 
                      onChange={(e) => setResolutionNotes(e.target.value)} 
                      rows="3" placeholder="Explain how the issue was fixed..."
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    Update Ticket
                  </button>
                </form>
              </div>
            )}

            {ticket.status !== 'REJECTED' && ticket.status !== 'CLOSED' && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--text-main)' }}>Admin Actions</h4>
                
                <form onSubmit={handleAssign} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="Assign to..." 
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="input-field"
                  />
                  <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 16px', background: '#3B82F6' }}>
                    Assign
                  </button>
                </form>

                {!showRejectBox ? (
                  <button 
                    onClick={() => setShowRejectBox(true)}
                    style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FCA5A5', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                  >
                    Reject Ticket
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#FEF2F2', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #FCA5A5' }}>
                    <textarea 
                      placeholder="Why is this ticket being rejected?" 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="2"
                      className="input-field"
                      style={{ background: '#fff', border: '1px solid #FCA5A5', color: '#000' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleReject} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}>
                        Confirm Reject
                      </button>
                      <button onClick={() => setShowRejectBox(false)} style={{ background: 'transparent', color: '#EF4444', border: '1px solid #EF4444', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {statusMessage && (
              <div className="helper-text" style={{ marginTop: '12px', textAlign: 'center', color: statusMessage.includes('Failed') || statusMessage.includes('rejected') ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>
                {statusMessage}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}