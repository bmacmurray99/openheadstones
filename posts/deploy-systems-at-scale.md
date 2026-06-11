---
title: What I Learned Building a Deploy System for 600 Engineers
date: 2026-04-10
description: The hard lessons from two years of making deployments boring at Stripe.
image: /posts/deploy-systems-at-scale.jpg
---

Two years ago, our deploy system was a source of daily anxiety. Engineers would hover over Slack waiting for deploys to finish, incidents would cascade from bad rollouts, and the on-call rotation dreaded Fridays. Today, deploying at Stripe is boring — and that's exactly what we were going for.

Here's what we learned.

## Start with the feedback loop, not the infrastructure

The first thing we shipped wasn't a new deploy pipeline. It was a dashboard that showed exactly what was happening during a deploy: which services were updating, which canaries were passing, what the rollback status was. We didn't change how deploys worked — we just made them legible.

That dashboard surfaced three problems we didn't know we had. Two were fixable in a week. One took six months.

**Lesson:** before optimizing a system, make sure you can see it.

## Canaries are load-bearing, but only if you trust the signals

We had canary deploys before I joined the team. They weren't catching much. The reason: the metrics we were gating on were either too noisy (alert fatigue had trained people to ignore them) or too coarse (5xx rates look fine until they're not).

We spent three months working with teams to define service-specific health signals — not generic SLOs, but signals that the owning team actually believed in. Canary catch rates went from roughly 20% to over 70% in the six months following.

**Lesson:** a canary gate is only as good as the signal behind it. If the owning team wouldn't page on it, don't automate against it.

## Self-service is harder than automation

The deploy system itself wasn't that hard to build. The hard part was making it something 600+ engineers could use without reading documentation.

We ran usability sessions. We watched people try to deploy for the first time. We killed every concept that required knowing something about the system's internals. The final mental model: "a deploy is a queue entry — you push, it runs, you can pause or roll back at any point."

Simple to say. Took 18 months to actually achieve.

**Lesson:** the interface is the product. Automation that requires understanding the automation is just complexity with extra steps.

## On-call rotation as a design constraint

We made a rule early: if something in the deploy system caused an on-call page, it was a design defect, not an operational failure. That reframe changed how we triaged incidents. Instead of "who was on call when this broke," the question became "what does this tell us about the system's design?"

It slowed down short-term firefighting. It made the system dramatically more reliable over 18 months.

**Lesson:** treat every page as a design failure. Fix the design.

---

The system we shipped isn't particularly novel. Canaries, progressive rollouts, automated rollbacks — none of this is new. What made it work was the sustained focus on the experience of the engineer doing the deploy, not the elegance of the infrastructure underneath.

Boring is the goal. We're getting there.
