/**
 *
 * for validating user's request
 * @param {Request} req
 * @param {Response} route
 */

const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url instanceof RegExp && route.url.test(req.url)) return true;
  if (route.url && req.url != route.url) return false;
  return true;
};

/**
 * Represents Express class.
 * It's a HTTP request handler framework that will help to deal with user requests
 * @constructor
 */

class Express {
  constructor() {
    this.routes = [];
  }

  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(route => isMatching(req, route));
    let remaining = [...matchingRoutes];

    /**
     * next is a utility for express class that will allow to deal with mutiple valid requests
     */
    let next = () => {
      let current = remaining[0];
      if (!current) return;
      remaining = remaining.slice(1);
      current.handler(req, res, next);
    };
    next();
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(url, handler) {
    this.routes.push({ method: 'GET', url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: 'POST', url, handler });
  }
}

module.exports = Express;
