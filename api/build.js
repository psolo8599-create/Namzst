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
    const form = formidable({ multiples: false });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const url = fields.url;
    const name = fields.name;
    const email = fields.email;
    const icon = files.icon?.[0];

    // Log
    console.log("DATA DITERIMA:", { url, name, email });
    if (icon) console.log("Logo:", icon.originalFilename);

    const fileName = `${name.replace(/\s+/g, "_")}.apk`;
    const fakePath = `/tmp/${fileName}`;
    fs.writeFileSync(fakePath, "Fake APK");

    return res.status(200).json({
      status: true,
      message: "APK berhasil dibuat!",
      appName: name,
      download: `https://example.com/download/${fileName}`
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: e.message
    });
  }
}