import { Link } from 'react-router-dom';
import { Panel } from './ui/Panel';
import type { NewsItem } from '@/types';
import { formatLongDate } from '@/utils/format';

const CAT: Record<string, string> = { Tournament: 'bg-neon text-void', Announcement: 'bg-cyan-400 text-void', Update: 'bg-lime text-void', Community: 'bg-fuchsia-400 text-void' };

export function NewsArt({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Tournament news artwork">
      <rect width="400" height="200" fill="#061412" />
      <g stroke={color} strokeOpacity=".12">{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 44} 0V200`} />)}</g>
      <path d="M-20 200 120 -10h70L50 200z" fill={color} opacity=".35" /><path d="M200 200 330 -10h60L260 200z" fill={color} opacity=".18" />
      <circle cx="300" cy="90" r="46" fill="none" stroke={color} strokeWidth="2" /><circle cx="300" cy="90" r="6" fill={color} />
      <path d="M254 90h-30M346 90h30M300 44V14M300 136v30" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export function NewsCard({ item, featured }: { item: NewsItem; featured?: boolean }) {
  return (
    <Link to={`/news/${item.slug}`} className="group block h-full" aria-label={item.title}>
      <Panel hover className="h-full" innerClassName={`flex flex-col ${featured ? 'md:flex-row' : ''}`}>
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : ''}`}>
          <NewsArt color={item.color} className={`w-full transition-transform duration-500 group-hover:scale-105 ${featured ? 'h-56 md:h-full' : 'h-36'}`} />
          <span className={`absolute bottom-2 left-3 px-2 py-0.5 font-display text-[11px] font-bold uppercase ${CAT[item.category]}`}>{item.category}</span>
        </div>
        <div className={`flex flex-1 flex-col p-4 ${featured ? 'md:p-8' : ''}`}>
          <h3 className={`font-display font-bold leading-snug text-white ${featured ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>{item.title}</h3>
          <time className="mt-1 text-xs text-dim" dateTime={item.date}>{formatLongDate(item.date)}</time>
          <p className="mt-2 line-clamp-3 text-sm text-dim">{item.excerpt}</p>
          <span className="mt-auto pt-3 font-display text-sm font-bold uppercase text-neon group-hover:underline">Read more</span>
        </div>
      </Panel>
    </Link>
  );
}
