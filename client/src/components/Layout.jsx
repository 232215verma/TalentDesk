import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UsersRound, Settings2, LogOut, Menu, X, Bell, ChevronDown, Sparkles, Pencil, Check, LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const links = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/users', label: 'People', icon: UsersRound },
];

function avatar(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [workspace, setWorkspace] = useState({ name: 'Growth Tech' });
  const [workspaceModal, setWorkspaceModal] = useState(false);
  const [workspaceDraft, setWorkspaceDraft] = useState('');
  const [workspaceError, setWorkspaceError] = useState('');
  const [workspaceBusy, setWorkspaceBusy] = useState(false);
  const title = location.pathname.includes('users') ? 'People' : location.pathname.includes('account') ? 'Account' : 'Overview';

  useEffect(() => {
    api('/workspace').then(({ workspace: saved }) => setWorkspace(saved)).catch((error) => setWorkspaceError(error.message));
  }, []);

  const logout = () => {
    signOut();
    navigate('/', { replace: true });
  };

  const openWorkspaceEditor = () => {
    setWorkspaceDraft(workspace.name);
    setWorkspaceError('');
    setWorkspaceModal(true);
  };

  const saveWorkspace = async (event) => {
    event.preventDefault();
    const name = workspaceDraft.trim();
    if (name.length < 2 || name.length > 50) {
      setWorkspaceError('Enter a workspace name from 2 to 50 characters.');
      return;
    }
    setWorkspaceBusy(true);
    setWorkspaceError('');
    try {
      const { workspace: saved } = await api('/workspace', { method: 'PUT', body: JSON.stringify({ name }) });
      setWorkspace(saved);
      setWorkspaceModal(false);
    } catch (error) {
      setWorkspaceError(error.message);
    } finally {
      setWorkspaceBusy(false);
    }
  };

  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark">T</span><span>TalentDesk</span><span className="brand-pill">PEOPLE</span><button className="icon-button close-nav" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20}/></button></div>
      <button className={`workspace-switch ${user?.role === 'admin' ? 'workspace-switch-editable' : ''}`} type="button" onClick={user?.role === 'admin' ? openWorkspaceEditor : undefined} disabled={user?.role !== 'admin'} aria-label={user?.role === 'admin' ? 'Edit workspace name' : 'Workspace name'}>
        <span className="workspace-icon">{(workspace.name || 'G').trim().charAt(0).toUpperCase()}</span>
        <span className="workspace-label"><b>{workspace.name}</b><small>{user?.role === 'admin' ? 'Click to edit workspace' : 'Current workspace'}</small></span>
        {user?.role === 'admin' && <Pencil size={15} className="workspace-edit-icon"/>}
      </button>
      <div className="nav-label">WORKSPACE</div>
      <nav>{links.filter(({ to }) => user?.role === 'admin' || to === '/app').map(({ to, label, icon: Icon }) => <NavLink onClick={() => setOpen(false)} key={to} to={to} end={to === '/app'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={20}/><span>{user?.role === 'admin' ? label : 'My space'}</span></NavLink>)}</nav>
      <div className="sidebar-spacer"/>
      <div className="sidebar-note"><div className="note-icon"><Sparkles size={18}/></div><b>A little room to grow.</b><p>Good teams start with knowing each other.</p><span className="note-line"/></div>
      <button className="nav-link settings-link" onClick={() => { navigate('/app/account'); setOpen(false); }}><Settings2 size={20}/>Account settings</button>
      <div className="sidebar-user"><div className="avatar avatar-small">{avatar(user?.name)}</div><div className="user-mini"><b>{user?.name}</b><small>{user?.role === 'admin' ? 'Workspace admin' : 'Team member'}</small></div><button className="icon-button logout-icon" aria-label="Log out" title="Log out" onClick={logout}><LogOut size={19}/></button></div>
    </aside>
    {open && <button className="mobile-overlay" onClick={() => setOpen(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar">
        <button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={23}/></button>
        <div className="breadcrumb">Workspace <span>/</span> <b>{title}</b></div>
        <div className="topbar-actions">
          <span className="today-label">A good day to do good work</span>
          <div className="notification-wrap"><button className="icon-button notification" aria-label="Notifications" aria-expanded={noticeOpen} onClick={() => setNoticeOpen(!noticeOpen)}><Bell size={20}/></button>{noticeOpen && <div className="notification-popover"><b>You’re all caught up</b><p>No new notifications just yet.</p><button onClick={() => setNoticeOpen(false)}>Got it</button></div>}</div>
          <button className="top-user" onClick={() => navigate('/app/account')} aria-label="Open account"><div className="avatar avatar-small">{avatar(user?.name)}</div><ChevronDown size={16}/></button>
        </div>
      </header>
      <div className="page-content"><Outlet/></div>
      <footer className="footer"><span>© 2025 TalentDesk</span><span>Made for the people who make it happen <span className="footer-heart">✳</span></span></footer>
    </main>
    {workspaceModal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setWorkspaceModal(false)}><section className="modal workspace-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-modal-title"><div className="modal-top"><div><span className="eyebrow">WORKSPACE SETTINGS</span><h2 id="workspace-modal-title">Name your workspace</h2><p>This name is saved for everyone on your team.</p></div><button className="icon-button" onClick={() => setWorkspaceModal(false)} aria-label="Close"><X size={20}/></button></div><form className="modal-form" onSubmit={saveWorkspace}>{workspaceError && <div className="form-error">{workspaceError}</div>}<label>Workspace name<input autoFocus maxLength={50} minLength={2} value={workspaceDraft} onChange={(event) => setWorkspaceDraft(event.target.value)} placeholder="e.g. Growth Tech" required/></label><div className="modal-actions"><button className="button button-quiet" type="button" onClick={() => setWorkspaceModal(false)}>Cancel</button><button className="button button-primary" disabled={workspaceBusy}>{workspaceBusy ? <><LoaderCircle size={17}/>Saving…</> : <><Check size={17}/>Save workspace name</>}</button></div></form></section></div>}
  </div>;
}



