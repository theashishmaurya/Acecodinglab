import ProductCard from './productCard';
import './styles.css';

export default function App() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <span data-testid="total-products" style={{ display: 'none' }}>
        {/** Total Number of Products here */}
        {/* {totalProducts} */}
      </span>

      {/** Your Implementation Here */}
    </div>
  );
}
