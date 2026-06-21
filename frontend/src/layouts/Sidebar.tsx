import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Boxes, History, Shield, Brain, HeartPulse } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/modules",
      label: "Modules",
      icon: Boxes,
    },
    {
      path: "/builds",
      label: "Builds",
      icon: History,
    },
    {
      path: "/quality-gate",
      label: "Quality Gate",
      icon: Shield,
    },
    {
      path: "/code-health",
      label: "Code Health",
      icon: HeartPulse,
    },
    {
      path: "/ai-insights",
      label: "Coverage Intelligence",
      icon: Brain,
    },
  ];

  return (
    <div
      style={{
        width: "250px",
        height: "calc(100vh - 64px)",
        background: "#FFFFFF",
        borderRight: "1px solid #DADCE0",
        padding: "16px 0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: "64px",
        left: 0,
        bottom: 0,
        zIndex: 900,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Exact match for dashboard, prefix match for others to keep highlight
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 24px",
                color: isActive ? "#1A73E8" : "#5F6368",
                background: isActive ? "#E8F0FE" : "transparent",
                fontWeight: isActive ? 600 : 500,
                fontSize: "14px",
                textDecoration: "none",
                position: "relative",
                transition: "all 0.15s ease",
                borderLeft: isActive ? "4px solid #1A73E8" : "4px solid transparent",
                paddingLeft: isActive ? "20px" : "24px" /* Offset border width */
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#F1F3F4";
                  e.currentTarget.style.color = "#202124";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#5F6368";
                }
              }}
            >
              <Icon size={18} style={{ color: isActive ? "#1A73E8" : "#757575", transition: "color 0.15s" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}