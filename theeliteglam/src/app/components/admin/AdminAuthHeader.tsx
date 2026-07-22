type AdminAuthHeaderProps = {
  title: string;
  description: string;
};

export default function AdminAuthHeader({ title, description }: AdminAuthHeaderProps) {
  return (
    <div className="text-center py-8">
      <h1 className="font-raleway text-4xl text-[#F5EDD6] mb-3">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
