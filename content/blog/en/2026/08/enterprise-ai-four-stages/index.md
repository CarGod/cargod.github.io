---
locale: en
title: "How Should Legacy Enterprise Systems Adopt AI? Start with These Four Stages"
seoTitle: "Four Stages for Adding AI to Legacy Systems | Luffy Liu"
description: "A four-stage framework for bringing AI into legacy enterprise systems: Chatbot, AI + Tools, Copilot, and Agent—and the data, tools, workflows, and governance each stage requires."
slug: enterprise-ai-four-stages
contentKey: blog.enterprise-ai-four-stages
published: 2026-08-20
updated: 2026-08-31
tags:
  - id: ai
    label: AI
  - id: agent
    label: Agent
  - id: copilot
    label: Copilot
  - id: enterprise-digitalization
    label: enterprise transformation
  - id: ai-customer-service
    label: customer service
translation_of: "/blog/enterprise-ai-four-stages/"
cover: "assets/cover-liu-lufei-en-v1.png"
cover_alt: "How legacy enterprise systems can adopt AI in four stages"
media_base: "shared:enterprise-ai-four-stages"
draft: false
---

The model is only a small part of the picture. Whether the data is usable, the interfaces are clear, workflows connect properly, and someone knows what to do when AI gets it wrong—these questions arrive together.

After finishing the gptpmt tutorials, I stayed busy with all kinds of work and did not sit down to write a systematic article for a long time.

I first encountered ChatGPT in 2022, began writing gptpmt in 2023, and later took part in enterprise AI projects. More than three years have passed. I have tried many things and seen many of the problems companies face when putting AI into practice.

Recently, more and more friends have asked me the same question: companies already have many business systems, so how should they connect those systems to AI?

It sounds like a technical question: Which model should we choose? Which framework? How should we call the APIs?

But once the work starts, the model turns out to be only a small piece. Can internal data be used? Are the existing interfaces understandable? How do multiple business processes connect? Who handles the outcome when AI makes a mistake? These issues appear at the same time.

Start with a familiar customer-service scenario. A customer opens the support window and asks:

> “Why hasn’t my order shipped?”

The AI gives a long list of possible reasons for a logistics delay and finally asks for an order number. The customer provides it, but the AI still cannot look anything up, so it transfers the conversation to a person.

The company has spent substantial time building AI customer support. The workload has not fallen. Support staff now have one more job: explaining the AI.

Why?

The model may not be the problem. A system that can only answer questions has been assigned a task that requires lookup, judgment, execution, and risk ownership.

It is like discussing the top-floor decoration before laying the foundation. The problem is not merely slow construction; halfway through, you discover that the structure below cannot support it.

Bringing AI into legacy enterprise systems also requires capabilities to be added layer by layer. I divide the path into four broad stages: **Chatbot** (a conversational interface that answers questions), **AI + Tools** (AI connected to specific callable business capabilities), **Copilot** (an assistant that chains steps toward a goal while handing uncertainty back to people), and **Agent** (a system that can act autonomously within an agreed boundary).

This is not an industry standard. It is a framework for checking capabilities. A company does not need to formally launch every intermediate version, but it cannot skip the underlying layers of data, tools, tasks, and governance.

![Four stages for integrating AI into enterprise systems and the capabilities required at each stage](/assets/blog/enterprise-ai-four-stages/diagram-01-four-stages-en-v1.png)

*Four stages, four layers of capability.*

## Stage One: Chatbot—Answer the Question Correctly First

Make the question simpler.

Instead of asking about a specific order, the customer asks, “How soon do you usually ship after payment?”

The AI does not need to enter a business system. If the company has organized its shipping rules, refund policy, product information, and frequently asked questions, it can answer.

At this point, the Chatbot answers general questions from enterprise knowledge.

Business hours, product descriptions, expense policies, and after-sales rules usually already exist in company documents. Employees once had to search for them manually. Now they can ask in natural language, and AI can find the relevant material and organize an answer.

That makes it sound as if loading the documents is enough.

But as soon as the question concerns a particular order, the Chatbot does not know. It does not know who the user is, which orders belong to them, or the current status. If it keeps answering, it can only guess from general policy.

