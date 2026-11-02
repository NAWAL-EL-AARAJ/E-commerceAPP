import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Aperçu affiché quand on partage un lien du site (WhatsApp, Instagram…). */

export const alt = "MERHAS — Foulards pensés avec élégance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dataUri = async (chemin: string, type: string) =>
  `data:${type};base64,${(await readFile(join(process.cwd(), chemin))).toString("base64")}`;

export default async function Image() {
  const [italique, medium, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/Cormorant-Italic.ttf")),
    readFile(join(process.cwd(), "assets/Cormorant-Medium.ttf")),
    dataUri("public/images/apropos/image3.png", "image/png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#fbf4f2",
          fontFamily: "Cormorant",
          color: "#2b2420",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={474} height={630} style={{ objectFit: "cover" }} />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 92, fontWeight: 500, letterSpacing: 18 }}>MERHAS</div>
          <div style={{ marginTop: 8, fontSize: 44, fontStyle: "italic", color: "#a9808a" }}>
            More than just a scarf.
          </div>
          <div
            style={{
              marginTop: 48,
              padding: "14px 34px",
              borderRadius: 999,
              border: "1.5px solid #e0c0b8",
              background: "#f6e6e1",
              fontSize: 30,
              fontWeight: 500,
            }}
          >
            Livraison partout au Maroc
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: medium, style: "normal", weight: 500 },
        { name: "Cormorant", data: italique, style: "italic", weight: 500 },
      ],
    },
  );
}
