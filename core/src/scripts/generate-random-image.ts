import { promises as fsp } from 'fs';
import path from 'path';
import _ from 'lodash';
import BPromise from 'bluebird';
import { createCanvas, loadImage } from 'canvas';
import Frame from 'canvas-to-buffer';

import { CIP25 } from '../types/cardano';
import { AsyncResult, AsyncSuccess } from '../types/standard';
import { selectByRarity } from '../utils/crypto';
import * as pathUtils from '../utils/path';
import * as processUtils from '../utils/process';

export type Attribute = {
  readonly rarity: number;
  readonly name: string;
  readonly imagePath: string;
};

export type Layer = {
  readonly attributeTypeName: string;
  readonly attributes: readonly Attribute[];
};

export type ScanLayerError = {
  readonly errorCode: 'InvalidDir' | 'ReadError';
};

const imageFileExts = ['png', 'svg', 'jpg', 'jpeg'];

async function scanLayer(
  directory: string
): Promise<AsyncResult<Layer, ScanLayerError>> {
  try {
    // parse layer name
    const dirName = path.basename(directory);
    const digits = pathUtils.leadingDigits(dirName);
    const attributeTypeName = dirName.substring(digits ? digits.length + 1 : 0);

    // scan attribute names
    const files = await fsp.readdir(directory, { withFileTypes: true });
    const images = files.filter(
      (file) =>
        file.isFile() &&
        imageFileExts.includes(
          path.extname(file.name).substring(1).toLowerCase()
        )
    );
    const attributes = images.reduce((result: readonly Attribute[], image) => {
      const digits = pathUtils.leadingDigits(image.name);
      const name = image.name.substring(
        digits ? digits.length + 1 : 0,
        image.name.length - path.extname(image.name).length
      );

      // NOTICE: currently don't validate the image file names and ignore invalid filenames
      if (!name) return result;

      return [
        ...result,
        {
          // if rarity is not specified, place 1
          rarity: digits
            ? pathUtils.parseRarityStr(digits)
            : 1.0 / images.length,
          name,
          imagePath: path.join(directory, image.name),
        },
      ];
    }, []);

    return {
      _tag: 'Success',
      result: {
        attributeTypeName,
        attributes,
      },
    };
  } catch (error) {
    return {
      _tag: 'Error',
      error: {
        errorCode: 'ReadError',
      },
    };
  }
}

export async function scan(
  directory: string
): Promise<AsyncSuccess<readonly Layer[]>> {
  const files = await fsp.readdir(directory, { withFileTypes: true });
  const subDirs = files
    .filter((file) => file.isDirectory())
    .sort((dir1, dir2) => dir1.name.localeCompare(dir2.name));
  const scanLayerResults = await Promise.all(
    subDirs.map((subDir) => scanLayer(path.join(directory, subDir.name)))
  );

  return {
    _tag: 'Success',
    result: scanLayerResults.reduce(
      (result: readonly Layer[], scanLayerResult) => {
        if (scanLayerResult._tag === 'Success') {
          return [...result, scanLayerResult.result];
        } else {
          console.error(scanLayerResult);
          return result;
        }
      },
      []
    ),
  };
}

export async function mergeImages(images: readonly string[], output: string) {
  const first = images[0];
  const firstImage = await loadImage(first);
  const canvas = createCanvas(firstImage.width, firstImage.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(firstImage, 256, 256);

  // render images in sequence
  // eslint-disable-next-line functional/no-loop-statement
  for await (const image of images.map((path) => loadImage(path))) {
    ctx.drawImage(image, 0, 0);
  }

  // write file
  const outputFile = await fsp.open(output, 'w+');
  await new Promise((resolve) => {
    outputFile.writeFile(new Frame(canvas).toBuffer()).then(resolve);
  });
  await outputFile.close();
}

export async function generateRandomImage(
  layers: readonly Layer[],
  { policyId, policyName }: { policyId: string; policyName: string },
  output: {
    readonly name: string;
    readonly image: string;
    readonly meta: string;
  }
): Promise<boolean> {
  const attributes = layers.map((layer) => {
    const randomIndex = selectByRarity(layer.attributes, Math.random());
    return layer.attributes[randomIndex];
  });
  const meta: CIP25 = {
    721: {
      [policyId]: {
        [policyName]: {
          name: output.name,
          image: output.image,
          mediaType: 'image/png',
          ...Object.fromEntries(
            attributes.map((attr, index) => [
              layers[index].attributeTypeName,
              attr.name,
            ])
          ),
        },
      },
    },
  };

  await mergeImages(
    attributes.map((item) => item.imagePath),
    output.image
  );
  await fsp.writeFile(output.meta, JSON.stringify(meta, null, 2));
  return true;
}

export type InputData = {
  readonly images: string;
  readonly policyId: string;
  readonly policyName: string;
  readonly output: {
    readonly images: string;
    readonly meta: string;
  };
  readonly numberOfImages: number;
};

processUtils.getInputData<InputData>().then(async (res) => {
  if (res._tag !== 'Success') {
    console.error('Error ocurred while reading input', res.error);
    return process.exit(1);
  }

  const input = res.result;
  const scanRes = await scan(res.result.images);

  if (scanRes._tag === 'Success') {
    await BPromise.each(
      _.range(Number(input.numberOfImages)),
      async (index) => {
        const name = String(index).padStart(4, '0');
        const failed = await generateRandomImage(
          scanRes.result,
          { policyId: input.policyId, policyName: input.policyName },
          {
            image: path.resolve(path.join(input.output.images, `${name}.png`)),
            meta: path.resolve(path.join(input.output.meta, `${name}.json`)),
            name,
          }
        );
        if (!failed) {
          console.error('Failed to generate image');
        }
      }
    );
  }

  return null;
});
