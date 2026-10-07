import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Swords, Trophy, Users, Wallet, Youtube, Instagram, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatCard } from '@/components/ui/StatCard';
import { AsyncView, SkeletonCard, SkeletonTable } from '@/components/ui/States';
import { DiscordIcon } from '@/components/ui/icons';
import { HeroArt } from '@/components/HeroArt';
import { TournamentCard } from '@/components/TournamentCard';
import { MatchCard, MatchTable } from '@/components/MatchCard';
import { StandingTable } from '@/components/StandingTable';
import { TeamCard } from '@/components/TeamCard';
import { NewsCard } from '@/components/NewsCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useReveal } from '@/hooks/useReveal';
import { useEffect } from 'react';
import { heroIntro } from '@/animations/heroAnimations';
import { parallax } from '@/animations/scrollAnimations';
import { getTournaments } from '@/services/tournamentService';
import { getMatches } from '@/services/matchService';
import { getStandings } from '@/services/standingService';
import { getTeams } from '@/services/teamService';
import { getNews } from '@/services/newsService';

const loadHome = () => Promise.all([getTournaments(), getMatches(), getStandings(1), getTeams(), getNews()]);

export default function Home() {
  useDocumentTitle('Home', 'Join competitive Free Fire tournaments, build your team and prove yourself on the battlefield.');
  const root = useRef<HTMLDivElement>(null);
  const state = useAsync(loadHome, []);
  useReveal(root, state.data);
  useEffect(() => (root.current ? heroIntro(root.current) : undefined), []);
  useEffect(() => (root.current ? parallax(root.current) : undefined), []);

  return (
    <div ref={root}>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24" aria-label="Welcome">
        <div data-hero="bg" className="absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(ellipse_at_70%_40%,rgba(57,255,20,.28),transparent_60%)]" />
          <div data-hero="shape" className="absolute -left-10 top-1/4 h-64 w-24 -skew-x-[20deg] bg-neon/10" />
          <div data-hero="shape" className="absolute left-1/3 bottom-10 h-3 w-48 -skew-x-[30deg] bg-neon/40" />
          <div data-hero="shape" className="absolute right-1/4 top-24 h-40 w-2 rotate-[20deg] bg-lime/50" />
        </div>
        <div className="container-x relative grid items-center gap-8 lg:grid-cols-2">
          <div className="relative z-10">
            <p data-hero="label" className="mb-4 inline-block border-l-4 border-neon pl-3 font-display text-sm tracking-[0.25em] text-neon sm:text-base">FREE FIRE TOURNAMENT PLATFORM</p>
            <h1 className="font-title text-5xl leading-[0.95] sm:text-7xl xl:text-8xl" aria-label="Battle. Compete. Dominate.">
              <span className="block overflow-hidden"><span data-hero="line" className="block text-white">Battle.</span></span>
              <span className="block overflow-hidden"><span data-hero="line" className="block text-white">Compete.</span></span>
              <span className="block overflow-hidden pr-4"><span data-hero="line" className="block text-neon [text-shadow:0_0_28px_rgba(57,255,20,.55)]">Dominate.</span></span>
            </h1>
            <p data-hero="sub" className="mt-6 max-w-md text-lg text-mist sm:text-xl">Join competitive Free Fire tournaments, build your team, and prove yourself on the battlefield.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/tournaments" arrow dataHero="btn">Join tournament</Button>
              <Button to="/tournaments" variant="outline" dataHero="btn">View tournaments</Button>
            </div>
          </div>
          <div data-hero="art" className="relative mx-auto -mt-4 h-[360px] w-full max-w-[460px] sm:h-[480px] lg:h-[600px] lg:max-w-none">
            <div data-hero="art-float" className="h-full w-full"><HeroArt /></div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent" aria-hidden />
      </section>

      {/* STATS */}
      <section className="container-x -mt-6 pb-16" aria-label="Platform statistics">
        <div data-stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Trophy />} label="Tournaments" value={128} suffix="+" />
          <StatCard icon={<Users />} label="Teams" value={1240} suffix="+" />
          <StatCard icon={<Swords />} label="Players" value={4960} suffix="+" />
          <StatCard icon={<Wallet />} label="Prize pool" value={25} prefix="₹" suffix="L+" />
        </div>
      </section>

      <div className="container-x space-y-20">
        {/* LIVE TOURNAMENTS */}
        <section aria-label="Live tournaments">
          <SectionTitle title="Live" accent="Tournaments" subtitle="Compete in the biggest battles." to="/tournaments" linkLabel="View all tournaments" icon={<Radio />} />
          <AsyncView state={state} skeleton={<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>}>
            {([tournaments]) => (
              <div data-stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[...tournaments].sort((a, b) => (a.status === 'live' ? -1 : 0) - (b.status === 'live' ? -1 : 0)).filter(t => t.status !== 'completed').slice(0, 6).map(t => <TournamentCard key={t.id} t={t} />)}
              </div>
            )}
          </AsyncView>
        </section>

        {/* MATCHES + STANDINGS */}
        <section className="grid gap-6 xl:grid-cols-5" aria-label="Matches and standings">
          <div className="xl:col-span-3" data-reveal>
            <Panel className="h-full" innerClassName="p-5">
              <SectionTitle title="Upcoming" accent="Matches" to="/matches" linkLabel="View all matches" />
              <AsyncView state={state} skeleton={<SkeletonTable />}>
                {([, matches, , teams, ]) => <MatchesBlock matches={matches} teams={teams} />}
              </AsyncView>
            </Panel>
          </div>
          <div className="xl:col-span-2" data-reveal>
            <Panel className="h-full" innerClassName="p-5">
              <SectionTitle title="Group Stage" accent="Standings" to="/standings" linkLabel="View all standings" />
              <AsyncView state={state} skeleton={<SkeletonTable />}>
                {([, , standings, teams]) => <StandingTable compact rows={standings.slice(0, 8)} teams={Object.fromEntries(teams.map(t => [t.id, t]))} />}
              </AsyncView>
            </Panel>
          </div>
        </section>

        {/* TOP TEAMS */}
        <section aria-label="Top teams">
          <SectionTitle title="Top" accent="Teams" to="/teams" linkLabel="View all teams" icon={<Crown />} />
          <AsyncView state={state} skeleton={<SkeletonTable rows={2} />}>
            {([, , , teams]) => (
              <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {[...teams].sort((a, b) => b.points - a.points).slice(0, 5).map((t, i) => <div key={t.id} className={i === 4 ? 'col-span-2 md:col-span-1' : ''}><TeamCard team={t} rank={i + 1} /></div>)}
              </div>
            )}
          </AsyncView>
        </section>
      </div>

      {/* CTA */}
      <section className="relative mt-24 overflow-hidden border-y border-neon/40 py-20 sm:py-28" aria-label="Create your team">
        <div className="absolute inset-0 bg-gradient-to-r from-neon/20 via-void to-void" aria-hidden />
        <div data-parallax="0.3" className="absolute -right-10 top-0 h-[140%] w-48 -skew-x-12 bg-neon/15" aria-hidden />
        <div className="absolute right-1/4 top-0 h-full w-px rotate-12 bg-neon/50" aria-hidden />
        <div className="container-x relative" data-reveal>
          <h2 className="font-title text-4xl text-white sm:text-6xl lg:text-7xl">Ready to enter <span className="text-neon">the battle?</span></h2>
          <p className="mt-5 font-display text-xl text-mist sm:text-2xl">Create your team. Enter the tournament. Become a champion.</p>
          <div className="mt-8 flex flex-wrap gap-4"><Button to="/my-team" arrow>Create team</Button><Button to="/tournaments" variant="outline">Explore tournaments</Button></div>
        </div>
      </section>

      <div className="container-x space-y-20 pt-20">
        {/* NEWS */}
        <section aria-label="Latest news">
          <SectionTitle title="Latest" accent="News" to="/news" linkLabel="View all news" />
          <AsyncView state={state} skeleton={<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}</div>}>
            {([, , , , news]) => <div data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{news.slice(0, 4).map(n => <NewsCard key={n.id} item={n} />)}</div>}
          </AsyncView>
        </section>

        {/* COMMUNITY */}
        <section aria-label="Community" data-reveal>
          <Panel innerClassName="flex flex-col items-center gap-5 px-6 py-12 text-center">
            <h2 className="font-title text-3xl text-white sm:text-5xl">Join the <span className="text-neon">community</span></h2>
            <p className="max-w-xl text-lg text-dim">Connect with players, teams and tournament organizers.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="https://discord.com"><DiscordIcon size={18} /> Discord</Button>
              <Button href="https://instagram.com" variant="outline"><Instagram size={18} /> Instagram</Button>
              <Button href="https://youtube.com" variant="outline"><Youtube size={18} /> YouTube</Button>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

function MatchesBlock({ matches, teams }: { matches: import('@/types').Match[]; teams: import('@/types').Team[] }) {
  const tMap = Object.fromEntries(teams.map(t => [t.id, t]));
  const rows = [...matches.filter(m => m.status === 'completed').slice(-2), ...matches.filter(m => m.status !== 'completed').slice(0, 4)];
  const tournaments = useAsync(getTournaments, []);
  const trMap = Object.fromEntries((tournaments.data ?? []).map(t => [t.id, t]));
  return (
    <>
      <div className="hidden md:block"><MatchTable matches={rows} teams={tMap} tournaments={trMap} /></div>
      <div className="grid gap-4 md:hidden">{rows.slice(0, 4).map(m => <MatchCard key={m.id} match={m} teams={tMap} tournaments={trMap} />)}</div>
      <p className="mt-3 text-xs text-dim"><Link to="/matches" className="hover:text-neon">Room details unlock on each match page.</Link></p>
    </>
  );
}
