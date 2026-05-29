function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-700">
      <h1 className="text-2xl font-bold text-indigo-400">
        CodeSensei
      </h1>

      <button className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
        Try Review
      </button>
    </nav>
  )
}

export default Navbar