/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function descriptorConfig(value: any) {
  return { enumerable: true, writable: true, configurable: true, value: value };
}
