import { Panel } from '@/components/ui/Panel';
import { PageHeader } from '@/components/ui/SectionTitle';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PLACEMENT_POINTS } from '@/utils/scoring';

const BLOCKS = [
  { id: 'mission', title: 'Our mission', body: 'FF Battle Arena gives Free Fire squads one place to register, play and track competitive tournaments, from local community cups to state championships.' },
  { id: 'privacy', title: 'Privacy policy', body: 'We store only the details needed to run tournaments: username, email and team information. Room passwords are shown only on match pages.' },
  { id: 'terms', title: 'Terms', body: 'Players must follow tournament rules, play on approved devices and respect organizers. Cheating results in disqualification and a ban.' },
  { id: 'contact', title: 'Contact', body: 'Reach organizers through the Discord community or email support@ffbattlearena.gg. We reply within two days.' },
];

export default function About() {
  useDocumentTitle('About', 'About FF Battle Arena, scoring rules, privacy and contact information.');
  return (
    <>
      <PageHeader title="About" accent="The Arena" subtitle="An independent tournament platform built for the Free Fire community." />
      <div className="container-x grid gap-6 py-10 md:grid-cols-2">
        {BLOCKS.map(b => <div id={b.id} key={b.id} className="scroll-mt-28"><Panel className="h-full" innerClassName="p-6"><h2 className="mb-2 font-title text-2xl text-white">{b.title}</h2><p className="text-dim">{b.body}</p></Panel></div>)}
        <div id="rules" className="scroll-mt-28 md:col-span-2">
          <Panel innerClassName="p-6">
            <h2 className="mb-3 font-title text-2xl text-white">Scoring rules</h2>
            <p className="mb-4 text-dim">Every kill is worth 1 point. Placement points are awarded as follows.</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">{Object.entries(PLACEMENT_POINTS).map(([p, v]) => <li key={p} className="border border-neon/25 bg-deep p-3 text-center"><span className="block text-xs text-dim">Rank {p}</span><span className="font-hud text-xl font-bold text-neon">{v}</span></li>)}</ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
