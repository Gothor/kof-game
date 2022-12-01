import { Animation } from "./Animation.js";

export class Resources {

  static loadAnimations(filePath, groupName) {
    console.log("loading " + filePath);
    const animations = {};

    const directory = filePath.split('/').slice(0, -1).join('/') + '/';
    const fileName = filePath.split('/').slice(-1)[0];

    fetch(filePath)
      .then(response => response.json())
      .then(data => {
        const fileFormat = data.fileFormat;

        if (fileFormat === undefined) throw "fileFormat missing in " + fileFormat;

        const sharpIndex = fileFormat.indexOf('#');
        let len = sharpIndex >= 0 ? 1 : 0;
        for (let i = sharpIndex + 1; i < fileFormat.length && fileFormat[i] === '#'; i++) len++;

        const partToReplace = fileFormat.substr(sharpIndex, len);

        for (const animationData of data.animations) {
          const animation = new Animation();
          animation.name = animationData.name;
          animation.current = 0;

          for (let i = animationData.start; i <= animationData.end; i++) {
            const img = new Image();
            img.src = directory + data.fileFormat.replace(partToReplace, i.toString().padStart(len, '0'));

            animation.images.push(img);
          }

          animations[animation.name] = animation;
        }
      });

    return animations;
  }

}