import { IBlobImage } from '@/interfaces/common';

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', (...data) => {
      resolve(image);
    });
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });
};

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
// export default async function getCroppedImg(
//   imageSrc,
//   pixelCrop,
//   rotation = 0,
//   flip = { horizontal: false, vertical: false }
// ) {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   if (!ctx) {
//     return null;
//   }

//   const rotRad = getRadianAngle(rotation);

//   // calculate bounding box of the rotated image
//   const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
//     image.width,
//     image.height,
//     rotation
//   );

//   // set canvas size to match the bounding box
//   canvas.width = bBoxWidth;
//   canvas.height = bBoxHeight;

//   // translate canvas context to a central location to allow rotating and flipping around the center
//   ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
//   ctx.rotate(rotRad);
//   ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
//   ctx.translate(-image.width / 2, -image.height / 2);

//   // draw rotated image
//   ctx.drawImage(image, 0, 0);

//   // croppedAreaPixels values are bounding box relative
//   // extract the cropped image using these values
//   const data = ctx.getImageData(
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   // set canvas width to final desired crop size - this will clear existing context
//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   // paste generated rotate image at the top left corner
//   ctx.putImageData(data, 0, 0);

//   // As Base64 string
//   // return canvas.toDataURL('image/jpeg');

//   // As a blob
//   return new Promise((resolve, reject) => {
//     canvas.toBlob((file) => {
//       if (!file) {
//         reject("file null");
//         return;
//       }

//       resolve({
//         file: file,
//         width: canvas.width,
//         height: canvas.height,
//       });
//     }, "image/png");
//   });
// }

interface IPixelCrop {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: IPixelCrop,
): Promise<IBlobImage> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const size = getMaxSizeImage(pixelCrop.width, pixelCrop.height, 700);
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext('2d');

  if (!ctx)
    throw new Error(
      "Make canvas fail: message: can't get the context in canvas",
    );
  // ctx.fillStyle = "#ffffff";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (!file) {
        reject('make file (Blob) fail');
        return;
      }
      resolve({
        file: file,
        width: canvas.width,
        height: canvas.height,
      });
    }, 'image/png');
  });
}

function getMaxSizeImage(w: number, h: number, maxWidthOrHeight: number) {
  if (maxWidthOrHeight < w) {
    const ratio = h / w;
    return { width: maxWidthOrHeight, height: maxWidthOrHeight * ratio };
  } else if (maxWidthOrHeight < h) {
    const ratio = w / h;
    return { width: maxWidthOrHeight * ratio, height: maxWidthOrHeight };
  }

  return { width: w, height: h };
}
function getCanvas() {
  let canvas = document.querySelector('canvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  } else {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("can't get context in canvas");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  return canvas;
}

export async function linkImageToFile(src: string): Promise<IBlobImage> {
  /** @type { Promise<HTMLImageElement>} image */
  const image = await createImage(src);
  const { width, height } = image;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx?.drawImage(image, 0, 0, width, height, 0, 0, canvas.width, canvas.height);

  return await new Promise((res, rej) => {
    canvas.toBlob((file) => {
      if (!file) throw new Error('create blob in canvas fail');
      res({
        file: file,
        width: canvas.width,
        height: canvas.height,
      });
    }, 'image/jpeg');
  });
}

export async function getWidthHeightFileVideo(file: Blob): Promise<IBlobImage> {
  const video = document.createElement('video');

  return await new Promise((res, rej) => {
    video.src = URL.createObjectURL(file);

    video.onloadeddata = function () {
      res({
        file,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };
  });
}
