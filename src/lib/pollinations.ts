const POLLINATIONAPI = process.env.POLLINATION_API;

export function getImageUrl(prompt: string, seed?: number) {
  const encoded = encodeURIComponent(prompt);
  const seedParam = seed !== undefined ? `?seed=${seed}` : '';
  const noLogo = seed !== undefined ? `&nologo=true` : `?nologo=true`;
  const model = "&model=flux";
  const size = "&width=1280&height=720";
  return `https://gen.pollinations.ai/image/${encoded}${seedParam}${noLogo}${model}${size}`;
}
