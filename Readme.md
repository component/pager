# pager

  Pager ui component.

  ![Pager](https://github.com/redbadger/pager/blob/master/pager_demo.gif?raw=true)

## Installation

    $ component install component/pager

## Events

  - `show` (n) emitted when a page is selected (0-based)

## API

### Pager#total(n)

  Set the total number of items to `n`.

### Pager#perpage(n)

  Set the number of items per page to `n`. [5]. Pager will calculate number of page links by dividing total amount of items on perpage value.
  
### Pager#max_pages(n)

  Specify size of the links window. `n` means amount of page links to the left and right from the current page. `...` will be added to the start and end of the links window.

### Pager#pages()

  Return the total number of pages.

### Pager#show(n)

  Select page `n`, `.render()`, and emit "show".

### Pager#select(n)

  Select page `n` and `.render()`.

### Pager#render()

  Re-render the pager.

# License

  MIT
