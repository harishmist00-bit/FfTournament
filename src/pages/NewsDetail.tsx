import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { NewsArt } from '@/components/NewsCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getNewsItem } from '@/services/newsService';
import { formatLongDate } from '@/utils/format';

export default function NewsDetail() {
  const { slug = '' } = useParams();
  const state = useAsync(() => getNewsItem(slug), [slug]);
  useDocumentTitle(state.data?.title ?? 'News', state.data?.excerpt);
  return (
    <article className="container-x max-w-3xl pb-8 pt-32">
      <Link to="/news" className="mb-6 inline-flex items-center gap-2 text-neon hover:underline"><ArrowLeft size={16} /> All news</Link>
      <AsyncView state={state} skeleton={<SkeletonTable rows={8} />}>
        {n => (
          <Panel innerClassName="overflow-hidden">
            <NewsArt color={n.color} className="h-56 w-full" />
            <div className="p-6 sm:p-10">
              <p className="text-sm uppercase tracking-widest text-neon">{n.category} · <time dateTime={n.date}>{formatLongDate(n.date)}</time></p>
              <h1 className="mt-2 font-title text-3xl text-white sm:text-4xl">{n.title}</h1>
              <div className="mt-6 space-y-4 text-lg text-mist">{n.body.map(p => <p key={p}>{p}</p>)}</div>
            </div>
          </Panel>
        )}
      </AsyncView>
    </article>
  );
}
