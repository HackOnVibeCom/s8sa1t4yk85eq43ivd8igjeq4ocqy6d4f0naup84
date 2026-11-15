# Final audit

The application runtime stack is open source: Node.js, Next.js, React, TypeScript, Tailwind CSS, Lucide, Zod, Prisma ORM and SQLite. Public venue listing/detail and contribution/reaction/comment/report writes use Prisma-backed Next.js API handlers. Seed content is labeled demo. Local database is the default; Supabase has been removed.

Authentication, private image storage and privacy processing, map provider and optional open-source vision inference need operator configuration before production use. Demo identity headers are not production authentication.
