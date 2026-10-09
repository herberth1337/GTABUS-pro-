import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import Pagination from './Pagination.jsx';

const PAGE_SIZE = 8;

export default function ListPage({
  title,
  subtitle,
  actionLabel,
  actionTo,
  searchPlaceholder,
  data,
  searchFn,
  columns,
  renderRow,
  emptyMessage
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [query]);

  const filtro = searchFn
    ? (item) => searchFn(item, query)
    : (item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase());

  const filtrados = query ? data.filter(filtro) : data;
  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const pagina = filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="list-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        {actionLabel && (
          <Link to={actionTo}><button className="btn-accent">{actionLabel}</button></Link>
        )}
      </div>

      <div className="list-toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder={searchPlaceholder} />
        <span className="result-count">
          {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>

      <div className="table-wrap">
        {pagina.length === 0 ? (
          <div className="empty-state">
            {query ? 'No hay resultados para tu búsqueda.' : (emptyMessage || 'Todavía no hay registros.')}
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {pagina.map(renderRow)}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
