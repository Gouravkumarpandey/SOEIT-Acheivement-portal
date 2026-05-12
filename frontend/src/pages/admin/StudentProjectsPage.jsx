import { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';
import { Search, Code2, ExternalLink, Eye, Github, X, Calendar, User, Layers, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ department: '', search: '' });
    const [selectedProject, setSelectedProject] = useState(null);

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const res = await projectAPI.getAll(filters);
            setProjects(res.data.data);
        } catch {
            toast.error('Failed to load project records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllProjects();
        }, 300);
        return () => clearTimeout(handler);
    }, [filters.department, filters.search]);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Student Projects</h2>
                <p className="page-subtitle">View and monitor technical projects built by students across all departments.</p>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                    <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="search-wrapper flex-order-last-desktop" style={{ flex: 1, minWidth: '280px' }}>
                            <input
                                className="form-control"
                                placeholder="Search by Student, Project, or Tech Stack..."
                                value={filters.search}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                            />
                            <Search size={18} className="search-icon" />
                        </div>
                        <select
                            className="form-control"
                            style={{ fontWeight: 700, flex: 1, minWidth: '200px' }}
                            value={filters.department}
                            onChange={e => setFilters({ ...filters, department: e.target.value })}
                        >
                            <option value="">All Departments</option>
                            {[
                                { group: 'B.Tech', depts: ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'] },
                                { group: 'BCA', depts: ['BCA (Regular)', 'AIDL', 'Cybersecurity'] },
                                { group: 'Diploma', depts: ['DCSE', 'DME', 'DEEE'] },
                            ].map(({ group, depts }) => (
                                <optgroup key={group} label={group}>
                                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                {/* Desktop View */}
                <div className="table-container display-desktop">
                    <table className="table" style={{ minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '2rem' }}>Student Details</th>
                                <th>Project Name</th>
                                <th>Tech Stack</th>
                                <th style={{ textAlign: 'center' }}>Links</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="5" style={{ padding: '0.75rem 2rem' }}>
                                            <div className="skeleton" style={{ height: 60, borderRadius: '12px' }} />
                                        </td>
                                    </tr>
                                ))
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                        <Code2 size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                        <h4 style={{ fontWeight: 800 }}>No projects found</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>No student projects match your search criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                projects.map(project => (
                                    <tr key={project.id} className="hover-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                                <div style={{ width: 44, height: 44, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                                    {project.student?.name ? project.student.name.charAt(0) : 'S'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{project.student?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{project.student?.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{project.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--brand-700)', fontWeight: 800, textTransform: 'uppercase' }}>{project.status}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {project.techStack?.split(',').map((tech, i) => (
                                                    <span key={i} style={{ background: 'var(--slate-100)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                {project.githubLink && (
                                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--text-primary)' }} title="GitHub">
                                                        <Github size={18} />
                                                    </a>
                                                )}
                                                {project.liveLink && (
                                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--brand-600)' }} title="Live Demo">
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                            <button
                                                className="btn btn-ghost"
                                                style={{ padding: '0.5rem', color: 'var(--brand-600)' }}
                                                title="View Project Details"
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                <Eye size={20} strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="display-mobile" style={{ flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 180, borderRadius: '16px' }} />
                        ))
                    ) : projects.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <Code2 size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No projects found</p>
                        </div>
                    ) : (
                        projects.map(project => (
                            <div key={project.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                                            {project.student?.name ? project.student.name.charAt(0) : 'S'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{project.student?.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{project.student?.department}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        style={{ padding: '0.4rem', color: 'var(--brand-600)' }}
                                        onClick={() => setSelectedProject(project)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{project.title}</div>
                                        <span className={`badge ${project.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {project.techStack?.split(',').map((tech, i) => (
                                            <span key={i} style={{ background: 'var(--slate-100)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, gap: '0.4rem', background: 'var(--slate-50)', fontSize: '0.75rem' }}>
                                            <Github size={14} /> GitHub
                                        </a>
                                    )}
                                    {project.liveLink && (
                                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, gap: '0.4rem', background: 'var(--primary-50)', color: 'var(--brand-700)', fontSize: '0.75rem' }}>
                                            <ExternalLink size={14} /> Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ===== Project Detail Modal ===== */}
            {selectedProject && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)', zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem', animation: 'fadeIn 0.2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}
                >
                    <div
                        className="animate-scale-in"
                        style={{
                            background: 'white', borderRadius: '20px',
                            width: '100%', maxWidth: '620px',
                            maxHeight: '90vh', overflow: 'auto',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                            border: '1px solid var(--border-primary)'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.75rem 2rem 1.25rem',
                            borderBottom: '1px solid var(--border-primary)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div style={{
                                        width: 44, height: 44,
                                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))',
                                        color: 'var(--brand-700)', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, fontSize: '1.1rem'
                                    }}>
                                        <Layers size={22} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                            Project Details
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            Submitted project record overview
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                style={{
                                    background: 'var(--slate-50)', border: '1px solid var(--border-primary)',
                                    borderRadius: '10px', padding: '0.5rem', cursor: 'pointer',
                                    color: 'var(--text-muted)', transition: 'all 0.15s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                                onMouseOut={e => e.currentTarget.style.background = 'var(--slate-50)'}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '1.75rem 2rem' }}>
                            {/* Project Title & Status */}
                            <div style={{
                                background: 'var(--slate-50)', borderRadius: '14px',
                                padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
                                border: '1px solid var(--border-primary)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                                        PROJECT TITLE
                                    </span>
                                    <span
                                        className={`badge ${selectedProject.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}
                                        style={{ fontWeight: 800, fontSize: '0.7rem', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                    >
                                        {selectedProject.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {selectedProject.status?.toUpperCase()}
                                    </span>
                                </div>
                                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.3rem', color: 'var(--brand-800)', lineHeight: 1.3 }}>
                                    {selectedProject.title}
                                </h4>
                            </div>

                            {/* Student Info */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '1rem 1.25rem', marginBottom: '1.5rem',
                                background: 'var(--primary-50)', borderRadius: '12px',
                                border: '1px solid var(--primary-100)'
                            }}>
                                <div style={{
                                    width: 48, height: 48,
                                    background: 'white', color: 'var(--brand-700)',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 900, fontSize: '1.1rem', border: '2px solid var(--primary-100)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}>
                                    {selectedProject.student?.name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                        {selectedProject.student?.name || 'Unknown Student'}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--brand-700)', fontWeight: 700 }}>
                                        {selectedProject.student?.department || 'N/A'}
                                        {selectedProject.student?.email && (
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}> • {selectedProject.student.email}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedProject.description && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                        DESCRIPTION
                                    </div>
                                    <div style={{
                                        background: 'white', borderRadius: '12px',
                                        border: '1px solid var(--border-primary)',
                                        padding: '1.25rem 1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            {selectedProject.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                                    <div style={{
                                                        marginTop: '0.5rem', width: '6px', height: '6px',
                                                        borderRadius: '50%', background: 'var(--brand-400)', flexShrink: 0
                                                    }} />
                                                    <p style={{
                                                        fontSize: '0.88rem', color: 'var(--text-secondary)',
                                                        margin: 0, lineHeight: '1.6', wordBreak: 'break-word'
                                                    }}>
                                                        {line.trim().replace(/^[-*•]\s*/, '')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {selectedProject.techStack && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                        TECH STACK
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {selectedProject.techStack.split(',').map((tech, i) => (
                                            <span key={i} style={{
                                                background: 'var(--slate-100)', padding: '0.35rem 0.8rem',
                                                borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800,
                                                color: 'var(--text-secondary)', border: '1px solid var(--border-primary)'
                                            }}>
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    background: 'var(--slate-50)', borderRadius: '10px',
                                    padding: '1rem 1.25rem', border: '1px solid var(--border-primary)'
                                }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                        STATUS
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: selectedProject.status === 'Completed' ? 'var(--success-600)' : 'var(--brand-600)' }}>
                                        {selectedProject.status}
                                    </div>
                                </div>
                                <div style={{
                                    background: 'var(--slate-50)', borderRadius: '10px',
                                    padding: '1rem 1.25rem', border: '1px solid var(--border-primary)'
                                }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                        SUBMITTED ON
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                        {selectedProject.createdAt
                                            ? new Date(selectedProject.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : 'N/A'
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            {(selectedProject.githubLink || selectedProject.liveLink) && (
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {selectedProject.githubLink && (
                                        <a
                                            href={selectedProject.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-ghost"
                                            style={{
                                                flex: 1, minWidth: '160px', gap: '0.6rem',
                                                padding: '0.85rem 1.25rem', fontWeight: 800,
                                                background: 'var(--slate-50)', border: '1px solid var(--border-primary)',
                                                borderRadius: '12px', fontSize: '0.85rem',
                                                color: 'var(--text-primary)', justifyContent: 'center'
                                            }}
                                        >
                                            <Github size={18} /> View on GitHub
                                        </a>
                                    )}
                                    {selectedProject.liveLink && (
                                        <a
                                            href={selectedProject.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{
                                                flex: 1, minWidth: '160px', gap: '0.6rem',
                                                padding: '0.85rem 1.25rem', fontWeight: 800,
                                                borderRadius: '12px', fontSize: '0.85rem',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <ExternalLink size={18} /> Live Demo
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProjectsPage;
