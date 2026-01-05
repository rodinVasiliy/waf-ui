import { NavLink } from "react-router-dom"

export function Navbar() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/webapps" style={styles.link}>WebApps</NavLink>
      <NavLink to="/actions" style={styles.link}>Actions</NavLink>
      <NavLink to="/ssls" style={styles.link}>SSL</NavLink>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    gap: "20px",
    padding: "12px 20px",
    background: "#1e1e1e",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
  },
}