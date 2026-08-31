export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const addThousandSeparators = (number) => {
  if (number == null || isNaN(number)) return "";

  const parts = number.toString().split(".");
  const integerPart = parts[0];
  const fractionalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};

export const getLocalDateTimeInputValue = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const INDIA_TIME_ZONE = 'Asia/Kolkata';

export const getIndiaDateTimeInputValue = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).reduce((values, part) => {
    values[part.type] = part.value;
    return values;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

export const getIndiaDateTimeISOString = (dateTimeInput) => `${dateTimeInput}:00+05:30`;

export const formatDateTimeInIndia = (date) => new Intl.DateTimeFormat('en-IN', {
  timeZone: INDIA_TIME_ZONE,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}).format(new Date(date));

// Icon mapping for different categories and sources
export const getCategoryIcon = (category, type) => {
  if (type === 'expense') {
    const categoryMap = {
      'food': '🍔',
      'groceries': '🛒',
      'transportation': '🚗',
      'shopping': '🛍️',
      'entertainment': '🎬',
      'health': '🏥',
      'education': '📚',
      'bills': '📄',
      'rent': '🏠',
      'utilities': '💡',
      'travel': '✈️',
      'gym': '💪',
      'clothing': '👔',
      'insurance': '🛡️',
      'phone': '📱',
      'internet': '🌐',
      'subscriptions': '📺',
      'gifts': '🎁',
      'other': '💰',
    };
    return categoryMap[category?.toLowerCase()] || '💸';
  } else {
    const sourceMap = {
      'salary': '💼',
      'freelance': '💻',
      'business': '🏢',
      'investment': '📈',
      'bonus': '🎉',
      'gift': '🎁',
      'rental': '🏘️',
      'dividends': '💹',
      'interest': '🏦',
      'pension': '👴',
      'refund': '↩️',
      'cashback': '💳',
      'side hustle': '🚀',
      'other': '💰',
    };
    return sourceMap[category?.toLowerCase()] || '💵';
  }
};            
