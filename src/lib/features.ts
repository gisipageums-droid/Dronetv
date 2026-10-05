// Drone Doctor paid consultations are live on the dev site only for now. The live domains
// (dronetv.in / www.dronetv.in) hide every link to it; flip this when it goes to production.
export const DOCTOR_CONSULT_ENABLED: boolean =
  typeof window !== 'undefined' && !/^(www\.)?dronetv\.in$/i.test(window.location.hostname);
