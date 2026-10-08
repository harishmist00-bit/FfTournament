import { useState } from 'react';
import { Calendar, Swords, Trophy, Users } from 'lucide-react';
import { Panel } from './ui/Panel';
import { StatusBadge } from './ui/StatusBadge';
import { Button } from './ui/Button';
import { TournamentLogo } from './ui/TeamLogo';
import { TournamentRegisterModal } from './ui/TournamentRegisterModal';
import type { Tournament } from '@/types';
import { formatDay, formatINR, formatRange } from '@/utils/format';

export function TournamentCard({ t }: { t: Tournament }) {
  const [showRegister, setShowRegister] = useState(false);

  const pct = Math.min(
    100,
    Math.round((t.teamCount / t.maxTeams) * 100)
  );

  return (
    <>
      <Panel hover className="h-full" innerClassName="flex flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="transition-transform duration-300 group-hover:scale-110">
            <TournamentLogo
              name={t.name}
              color={t.color}
              size={64}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1">
              <StatusBadge status={t.status} />
            </div>

            <h3 className="font-title text-lg leading-tight text-white">
              {t.name}
            </h3>

            <p className="flex items-center gap-1 text-sm text-dim">
              <Swords size={14} aria-hidden />
              {t.mode} Tournament
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-dim">
          {t.description}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-neon/20 pt-3 text-center">
          <div>
            <dt className="sr-only">Prize pool</dt>

            <dd className="font-hud text-sm font-bold text-neon sm:text-base">
              <Trophy
                size={14}
                className="mx-auto mb-0.5"
                aria-hidden
              />

              {formatINR(t.prizePool)}
            </dd>

            <span className="text-[11px] uppercase text-dim">
              Prize pool
            </span>
          </div>

          <div>
            <dt className="sr-only">Teams</dt>

            <dd className="font-hud text-sm font-bold text-white sm:text-base">
              <Users
                size={14}
                className="mx-auto mb-0.5 text-neon"
                aria-hidden
              />

              {t.teamCount}/{t.maxTeams}
            </dd>

            <span className="text-[11px] uppercase text-dim">
              Teams
            </span>
          </div>

          <div>
            <dt className="sr-only">Dates</dt>

            <dd className="font-hud text-xs font-bold text-white sm:text-sm">
              <Calendar
                size={14}
                className="mx-auto mb-0.5 text-neon"
                aria-hidden
              />

              {formatRange(t.startDate, t.endDate)}
            </dd>

            <span className="text-[11px] uppercase text-dim">
              Dates
            </span>
          </div>
        </dl>

        <div
          className="mt-4"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Slots filled"
        >
          <div className="mb-1 flex justify-between text-xs text-dim">
            <span>
              Registration closes {formatDay(t.regEnd)}
            </span>

            <span>{pct}% full</span>
          </div>

          <div className="h-1.5 bg-deep">
            <div
              className="h-full bg-gradient-to-r from-neon2 to-neon shadow-neon-sm"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-auto pt-5 text-center">
          <Button
            type="button"
            onClick={() => setShowRegister(true)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            View details
          </Button>
        </div>
      </Panel>

      {showRegister && (
        <TournamentRegisterModal
          tournamentName={t.name}
          onClose={() => setShowRegister(false)}
        />
      )}
    </>
  );
}