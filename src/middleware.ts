import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match puzzle URLs with unpadded IDs (1-3 digits)
  const puzzleMatch = pathname.match(/^\/puzzles\/(easy|medium|hard)\/puzzle\/(\d{1,3})$/);
  
  if (puzzleMatch) {
    const [, difficulty, id] = puzzleMatch;
    
    // If ID is less than 4 digits, pad it and redirect
    if (id.length < 4) {
      const paddedId = id.padStart(4, '0');
      const newUrl = new URL(`/puzzles/${difficulty}/puzzle/${paddedId}`, request.url);
      return NextResponse.redirect(newUrl, 301); // Permanent redirect
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/puzzles/:difficulty*/puzzle/:id*',
};
