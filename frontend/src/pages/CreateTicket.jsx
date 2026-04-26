import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  AlignLeft, 
  Layers, 
  AlertCircle, 
  MapPin, 
  Phone, 
  UploadCloud, 
  X, 
  Image as ImageIcon,
  Ticket
} from 'lucide-react';
import Toast from '../components/Toast';

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Medium');
  const [preferredContact, setPreferredContact] = useState('');
  const [location, setLocation] = useState('');
  
  const [images, setImages] = useState([]); 
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Validation state
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!preferredContact.trim()) newErrors.preferredContact = 'Contact info is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelection = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (images.length + selectedFiles.length > 3) {
      setToast({ message: 'You can only upload a maximum of 3 images.', type: 'error' });
      return;
    }

    const validFiles = selectedFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        setToast({ message: `"${file.name}" is too large! Max size is 10MB.`, type: 'error' });
        return false;
      }
      return true;
    });

    const newImages = validFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ message: 'Please fill in all required fields.', type: 'warning' });
      return;
    }

    setLoading(true);

    const ticketData = new FormData();
    ticketData.append('title', title);
    ticketData.append('description', description);
    ticketData.append('category', category);
    ticketData.append('priority', priority);
    ticketData.append('preferredContact', preferredContact);
    ticketData.append('location', location);

    try {
      const ticketResponse = await axios.post('http://localhost:8082/api/tickets', ticketData);
      const newTicketId = ticketResponse.data.id; 

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const imageData = new FormData();
          imageData.append('file', images[i]);
          await axios.post(`http://localhost:8082/api/tickets/${newTicketId}/attachments`, imageData);
        }
      }

      setToast({ message: 'Ticket submitted successfully! 🎉', type: 'success' });
      
      setTitle('');
      setDescription('');
      setCategory('Hardware');
      setPriority('Medium');
      setPreferredContact('');
      setLocation('');
      setImages([]); 
      setErrors({});
      
    } catch (error) {
      console.error('Error uploading ticket:', error);
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card" style={{ padding: '40px' }}>
        <h2 className="page-title"><Ticket style={{ marginRight: '12px' }} size={32} className="text-primary" /> Create Incident Ticket</h2>
        <p className="page-subtitle" style={{ marginBottom: '40px' }}>
          Report a broken resource, software bug, or facility issue. Provide as much detail as possible to help us resolve it quickly.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section: Basic Information */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', color: 'var(--text-main)' }}>Basic Information</h3>
            
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} /> Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input 
                type="text" 
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                style={{ borderColor: errors.title ? 'var(--danger)' : 'var(--border)' }}
                value={title} 
                onChange={(e) => { setTitle(e.target.value); setErrors({...errors, title: null}); }} 
                placeholder="E.g., Broken Projector in Lab 3" 
              />
              {errors.title && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px' }}>{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlignLeft size={16} /> Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea 
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                style={{ borderColor: errors.description ? 'var(--danger)' : 'var(--border)', resize: 'vertical' }}
                value={description} 
                onChange={(e) => { setDescription(e.target.value); setErrors({...errors, description: null}); }} 
                rows="5" 
                placeholder="Describe the issue in detail. What happened? When did you notice it?" 
              />
              {errors.description && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px' }}>{errors.description}</div>}
            </div>
          </div>

          {/* Section: Categorization */}
          <div className="form-row" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 300px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} /> Category
              </label>
              <select 
                className="form-control" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Facility">Facility</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group" style={{ flex: '1 1 300px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> Priority
              </label>
              <select 
                className="form-control" 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low - Not urgent</option>
                <option value="Medium">Medium - Needs attention</option>
                <option value="High">High - Critical impact</option>
              </select>
            </div>
          </div>

          {/* Section: Location & Contact */}
          <div className="form-row" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 300px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} /> Location <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input 
                type="text" 
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                style={{ borderColor: errors.location ? 'var(--danger)' : 'var(--border)' }}
                value={location} 
                onChange={(e) => { setLocation(e.target.value); setErrors({...errors, location: null}); }} 
                placeholder="E.g., Engineering Block, Room 102" 
              />
              {errors.location && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px' }}>{errors.location}</div>}
            </div>
            
            <div className="form-group" style={{ flex: '1 1 300px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> Contact Info <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input 
                type="text" 
                className={`form-control ${errors.preferredContact ? 'is-invalid' : ''}`}
                style={{ borderColor: errors.preferredContact ? 'var(--danger)' : 'var(--border)' }}
                value={preferredContact} 
                onChange={(e) => { setPreferredContact(e.target.value); setErrors({...errors, preferredContact: null}); }} 
                placeholder="E.g., student@campus.edu or Phone #" 
              />
              {errors.preferredContact && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px' }}>{errors.preferredContact}</div>}
            </div>
          </div>

          {/* Section: Upload */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', color: 'var(--text-main)' }}>Evidence</h3>
            
            <div 
              onClick={() => !loading && images.length < 3 && fileInputRef.current?.click()}
              style={{ 
                border: '2px dashed var(--border)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '40px 20px', 
                textAlign: 'center', 
                cursor: images.length >= 3 ? 'not-allowed' : 'pointer',
                backgroundColor: 'var(--surface-hover)',
                transition: 'all 0.2s',
                opacity: images.length >= 3 ? 0.6 : 1
              }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleImageSelection({ target: { files: e.dataTransfer.files }});
                }
              }}
            >
              <UploadCloud size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                {images.length >= 3 ? 'Maximum images reached' : 'Click or drag images to upload'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Upload up to 3 images showing the issue (Max 10MB each)
              </p>
              
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageSelection} 
                accept="image/*" 
                multiple
                disabled={images.length >= 3}
              />
            </div>
            
            {/* Visual list of selected images with previews */}
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
                {images.map((file, index) => (
                  <div key={index} style={{ 
                    position: 'relative', 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-hover)'
                  }}>
                    {file.preview ? (
                      <img src={file.preview} alt={`preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <ImageIcon size={32} color="var(--text-muted)" />
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                      style={{ 
                        position: 'absolute', 
                        top: '6px', 
                        right: '6px', 
                        background: 'rgba(239, 68, 68, 0.9)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}
            >
              {loading ? 'Submitting Ticket...' : 'Submit Incident Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}