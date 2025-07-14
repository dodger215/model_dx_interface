
export const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        padding: '0.6rem 1.2rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 10px var(--color-shadow)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
      }}
    >
      {children}
    </button>
  );
};
