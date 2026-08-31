---
locale: "en"
title: "Ask the Model to Output JSON"
seoTitle: "Getting Valid JSON Output from an AI Model | Luffy Liu"
description: "Using a teacher entering student records as a step-by-step example, learn why programs need structured data and how to define fields, unknown values, and JSON validation."
slug: "json-output"
contentKey: "tutorial.prompt-engineering.json-output"
translation_of: "/tutorials/prompt-engineering/json-output/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 7
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "structured-output"
    label: "Structured Output"
draft: false
---

## What Is JSON?

JSON (JavaScript Object Notation) is a common data-interchange format. It organizes data as key-value pairs, making it readable for people and straightforward for programs to parse.

```json
{
  "name": "John",
  "age": 30,
  "isStudent": false,
  "grades": [90, 85, 88],
  "address": {
    "city": "New York",
    "zipcode": "10001"
  }
}
```

This example represents a person's name, age, student status, grades, and address.

A JSON value can be a string, number, Boolean, `null`, array, or object. Most mainstream programming languages provide tools for working with JSON, so it is often used to pass data between systems.

But why ask a model to output JSON?

Let us look at an example.

## A Teacher's Problem

Suppose I am a primary-school teacher. On the first day of school, I ask every child in the class to write a short introduction, and I want to enter the information into the student management system.

Every child will write it differently.

```text
My name is Zhang San. I am 9 years old and live in Xingfu Residential Community. My mother is a teacher, and my father is a doctor. I like drawing and singing.
```

```text
I am Xiaomei, age 8, and I live in Wutong Garden. I like dancing best. My father catches bad people every day, and my mother looks after me at home.
```

We can ask the model to extract each student's name, age, parents' jobs, address, and hobbies.

Zhang San's introduction states both parents' occupations explicitly. For Xiaomei, “catches bad people every day” does not reliably prove that her father is a police officer, and “looks after me at home” does not prove that her mother's occupation is homemaker.

An interpretation does not become a fact merely because it sounds plausible.

A safer result leaves fields empty when the source does not state them clearly:

```text
Name: Xiaomei
Age: 8
Father's job: Not provided
Mother's job: Not provided
Home address: Wutong Garden
Hobby: Dancing
```

This looks fine at first.

But what if we need to enter the data into the student management system?

With only two students, we can do it by hand.

What if there are 100 students?

The teacher would be exhausted.

So we write a program that imports the information extracted by the model in a batch.

Now we have a problem. The result above is only multiline text. To get the name, the program might read the first line; to get the age, it might read the second.

What happens if we add a “gender” field?

```text
Name: Xiaomei
Gender: Female
Age: 8
Father's job: Not provided
Mother's job: Not provided
Home address: Wutong Garden
Hobby: Dancing
```

The second line used to contain the age. Now it contains gender, so the code may fail.

Someone might say: instead of using line numbers, why not search for “Age:”?

Then what if we also add the ages of the father and mother?

```text
Name: Xiaomei
Age: 8
Father's job: Not provided
Father's age: Not provided
Mother's job: Not provided
Mother's age: Not provided
Home address: Wutong Garden
Hobby: Dancing
```

As fields and levels multiply, a program built around line numbers and text slicing becomes harder and harder to maintain.

What is the root problem?

The data has no stable, explicit structure.

## Representing Levels with JSON

We can express the same information this way:

```json
{
  "name": "Xiaomei",
  "age": 8,
  "father": {
    "job": null,
    "age": null
  },
  "mother": {
    "job": null,
    "age": null
  },
  "address": "Wutong Garden",
  "hobby": ["Dancing"]
}
```

Now the program can read `name`, `age`, or `father.job` directly, without guessing which line contains it.

JSON is not required for every task. If a result is meant only for people to read, plain text or Markdown is often more natural. Structured data becomes especially useful when a program needs to process the result next.

## How Do We Ask a Model for JSON?

```text
Extract the student information from <student></student> and output only one JSON object.

Fields:
- name: string or null
- age: number or null
- father_job: string or null
- mother_job: string or null
- address: string or null
- hobby: array of strings

Rules:
- Extract only information explicitly stated in the source.
- Do not infer occupations from descriptions.
- Use null for a single-value field that is not provided.
- Do not output any explanatory text outside the JSON.

<student>
{{student introduction}}
</student>
```

The important part is not merely the words “return JSON.”

We have also defined the fields, types, missing values, and the boundary against unsupported inference.

## If the Model Says “This Is JSON,” Can We Use It?

Not necessarily.

It might add an explanation, omit a field, use the wrong type, or produce invalid JSON syntax. Even syntactically valid JSON may violate the business rules.

At a minimum, the program still needs to check two things:

1. Can a JSON parser parse the output?
2. Are the fields, types, allowed values, and business rules correct?

If the platform supports Structured Outputs or JSON Schema, prefer the platform's structural constraints. The exact support can change, so check the official documentation for the interface you use.

> **Note:** All student details above are fictional examples. Do not submit real children's addresses, identity documents, health information, or other sensitive data to a model for practice.

JSON makes a result easier to pass into a program. Reliability, however, comes from clearly defined fields, honest treatment of unknowns, validation by code, and human handling of exceptions.

**Previous:** [Structured Prompt Templates and Techniques](/tutorials/prompt-engineering/structured-prompts/)

**Next:** [Using XML Tags Well](/tutorials/prompt-engineering/xml-delimiters/)
