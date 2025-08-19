
const API_KEY = 'd188438ae5aac9dde2713461444ff1ce5f341cc93635e49a057a982263da7e115c3b8fab26acd5dd43325ab79f226f488d6b2b3403260b2d2f3949e5422cb7ff';
const USER_ID = '5254537';

export async function fetchRule34Images(tags: string = '', limit: number = 20, page: number = 0) {
  const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=${limit}&json=1&api_key=${API_KEY}&user_id=${USER_ID}&tags=${tags}&pid=${page}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Rule34 images:", error);
    return [];
  }
}