Stage one therefore has a clear boundary: it can answer questions already covered by enterprise knowledge, but it cannot pretend to know live business facts.

### From Stage Zero to Stage One, the Key Is Data Governance—not the Model

Many companies begin by feeding millions of words from Lark documents, product manuals, and support records into AI, assuming that more documents will produce better answers.

More documents do not necessarily mean usable knowledge.

Imagine a kitchen with dozens of identical spice jars, none labeled or kept in a fixed place. The cook knows that salt, sugar, vinegar, and pepper must be there somewhere, but still has to open and smell each jar.

Enterprise documents often look like that.

The same refund policy may exist in three versions. A product may have been discontinued while the old support script remains. A term may mean a bag, a bundle, or something else, with no classification. The same word can mean different things across departments, while one business concept may be renamed several times over the years.

People struggle to find the right answer; AI will retrieve the wrong thing too.

The bigger problem is that AI writes fluently. When it blends an old policy with a new one, an ordinary user may not notice. The more an incorrect answer resembles a correct one, the greater the risk.

The first capability to build is therefore data governance. At minimum, a company must clarify:

- which content is accurate and which is obsolete;
- how documents are classified and where each type of question should be retrieved;
- what the same concept is called in different systems, and whether a shared glossary is needed;
- what each identity is allowed to see and how sensitive data is isolated;
- who maintains the material and when old versions are retired;
- what counts as a correct answer and how errors will be found continuously.

AI can help classify, deduplicate, and organize content, but the company still has to define the taxonomy, ownership, and acceptance criteria.

Data governance is not a one-time cleanup. Business rules change, products are retired, organizations are reorganized, and content that is correct today may be wrong six months from now. A knowledge base needs an ongoing maintenance path or it will quickly return to its previous state.

At this point, customer support has done more than “connect a large model.” It can answer from valid enterprise knowledge. When it cannot find evidence, it should say that it does not know instead of inventing a plausible answer.

How do you know stage one is complete? Do not judge it by a demo with prepared questions. Test whether the system can still find the right evidence when real users rephrase a question, ask follow-ups, and reach permission boundaries. Only when this is stable does it make sense to move deeper into business systems.

## Stage Two: AI + Tools—Let AI Look Up This Order

In stage two, the question begins to involve a specific order.

To answer the opening question, AI must call an order-query tool and obtain the customer’s order and logistics status. Only after learning that the order is still in the warehouse can it explain the actual reason.

If the customer then requests a refund, the system must call a refund tool.

AI is no longer limited to reading enterprise knowledge. It can use a business system to perform a concrete action. This is AI + Tools.

Tools are capability endpoints that a company provides to AI. Looking up an order is one tool. Getting the shipping status is another. Calculating a refund is a third. Actually submitting the refund is yet another.

AI interprets what the user says, selects an appropriate tool, and turns the returned data into something the user can understand.

That still sounds straightforward. Then the problems surface.

A legacy system may contain more than a dozen refund APIs. Some are old versions, some refund coupons only, some require internal fields, and some return no clear reason when they fail.

Giving all of them to AI and asking it to guess will not make the old system intelligent. It will expose complexity that used to be hidden.

Previously, developers familiar with the system called these interfaces. They knew which one worked, which one was a historical remnant, and which “optional” parameter actually caused an error when omitted. AI has none of that tacit knowledge. It can judge only from the description it receives.

If tool names are vague, parameter definitions incomplete, and return formats inconsistent, even a strong model can choose incorrectly.

### From Stage One to Stage Two, the Key Is Tool Governance

Tool governance is not merely wrapping old APIs. It means answering basic questions again:

- What problem does this tool solve, and when must it not be used?
- Which parameters are required, and where do they come from?
- What structures represent success, failure, and partial success?
- Which roles may call it, and what data may they read or change?
- How often may read operations run, and do write operations require confirmation?
- If the same request arrives twice, how do we prevent duplicate refunds or orders?
- Can every call be traced to its initiator, input, and result?

One easily overlooked property is idempotency.

Suppose the refund tool times out. AI does not know whether the refund succeeded, so it calls the tool again. Without duplicate protection, the same order may be refunded twice.

