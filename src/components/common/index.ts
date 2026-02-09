/**
 * BARREL EXPORTS FOR COMMON COMPONENTS
 * 
 * WHAT IS BARREL EXPORT?
 * A single index.ts file that re-exports all components from a folder.
 * 
 * WITHOUT barrel export:
 * import { Button } from '@/components/common/Button/Button';
 * import { Card } from '@/components/common/Card/Card';
 * import { Badge } from '@/components/common/Badge/Badge';
 * import { Input } from '@/components/common/Input/Input';
 * ^ Verbose and brittle
 * 
 * WITH barrel export (what we're doing):
 * import { Button, Card, Badge, Input } from '@/components/common';
 * ^ Clean, easy, less path changes if we reorganize
 * 
 * THIS IS A BEST PRACTICE IN PROFESSIONAL APPLICATIONS
 * - Airbnb does this
 * - Stripe does this
 * - Next.js projects use this pattern
 */

export { Button } from './Button';
export { Card } from './Card';
export { Badge } from './Badge';
export { Input } from './Input';
