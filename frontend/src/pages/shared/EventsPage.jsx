import '../../styles/EventsPage.css';
import { useState, useEffect } from 'react';
import { eventAPI } from '../../services/api';
import { Calendar, MapPin, Link as LinkIcon, Plus, Trash2, User, Filter, Search, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technical',
        date: '',
        venue: '',
        registrationLink: ''
    });
    const [editingId, setEditingId] = useState(null);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const { data } = await eventAPI.getAll({ category: selectedCategory });
            setEvents(data.data);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [selectedCategory]);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        const actionText = editingId ? 'Updating' : 'Publishing';
        const toastId = toast.loading(`${actionText} event...`);
        try {
            if (editingId) {
                await eventAPI.update(editingId, formData);
                toast.success('Event updated successfully!', { id: toastId });
            } else {
                await eventAPI.create(formData);
                toast.success('Event published! Students notified via email.', { id: toastId });
            }
            setShowAddModal(false);
            setEditingId(null);
            setFormData({ title: '', description: '', category: 'Technical', date: '', venue: '', registrationLink: '' });
            loadEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} event`, { id: toastId });
        }
    };

    const handleEditClick = (event) => {
        setEditingId(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date.split('T')[0], // format for date input
            venue: event.venue,
            registrationLink: event.registrationLink || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this event?')) return;
        try {
            await eventAPI.delete(id);
            toast.success('Event removed');
            loadEvents();
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            month: d.toLocaleString('default', { month: 'short' }),
            day: d.getDate(),
            full: d.toLocaleDateString()
        };
    };

    const isStaff = user?.role === 'admin' || user?.role === 'faculty';

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Campus Events</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Stay updated with workshops, seminars and fests</p>
                </div>
                {isStaff && (
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} /> Add New Event
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border-primary)',
                            background: selectedCategory === cat ? 'var(--primary-600)' : 'var(--bg-card)',
                            color: selectedCategory === cat ? 'white' : 'var(--text-primary)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="events-grid">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 350, borderRadius: '15px' }} />)}
                </div>
            ) : events.length === 0 ? (
                <div className="card card-body" style={{ textAlign: 'center', padding: '4rem' }}>
                    <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3>No Events Found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Check back later for new activities.</p>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map((event) => {
                        const dateInfo = formatDate(event.date);
                        return (
                            <div key={event._id} className="event-card">
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div className="event-date-box">
                                            <span className="month">{dateInfo.month}</span>
                                            <span className="day">{dateInfo.day}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span className="event-category-tag">{event.category}</span>
                                            <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.1rem', fontWeight: 700 }}>{event.title}</h3>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {event.description}
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <MapPin size={16} /> {event.venue}
                                        </div>
                                        {event.registrationLink && (
                                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-500)', fontWeight: 600 }}>
                                                <LinkIcon size={16} /> Registration Link
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="event-footer">
                                    <div className="faculty-info">
                                        <div className="avatar avatar-xs" style={{ width: 24, height: 24, fontSize: '0.65rem' }}>
                                            {event.createdBy?.name?.charAt(0)}
                                        </div>
                                        <span>Added by {event.createdBy?.name}</span>
                                    </div>
                                    {isStaff && (user?.role === 'admin' || event.createdBy?._id === user?._id) && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditClick(event)} style={{ background: 'none', border: 'none', color: 'var(--primary-400)', cursor: 'pointer' }} title="Edit Event">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete Event">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Event Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Event' : 'Add New Event'}</h3>
                            <button onClick={() => { setShowAddModal(false); setEditingId(null); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Event Title</label>
                                    <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Annual Tech Symposium" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select className="form-control" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Venue</label>
                                        <input type="text" className="form-control" required value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} placeholder="e.g. Seminar Hall 1" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Registration Link (Optional)</label>
                                    <input type="url" className="form-control" value={formData.registrationLink} onChange={e => setFormData({ ...formData, registrationLink: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Detailed Description</label>
                                    <textarea className="form-control" required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the event goals and topics..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    {editingId ? 'Save Changes' : 'Publish Event & Notify Students'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
