export const LoadingFallback = () => (
  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div className="skeleton" style={{ height: '64px', width: '100%' }} />
    <div className="skeleton" style={{ height: '300px', width: '100%' }} />
  </div>
);
