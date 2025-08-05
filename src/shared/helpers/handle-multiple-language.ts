import { validateTag } from '../validate-localization/language-validation';

// not sure, may be not use
export const haveThAndEn = (str: string): boolean => {
  const regex = /<th>.+<\/th>.*<en>.+<\/en>|<en>.+<\/en>.*<th>.+<\/th>/;
  return regex.test(str);
};

export const validateWord = (str: string, tag: string): boolean => {
  if (!validateTag(tag)) {
    console.error('Invalid Language. Allowed languages are: th and en');
  }
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
  return regex.test(str);
};

export const contentLocalization = (str: string): string[] => {
  const regex = /<([^>]+)>/g; // Match the opening tag and capture the tag name
  const res: string[] = [];
  [...str.matchAll(regex)].map((match) => {
    validateTag(match[1]) && res.push(match[1]);
  });
  return res;
};

export const checkLanguageExist = (str: string, tag: string): boolean => {
  if (!validateTag(tag)) {
    console.error('Invalid tag. Allowed tags are: <en></en> or <th></th>.');
  }
  const regexEn = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
  const matchEn = str.match(regexEn);
  if (matchEn && matchEn[1]) {
    return true;
  }
  return false;
};

export const extractDataFromTagLanguage = (
  str: string,
  tag: string,
): string => {
  if (!validateTag(tag)) {
    console.error('Invalid tag. Allowed tags are: <en></en> or <th></th>.');
  }
  const listLang = contentLocalization(str);
  if (listLang.includes(tag)) {
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
    const match = str.match(regex);

    if (match && match[1]) {
      return match[1];
    }
  } else {
    const defaultLang = listLang[0];
    const regex = new RegExp(`<${defaultLang}>(.*?)<\/${defaultLang}>`);
    const match = str.match(regex);

    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
};

export const replaceWordInTag = (
  tag: string,
  newWord: string,
  original: string,
): string => {
  if (!validateWord(newWord, tag)) {
    console.error('Invalid tag. Allowed tags are: <en></en> and <th></th>.');
  }
  const extractInput = extractDataFromTagLanguage(newWord, tag);
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g');
  const replacedInput = original.replace(
    regex,
    `<${tag}>${extractInput}</${tag}>`,
  );
  return replacedInput;
};

export const updateLanguageTag = (
  content: string,
  tag: string,
  newContent: string,
): string => {
  const regex = new RegExp(`<${tag}>.*?</${tag}>`, 'g');
  if (content.match(regex)) {
    // has language in original content (update exist value)
    return content.replace(regex, `<${tag}>${newContent}</${tag}>`);
  }
  // has not language in original content (add new language)
  return content + `<${tag}>${newContent}</${tag}>`;
};
