function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <h1 className="logo">CodeSensei</h1>
        <span className="nav-badge">BETA</span>
      </div>

      <div className="nav-links">
        <span className="nav-link">Docs</span>
        <span className="nav-link">Pricing</span>
        <button className="nav-btn">Try Review</button>
      </div>
    </nav>
  );
}

export default Navbar;
