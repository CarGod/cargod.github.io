---
locale: "en"
title: "Structured Prompt Templates and Techniques"
seoTitle: "Structured Prompt Template: Reduce Omissions | Luffy Liu"
description: "Starting with everyday examples such as writing a letter and buying beef pies, learn how to organize a complex Prompt with roles, actions, constraints, formats, and examples."
slug: "structured-prompts"
contentKey: "tutorial.prompt-engineering.structured-prompts"
translation_of: "/tutorials/prompt-engineering/structured-prompts/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 6
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "structured-prompts"
    label: "Structured Prompts"
draft: false
---

## Rules Keep Things from Falling Apart

Before we begin, do you remember primary-school assignments that asked us to write a letter to “Li Ming”?

We would usually start with a greeting and finish with a formal closing. In an exam, leaving out one item could cost us points.

At the time, I always wondered why it had to be so complicated. Why not just write what we wanted to say, as if we were passing a note?

After I started working, I often had to write emails. At first I did not follow a fixed format. Then I noticed that whenever I was in a hurry, something was easily left out.

Sometimes it was my name, sometimes the date, and sometimes what the recipient was supposed to do next.

Over time, I began checking emails in a fixed order, much as I had done as a child. Even on a busy day, I was less likely to miss something important.

The same thing happens in many fields. Nurses, flight attendants, and equipment operators repeatedly work through checklists. If a task looks simple, why do they still do that?

Because people overlook things. A fixed process cannot guarantee that nothing will ever go wrong, but it can reduce omissions.

The same is true when writing a Prompt.

Could we prepare a reference template and work through it when a task gets complicated?

Yes.

But it is only a tool for reducing omissions, not a “best formula” for every model and every task.

## What Should a Good Prompt Contain?

Should we put in every piece of information we can find—the more detail, the better?

Of course not.

In the Chinese sitcom *My Own Swordsman*, the constable Yan Xiaoliu often fires off a string of questions: “What is your surname? Your given name? Where are you from? Where are you going? How many people are in your family? How much land does each person have? How many cattle are in the fields?”

It sounds very specific, but much of that information has nothing to do with the matter at hand. Too much information can become a distraction.

With too little information, the model has to guess. Too much irrelevant information creates noise.

Let us start with an everyday situation: **asking Zhang San to buy two beef pies.**

## Buying Two Beef Pies

Suppose the full request is:

```text
Ask Zhang San to go to the Lawson convenience store downstairs now and buy two beef pies at 7 yuan each.
Have the pies heated, put them in two separate paper bags, and bring them back within 20 minutes.
```

What information matters here?

First, who should buy them? There has to be a clearly identified person. If we stand in a crowd and say, “Buy me two beef pies,” Zhang San will not know whether we mean him. This is the **role or addressee**.

Where should he go, and when? Otherwise he may buy them tomorrow or go to a different store. These are the **time and place of the action**.

What should he buy, how many, and at what price? These are the **task and constraints**.

Should they be heated? That is a **specific operation**.

How should they be packed? That is the **delivery format**.

How soon should they be brought back? That is another **constraint**.

What if we only tell Zhang San, “Go buy me something”?

Could he return with exactly the two beef pies we had in mind?

It is possible. If he gets every detail right, then Zhang San really knows us well.

Most of the time, though, he has to ask follow-up questions or make his own guesses.

If that is true for people, what about AI?

If we want the model to write a novel but only say, “Write me a novel,” the result probably will not happen to match the idea in our head.

## A Reference Structure

For a complex Prompt, choose the parts you need from the following structure:

### Role

State the point of view the model should work from, or who the result is for.

A role does not give the model a real professional qualification, nor does it “block” knowledge from other fields. What helps is the concrete standard behind the role—for example, “look for risks as a code reviewer would”—not “you are the greatest engineer in the world.”

### Skills

List the abilities the task calls for, such as summarizing, classifying, translating, or explaining code.

This does not install new skills in the model. It only helps direct attention toward the kind of processing the task needs. Many simple tasks can omit this part.

### Action

Tell the model directly what it needs to do.

For example: extract action items from meeting notes; find errors in code; write a story outline from a theme.

### Constraints

State what the model must not do, how it should handle missing information, and any boundaries around length, language, safety, and facts.

For example: do not add information that is absent from the source; write “not provided” when uncertain; reply in Chinese.

### Format

Say whether you want Markdown, a table, JSON, or a set of fixed fields.

### Example

When a rule is abstract, provide one input-and-output example to show the relationship you expect.

## Put the Structure into a Prompt

```text
# Role
Science-fiction story editor

## Action
Based on the theme provided by the user, produce character profiles, the central conflict, and a three-act outline.

## Constraints
- Do not use well-known characters or plots from existing works.
- If information is missing, list the questions that need to be answered first. Do not fill in the gaps yourself.
- The world may be fictional, but its internal rules must stay consistent.

## Format
Use Markdown and organize the answer into four sections: Characters, Conflict, Outline, and Questions to Confirm.

## Example
Character: an engineer responsible for repairing interstellar routes.
Conflict: a repair mission uncovers a hidden history between two civilizations.
```

This template is not a standard answer that must be copied word for word.

If we only want the model to polish one sentence, there is no need to write all six parts. Structure becomes more useful when a task involves long source material, collaboration among several people, or further processing by a program.

Simple task, simple Prompt.

Complex task, use the template to check what might be missing.

**Previous:** [Six Ways to Get Better Output](/tutorials/prompt-engineering/clear-instructions/)

**Next:** [Ask the Model to Output JSON](/tutorials/prompt-engineering/json-output/)
