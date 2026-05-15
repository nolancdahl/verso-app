export default function Header() {
  return (
    <div className="py-1.5 pl-3 pr-5 bg-warm-200 mb-6">
      <div className="flex items-center gap-1.5">
        {/* Exact Lucide Droplets icon — outline only, two orange shades */}
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"
            fill="none"
            stroke="#f4a58a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
            fill="none"
            stroke="#e06c4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-2xl tracking-wide text-warm-900">
          <span style={{ fontFamily: "'WS Paradose', serif" }}>NOUR-</span>
          <span style={{ fontFamily: "'WS Paradose', serif", fontStyle: 'italic' }}>ish</span>
        </h1>
      </div>
    </div>
  )
}
