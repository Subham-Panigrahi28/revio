import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, GitPullRequest, Search, Server } from "lucide-react";
import { RevioWordmark, RevioMark } from "../components/brand/logo.jsx";
import { Meta, Code, StatusDot, SectionLabel } from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Northwind Platform");
  const [slug, setSlug] = useState("northwind");
  const [url, setUrl] = useState("https://northwind.dev");
  const [selectedRepo, setSelectedRepo] = useState("northwind/platform");
  const [analysisStage, setAnalysisStage] = useState(0);

  const { workspace, updateWorkspace, selectRepository } = useWorkspace();
  const navigate = useNavigate();

  // Handle analysis progression in Step 3
  useEffect(() => {
    if (step === 3) {
      const t1 = setTimeout(() => setAnalysisStage(1), 1000);
      const t2 = setTimeout(() => setAnalysisStage(2), 2200);
      const t3 = setTimeout(() => setAnalysisStage(3), 3400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [step]);

  const handleStep1 = (e) => {
    e.preventDefault();
    updateWorkspace({ name, slug, url });
    setStep(2);
  };

  const handleStep2 = (repoName) => {
    setSelectedRepo(repoName);
    selectRepository(repoName);
  };

  const handleProceedToAnalysis = () => {
    setStep(3);
  };

  const handleCompleteOnboarding = () => {
    updateWorkspace({ onboardingCompleted: true });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-signal selection:text-signal-foreground">
      <header className="border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <RevioWordmark subtitle="workspace setup" />
          <div className="flex items-center gap-3">
            <Meta className="text-signal">Step 0{step} of 03</Meta>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-1.5 w-6 transition-colors ${
                    s <= step ? "bg-signal" : "bg-border-strong"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl border border-border bg-surface p-6 sm:p-10">
          {/* STEP 1: WORKSPACE IDENTITY */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <SectionLabel index="01">Workspace setup</SectionLabel>
              <h1 className="text-editorial mt-4 text-3xl sm:text-4xl text-foreground">
                What product are you shipping?
              </h1>
              <p className="mt-2.5 text-sm text-muted-foreground">
                Revio creates a single release workspace between your GitHub repository activity
                and your public customer changelog.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Product / Workspace Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }}
                    className="w-full border border-input bg-surface-sunken px-3.5 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none"
                    placeholder="e.g. Northwind Platform"
                  />
                </div>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Public Changelog URL
                  </label>
                  <div className="flex items-center border border-input bg-surface-sunken px-3.5 py-2.5 text-sm">
                    <span className="text-muted-foreground/60 select-none">revio.app/c/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-transparent text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Product URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full border border-input bg-surface-sunken px-3.5 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none"
                    placeholder="https://northwind.dev"
                  />
                </div>
              </div>

              <div className="mt-9 flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-signal px-6 py-2.5 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Continue to Repository <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: REPOSITORY SELECTION */}
          {step === 2 && (
            <div>
              <SectionLabel index="02">Repository selection</SectionLabel>
              <h1 className="text-editorial mt-4 text-3xl sm:text-4xl text-foreground">
                Select your primary release repository
              </h1>
              <p className="mt-2.5 text-sm text-muted-foreground">
                Revio will inspect merged pull requests and tag history to prepare your first draft release.
              </p>

              <div className="mt-7 space-y-2.5">
                {workspace.repositories.map((repo) => {
                  const isSelected = selectedRepo === repo.name;
                  return (
                    <div
                      key={repo.name}
                      onClick={() => handleStep2(repo.name)}
                      className={`flex cursor-pointer items-center justify-between border p-4 transition-all ${
                        isSelected
                          ? "border-signal bg-surface-raised"
                          : "border-border bg-surface-sunken hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected ? "border-signal bg-signal" : "border-border-strong"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-signal-foreground" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{repo.name}</span>
                            <Code>{repo.branch}</Code>
                          </div>
                          <p className="text-meta mt-1 text-muted-foreground">{repo.activity}</p>
                        </div>
                      </div>
                      <Meta>{repo.visibility}</Meta>
                    </div>
                  );
                })}
              </div>

              <div className="mt-9 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ← Back to Workspace
                </button>
                <button
                  onClick={handleProceedToAnalysis}
                  className="inline-flex items-center gap-2 bg-signal px-6 py-2.5 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Analyze Activity <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REPOSITORY ANALYSIS */}
          {step === 3 && (
            <div>
              <SectionLabel index="03">Activity Analysis</SectionLabel>
              <h1 className="text-editorial mt-4 text-3xl sm:text-4xl text-foreground">
                Analyzing repository activity
              </h1>
              <p className="mt-2.5 text-sm text-muted-foreground">
                Inspecting <Code>{selectedRepo}</Code> since last release tag.
              </p>

              <div className="mt-8 space-y-4 border border-border bg-surface-sunken p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusDot tone={analysisStage >= 1 ? "live" : "signal"} pulse={analysisStage < 1} />
                    <span className="text-sm">Scanning merged pull requests</span>
                  </div>
                  <Meta>{analysisStage >= 1 ? "87 PRs scanned" : "Processing..."}</Meta>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusDot tone={analysisStage >= 2 ? "live" : "signal"} pulse={analysisStage === 1} />
                    <span className="text-sm">Grouping related change topics</span>
                  </div>
                  <Meta>{analysisStage >= 2 ? "12 changes grouped" : "Pending..."}</Meta>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusDot tone={analysisStage >= 3 ? "live" : "signal"} pulse={analysisStage === 2} />
                    <span className="text-sm">Drafting customer-facing release notes</span>
                  </div>
                  <Meta>{analysisStage >= 3 ? "v2.14.0 Ready" : "Pending..."}</Meta>
                </div>
              </div>

              <div className="mt-9 flex items-center justify-end">
                <button
                  onClick={handleCompleteOnboarding}
                  disabled={analysisStage < 3}
                  className="inline-flex items-center gap-2 bg-signal px-6 py-2.5 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  Open Workspace <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
