// import { CheckCircle, Clock, Mail } from 'lucide-react';

// export default function SignupConfirmation() {

//     function clicked(){
//         window.location.href="/"
//     }
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-surface-main to-white flex items-center justify-center p-4">
//             <div className="max-w-md w-full">
//                 {/* Main Card */}
//                 <div className="bg-surface-card rounded-2xl shadow-xl border border-brand-yellow-soft p-8 text-center">
//                     {/* Success Icon */}
//                     <div className="mb-6">
//                         <div className="mx-auto w-16 h-16 bg-brand-yellow-soft rounded-full flex items-center justify-center">
//                             <CheckCircle className="w-8 h-8 text-brand-gold" />
//                         </div>
//                     </div>

//                     {/* Celebration Emoji */}
//                     <div className="text-4xl mb-4">🎊</div>

//                     {/* Main Heading */}
//                     <h1 className="text-2xl font-bold text-ink-charcoal mb-2">
//                         Thank you for Creating Profile!
//                     </h1>

//                     {/* Success Message */}
//                     <p className="text-ink-paragraph mb-6">
//                         Your profile has been successfully submitted and is now under review.
//                     </p>

//                     {/* Review Process Info */}
//                     <div className="bg-surface-main rounded-lg p-4 mb-6">
//                         <div className="flex items-center justify-center mb-3">
//                             <Clock className="w-5 h-5 text-brand-gold mr-2" />
//                             <span className="text-brand-gold font-medium">Review in Progress</span>
//                         </div>
//                         <p className="text-sm text-brand-gold leading-relaxed">
//                             Our team carefully checks every application, and this process usually takes{' '}
//                             <span className="font-semibold">48–72 hours</span>.
//                         </p>
//                     </div>

//                     {/* Email Notification Info */}
//                     <div className="flex items-center justify-center text-ink-paragraph mb-8">
//                         <Mail className="w-4 h-4 mr-2" />
//                         <span className="text-sm">
//                             You'll receive an update on your registered email
//                         </span>
//                     </div>

//                     {/* Action Button */}
//                     <button className="w-full bg-brand-gold hover:bg-brand-gold text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
//                     onClick={clicked}>
//                         Got it, thanks!
//                     </button>
//                 </div>

//                 {/* Footer Message */}
//                 <div className="text-center mt-6">
//                     <p className="text-sm text-ink-caption">
//                         Questions? Feel free to contact our support team.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }