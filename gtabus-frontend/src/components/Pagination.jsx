export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Ventana de hasta 5 números de página, centrada en la página actual
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  start = Math.max(1, end - 4);
  const numeros = [];
  for (let i = start; i <= end; i++) numeros.push(i);

  return (
    <div className="pagination">
      <button
        className="btn-ghost"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>

      {numeros.map(n => (
        <button
          key={n}
          className={n === page ? 'current' : ''}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}

      <button
        className="next-btn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente →
      </button>
    </div>
  );
}
