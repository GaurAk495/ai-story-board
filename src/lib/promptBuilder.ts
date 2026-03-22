import { Character, Scene } from "@/types";

export function buildImagePrompt(scene: Scene, characters: Character[], style: string) {
  let mainAction = scene.scriptLine ? scene.scriptLine : scene.description;

  // Collect characters present in this scene
  const presentChars = characters.filter(char =>
    scene.characters.some(sceneChar =>
      sceneChar.toLowerCase().includes(char.name.toLowerCase()) ||
      char.name.toLowerCase().includes(sceneChar.toLowerCase())
    )
  );

  // Inject full appearance inline next to their name for spatial context
  presentChars.forEach(char => {
    const regex = new RegExp(`\\b${char.name}\\b`, 'gi');
    if (regex.test(mainAction)) {
      mainAction = mainAction.replace(regex, `${char.name} [${char.appearance}]`);
    } else {
      mainAction += `. Also in scene: ${char.name} [${char.appearance}]`;
    }
  });

  // Build a consistency anchor block using the short consistencyTag for each character
  // This repeats their core visual identity at the end of the prompt to lock it in
  const consistencyAnchors = presentChars
    .filter(c => (c as any).consistencyTag)
    .map(c => `${c.name}: ${(c as any).consistencyTag}`)
    .join('. ');

  const visualStyle = scene.visualStyle ? `Visual style: ${scene.visualStyle}.` : '';

  return `
Artwork perfectly drawn in the visual style of: ${style}. ${visualStyle}
Scene Action: ${mainAction}.
Setting: ${scene.location}, ${scene.time}.
Atmosphere: ${scene.emotion}.
Scene Framing: ${scene.camera}.
${consistencyAnchors ? `Character Anchors: ${consistencyAnchors}.` : ''}
`.trim().replace(/\n/g, ' ');
}
