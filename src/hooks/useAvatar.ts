const useAvatar = () => {
  const generateArray = (length: number, prefix: string) =>
  Array.from({ length }, (_, i) => `${prefix}${String(i + 1).padStart(2, '0')}`);

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const backgroundColor = ['b6e3f4', 'c0aede', 'd1d4f9'];
  const hair = [
    ...generateArray(26, 'long'),
    ...generateArray(19, 'short'),
  ];
  const hairColor = ["0e0e0e", "3eac2c", "6a4e35", "85c2c6", "796a45", "562306", "592454", "ab2a18", "ac6511", "afafaf", "b9a05f", "cb6820", "dba3be", "e5d7a3"];
  const skinColor = ["9e5622", "763900", "ecad80", "f2d3b1"];
  const mouth = generateArray(30, 'variant');

  const generateAvatar = () => {
    const url = new URL('https://api.dicebear.com/9.x/adventurer/svg');
    url.searchParams.append('backgroundColor', getRandomElement(backgroundColor));
    url.searchParams.append('hair', getRandomElement(hair));
    url.searchParams.append('hairColor', getRandomElement(hairColor));
    url.searchParams.append('skinColor', getRandomElement(skinColor));
    url.searchParams.append('mouth', getRandomElement(mouth));
    return url.toString();
  }

  return {
    generateAvatar,
  };
};

export default useAvatar;
