import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Mail, Check, ArrowRight, Rss } from "lucide-react";
import { RevioWordmark } from "../components/brand/logo.jsx";
import { CategoryTag, Code } from "../components/revio/primitives.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function PublicChangelogPage() {
  const { publishedList } = useReleases();
  const { workspace } = useWorkspace();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3500);
      setEmail("");
    }
  };

  const filteredReleases = publishedList.filter((rel) => {
    const matchesSearch =
      rel.title.toLowerCase().includes(search.toLowerCase()) ||
      rel.summary.toLowerCase().includes(search.toLowerCase()) ||
      rel.version.toLowerCase().includes(search.toLowerCase());

    if (activeCategory === "all") return matchesSearch;

    const hasCategory = rel.changes.some((c) => c.category === activeCategory);
    return matchesSearch && hasCategory;
  });

  return (
    <div className="min-h-screen bg-paper text-paper-foreground selection:bg-paper-border">
      {/* PUBLIC HEADER */}
      <header className="border-b border-paper-border bg-paper">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold tracking-tight">{workspace.name}</span>
            <span className="text-code text-paper-muted">Release Updates</span>
          </div>
          <Link
            to="/dashboard"
            className="text-xs text-paper-muted transition-colors hover:text-paper-foreground"
          >
            Manage Workspace →
          </Link>
        </div>
      </header>

      {/* HERO / PUBLICATION TITLE */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="text-editorial text-4xl sm:text-5xl font-medium">
            Product Changelog
          </h1>
          <p className="mt-3 text-base text-paper-muted leading-relaxed">
            Continuous product updates and release notes for {workspace.name}.
          </p>
        </div>

        {/* SUBSCRIBER FORM */}
        <form
          onSubmit={handleSubscribe}
          className="mt-8 flex flex-wrap items-center gap-3 border-y border-paper-border py-6"
        >
          <div className="flex flex-1 items-center border border-paper-border bg-paper px-3 py-2 text-sm">
            <Mail className="h-4 w-4 text-paper-muted mr-2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Subscribe to email updates..."
              className="w-full bg-transparent text-paper-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-paper-foreground px-5 py-2.5 text-xs font-medium text-paper transition-opacity hover:opacity-90 cursor-pointer"
          >
            {subscribed ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        {/* CONTROLS: SEARCH & CATEGORY FILTER */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["all", "new", "improved", "fixed"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 border capitalize cursor-pointer transition-colors ${
                  activeCategory === cat
                    ? "border-paper-foreground bg-paper-foreground text-paper"
                    : "border-paper-border text-paper-muted hover:text-paper-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-paper-border bg-paper px-3 py-1.5 text-xs">
            <Search className="h-3.5 w-3.5 text-paper-muted mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search releases..."
              className="bg-transparent text-paper-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* RELEASE FEED */}
        <div className="mt-12 space-y-12">
          {filteredReleases.map((rel) => (
            <article
              key={rel.id}
              className="border-b border-paper-border pb-12 last:border-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Code className="bg-paper-border/20 text-paper-foreground font-semibold">
                  {rel.version}
                </Code>
                <span className="text-code text-paper-muted">{rel.date}</span>
              </div>

              <h2 className="text-editorial mt-4 text-3xl sm:text-4xl">
                {rel.title}
              </h2>

              <p className="mt-3 text-base text-paper-muted leading-relaxed max-w-3xl">
                {rel.summary}
              </p>

              <div className="mt-8 space-y-6">
                {rel.changes
                  .filter(
                    (c) =>
                      activeCategory === "all" || c.category === activeCategory
                  )
                  .map((change) => (
                    <div key={change.id} className="space-y-1.5">
                      <CategoryTag category={change.category} />
                      <h3 className="text-lg font-medium">{change.title}</h3>
                      <p className="text-sm text-paper-muted leading-relaxed">
                        {change.body}
                      </p>
                    </div>
                  ))}
              </div>
            </article>
          ))}

          {filteredReleases.length === 0 && (
            <div className="py-12 text-center text-paper-muted">
              No published releases match your filter criteria.
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-paper-border py-8 text-center text-xs text-paper-muted">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between px-4">
          <span>Powered by Revio Release Intelligence</span>
          <Link to="/" className="hover:text-paper-foreground">
            revio.app
          </Link>
        </div>
      </footer>
    </div>
  );
}