That is not a question of model intelligence. The tool itself must be ready for automated calls.

The people who maintain the system should first be able to explain exactly how a tool works, then hand it to AI. Fewer tools with clearer responsibilities are easier to use correctly. A dozen historical interfaces should ideally converge into a small set of stable business capabilities instead of pushing every layer of complexity onto the model.

At this point, distinguish between executing an instruction and completing a task.

Looking up an order, reading a logistics status, and initiating a refund are each explicit instructions. The user gives one instruction, AI calls one tool, and then stops. That is AI + Tools.

If the user provides only a final goal and the system must decide what to do first, what to do next, and how to handle intermediate problems, the work has entered the next stage.

## Stage Three: Copilot—Keep the Task Moving

Add one condition: look up this order and refund it directly if it has not shipped.

One tool call is no longer enough. The system has to verify the user and order, check logistics, determine eligibility, calculate the amount, initiate the refund, and report the outcome.

AI + Tools is like a person giving one instruction and AI taking one step. With Copilot, the person supplies a goal and AI links several steps around it. When uncertainty or high risk appears, it stops and hands the work back to a person.

During this process, AI repeats a loop: understand the current goal, choose the next step, call a tool, read the result, and decide what to do next from the new information.

If the order has shipped, it must not follow the unshipped-order refund path. If the refund tool returns an unusual amount, it should pause. If the user’s identity has not been verified, it must not change the order. Every result changes the appropriate next step.

That is a closed task loop.

The difference between stages two and three is not whether AI can call multiple tools at once, nor simply whether the access changes from read-only to write. The real distinction is whether the system can keep working toward a goal until the task succeeds, fails, or requires a person.

Once tools can be connected, new problems appear.

### Problem One: Intent Governance

The hardest issue is often not calling a particular tool. It is entering the wrong process at the beginning.

Suppose a customer sees no shipping update for three days and asks both to file a complaint and to get a refund.

That request contains a logistics exception, a complaint, and a refund. If the system recognizes only the complaint, it may keep reassuring the customer without addressing the refund. If it refunds immediately, it may skip the order status and refund rules.

It must first identify the business domain, then split the ambiguous statement into executable intents and determine their order.

Why not make one enormous intent classifier and ask AI to choose directly from hundreds of options?

Real enterprise operations are much more complex than a demo. “Please change it” could mean changing an address in an order system, rebooking in a travel system, or updating employee data in HR. As the business expands, putting every intent at one level makes classification increasingly chaotic.

A better approach is hierarchical routing.

The first level identifies orders, logistics, after-sales support, or accounts. Within orders, the next level identifies lookup, modification, cancellation, or refund. If one sentence contains several intents, the system must split them and order them by dependency.

A ride-hailing example makes this clearer. When a user says, “Take me to the airport tomorrow morning,” the system needs the departure point, flight time, and desired arrival buffer. If the user adds, “And book another car for the person traveling with me,” there is a second passenger, a second pickup point, and perhaps a different vehicle class. If everything is forced into a simple “book a ride” intent, the subsequent workflows are easily mixed together.

Intent governance is not about putting a label on one sentence. It gradually narrows what the user actually wants to accomplish into a task the system can execute.

![A user request narrows through business domain and specific intent into the correct order workflow](/assets/blog/enterprise-ai-four-stages/diagram-02-intent-tree-en-v1.png)

*From one sentence to an executable task.*

### Problem Two: State Management

Now add another change.

The system has looked up the order and is about to submit the refund when the customer changes their mind: do not refund it yet; change the shipping address instead.

The reasonable response is neither to continue the refund blindly nor to discard everything already completed. The system should interrupt the current process, keep the order and logistics information it has already retrieved, and determine whether the address can still be changed.

That requires state management. The system must know both what has been discussed and where the task currently stands—which tools have run and which operations remain reversible. If the refund has already been submitted, it must enter a cancellation or compensation flow rather than pretending nothing happened.

There are at least two kinds of context. Conversational context tells the system which order “this order” refers to and what has already been confirmed. Task context records the current step in the refund process, which tool succeeded, and which action awaits confirmation.

