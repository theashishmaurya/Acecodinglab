import React from 'react';

const ProductCard = ({ product }) => {
  const discountedPrice = product.price * (1 - product.discountPercentage);
  const formatPrice = price => `$${price.toFixed(2)}`;

  return (
    <div
      data-testid={`product-${product.id}`}
      style={{
        maxWidth: '100%',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '60%', // 60% aspect ratio
        }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#ff4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {(product.discountPercentage * 100).toFixed(0)}% OFF
        </span>
      </div>

      <div
        style={{
          padding: '16px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          {product.title}
        </h3>

        <p
          style={{
            fontSize: '14px',
            color: '#666',
            margin: '0 0 8px 0',
          }}
        >
          {product.brand}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#2c2c2c',
            }}
          >
            {formatPrice(discountedPrice)}
          </span>
          <span
            style={{
              textDecoration: 'line-through',
              color: '#999',
              fontSize: '16px',
            }}
          >
            {formatPrice(product.price)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                color: '#ffd700',
              }}
            >
              ★
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#666',
              }}
            >
              {product.rating}
            </span>
          </div>
          <span
            style={{
              fontSize: '14px',
              color: product.stock > 0 ? '#22c55e' : '#ef4444',
            }}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: '#666',
            margin: '12px 0 0 0',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
