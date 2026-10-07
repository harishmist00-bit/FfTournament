import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/SectionTitle';
import { FilterBar, Pagination, SearchBar } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonCard } from '@/components/ui/States';
import { NewsCard } from '@/components/NewsCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getNews } from '@/services/newsService';

const CATS = ['All', 'Tournament', 'Announcement', 'Update', 'Community'] as const;
const PER = 6;

export default function News() {
  useDocumentTitle('News', 'Tournament announcements, updates and community news from FF Battle Arena.');
  const state = useAsync(getNews, []);
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [cat, q]);
  const list = useMemo(() => (state.data ?? []).filter(n => (cat === 'All' || n.category === cat) && n.title.toLowerCase().includes(q.toLowerCase())), [state.data, cat, q]);
  return (
    <>
      <PageHeader title="Arena" accent="News" subtitle="Announcements, rule changes and results from the field." />
      <div className="container-x py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><FilterBar label="Filter by category" options={CATS} value={cat} onChange={setCat} /><SearchBar value={q} onChange={setQ} placeholder="Search news" /></div>
        <AsyncView state={{ ...state, data: state.data && list }} isEmpty={d => !d.length} empty={<EmptyState title="No articles found" message="Try another category or search term." />}
          skeleton={<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>}>
          {d => {
            const featured = page === 1 && d.length > 1 ? d[0] : null;
            const rest = featured ? d.slice(1) : d;
            const pageItems = rest.slice((page - 1) * PER, page * PER);
            return (<>
              {featured && <div className="mb-6"><NewsCard item={featured} featured /></div>}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{pageItems.map(n => <NewsCard key={n.id} item={n} />)}</div>
              <Pagination page={page} pageCount={Math.ceil(rest.length / PER)} onChange={setPage} />
            </>);
          }}
        </AsyncView>
      </div>
    </>
  );
}