Saving only the chat history is not enough. The chat may say “preparing refund,” but the system still needs to know whether the refund command was actually submitted. Saving only tool state is not enough either: a single “never mind” from the user can change the task goal.

A Copilot therefore needs to handle several kinds of change:

- completed results remain usable after a task is interrupted;
- the workflow resumes at the correct point after the user adds information;
- dependent intents run in the right order;
- an operation that has already caused side effects can be rolled back or compensated if it fails;
- when capability is exceeded, information is missing, or risk is too high, the task transfers to a person with complete context.

Intent governance determines whether the system chose the right road. State management determines whether it gets lost when the task changes.

Only then does AI begin to participate in the business process rather than sitting as a chat box around a few tools.

## Stage Four: Agent—Who Owns the Outcome Within the Boundary?

By the Copilot stage, AI can understand a goal, arrange steps, and keep calling tools. What separates it from an Agent?

Responsibility.

Suppose an AI support system can issue refunds. An order should be eligible for only ¥50, but a user manipulates it into refunding ¥5,000. Who bears the outcome?

If business staff must still review every case, and a failure is later blamed on “the reviewer who missed it,” the system remains a Copilot. AI executes while a person sits beside it with a foot on the brake.

Agent implies a different commitment: within operating boundaries agreed by both sides, business staff no longer need to review each case. If the system makes an autonomous decision that goes wrong, the team delivering the Agent is responsible for the result within that agreed scope.

This does not mean an Agent offers unlimited guarantees.

Levels L2 and L3 in driving automation help illustrate the change. L2 still requires the driver to monitor continuously. Under limited conditions, L3 assigns more of the driving task to the system while retaining takeover requirements. This analogy describes a shift in task and monitoring responsibility; it cannot determine legal liability in any particular crash.

Actual responsibility depends on local law, product commitments, operating conditions, and the facts. The same applies to an Agent: boundaries must be written in advance, and the system must refuse, degrade safely, or hand over to a person when it moves outside them.

For example, a refund Agent might handle only ordinary after-sales requests where the amount is no more than ¥200, the order state is unambiguous, and the user’s identity is verified. If the amount exceeds the limit, the account is anomalous, or rules conflict, it immediately hands the case to a person.

Inside the boundary it may finish the task itself. Outside the boundary it must not keep guessing merely to improve its completion rate.

### From Copilot to Agent, the Key Is Systematic Oversight

When people stop checking each case, oversight does not disappear. It changes from “a person watches every step” to “the system automatically contains the risk.”

![Copilot relies on human confirmation; Agent operates within agreed boundaries using system guardrails](/assets/blog/enterprise-ai-four-stages/diagram-03-governance-en-v1.png)

*Unattended operation does not mean ungoverned operation.*

At minimum, the system needs controls for:

- **Permissions:** which systems it may access, which data it may read, and what it may change;
- **Budget:** maximum tool calls, resource use, and financial amount per task;
- **Monitoring:** what it is doing now, whether the result is drifting, and whether anomalies are detected promptly;
- **Risk controls:** rules that can never be bypassed and situations that require renewed identity verification;
- **Circuit breaking:** whether the system stops immediately after repeated failures, abnormal cost, or loss of control;
- **Rollback and compensation:** how to return to a safe state when an operation is only partly complete;
- **Audit and evaluation:** whether every decision is traceable and extreme cases are repeatedly tested;
- **Accountability:** who responds, who repairs the problem, and who bears outcomes within the agreed scope.

The difficult part is turning judgments that once lived in employee experience into rules the system can execute.

An experienced support agent may look at an unusual refund and feel that “something is off.” An Agent does not share that tacit understanding. The company must ask what is actually abnormal: the amount, frequency, account, or a mismatch between the order status and the stated reason? Which cases should be refused, which require secondary confirmation, and which must go to a person?

Only when that experience is made explicit does systematic oversight truly exist.

Evaluation cannot focus only on average accuracy. Even if normal orders are handled well, a system that can bypass permissions under extreme input—or keeps calling tools after repeated failures—cannot run unattended.

A reliable Agent needs more than a strong model. It needs a defined operating scope, continuous monitoring, human takeover, incident response, and recovery.

