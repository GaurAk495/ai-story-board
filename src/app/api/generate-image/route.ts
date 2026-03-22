import { NextResponse } from 'next/server';
import { getImageUrl } from '@/lib/pollinations';

// Toggle this boolean to switch between the two APIs
const USE_MODAL_API = false;

export async function POST(req: Request) {
  try {
    const { prompt, seed } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let imageRes: Response;

    if (USE_MODAL_API) {
      const modalUrl = "https://gaurak495--flux-klein-fluxklein-api-generate.modal.run";
      console.log("Generating image with Modal API...");

      imageRes = await fetch(modalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          width: 1280,
          height: 720,
          // Optional: passing seed if your Modal endpoint ever accepts it
          ...(seed !== undefined && { seed })
        })
      });

      if (!imageRes.ok) {
        throw new Error(`Modal API error: ${imageRes.statusText}`);
      }
    } else {
      const imageSeed = seed !== undefined ? seed : Math.floor(Math.random() * 100000);
      const url = getImageUrl(prompt, imageSeed);

      console.log("Generating image with Pollinations URL:", url);
      const headers: HeadersInit = {};
      if (process.env.POLLINATION_API) {
        headers['Authorization'] = `Bearer ${process.env.POLLINATION_API}`;
      }

      imageRes = await fetch(url, { headers });

      if (!imageRes.ok) {
        throw new Error(`Pollinations API error: ${imageRes.statusText}`);
      }
    }

    let dataUrl = "";

    if (USE_MODAL_API) {
      const data = await imageRes.json();

      if (!data.image_base64) {
        throw new Error("Modal API did not return image_base64");
      }

      const base64String = data.image_base64;
      dataUrl = base64String.startsWith("data:")
        ? base64String
        : `data:image/jpeg;base64,${base64String}`;
    } else {
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = buffer.toString('base64');

      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50;
      const mimeType = isPng ? "image/png" : "image/jpeg";

      dataUrl = `data:${mimeType};base64,${base64String}`;
    }

    return NextResponse.json({ url: dataUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate image' }, { status: 500 });
  }
}
