import { isValidElementType } from 'react-is';
import css from './css';
import styledError from '../utils/error';
import { EMPTY_OBJECT } from '../utils/empties';

import { Target } from '../types';

export default function constructWithOptions(
  componentConstructor: Function,
  tag: Target,
  options = EMPTY_OBJECT
) {
  if (!isValidElementType(tag)) {
    throw styledError(1, String(tag));
  }

  /* This is callable directly as a template function */
  // $FlowFixMe: Not typed to avoid destructuring arguments
  const templateFunction = (...args) => componentConstructor(tag, options, css(...args));

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = config =>
    constructWithOptions(componentConstructor, tag, { ...options, ...config });

  /* Modify/inject new props at runtime */
  templateFunction.attrs = attrs =>
    constructWithOptions(componentConstructor, tag, {
      ...options,
      attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
    });

  return templateFunction;
}
