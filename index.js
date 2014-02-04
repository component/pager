
/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , html = require('./template')
  , dom = require('dom');

/**
 * Expose `Pager`.
 */

module.exports = Pager;

/**
 * Initialize a new `Pager`.
 *
 * @api public
 */

function Pager() {
  Emitter.call(this);
  this.el = dom(html);
  this.el.on('click', 'li > a', this.onclick.bind(this));
  this.perpage(5);
  this.total(0);
  this.show(0);
}

/**
 * Mixin emitter.
 */

Emitter(Pager.prototype);

/**
 * Handle delegated clicks.
 *
 * @api private
 */

Pager.prototype.onclick = function(e){
  e.preventDefault();
  var el = dom(e.target.parentNode);
  if (el.hasClass('prev')) return this.prev();
  if (el.hasClass('next')) return this.next();
  this.show(el.text() - 1);
};

/**
 * Return the total number of pages.
 *
 * @return {Number}
 * @api public
 */

Pager.prototype.pages = function(){
  return Math.ceil(this._total / this._perpage);
};

/**
 * Select the previous page.
 *
 * @api public
 */

Pager.prototype.prev = function(){
  this.show(Math.max(0, this.current - 1));
};

/**
 * Select the next page.
 *
 * @api public
 */

Pager.prototype.next = function(){
  this.show(Math.min(this.pages() - 1, this.current + 1));
};

/**
 * Select the page `n`.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.show = function(n){
  this.select(n);
  this.emit('show', n)
  return this;
};

/**
 * Select page `n` without emitting "show".
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.select = function(n){
  this.current = n;
  this.render();
  return this;
};

/**
 * Set the number of items perpage to `n`.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.perpage = function(n){
  this._perpage = n;
  return this;
};

/**
 * Set the total number of items to `n`.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.total = function(n){
  this._total = n;
  return this;
};

/**
 * Create a page link for index `i`.
 *
 * @param {Number} i
 * @api private
 */

Pager.prototype.createPageLink = function(i){
  var n = i + 1;
  return this.current == i
    ? '<li class="pager-page pager-active"><a href="#">' + n + '</a></li>'
    : '<li class="pager-page"><a href="#">' + n + '</a></li>';
};

/**
 * Render the pager.
 *
 * @api public
 */

Pager.prototype.render = function(){
  var total = this._total;
  var curr = this.current;
  var per = this._perpage;
  var pages = this.pages();
  var el = this.el;
  var prev = el.find('.prev');
  var next = el.find('.next');
  var links = '';

  // remove old
  el.find('li.pager-page').remove();
  el.find('span.pager-dots').remove();

  // page links
  if (pages > 7) {
    // when there are more than 7 pages

    // the ugly code following determines
    // which links should be shown
    // where and when to put the dots

    var needle = curr;
    links += this.createPageLink(0);
    if (needle > 3) {
      if (needle < pages-4) {
        links += '<span class="pager-dots">...</span>';
      }
      else if (needle >= pages-4) {
        needle = pages-3;
        links += '<span class="pager-dots">...</span>';
        links += this.createPageLink(needle-2);
      }
    }
    else {
      needle = 2;
    }

    links += this.createPageLink(needle-1);
    if (needle != 0 && needle != pages-1) links += this.createPageLink(needle);

    if (needle >= 2) {
      links += this.createPageLink(needle+1);
    }
    else if (curr > pages-3) {
      //
    }
    else {
      links += '<span class="pager-dots">...</span>';
      links += this.createPageLink(Math.floor(pages/2));
      links += '<span class="pager-dots">...</span>';
    }

    if (curr <= 3) {
      links += this.createPageLink(needle+2);
    }

    if (needle+1 < pages-3) {
      links += '<span class="pager-dots">...</span>';
    }

    links += this.createPageLink(pages-1);
  }
  else {
    // in series
    for (var i = 0; i < pages; ++i) {
      links += this.createPageLink(i);
    }
  }

  // insert
  if (links) dom(links).insertAfter(prev);

  // prev
  if (curr) prev.removeClass('pager-hide')
  else prev.addClass('pager-hide');

  // next
  if (curr < pages - 1) next.removeClass('pager-hide')
  else next.addClass('pager-hide');
};

