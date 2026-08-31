function exactLineIndexes(lines, expected) {
  const indexes = [];
  for (const [index, line] of lines.entries()) if (line.trim() === expected) indexes.push(index);
  return indexes;
}

export function missingRequiredLiterals(content, literals = []) {
  return literals.filter((literal) => !content.includes(literal));
}

export function validateRequiredFencedOutput(fences, rule, locale) {
  const issues = [];
  if (!rule || typeof rule !== "object") return ["required_fenced_output must be an object"];
  if (typeof rule.language !== "string" || !rule.language) issues.push("language must be a non-empty string");
  if (!Number.isInteger(rule.heading_level) || rule.heading_level < 1 || rule.heading_level > 6) issues.push("heading_level must be an integer from 1 to 6");
  if (!Array.isArray(rule.owners) || !rule.owners.length || rule.owners.some((owner) => typeof owner !== "string" || !owner.trim())) issues.push("owners must be a non-empty string array");
  const deadlineLine = rule.missing_deadline_line_by_locale?.[locale];
  if (typeof deadlineLine !== "string" || !deadlineLine.trim()) issues.push(`missing_deadline_line_by_locale must define ${locale}`);
  if (issues.length) return issues;

  const headingPrefix = `${"#".repeat(rule.heading_level)} `;
  const headings = rule.owners.map((owner) => `${headingPrefix}${owner}`);
  const candidates = fences.filter((fence) => fence.language === rule.language);
  if (!candidates.length) return [`no ${rule.language} fence exists for the protected output example`];

  const matching = candidates.find((fence) => {
    const lines = fence.content.split(/\r?\n/);
    return headings.every((heading) => exactLineIndexes(lines, heading).length === 1);
  });
  if (!matching) return [`no single ${rule.language} fence contains each required owner heading exactly once: ${rule.owners.join(", ")}`];

  const lines = matching.content.split(/\r?\n/);
  const positions = headings.map((heading) => exactLineIndexes(lines, heading)[0]);
  for (let index = 1; index < positions.length; index++) {
    if (positions[index] <= positions[index - 1]) issues.push(`owner headings are out of order: ${rule.owners[index - 1]} before ${rule.owners[index]}`);
  }

  for (const [index, owner] of rule.owners.entries()) {
    const start = positions[index] + 1;
    let end = lines.length;
    for (let cursor = start; cursor < lines.length; cursor++) {
      if (/^#{1,6}\s+\S/.test(lines[cursor].trim())) { end = cursor; break; }
    }
    const sectionLines = lines.slice(start, end).map((line) => line.trim());
    if (!sectionLines.includes(deadlineLine)) issues.push(`${owner} section must contain the exact missing-deadline line: ${deadlineLine}`);
  }
  return issues;
}
