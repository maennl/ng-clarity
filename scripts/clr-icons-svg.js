/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const writeSVGIcons = require('./write-svg-icons');
const shell = require('shelljs');

const SHAPE_SETS = [
  'core-shapes',
  'commerce-shapes',
  'essential-shapes',
  'media-shapes',
  'social-shapes',
  'technology-shapes',
  'travel-shapes',
  'chart-shapes',
  'text-edit-shapes',
];

writeSVGIcons(SHAPE_SETS, () => {
  shell.exec('cd dist/clr-icons/shapes; zip -r all-shapes.zip ./**/*');
  SHAPE_SETS.forEach(setName => {
    shell.exec(`cd dist/clr-icons/shapes; zip -r ${setName}.zip ./${setName}/*; rm -r ./${setName}`);
  });
});