Under this framework, Agent is not a fashionable new name for Copilot. It is a commitment to take responsibility for autonomous outcomes within a defined boundary.

## Where Should a Company Begin?

Do not start by asking, “How do we build an Agent?” Look at what the current system lacks.

![Companies can assess the next capability to build across knowledge, tools, workflows, and governance](/assets/blog/enterprise-ai-four-stages/diagram-04-upgrade-checklist-en-v1.png)

*Find the weakest layer and start there.*

If enterprise knowledge is inaccurate, organize the data first. Do not rush to let AI answer everything.

If the Chatbot can already answer correctly, turn messy old interfaces into clear, safe, traceable tools.

If the tools work, add intent governance and state management so the system can keep moving through the right workflow.

If the Copilot can complete multi-step tasks reliably, turn the genuinely useful rules in human supervision into executable permissions, risk controls, circuit breakers, audits, and accountability mechanisms.

The four layers can be made more concrete.

### Layer One: Organize Knowledge First

Choose one bounded business scenario with a concentrated question set. Do not load every document in the company on day one. Confirm the authoritative sources, classification, permissions, and owner, then test repeatedly with real questions.

### Layer Two: Organize Tools Next

Begin with read-only tools and stabilize their entry points and return values. For tools that change data, prioritize permissions, confirmation, idempotency, and auditability before failures happen.

### Layer Three: Build a Closed Task Loop

Choose a process with a manageable number of steps and an outcome that is easy to verify. Test intent decomposition, task state, interruption and resumption, and human takeover. One stable complete workflow is more valuable than ten unfinished ones.

### Layer Four: Expand the Autonomous Boundary Gradually

Write down which tasks may run unattended, then configure budgets, monitoring, risk controls, circuit breaking, compensation, and accountable owners for that scope. Expand little by little after it proves stable instead of trying to automate everything at once.

An intermediate version does not have to be formally launched, but the capability building and validation behind it cannot be skipped.

Nor does every company need to reach the final stage. Some businesses need only a Chatbot. For high-risk operations, retaining human confirmation over the long term may be the better design.

## Closing Thoughts

Chatbot, AI + Tools, Copilot, and Agent are not an industry standard that every company must follow, and reaching stage four is not the definition of success.

The framework is meant to answer a more practical question: when an AI project stalls, can we see what is actually missing?

If answers are inaccurate, inspect knowledge and data. If tools are often chosen incorrectly, inspect interfaces and permissions. If workflows cannot finish, inspect intent and state. If the system cannot be trusted to run autonomously, inspect governance and responsibility.

Every step forward reveals a problem at the next layer that people once concealed. Rules remembered through employee experience become data problems. Interfaces used through developers’ tacit coordination become tool problems. Exceptions watched by business staff become governance problems.

Connecting a stronger model does not make these problems disappear.

Everyone is still exploring, and the boundaries of many concepts will keep changing. Instead of rushing to prove that an Agent has been built, choose one real scenario and make the system answer one question correctly, use one tool well, and complete one workflow reliably.

Practice will show what is missing next.

Identify the current layer and build it properly. That is how a legacy enterprise system adopts AI without merely adding a chat box that looks intelligent.

## References

- NHTSA, [Automated Vehicle Safety](https://www.nhtsa.gov/vehicle-safety/automated-vehicle-safety); SAE, [J3016 Levels of Driving Automation](https://www.sae.org/binaries/content/assets/cm/content/blog/sae-j3016-visual-chart_5.3.21.pdf).
- NIST, [AI Risk Management Framework Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/).
- Anthropic, [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents).

## Follow the WeChat Official Account

If you are also thinking about enterprise AI, Agents, and deployment in real operations, you are welcome to follow the WeChat official account “刘路飞”. I will continue writing about these questions.

![Yunzhou, the original mascot of the 刘路飞 WeChat official account](/assets/blog/enterprise-ai-four-stages/mascot-yunzhou-avatar-v4.png)

**Luffy Liu · 刘路飞** is an independent product builder documenting enterprise AI, Agents, and real-world workflows.

## Continue Reading

[Prompt Engineering Guide](/tutorials/prompt-engineering/)
