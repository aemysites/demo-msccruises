/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import cards3Parser from './parsers/cards3.js';
import cards10Parser from './parsers/cards10.js';
import accordion11Parser from './parsers/accordion11.js';
import carousel9Parser from './parsers/carousel9.js';
import accordion8Parser from './parsers/accordion8.js';
import cards15Parser from './parsers/cards15.js';
import hero14Parser from './parsers/hero14.js';
import cards16Parser from './parsers/cards16.js';
import columns17Parser from './parsers/columns17.js';
import cards18Parser from './parsers/cards18.js';
import accordion19Parser from './parsers/accordion19.js';
import columns7Parser from './parsers/columns7.js';
import accordion21Parser from './parsers/accordion21.js';
import cards24Parser from './parsers/cards24.js';
import columns5Parser from './parsers/columns5.js';
import columns22Parser from './parsers/columns22.js';
import columns26Parser from './parsers/columns26.js';
import cards1Parser from './parsers/cards1.js';
import columns13Parser from './parsers/columns13.js';
import columns30Parser from './parsers/columns30.js';
import columns20Parser from './parsers/columns20.js';
import cards33Parser from './parsers/cards33.js';
import columns36Parser from './parsers/columns36.js';
import cards4Parser from './parsers/cards4.js';
import cards38Parser from './parsers/cards38.js';
import accordion28Parser from './parsers/accordion28.js';
import columns39Parser from './parsers/columns39.js';
import cards40Parser from './parsers/cards40.js';
import columns42Parser from './parsers/columns42.js';
import accordion43Parser from './parsers/accordion43.js';
import columns44Parser from './parsers/columns44.js';
import accordion45Parser from './parsers/accordion45.js';
import cards41Parser from './parsers/cards41.js';
import tabs37Parser from './parsers/tabs37.js';
import columns32Parser from './parsers/columns32.js';
import cards48Parser from './parsers/cards48.js';
import carousel47Parser from './parsers/carousel47.js';
import cards52Parser from './parsers/cards52.js';
import columns53Parser from './parsers/columns53.js';
import columns29Parser from './parsers/columns29.js';
import cards46Parser from './parsers/cards46.js';
import search35Parser from './parsers/search35.js';
import cards6Parser from './parsers/cards6.js';
import cards49Parser from './parsers/cards49.js';
import accordion58Parser from './parsers/accordion58.js';
import carousel57Parser from './parsers/carousel57.js';
import carousel2Parser from './parsers/carousel2.js';
import cards61Parser from './parsers/cards61.js';
import cards56Parser from './parsers/cards56.js';
import cards59Parser from './parsers/cards59.js';
import columns63Parser from './parsers/columns63.js';
import cards66Parser from './parsers/cards66.js';
import accordion67Parser from './parsers/accordion67.js';
import carousel34Parser from './parsers/carousel34.js';
import cards68Parser from './parsers/cards68.js';
import accordion70Parser from './parsers/accordion70.js';
import columns51Parser from './parsers/columns51.js';
import columns50Parser from './parsers/columns50.js';
import hero73Parser from './parsers/hero73.js';
import cards65Parser from './parsers/cards65.js';
import hero74Parser from './parsers/hero74.js';
import accordion75Parser from './parsers/accordion75.js';
import cards72Parser from './parsers/cards72.js';
import cards54Parser from './parsers/cards54.js';
import cards71Parser from './parsers/cards71.js';
import cards64Parser from './parsers/cards64.js';
import carousel69Parser from './parsers/carousel69.js';
import cards62Parser from './parsers/cards62.js';
import cards55Parser from './parsers/cards55.js';
import cards60Parser from './parsers/cards60.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  cards3: cards3Parser,
  cards10: cards10Parser,
  accordion11: accordion11Parser,
  carousel9: carousel9Parser,
  accordion8: accordion8Parser,
  cards15: cards15Parser,
  hero14: hero14Parser,
  cards16: cards16Parser,
  columns17: columns17Parser,
  cards18: cards18Parser,
  accordion19: accordion19Parser,
  columns7: columns7Parser,
  accordion21: accordion21Parser,
  cards24: cards24Parser,
  columns5: columns5Parser,
  columns22: columns22Parser,
  columns26: columns26Parser,
  cards1: cards1Parser,
  columns13: columns13Parser,
  columns30: columns30Parser,
  columns20: columns20Parser,
  cards33: cards33Parser,
  columns36: columns36Parser,
  cards4: cards4Parser,
  cards38: cards38Parser,
  accordion28: accordion28Parser,
  columns39: columns39Parser,
  cards40: cards40Parser,
  columns42: columns42Parser,
  accordion43: accordion43Parser,
  columns44: columns44Parser,
  accordion45: accordion45Parser,
  cards41: cards41Parser,
  tabs37: tabs37Parser,
  columns32: columns32Parser,
  cards48: cards48Parser,
  carousel47: carousel47Parser,
  cards52: cards52Parser,
  columns53: columns53Parser,
  columns29: columns29Parser,
  cards46: cards46Parser,
  search35: search35Parser,
  cards6: cards6Parser,
  cards49: cards49Parser,
  accordion58: accordion58Parser,
  carousel57: carousel57Parser,
  carousel2: carousel2Parser,
  cards61: cards61Parser,
  cards56: cards56Parser,
  cards59: cards59Parser,
  columns63: columns63Parser,
  cards66: cards66Parser,
  accordion67: accordion67Parser,
  carousel34: carousel34Parser,
  cards68: cards68Parser,
  accordion70: accordion70Parser,
  columns51: columns51Parser,
  columns50: columns50Parser,
  hero73: hero73Parser,
  cards65: cards65Parser,
  hero74: hero74Parser,
  accordion75: accordion75Parser,
  cards72: cards72Parser,
  cards54: cards54Parser,
  cards71: cards71Parser,
  cards64: cards64Parser,
  carousel69: carousel69Parser,
  cards62: cards62Parser,
  cards55: cards55Parser,
  cards60: cards60Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
