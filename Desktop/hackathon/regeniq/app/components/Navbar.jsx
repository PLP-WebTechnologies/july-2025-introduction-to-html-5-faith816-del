import Link from "next/link";

export default function Navbar() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Farms", href: "/farms" }, // ✅ plural
    { name: "AI Buddy", href: "/ai-buddy" },
    { name: "Map", href: "/map" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="flex justify-between items-center p-4 bg-[#01411C] text-white">
      <h1 className="text-2xl font-bold">RegenIQ</h1>
      <div className="flex gap-6">
       {links.map((link) => (
  <Link
    key={`${link.name}-${link.href}`}
    href={link.href}
    className="hover:underline hover:text-[#9caf88]"
  >
    {link.name}
  </Link>
))} 
      </div>
    </nav>
  );
}