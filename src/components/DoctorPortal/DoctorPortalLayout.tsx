import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, ClipboardCheck, FileText, HelpCircle, LayoutDashboard, LogOut, Menu, Settings, Stethoscope, Users, Video, BarChart3, X, ExternalLink, ChevronDown } from 'lucide-react';
import { getToken } from '../../lib/authService';
import { Me, Summary, portalAccess, portalMe, portalSummary } from '../../lib/doctorPortalApi';
import { Spinner } from './ui';

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
      <div className="mt-auto overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#16367f] to-[#071535] p-4 text-center text-white">
        <div className="text-3xl font-black leading-none tracking-tight">Drone</div>
        <div className="mt-1 flex items-center justify-center gap-1.5 text-xl font-extrabold text-[#ffd321]">Doctor<Stethoscope className="size-5" /></div>
        <div className="mt-1 text-[11px] text-slate-300">Powered by DroneTv.in</div>
        <div className="mt-3 border-t border-white/15 pt-2 text-[11px] font-semibold tracking-wide text-slate-100">Guidance | Solutions | Growth</div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800">
      <header className="sticky top-0 z-40 h-16 overflow-hidden bg-white shadow lg:h-[7.5rem]">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-full bg-[#ffd321] lg:w-[80%]" style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 0px) 100%, 0 100%)' }} />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[82%] bg-[#ffd321] lg:block" style={{ clipPath: 'polygon(0 0, 100% 0, 91% 100%, 0 100%)' }} />
        <div className="relative z-10 flex h-full items-center gap-3 px-3 sm:px-5">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-[#07130f] hover:bg-black/10 lg:hidden"><Menu className="size-6" /></button>
          <Link to="/doctor-portal" className="flex min-w-0 items-center gap-3 lg:gap-5" aria-label="Drone Doctor dashboard">
            <span className="flex shrink-0 flex-col items-center">
              <img src="/images/Drone%20tv%20.in.png" alt="DroneTV.in" className="h-9 w-auto sm:h-10 lg:h-[4.75rem]" />
              <span className="mt-0.5 hidden whitespace-nowrap text-[8px] font-bold uppercase tracking-wide text-[#07130f] lg:block">Voice of drone technology, for all technologies</span>
            </span>
            <span className="hidden h-14 w-px bg-black/30 lg:block" />
            <span className="min-w-0 leading-tight">
              <span className="flex items-center gap-1.5 text-lg font-black tracking-tight text-[#111] sm:text-xl lg:text-[2.6rem] lg:leading-none">Drone <span className="text-red-600">Doctor</span><Stethoscope className="size-5 text-red-600 lg:size-9" /></span>
              <span className="hidden truncate text-[11px] font-semibold text-[#07130f] md:block lg:mt-1.5 lg:text-xs">Expert Consultation on Drones, GIS, AI and Related Technologies</span>
            </span>
          </Link>
          <div className="pointer-events-none absolute inset-y-0 right-[17rem] hidden w-[27rem] xl:flex" aria-hidden="true">
            <img src="/images/drone-doctor/dr-pranay-kumar.jpg" alt="" className="h-full w-44 object-cover object-top" />
            <div className="flex flex-1 flex-col justify-center bg-[#0b1f4d] pl-9 pr-4 text-white" style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)', marginLeft: '-1.5rem' }}>
              <div className="text-xl font-extrabold leading-tight text-[#ffd321]">{me.doctorName}</div>
              <div className="text-sm font-semibold">{me.doctorTitle}</div>
              <div className="mt-1 text-[10px] leading-snug text-slate-200">Expert Consultation on Drones,<br />GIS, AI and Related Technologies</div>
            </div>
          </div>
          <div className="relative ml-auto flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button type="button" onClick={() => { setBellOpen(v => !v); setUserOpen(false); }} aria-label={`Notifications${bellCount ? `, ${bellCount} need attention` : ''}`} aria-expanded={bellOpen} className="relative rounded-lg p-2 text-[#07130f] hover:bg-black/10 lg:text-slate-800">
                <Bell className="size-5 lg:size-6" />
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
                <img src="/images/drone-doctor/dr-pranay-kumar.jpg" alt="" className="size-9 rounded-full border-2 border-white object-cover object-top shadow lg:size-11" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <span className="hidden text-left leading-tight sm:block"><span className="block text-sm font-bold text-[#07130f] lg:text-slate-900">{me.doctorName}</span><span className="block text-[11px] text-[#07130f]/70 lg:text-slate-500">{me.isAdmin ? 'Admin view' : me.doctorTitle}</span></span>
                <ChevronDown className="hidden size-4 text-slate-700 sm:block" />
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
        </div>
      </header>

      <div className="lg:flex">
        <aside className="hidden w-60 shrink-0 bg-[#0b1f4d] lg:sticky lg:top-[7.5rem] lg:block lg:h-[calc(100vh-7.5rem)]">{sidebar}</aside>
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
