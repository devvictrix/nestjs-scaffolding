export const validateTag = (tag: string): boolean => {
  return ['th', 'en'].includes(tag);
};

export const validateLanguage = (txt: string): boolean => {
  const stack: string[] = [];

  const tagRegex = /<\/?(th|en)\b[^>]*>/g;
  const matches = txt.match(tagRegex);

  // console.log(matches);

  if (!matches) {
    return true; // No Language tags found
  }

  for (const match of matches) {
    const isClosingTag = match.startsWith('</');
    // console.log(`isClosingTag = ${isClosingTag}`);
    const tagName = match.substring(isClosingTag ? 2 : 1, match.length - 1);
    // console.log(`tagName = ${tagName}`);

    if (!validateTag(tagName)) {
      return false;
    }

    if (isClosingTag) {
      if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
        return false; // Invalid closing tag
      }
      stack.pop();
    } else {
      if (stack.length === 0) {
        stack.push(tagName);
      } else {
        return false;
      }
    }
  }

  return stack.length === 0; // All tags are properly closed
};
