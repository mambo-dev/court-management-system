import formidable, {
  Fields,
  Files,
  errors as FormidableErrors,
} from "formidable";
import type { NextApiRequest } from "next";
import { join } from "path";
import { format } from "date-fns";
import mime from "mime";

export const FormidableError = FormidableErrors.FormidableError;

export const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/uploads/${format(Date.now(), "dd-MM-Y")}`
    );
    const { mkdir, stat } = require("fs");
    try {
      await new Promise((resolve) => stat(uploadDir, resolve));
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await new Promise((resolve) =>
          mkdir(uploadDir, { recursive: true }, resolve)
        );
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    const form = formidable({
      maxFiles: 3,
      maxFileSize: 2e7, // 20mb
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || "") || "unknown"
        }`;
        return filename;
      },
      filter: (part) => {
        console.log(part.mimetype);
        return part.name === "media" && (part.mimetype?.includes("") || false);
      },
    });
    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
