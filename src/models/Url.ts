import mongoose, { Document , Schema } from "mongoose";

export interface IUrl extends Document{
    urlCode : string ;
    longUrl : string ;
    shortUrl :string ;
}

const UrlSchema: Schema = new Schema<IUrl>({
    urlCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    longUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(v);
        },
        message: 'Invalid URL format',
      },
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
  }, { timestamps: true });
  
  export const Url = mongoose.model<IUrl>('Url', UrlSchema);