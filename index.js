
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
  if (el.hasClass('first')) return this.first();
  if (el.hasClass('last')) return this.last();
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

Pager.prototype.first = function(){
  this.show(0);
};

Pager.prototype.last = function(){
  this.show(this.pages()-1);
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
 * Set the max number of pages displayed by pager
 * at once
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.max_pages = function(n){
  this._max_pages = n;
  return this;
};

/**
 * Render the pager.
 *
 * @api public
 */

Pager.prototype.render = function(){
  var total = this._total;
  var curr = this.current;
  var max_pages = this._max_pages;
  var per = this._perpage;
  var pages = this.pages();
  var el = this.el;
  var prev = el.find('.prev');
  var next = el.find('.next');
  var links = '';

  // remove old
  el.find('li.page').remove();

  // page links
  if(pages <= max_pages) {
    for (var i = 0; i < pages; ++i) {
        var n = i + 1;
        links += curr == i
          ? '<li class="page active"><a href="#">' + n + '</a></li>'
          : '<li class="page"><a href="#">' + n + '</a></li>';
      }
  } else {

    top_delta = Math.floor(max_pages / 2);
    bottom_delta = Math.floor(max_pages / 2);
    start_page = curr - bottom_delta;

    if(start_page < 0) {
      start_page = 0;
    } else {
      if(start_page > 0) {
        links += '<li class="page"><a href="#">1</a></li>';
        links += '<li class="page">...</li>'
      }
    }

    end_page = curr + top_delta;
    if(end_page > pages-1) end_page = pages-1;

    for (var i = start_page; i <= end_page; ++i) {
        var n = i + 1;
        links += curr == i
          ? '<li class="page active"><a href="#">' + n + '</a></li>'
          : '<li class="page"><a href="#">' + n + '</a></li>';
      }
    if(end_page < pages - 1) {
      links += '<li class="page">...</li>'
      links += '<li class="page"><a href="#">' + pages + '</a></li>';
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

