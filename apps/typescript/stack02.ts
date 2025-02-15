type Config = {
  api: {
    endpoint: string;
    timeout: number;
    headers: {
      'Content-Type': string;
      Auth: string;
    };
  };
  theme: string;
  grid: {
    location: {
      lat: number;
      lng: number;
    };
  };
};
const config = {
  api: {
    endpoint: 'https://api.mock.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      Auth: 'Bearer token',
    },
  },
  theme: 'dark',
  grid: {
    location: {
      lat: 37.5,
      lng: 126.9,
    },
  },
};

/**
 * [목표 결과물]
 * {
 * "api.endpoint": "https://api.mock.com",
 * "api.timeout": 5000,
 * "api.headers.Content-Type": "application/json",
 * "api.headers.Auth": "Bearer token",
 * "theme": "dark",
 * "grid.location.lat": 37.5,
 * "grid.location.lng": 126.9
 * }
 */
// function flattenObject(obj, prefix = '') {
//   let result = {};

//   for (let key in obj) {
//     const newKey = prefix ? `${prefix}.${key}` : key;

//     if (
//       typeof obj[key] === 'object' &&
//       obj[key] !== null &&
//       !Array.isArray(obj[key])
//     ) {
//       // 객체가 너무 깊으면 여기서 Stack Overflow 발생!
//       const nested = flattenObject(obj[key], newKey);
//       result = { ...result, ...nested };
//     } else {
//       result[newKey] = obj[key];
//     }
//   }
//   return result;
// }
function flattenObjectIterative(obj: Config) {
  const result: Record<string, any> = {};

  const stack: { currentObj: any; prefix: string }[] = [
    { currentObj: obj, prefix: '' },
  ];

  while (stack.length > 0) {
    const { currentObj, prefix } = stack.pop()!;

    for (let key in currentObj) {
      const value = currentObj[key]!;
      console.log('value:', value, 'currentObj:', currentObj);

      const newKey = prefix ? `${prefix}.${key}` : key;
      console.log(' ===prefix:', prefix, 'newKey:', newKey, 'key:', key, '===');

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        stack.push({ currentObj: value, prefix: newKey });
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}
console.log(flattenObjectIterative(config));
