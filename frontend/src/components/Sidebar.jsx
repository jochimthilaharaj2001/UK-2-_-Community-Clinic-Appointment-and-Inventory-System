import { useNavigate } from "react-router-dom";

export default function Sidebar({ title, links }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      {links.map(link => (
        <button
          key={link.to}
          onClick={() => navigate(link.to)}
          className="block w-full text-left py-2 hover:bg-gray-700 px-3 rounded"
        >
          {link.label}
        </button>
      ))}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="mt-6 bg-red-600 w-full py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}