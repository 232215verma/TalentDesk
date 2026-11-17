import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function StartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/app', { replace: true }); }, [user, navigate]);

  if (loading) return <div className="loading-screen"><span className="brand-mark">l.</span><span>Getting your space ready…</span></div>;

  return <main className="start-page">
    <div className="start-orb start-orb-one"/><div className="start-orb start-orb-two"/>
    <header className="start-topbar">
      <Link className="start-brand" to="/"><span className="brand-mark">T</span><span>TalentDesk</span></Link>
      <span className="start-tagline"><Sparkles size={16}/> PEOPLE, IN GOOD HANDS</span>
    </header>
    <section className="start-content">
      <div className="start-intro"><span className="eyebrow">A THOUGHTFUL SPACE FOR YOUR TEAM</span><h1>Welcome to your<br/><em>people space.</em></h1><p>Choose how you’d like to step into the workspace.</p></div>
      <div className="role-card-grid">
        <article className="role-card admin-role-card">
          <div className="role-card-top"><span className="role-icon"><ShieldCheck size={25}/></span><span className="role-tag">WORKSPACE MANAGEMENT</span></div>
          <div className="role-card-copy"><h2>Administrator</h2><p>Manage your team, account access, and workspace overview.</p></div>
          <Link className="role-primary admin-primary" to="/admin/login">Enter admin portal <ArrowRight size={19}/></Link>
          <div className="role-card-foot"><span>For workspace administrators</span><ArrowUpRight size={16}/></div>
        </article>
        <article className="role-card member-role-card">
          <div className="role-card-top"><span className="role-icon"><UsersRound size={25}/></span><span className="role-tag">YOUR TEAM SPACE</span></div>
          <div className="role-card-copy"><h2>Team member</h2><p>Sign in to your profile or create an account to join your people.</p></div>
          <div className="member-actions"><Link className="role-primary member-primary" to="/login">Sign in as a member <ArrowRight size={19}/></Link><Link className="member-register" to="/register">Create a new account <ArrowUpRight size={16}/></Link></div>
          <div className="role-card-foot"><span>Create an account to join the team</span><Sparkles size={16}/></div>
        </article>
      </div>
      <div className="start-footer"><span>YOUR PEOPLE. YOUR PLACE.</span><span>© TalentDesk</span></div>
    </section>
  </main>;
}



