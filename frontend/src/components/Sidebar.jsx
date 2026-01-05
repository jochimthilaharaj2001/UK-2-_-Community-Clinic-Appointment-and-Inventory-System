import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ title, links, doctorName, doctorRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col min-h-screen p-4">
      {/* Top: Name & Role */}
      <div className="p-6 bg-blue-800 text-center rounded mb-6">
        <h2 className="text-xl font-semibold">{doctorName}</h2>
        <p className="text-sm opacity-80">{doctorRole}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`flex items-center w-full text-left py-2 px-3 mb-1 rounded transition ${
                isActive ? "bg-blue-600 border-l-4 border-blue-300" : "hover:bg-blue-600"
              }`}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        className="mt-6 bg-red-600 w-full py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}
