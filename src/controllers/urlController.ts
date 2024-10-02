import { Request, RequestHandler, Response } from 'express';
import { Url } from '../models/Url';
import client from '../config/redis';

const generateRandomString = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Shorten URL
export const shortenUrl: RequestHandler = async (req, res): Promise<void> => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  try {
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      res.status(200).json({ status: true, data: existingUrl });
      return;
    }

    // Generate a unique urlCode
    let urlCode: string;
    do {
      urlCode = generateRandomString(6); 
    } while (await Url.findOne({ urlCode })); 

    const shortUrl = `${baseUrl}/${urlCode}`;
    const newUrl = new Url({
      urlCode,
      longUrl,
      shortUrl,
    });

    await newUrl.save();
    await client.set(longUrl, shortUrl);

    res.status(201).json({ status: true, data: newUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

export const redirectUrl: RequestHandler = async (req, res): Promise<void> => {
  const { urlCode } = req.params;

  // Check if urlCode is a valid format if required, else proceed directly
  if (!urlCode) {
     res.status(400).json({ status: false, message: 'Invalid URL code' });
  }

  try {
    const cachedUrl = await client.get(urlCode);

    if (cachedUrl) {
   
       res.status(301).redirect(cachedUrl); 
    }
    const url = await Url.findOne({ urlCode });

    if (url) {
      await client.set(urlCode, url.longUrl);
       res.status(301).redirect(url.longUrl); 

    } else {
       res.status(404).json({ status: false, message: 'URL not found' });
    }
  } catch (error) {
    console.error(error);
     res.status(500).json({ status: false, message: 'Server error' });
  }
};