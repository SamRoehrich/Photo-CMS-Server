export const addBorderWidth = (link: string, width: string): string => {
  const UPLOAD_PREFIX = `https://res.cloudinary.com/dchopcxko/image/upload/bo_${width}px_solid_rgb:ffffff`;
  return UPLOAD_PREFIX + link;
};
