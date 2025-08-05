export const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error stringifying object:', error);
    return '{}';
  }
};

export const filterAndTruncateStringify = (
  obj: any,
  maxLen: number = 65000,
): string => {
  const sensitiveKeys = [
    'user',
    'username',
    'password',
    'bankaccount',
    'bankaccountnumber',
    'creditcardnumber',
    'cardnumber',
    'cvv',
    'secret',
    'accesstoken',
    'token',
    'authorization',
    'set-cookie',
    'cookie',
    'xapikey',
    'apikey',
    'refreshtoken',
    'sessiontoken',
    'ssn',
    'personalinfo',
    'fullname',
    'lasttname',
    'lasttname',
    'phone',
    'email',
    'address',
    'location',
  ];

  const normalizeKey = (key: string) =>
    key.toLowerCase().replace(/[^a-z0-9]/g, '');

  const replacer = (key: string, value: any) => {
    // Normalize the key for a case- and character-insensitive comparison
    if (sensitiveKeys.includes(normalizeKey(key))) {
      return '[Filtered]';
    }
    return value;
  };

  try {
    let result = JSON.stringify(obj, replacer);
    // Truncate the string to the maximum allowed length
    if (result.length > maxLen) {
      result = result.substring(0, maxLen) + '...[Truncated]';
    }
    return result;
  } catch (error) {
    console.error('Error stringifying object:', error);
    return '{}';
  }
};
