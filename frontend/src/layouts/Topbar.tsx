import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLatestBuild } from "../api/dashboardApi";
import { 
  GitBranch, 
  Database, 
  LayoutDashboard, 
  Boxes, 
  History, 
  Shield, 
  HeartPulse, 
  Brain,
  Sun,
  Moon
} from "lucide-react";

export default function Topbar() {
  const [latestBuild, setLatestBuild] = useState<any>(null);
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "light");
  const location = useLocation();

  useEffect(() => {
    getLatestBuild()
      .then((res) => {
        setLatestBuild(res.data);
      })
      .catch(console.error);

    // Apply active theme on load
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/modules", label: "Modules", icon: Boxes },
    { path: "/builds", label: "Builds", icon: History },
    { path: "/quality-gate", label: "Quality Gate", icon: Shield },
    { path: "/code-health", label: "Code Health", icon: HeartPulse },
    { path: "/ai-insights", label: "AI Insights", icon: Brain },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px", // Wide Topbar padding
        background: theme === "dark" ? "#020617" : "#0F1D32",
        height: "76px", // Slightly wider topbar height
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: theme === "dark" ? "1px solid #1F2937" : "1px solid #1E2E46",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        fontFamily: "'Outfit', sans-serif",
        transition: "all 0.3s ease"
      }}
    >
      {/* Left side: Brand Logo & Repo Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link 
          to="/" 
          style={{ 
            color: "#FFFFFF", 
            fontSize: "20px", 
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            letterSpacing: "-0.01em",
            textDecoration: "none"
          }}
        >
          {/* Orange themed logo icon */}
          <Database size={20} style={{ color: "var(--bmc-orange)" }} />
          <span
  style={{
    background: "linear-gradient(90deg, #ffffff, #d1d5db)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    whiteSpace: "nowrap",
    fontSize: "clamp(14px, 1.5vw, 20px)",
    fontWeight: 600,
    letterSpacing: "-0.3px",

    display: "flex",
    alignItems: "center",
  }}
>
  Unified Coverage Intelligence
</span>
        </Link>
      </div>

      {/* Middle side: Centered Google Cloud-style Navigation Tabs with Icons */}
      <div 
        style={{ 
          display: "flex", 
          gap: "28px", 
          height: "100%", 
          alignItems: "center",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: isActive ? "#FFFFFF" : "#94A3B8",
                fontWeight: isActive ? 600 : 500,
                fontSize: "14px", // More visible
                textDecoration: "none",
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 4px",
                borderBottom: isActive ? "3px solid var(--bmc-orange)" : "3px solid transparent", // Orange BMC theme active
                transition: "all 0.2s ease",
                marginTop: "3px" // visual balance
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--bmc-orange)"; // BMC Orange on hover
                const icon = e.currentTarget.querySelector("svg");
                if (icon) icon.style.color = "var(--bmc-orange)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#94A3B8";
                  const icon = e.currentTarget.querySelector("svg");
                  if (icon) icon.style.color = "#94A3B8";
                } else {
                  e.currentTarget.style.color = "#FFFFFF";
                  const icon = e.currentTarget.querySelector("svg");
                  if (icon) icon.style.color = "var(--bmc-orange)";
                }
              }}
            >
              {/* Feature Icon - Larger size for visibility */}
              <Icon size={18} style={{ color: isActive ? "var(--bmc-orange)" : "#94A3B8", transition: "color 0.2s" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right side: Dark Mode & Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Dark/Light mode stateful toggle icon button */}
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            color: "#FFFFFF",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.2)";
            e.currentTarget.style.color = "var(--bmc-orange)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

       
      </div>
    </div>
  );
}

