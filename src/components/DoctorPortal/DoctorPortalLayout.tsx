import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, ClipboardCheck, FileText, HelpCircle, LayoutDashboard, LogOut, Menu, Settings, Stethoscope, Users, Video, BarChart3, X, ExternalLink } from 'lucide-react';
import { getToken } from '../../lib/authService';
import { Me, Summary, portalAccess, portalMe, portalSummary } from '../../lib/doctorPortalApi';
import { Spinner, initials } from './ui';

const NAV = [
  { to: '/doctor-portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/doctor-portal/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/doctor-portal/meeting-links', label: 'Meeting Links', icon: Video },
  { to: '/doctor-portal/clients', label: 'Clients', icon: Users },
  { to: '/doctor-portal/notes', label: 'Consultation Notes', icon: FileText },
  { to: '/doctor-portal/follow-ups', label: 'Follow-ups', icon: ClipboardCheck },
  { to: '/doctor-portal/reports', label: 'Reports', icon: BarChart3 },
  { to: '/doctor-portal/settings', label: 'Profile Settings', icon: Settings },
  { to: '/doctor-portal/support', label: 'Support', icon: HelpCircle },
];

export interface PortalContext { me: Me; refreshAttention: () => void }

const DoctorPortalLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<'loading' | 'ok' | 'denied'>('loading');
  const [me, setMe] = useState<Me | null>(null);
  const [attention, setAttention] = useState<Summary | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const email = useRef('');

  useEffect(() => {
    if (!getToken()) { navigate('/login', { replace: true }); return; }
    portalAccess().then(a => {
      email.current = a.email;
      if (!a.allowed) { setState('denied'); return; }
      return portalMe().then(m => { setMe(m); setState('ok'); });
    }).catch(() => setState('denied'));
  }, [navigate]);

  const refreshAttention = useCallback(() => { portalSummary().then(setAttention).catch(() => undefined); }, []);
  useEffect(() => { if (state === 'ok') refreshAttention(); }, [state, refreshAttention, location.pathname]);
  useEffect(() => { setMenuOpen(false); setBellOpen(false); setUserOpen(false); }, [location.pathname]);

  if (state === 'loading') return <div className="min-h-screen bg-[#f3f6fb] pt-24"><Spinner label="Opening your portal..." /></div>;
  if (state === 'denied' || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Stethoscope className="mx-auto mb-3 size-10 text-red-600" />
          <h1 className="text-xl font-extrabold text-slate-900">Drone Doctor portal</h1>
          <p className="mt-2 text-sm text-slate-600">
            {email.current ? <>The account <b>{email.current}</b> is not set up as a Drone Doctor.</> : 'We could not open the portal.'} Ask a DroneTV admin to add your login email, then sign in again.
          </p>
          <Link to="/" className="mt-5 inline-block rounded-lg bg-[#0b1f4d] px-5 py-2.5 text-sm font-bold text-white">Back to the website</Link>
        </div>
      </div>
    );
  }

  const needs = attention?.stats.needsUpdate ?? 0;
  const dueFollowUps = (attention?.followUps || []).filter(f => f.overdue).length;
  const bellCount = attention?.attention ?? 0;
  const sidebar = (
    <nav aria-label="Portal" className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4">
      {NAV.map(item => (
        <NavLink
          key={item.to} to={item.to} end={item.end}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-[#ffdf00] text-[#07130f] shadow-sm' : 'text-slate-200 hover:bg-white/10'}`}
        >
          <item.icon className="size-5 shrink-0" />{item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 bg-[#ffd321] px-3 shadow sm:px-5">
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-[#07130f] hover:bg-black/10 lg:hidden"><Menu className="size-6" /></button>
        <Link to="/doctor-portal" className="flex min-w-0 items-center gap-3" aria-label="Drone Doctor dashboard">
          <span className="block h-10 w-16 shrink-0 overflow-hidden"><img src="/images/Drone%20tv%20.in.png" alt="DroneTV.in" className="h-16 w-16 max-w-none -translate-y-[1.3rem]" /></span>
          <span className="hidden h-8 w-px bg-black/25 sm:block" />
          <span className="min-w-0 leading-tight">
            <span className="flex items-center gap-1.5 text-lg font-black text-[#0b1f4d] sm:text-xl">Drone <span className="text-red-600">Doctor</span><Stethoscope className="size-5 text-red-600" /></span>
            <span className="hidden truncate text-[11px] font-medium text-[#07130f]/80 md:block">Expert Consultation on Drones, GIS, AI and Related Technologies</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="relative">
            <button type="button" onClick={() => { setBellOpen(v => !v); setUserOpen(false); }} aria-label={`Notifications${bellCount ? `, ${bellCount} need attention` : ''}`} aria-expanded={bellOpen} className="relative rounded-lg p-2 text-[#07130f] hover:bg-black/10">
              <Bell className="size-5" />
              {bellCount > 0 && <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">{bellCount > 9 ? '9+' : bellCount}</span>}
            </button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl">
                {bellCount === 0 ? <div className="px-3 py-4 text-center text-slate-500">You are all caught up.</div> : (
                  <>
                    {needs > 0 && <Link to="/doctor-portal/appointments" className="block rounded-lg px-3 py-2 hover:bg-slate-50"><b>{needs}</b> past session{needs > 1 ? 's' : ''} need an update<span className="block text-xs text-slate-500">Mark them completed or no-show</span></Link>}
                    {dueFollowUps > 0 && <Link to="/doctor-portal/follow-ups" className="block rounded-lg px-3 py-2 hover:bg-slate-50"><b>{dueFollowUps}</b> follow-up{dueFollowUps > 1 ? 's' : ''} due<span className="block text-xs text-slate-500">Open the follow-ups list</span></Link>}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button type="button" onClick={() => { setUserOpen(v => !v); setBellOpen(false); }} aria-expanded={userOpen} aria-label="Account menu" className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-black/10">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#0b1f4d] text-sm font-bold text-white">{initials(me.doctorName.replace(/^Dr\.?\s*/i, ''))}</span>
              <span className="hidden text-left leading-tight sm:block"><span className="block text-sm font-bold text-[#07130f]">{me.doctorName}</span><span className="block text-[11px] text-[#07130f]/70">{me.isAdmin ? 'Admin view' : me.doctorTitle}</span></span>
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-xl">
                <div className="truncate px-3 py-2 text-xs text-slate-500">{me.email}</div>
                <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50"><ExternalLink className="size-4" />View website</Link>
                <Link to="/logout" className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"><LogOut className="size-4" />Log out</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="lg:flex">
        <aside className="hidden w-64 shrink-0 bg-[#0b1f4d] lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)]">{sidebar}</aside>
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onMouseDown={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
            <div className="absolute inset-0 bg-slate-900/50" />
            <div className="relative h-full w-72 max-w-[85vw] bg-[#0b1f4d] shadow-2xl">
              <div className="flex items-center justify-between px-4 pt-3 text-white"><span className="font-extrabold">Menu</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-white/10"><X className="size-5" /></button></div>
              {sidebar}
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6">
          <Outlet context={{ me, refreshAttention } satisfies PortalContext} />
        </main>
      </div>
    </div>
  );
};

export default DoctorPortalLayout;
