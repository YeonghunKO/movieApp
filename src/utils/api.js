export default async function getMovies(url) {
  try {
    const res = await fetch(url);
    // console.log(res);
    if (res.ok) {
      const data = await res.json();
      // console.log(data);
      return data;
    } else {
      console.log('invalid url');
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
