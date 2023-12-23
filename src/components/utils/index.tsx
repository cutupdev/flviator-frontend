export const generateRandomString = (num: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const displayName = (name: string) => {
  name = name || "Hidden";
  return name?.slice(0, 1) + "***" + name?.slice(-1);
};
