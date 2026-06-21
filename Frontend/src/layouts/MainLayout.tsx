import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GitBranch, ExternalLink } from "lucide-react";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { getLatestBuild } from "../api/dashboardApi";

interface Props {
  children: ReactNode;
}

function MainLayout({ children }: Props) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [latestBuild, setLatestBuild] = useState<any>(null);

  // Trigger page transition loading animation on route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450); // fast transition
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Fetch latest build for repo info bar
  useEffect(() => {
    getLatestBuild()
      .then((res) => setLatestBuild(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="app-container">
      {/* Top transition blue loading indicator bar */}
      {loading && <div className="page-loader-bar" />}
      
      <Topbar />

      {/* Repository Info Bar — full name + URL, always visible */}
      {latestBuild && (
        <div className="repo-info-bar">
          <span className="repo-name">
            {latestBuild.repositoryName}
          </span>
          <span className="repo-separator">•</span>
          <a
            href="https://github.com/Shraddha-Deshmukh2119/project-repos.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            Repository
            <ExternalLink size={10} style={{ marginLeft: "4px", verticalAlign: "middle" }} />
          </a>
          <span className="repo-separator">•</span>
          <span className="repo-branch">
            <GitBranch size={12} />
            {latestBuild.branch}
          </span>
        </div>
      )}
      
      <div className="main-wrapper">
        <main className="content-pane">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
