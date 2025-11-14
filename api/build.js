export const config = {
  api: { bodyParser: false }
};

import formidable from "formidable";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false, keepExtensions: true });
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { url, name, email } = fields;
    const iconFile = files.icon ? files.icon[0] : null;

    console.log("=== FORM DITERIMA ===");
    console.log("URL:", url);
    console.log("Nama:", name);
    console.log("Email:", email);
    if (iconFile) console.log("Logo:", iconFile.originalFilename);

    // Simulasi file APK
    const fileName = `${name.replace(/\s+/g, "_")}.apk`;
    const fakePath = path.join("/tmp", fileName);
    fs.writeFileSync(fakePath, "Fake APK data");

    const fakeDownload = `https://example.com/downloads/${fileName}`;

    res.status(200).json({
      status: true,
      appName: name,
      download: fakeDownload
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
}