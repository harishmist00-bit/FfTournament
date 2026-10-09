
import { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Crown, QrCode, CheckCircle2 } from 'lucide-react';

interface TournamentRegisterModalProps {
  tournamentName: string;
  onClose: () => void;
}

const ENTRY_FEE = '100.00'; // Change to your actual entry fee
const UPI_ID = 'yourname@okaxis'; // Replace with your actual UPI ID
const PAYEE_NAME = 'Your Tournament Name';
const QR_IMAGE = '/payment-qr.png';

export function TournamentRegisterModal({
  tournamentName,
  onClose,
}: TournamentRegisterModalProps) {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(['', '', '', '']);
  const [captain, setCaptain] = useState<number | null>(null);

  const [primaryMobile, setPrimaryMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');

  const inputClass =
    'w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon';

  const updatePlayer = (index: number, value: string) => {
    setPlayers((previous) =>
      previous.map((uid, i) => (i === index ? value : uid))
    );
  };

  const goToPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (captain === null) {
      alert('Please select your team captain.');
      return;
    }

    setStep(2);
  };

  const payNow = () => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: ENTRY_FEE,
      cu: 'INR',
      tn: `${tournamentName} - ${teamName}`,
    });

    // Opens Google Pay when its Android deep link is supported.
    window.location.href = `gpay://upi/pay?${params.toString()}`;
  };

  const openOtherUPIApps = () => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: ENTRY_FEE,
      cu: 'INR',
      tn: `${tournamentName} - ${teamName}`,
    });

    // General UPI link; the device may show available UPI apps.
    window.location.href = `upi://pay?${params.toString()}`;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className="relative my-auto max-h-[92vh] w-full max-w-xl overflow-y-auto border border-neon/60 bg-[#061510] p-5 shadow-[0_0_40px_rgba(57,255,20,0.2)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 text-dim hover:text-neon"
        >
          <X size={24} />
        </button>

        <p className="font-hud text-xs uppercase tracking-widest text-neon">
          Tournament Registration
        </p>

        <h2
          id="register-title"
          className="mt-2 pr-8 font-title text-2xl text-white"
        >
          {tournamentName}
        </h2>

        {/* Step indicator */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className={`border p-3 ${
              step === 1
                ? 'border-neon bg-neon/10'
                : 'border-neon/20'
            }`}
          >
            <p className="text-xs text-dim">STEP 01</p>
            <p className={`mt-1 text-sm font-bold ${
              step === 1 ? 'text-neon' : 'text-white'
            }`}>
              Team Details
            </p>
          </div>

          <div
            className={`border p-3 ${
              step === 2
                ? 'border-neon bg-neon/10'
                : 'border-neon/20'
            }`}
          >
            <p className="text-xs text-dim">STEP 02</p>
            <p className={`mt-1 text-sm font-bold ${
              step === 2 ? 'text-neon' : 'text-white'
            }`}>
              Payment
            </p>
          </div>
        </div>

        {/* STEP 1: TEAM REGISTRATION */}
        {step === 1 && (
          <form onSubmit={goToPayment} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-dim">
                Team Name
              </label>

              <input
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={50}
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-dim">
                  Squad Player UIDs
                </label>
                <span className="text-xs text-neon">4 Players</span>
              </div>

              <div className="space-y-3">
                {players.map((uid, index) => {
                  const selected = captain === index;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 border p-2 sm:gap-3 sm:p-3 ${
                        selected
                          ? 'border-neon bg-neon/10'
                          : 'border-neon/20 bg-deep'
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-neon/30 text-xs font-bold text-neon">
                        {index + 1}
                      </span>

                      <input
                        type="text"
                        placeholder={`Player ${index + 1} UID`}
                        value={uid}
                        onChange={(e) =>
                          updatePlayer(index, e.target.value)
                        }
                        required
                        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-dim"
                      />

                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setCaptain(index)}
                        className={`flex shrink-0 items-center gap-1 border px-2 py-2 text-[10px] font-bold sm:px-3 sm:text-xs ${
                          selected
                            ? 'border-neon bg-neon text-black'
                            : 'border-neon/30 text-dim hover:border-neon hover:text-neon'
                        }`}
                      >
                        <Crown size={14} />
                        {selected ? 'CAPTAIN' : 'SELECT'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-dim">
                {captain === null
                  ? 'Select one player as captain.'
                  : `Captain: Player ${captain + 1}`}
              </p>
            </div>

            
              {/* Mobile Numbers */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-dim">
                    Primary Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter primary mobile number"
                    value={primaryMobile}
                    onChange={(e) =>
                      setPrimaryMobile(
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                    pattern="[6-9][0-9]{9}"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-dim">
                    Alternate Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter alternate mobile number"
                    value={alternateMobile}
                    onChange={(e) =>
                      setAlternateMobile(
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                    pattern="[6-9][0-9]{9}"
                    className={inputClass}
                  />
                </div>
              </div>


            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-neon py-3 font-title text-sm font-bold uppercase text-black transition hover:bg-neon2"
            >
              Next: Payment
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <div className="mt-6 space-y-5">
            <div className="border border-neon/20 bg-deep p-4">
              <p className="text-xs uppercase tracking-wider text-dim">
                Registration Summary
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-white">Team</span>
                <span className="text-sm font-bold text-neon">
                  {teamName}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm text-white">Captain</span>
                <span className="text-sm text-neon">
                  Player {(captain ?? 0) + 1}
                </span>
              </div>

              <div className="mt-4 border-t border-neon/20 pt-4">
                <p className="text-xs text-dim">ENTRY FEE</p>
                <p className="mt-1 font-title text-3xl font-bold text-neon">
                  ₹{ENTRY_FEE}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-3 flex items-center justify-center gap-2 text-neon">
                <QrCode size={20} />
                <h3 className="font-title text-lg font-bold">
                  SCAN & PAY
                </h3>
              </div>

              <div className="mx-auto flex w-fit items-center justify-center border-4 border-white bg-white p-2">
                <img
                  src={QR_IMAGE}
                  alt="Tournament payment UPI QR code"
                  className="h-52 w-52 object-contain sm:h-60 sm:w-60"
                />
              </div>

              <p className="mt-3 text-sm text-white">
                Pay ₹{ENTRY_FEE} to complete your payment.
              </p>

              <p className="mt-1 break-all text-xs text-dim">
                UPI ID: {UPI_ID}
              </p>
            </div>

            <button
              type="button"
              onClick={payNow}
              className="flex w-full items-center justify-center gap-2 bg-neon py-3 font-title text-sm font-bold uppercase text-black transition hover:bg-neon2"
            >
              Pay Now
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={openOtherUPIApps}
              className="w-full border border-neon/30 py-3 text-sm font-bold text-white transition hover:border-neon hover:text-neon"
            >
              Open Other UPI Apps
            </button>

            <div className="flex items-start gap-2 border border-amber-400/20 bg-amber-400/5 p-3">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-amber-400"
              />
              <p className="text-xs leading-5 text-dim">
                After paying, your payment must be verified before
                your tournament registration can be confirmed.
                Keep your UPI transaction reference number.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex w-full items-center justify-center gap-2 py-2 text-sm text-dim transition hover:text-neon"
            >
              <ArrowLeft size={16} />
              Back to Team Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
