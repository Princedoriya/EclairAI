export const parseSection = (
  section: string
): { title: string; points: string[] } => {
  const [title, ...content] = section.split("\n");

  const cleanTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();

  const points: String[] = [];

  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("• ")) {
      // Split the bullet point line into sentences and add each as a separate point
      const sentences = trimmedLine
        .substring(2)
        .split(/(?<=[.!?])\s+/)
        .map((s) => "• " + s.trim())
        .filter(Boolean);
      points.push(...sentences);
    } else if (trimmedLine) {
      // For lines not starting with bullet, treat as separate points if not empty
      points.push(trimmedLine);
    }
  });

  return {
    title: cleanTitle,
    points: points.filter(
      (point) =>
        point && !point.startsWith("#") && !point.startsWith("[Choose]")
    ) as string[],
  };
};

export function parsePoint(point: string) {
  const isNumbered = /^\d+\./.test(point);
  // Fix isMainPoint to detect points starting with bullet or dash or similar
  const isMainPoint = /^[•\-*]/.test(point);

  // Replace the Unicode property escape with a simpler emoji detection
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();

  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

export function parseEmojiPoint(content: string) {
  const cleanContent = content.replace(/^[•]\s*/, "").trim();

  const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  if (!matches) {
    // If no emoji match, return null but provide text as cleanContent
    return { emoji: "", text: cleanContent };
  }

  const [, emoji, text] = matches;
  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}
