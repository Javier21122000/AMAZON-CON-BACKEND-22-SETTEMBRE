export function ProductReviews({ rating = 0, numeroRecensioni = 0 }: { rating?: number; numeroRecensioni?: number }) {
  const score = Math.max(0, Math.min(5, Math.round(rating)))
  return <span className="product-reviews" aria-label={`${score} su 5, ${numeroRecensioni} recensioni`}>
    <span className="review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span key={index} className={index < score ? 'star-filled' : 'star-empty'}>{index < score ? '★' : '☆'}</span>)}</span>
    <span className="review-count">({numeroRecensioni} {numeroRecensioni === 1 ? 'recensione' : 'recensioni'})</span>
  </span>
}
