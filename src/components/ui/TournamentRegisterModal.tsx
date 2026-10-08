import { X } from 'lucide-react';

interface TournamentRegisterModalProps {
  tournamentName: string;
  onClose: () => void;
}

export function TournamentRegisterModal({
  tournamentName,
  onClose,
}: TournamentRegisterModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Registration submitted');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl border border-neon/60 bg-[#061510] p-6 shadow-[0_0_40px_rgba(57,255,20,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-dim hover:text-neon"
        >
          <X size={24} />
        </button>

        <p className="font-hud text-xs uppercase tracking-widest text-neon">
          Tournament Registration
        </p>

        <h2 className="mt-2 font-title text-2xl text-white">
          {tournamentName}
        </h2>

        <p className="mt-1 text-sm text-dim">
          Register your team for this tournament.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <input
            type="text"
            placeholder="Player 1 UID"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <input
            type="text"
            placeholder="Player 2 UID"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <input
            type="text"
            placeholder="Player 3 UID"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <input
            type="text"
            placeholder="Player 4 UID"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none placeholder:text-dim focus:border-neon"
          />

          <select
            required
            defaultValue=""
            className="w-full border border-neon/20 bg-deep px-4 py-3 text-sm text-white outline-none focus:border-neon"
          >
            <option value="" disabled>
              Number of Players
            </option>

            <option value="2">2 Players</option>
            <option value="4">4 Players</option>
            <option value="5">5 Players</option>
            <option value="6">6 Players</option>
          </select>

          <button
            type="submit"
            className="w-full bg-neon py-3 font-title text-sm font-bold uppercase text-black hover:bg-neon2"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}