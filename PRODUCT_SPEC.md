# PRODUCT_SPEC.md — Revio Release Intelligence Platform

## Overview
Revio is a GitHub-native release intelligence platform that transforms raw repository activity (commits, pull requests, merges) into clear, customer-facing product updates.

## Core Transformation
```text
Engineering Activity (commits, PRs, tags)
        ↓
Normalization & Noise Filtering
        ↓
Change Classification & Related Change Grouping
        ↓
PR / Commit Evidence Linking
        ↓
Grounded Release Generation & Human Review
        ↓
Published Customer Communication
```

## Functional Scope
1. **GitHub Repository Webhook Ingestion**
2. **AI Change Classification & Grouping**
3. **Release Room Studio Editor (Edit Draft vs Customer Preview)**
4. **Publication Gate & Subscriber Delivery**
5. **Public Customer Changelog (`/c/:slug`) & Embedded Widgets**
