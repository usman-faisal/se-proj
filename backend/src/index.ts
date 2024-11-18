import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { decryptImage, encryptAndBlurImage } from "./utils";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: "*", allowedHeaders: "*", methods: "*" }));
app.use(express.json({ limit: "50mb" }));

app.get("/ping", async (_req, res) => {
  const all = await prisma.url.findMany();
  return res.json(all);
});

// Check if URL exists and create it if not
app.post("/url/:url", async (req: Request, res: Response) => {
  const { url } = req.params;

  const existingUrl = await prisma.url.findUnique({
    where: {
      url,
    },
    select: {
      id: true,
      image: true,
      url: true,
    },
  });
  console.log(existingUrl)
  if (existingUrl) {
    return res.json(existingUrl);
  }

  const newUrl = await prisma.url.create({
    data: {
      url,
    },
    select: {
      id: true,
      url: true,
    },
  });

  return res.json(newUrl);
});

// Encrypt and save the image with the given URL
app.post("/url/:url/image", async (req: Request, res: Response) => {
  const { url } = req.params;
  const { image, key } = req.body;
  if (!image || !key) {
    return res.json({
      success: false,
      message: "Image or key is missing",
    });
  }
  const existingUrl = await prisma.url.findUnique({
    where: {
      url,
    },
  });

  if (!existingUrl) {
    return res.json({
      success: false,
      message: "URL does not exist",
    });
  }

  const encryptedImage = encryptAndBlurImage(image, key);
  
  await prisma.url.update({
    where: { url },
    data: {
      image: encryptedImage,
      key,
    },
  });

  return res.json({
    success: true,
    message: "Image added successfully",
  });
});

// Retrieve and decrypt the image by URL
app.get("/url/:url/decrypted-image", async (req: Request, res: Response) => {
  const { url } = req.params;
  const { key } = req.query;

  const existingUrl = await prisma.url.findUnique({
    where: {
      url,
    },
    select: {
      image: true,
      key: true,
    },
  });
  if (!existingUrl) {
    return res.json({
      success: false,
      message: "URL does not exist",
    });
  }
  if (key !== existingUrl.key) {
    return res.json({
      success: false,
      message: "Invalid key",
    });
  }
  if (!existingUrl.image || !existingUrl.key) {
    return res.json({
      success: false,
      message: "Image or key is missing",
    });
  }
  const decryptedImage = decryptImage(
    existingUrl.image,
    existingUrl.key,
  );

  return res.json({
    image: decryptedImage,
    success: true,
  });
});

app.delete("/url/:url", async (req: Request, res: Response) => {
  const { url } = req.params;
  const existingUrl = await prisma.url.findUnique({
    where: {
      url,
    },
  });

  if (!existingUrl) {
    return res.json({
      success: false,
      message: "URL does not exist",
    });
  }

  await prisma.url.delete({
    where: {
      url,
    },
  });

  return res.json({
    success: true,
    message: "Image deleted successfully",
  });
});

const port = 3001;
app
  .listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.error(err);
  });
