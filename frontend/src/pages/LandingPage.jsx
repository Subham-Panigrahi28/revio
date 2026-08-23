import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GitPullRequest, Check } from "lucide-react";
import { RevioWordmark, RevioMark } from "../components/brand/logo.jsx";
import {
  Meta,
  Code,
  CategoryTag,
  SectionLabel,
  StatusDot,
} from "../components/revio/primitives.jsx";
import { publishedReleases } from "../services/mockData.js";

function TransformDemo() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => (s + 1) % 3), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid gap-px border border-border bg-border lg:grid-cols-[1fr_auto_1fr]">
      {/* raw */}
      <div className="bg-surface-sunken p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <Meta>Repository activity</Meta>
          <Code>main</Code>
        </div>
        <ul className="mt-6 space-y-4">
          {[
            { pr: 1842, t: "feat: add granular workspace permissions", c: 8 },
            { pr: 1851, t: "feat: permission matrix in settings", c: 3 },
          ].map((r, i) => (
            <li
              key={r.pr}
              className="border-l-2 pl-4 transition-colors duration-500"
              style={{
                borderColor: stage >= 1 ? "var(--signal)" : "var(--border-strong)",
                opacity: stage >= 1 ? 1 : 0.75,
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="flex items-center gap-2">
                <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-code text-foreground">PR #{r.pr}</span>
              </div>
              <p className="text-code mt-1.5 text-muted-foreground">{r.t}</p>
              <p className="text-meta mt-2">
                {r.c} commits · 3 contributors · merged
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* connector */}
      <div className="relative flex items-center justify-center bg-surface px-6 py-4 lg:px-8">
        <div className="flex flex-col items-center gap-3">
          <RevioMark className="h-6 w-6 text-foreground" />
          <span className="text-meta text-center leading-relaxed">
            {stage === 0 ? "detect" : stage === 1 ? "group" : "review"}
          </span>
          <div className="hidden h-16 w-px bg-gradient-to-b from-transparent via-signal to-transparent lg:block" />
        </div>
      </div>

      {/* published */}
      <div className="bg-surface p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <Meta>Customer-facing update</Meta>
          <CategoryTag category="new" />
        </div>
        <div
          className="mt-6 transition-all duration-700"
          style={{
            opacity: stage === 2 ? 1 : 0.35,
            transform: stage === 2 ? "none" : "translateY(6px)",
          }}
        >
          <h3 className="text-editorial text-2xl sm:text-[1.75rem]">
            Team workspace access controls
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Administrators can now assign granular roles and permissions across shared
            workspaces. Roles apply per workspace, so a person can review releases in one
            product and only read in another.
          </p>
          <div className="mt-5 flex items-center gap-2 text-[0.75rem] text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-signal" />
            Reviewed by a human before it ships
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center px-4 sm:px-6">
          <RevioWordmark subtitle="release communication" />
          <nav className="ml-auto flex items-center gap-5">
            <Link
              to="/changelog"
              className="hidden text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Changelog
            </Link>
            <Link
              to="/releases"
              className="hidden text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Product tour
            </Link>
            <Link
              to="/connect"
              className="bg-signal px-3.5 py-1.5 text-[0.8125rem] font-medium text-signal-foreground transition-opacity hover:opacity-90"
            >
              Connect GitHub
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
          <div className="flex items-center gap-2">
            <StatusDot pulse />
            <Meta>Release intelligence workspace</Meta>
          </div>
          <h1 className="mt-6 max-w-4xl text-[2.5rem] leading-[1.02] font-medium tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">
            Your repository already knows what shipped.
            <span className="text-editorial block text-muted-foreground">
              Revio turns it into something a customer can read.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Revio reads merged pull requests, commits and tags, groups them into the changes
            that actually matter, and hands your team a release draft to review, edit and
            publish. One workspace between engineering activity and customer communication.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/connect"
              className="inline-flex items-center gap-2 bg-signal px-5 py-2.5 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90"
            >
              Connect a repository <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/releases"
              className="inline-flex items-center gap-2 border border-border-strong px-5 py-2.5 text-sm transition-colors hover:bg-surface"
            >
              See the release workspace
            </Link>
          </div>

          <div className="mt-14 sm:mt-20">
            <TransformDemo />
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <SectionLabel index="01">The flow</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
            Six steps, and a human decides on every one that matters.
          </h2>
          <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Connect",
                "Point Revio at a repository and a release branch. Read-only access to metadata — nothing is written back.",
              ],
              [
                "Detect",
                "Merged pull requests, tags and release commits are collected continuously, with lockfile noise filtered out.",
              ],
              [
                "Prepare",
                "Related work is grouped into single customer-facing changes and drafted with plain-language titles.",
              ],
              [
                "Review",
                "Your team edits, recategorises, reorders and removes. Technical evidence stays one click away.",
              ],
              [
                "Publish",
                "A deliberate final review shows exactly what customers see and what stays internal.",
              ],
              [
                "Distribute",
                "Public changelog, subscriber email, in-app widget and a What's New feed — from the same release.",
              ],
            ].map(([t, d], i) => (
              <div key={t} className="bg-background p-6 sm:p-8">
                <span className="text-meta text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[1.0625rem] font-medium tracking-[-0.02em]">{t}</h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-muted-foreground">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSPACE PREVIEW */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
            <div>
              <SectionLabel index="02">The workspace</SectionLabel>
              <h2 className="mt-5 text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
                A release editor, not a dashboard.
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
                The customer-facing text is the document. Pull request numbers, commit
                hashes, branches and contributors sit underneath each change, visible when
                you need to verify something and invisible when you are writing.
              </p>
              <Link
                to="/releases/v2-14-0"
                className="mt-7 inline-flex items-center gap-2 text-sm text-signal transition-opacity hover:opacity-80"
              >
                Open the editor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-3">
                  <Code>v2.14.0</Code>
                  <Meta>draft · 12 changes</Meta>
                </div>
                <Meta className="text-signal">review</Meta>
              </div>
              <div className="p-5 sm:p-7">
                <h3 className="text-editorial text-2xl sm:text-3xl">
                  Workspace permissions and a faster release history
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This release focuses on control and speed.
                </p>
                <div className="mt-7 space-y-px bg-border">
                  {[
                    ["new", "Team workspace access controls", "PR #1842 · 8 commits"],
                    ["improved", "Release history loads up to 6× faster", "PR #1858 · 11 commits"],
                    ["fixed", "Webhook retries no longer stall", "PR #1849 · 2 commits"],
                  ].map(([c, t, e]) => (
                    <div key={t} className="bg-surface py-4">
                      <CategoryTag category={c} />
                      <p className="mt-2 text-[0.9375rem]">{t}</p>
                      <p className="text-code mt-1.5 text-muted-foreground/70">{e}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISTRIBUTION */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <SectionLabel index="03">Distribution</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
            Publishing is the middle of the story, not the end.
          </h2>

          <div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-[1fr_1fr]">
            <div className="bg-background p-6 sm:p-8">
              <Meta>Public changelog</Meta>
              <div className="mt-5 bg-paper p-6 text-paper-foreground">
                {publishedReleases.slice(0, 2).map((r) => (
                  <div key={r.id} className="border-b border-paper-border pb-5 last:border-0 last:pb-0 [&+div]:pt-5">
                    <p className="text-code text-paper-muted">
                      {r.version} — {r.date}
                    </p>
                    <h4 className="text-editorial mt-2 text-xl">{r.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-px bg-border">
              <div className="bg-background p-6 sm:p-8">
                <Meta>Embedded widget</Meta>
                <div className="mt-5 border border-border bg-surface-raised p-4">
                  <p className="text-[0.8125rem] font-medium">What's new</p>
                  <ul className="mt-3 space-y-3">
                    <li>
                      <p className="text-[0.8125rem]">Team workspace permissions</p>
                      <CategoryTag category="new" className="mt-1" />
                    </li>
                    <li>
                      <p className="text-[0.8125rem]">Improved release history performance</p>
                      <CategoryTag category="improved" className="mt-1" />
                    </li>
                  </ul>
                  <p className="mt-4 text-[0.75rem] text-signal">View all updates →</p>
                </div>
              </div>
              <div className="bg-background p-6 sm:p-8">
                <Meta>Subscriber notifications</Meta>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-muted-foreground">
                  Readers choose categories and cadence. Delivery state, retries and bounces
                  are visible in Distribution instead of disappearing into a provider
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="text-editorial text-4xl sm:text-5xl">
              Your next release is already sitting in the repository.
            </h2>
            <p className="mt-5 text-[0.9375rem] text-muted-foreground">
              Connect once. Revio drafts the first release from activity since your last tag.
            </p>
            <Link
              to="/connect"
              className="mt-8 inline-flex items-center gap-2 bg-signal px-5 py-2.5 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90"
            >
              Connect GitHub <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-4 px-4 py-8 sm:px-6">
          <RevioWordmark />
          <Meta className="ml-auto">© 2026 Revio</Meta>
        </div>
      </footer>
    </div>
  );
}
