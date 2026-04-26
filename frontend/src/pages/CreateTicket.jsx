import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// --- Our Custom Glassmorphism Dropdown Component ---
const CustomSelect = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div 
        className="input-field" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {value}
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
          transition: 'transform 0.3s ease' 
        }}>
          ▼
        </span>
      </div>
      
      {isOpen && (
        <ul className="custom-select-menu">
          {options.map((opt) => (
            <li 
              key={opt} 
              className="custom-select-option"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              style={{ 
                background: value === opt ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                borderLeft: value === opt ? '3px solid var(--primary-accent)' : '3px solid transparent'
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Medium');
  const [preferredContact, setPreferredContact] = useState('');
  const [location, setLocation] = useState('');
  
  // CHANGED: We now store an ARRAY of images instead of a single image
  const [images, setImages] = useState([]); 
  const [statusMessage, setStatusMessage] = useState('');

  // --- NEW: Handle Multiple Image Selection ---
  const handleImageSelection = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check if adding these files exceeds the 3-image limit
    if (images.length + selectedFiles.length > 3) {
      setStatusMessage('Error: You can only upload a maximum of 3 images per ticket.');
      return;
    }

    // Validate file sizes (Max 10MB per file)
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        setStatusMessage(`Error: "${file.name}" is too large! Max size is 10MB.`);
        return false;
      }
      return true;
    });

    // Add valid files to state
    setImages((prevImages) => [...prevImages, ...validFiles]);
    setStatusMessage(''); // Clear any previous errors
  };

  // --- NEW: Remove an image before submitting ---
  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Submitting ticket details...');

    // STEP 1: Send the text data to create the base Ticket
    const ticketData = new FormData();
    ticketData.append('title', title);
    ticketData.append('description', description);
    ticketData.append('category', category);
    ticketData.append('priority', priority);
    ticketData.append('preferredContact', preferredContact);
    ticketData.append('location', location);

    try {
      // FIX 1: Removed the hardcoded headers so Axios can set the boundary automatically!
      const ticketResponse = await axios.post('http://localhost:8082/api/tickets', ticketData);
      
      const newTicketId = ticketResponse.data.id; 

      // STEP 2: If there are images, loop through and upload them to the Attachment Controller
      if (images.length > 0) {
        setStatusMessage('Uploading images safely...');
        
        for (let i = 0; i < images.length; i++) {
          const imageData = new FormData();
          imageData.append('file', images[i]);
          
          // FIX 2: Removed the hardcoded headers here too!
          await axios.post(`http://localhost:8082/api/tickets/${newTicketId}/attachments`, imageData);
        }
      }

      setStatusMessage('Ticket and images submitted successfully! 🎉');
      
      // Reset the form
      setTitle('');
      setDescription('');
      setCategory('Hardware');
      setPriority('Medium');
      setPreferredContact('');
      setLocation('');
      setImages([]); 
      
    } catch (error) {
      console.error('Error uploading ticket:', error);
      setStatusMessage('Something went wrong. Please check the console and try again.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '4px' }}>Create Incident Ticket</h2>
      <span className="helper-text" style={{ marginBottom: '24px', fontSize: '0.95rem' }}>
        Fill in the details below. You can attach up to 3 images as evidence.
      </span>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <h3 className="form-section">Basic Information</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
            <input 
              type="text" className="input-field" value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="E.g., Broken Projector in Lab 3" required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
            <textarea 
              className="input-field" value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4" placeholder="Describe the issue in detail..." required 
            />
          </div>
        </div>

        <div>
          <h3 className="form-section">Categorization</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
              <CustomSelect 
                value={category} 
                options={['Hardware', 'Software', 'Network', 'Other']}
                onChange={setCategory} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Priority</label>
              <CustomSelect 
                value={priority} 
                options={['Low', 'Medium', 'High']}
                onChange={setPriority} 
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="form-section">Location & Contact</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Location (Room/Building)</label>
              <input 
                type="text" className="input-field" value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="E.g., Engineering Block, Room 102" required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Contact Info (Email/Phone)</label>
              <input 
                type="text" className="input-field" value={preferredContact} 
                onChange={(e) => setPreferredContact(e.target.value)} 
                placeholder="E.g., student@campus.edu" required 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Attach Evidence (Max 3 Images)</label>
            <input 
              type="file" 
              className="input-field" 
              onChange={handleImageSelection} 
              accept="image/*" 
              multiple // Allows selecting multiple files at once in the OS file picker
              disabled={images.length >= 3} // Disable input if they hit the limit
            />
            
            {/* Visual list of selected images */}
            {images.length > 0 && (
              <ul style={{ listStyle: 'none', padding: '12px 0 0 0', margin: 0 }}>
                {images.map((file, index) => (
                  <li key={index} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.05)', padding: '8px 12px', 
                    borderRadius: 'var(--radius-sm)', marginBottom: '8px', fontSize: '0.9rem'
                  }}>
                    <span>📎 {file.name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ✕ Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            <span className="helper-text" style={{ marginTop: '8px' }}>
              {images.length}/3 images selected. Max file size: 10MB.
            </span>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '16px' }}>
          Submit Ticket
        </button>
      </form>

      {statusMessage && (
        <div 
          className={statusMessage.includes('successfully') ? 'animate-fade-in feedback-glass' : 'animate-shake feedback-glass'} 
          style={{ 
            marginTop: '24px', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: '500',
            backgroundColor: statusMessage.includes('successfully') ? 'var(--success-bg)' : 'var(--error-bg)',
            color: statusMessage.includes('successfully') ? 'var(--success-text)' : 'var(--error-text)',
            border: `1px solid ${statusMessage.includes('successfully') ? 'var(--success-border)' : 'var(--error-border)'}`
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}