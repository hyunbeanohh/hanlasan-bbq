export default function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="site-width page-heading">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
