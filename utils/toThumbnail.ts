export function toThumbnail(str: String): string {
  let location = str.slice(50);

  const UPLOAD_PREFIX =
    "https://res.cloudinary.com/dchopcxko/image/upload/c_thumb,w_200,g_face/";

  return UPLOAD_PREFIX + location;
}
