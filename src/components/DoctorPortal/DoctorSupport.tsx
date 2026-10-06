import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Card } from './ui';

const STEPS: [string, string][] = [
  ['A client books and pays', 'The consultation appears in Appointments as Upcoming once the payment succeeds.'],
  ['Join the meeting', 'Use Join on the dashboard or in Meeting Links. Your Google Meet link is in every client email.'],
  ['Update the outcome', 'After the session starts, open the appointment and choose Mark completed, or Client did not join.'],
  ['Add notes and follow-ups', 'Write private notes and set follow-up reminders; due ones show in the bell at the top.'],
  ['Check the reports', 'Reports shows consultations, clients and fees for any period, and exports to CSV.'],
];

const DoctorSupport: React.FC = () => (
  <div className="space-y-5">
    <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Support</h1><p className="text-sm text-slate-500">We are here if something does not look right.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">
      <a href="mailto:support@dronetv.in" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><Mail className="mb-2 size-6 text-blue-600" /><div className="font-bold text-slate-900">Email</div><div className="text-sm text-slate-600">support@dronetv.in</div></a>
      <a href="tel:+917520123555" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><Phone className="mb-2 size-6 text-green-600" /><div className="font-bold text-slate-900">Phone</div><div className="text-sm text-slate-600">+91 75201 23555</div></a>
      <a href="https://wa.me/917520123555" target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><MessageCircle className="mb-2 size-6 text-emerald-600" /><div className="font-bold text-slate-900">WhatsApp</div><div className="text-sm text-slate-600">Chat with the team</div></a>
    </div>
    <Card className="p-4 sm:p-5">
      <h2 className="mb-3 text-lg font-extrabold text-slate-900">How the portal works</h2>
      <ol className="space-y-3">
        {STEPS.map(([t, d], i) => <li key={t} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0b1f4d] text-xs font-bold text-white">{i + 1}</span><span><b className="block text-slate-800">{t}</b><span className="text-sm text-slate-600">{d}</span></span></li>)}
      </ol>
      <p className="mt-4 text-sm text-slate-600">Need to refund or cancel a paid consultation? Ask the DroneTV admin team - they can cancel with a refund. See also <Link to="/faqs" className="font-bold text-blue-700 hover:underline">FAQs</Link>.</p>
    </Card>
  </div>
);

export default DoctorSupport;
