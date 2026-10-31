import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="quest-page">
      <p className="eyebrow">404 / UNCHARTED PATH</p>
      <h1>A little off the trail.</h1>
      <p>This quest hasn’t been recorded. The known trail is just over here.</p>
      <Link href="/" className="button">
        Back to Spawn Point ↗
      </Link>
    </main>
  );
}
