
# pager

  Pager ui component.

  ![](http://f.cl.ly/items/023v0g1I2p2D4313033a/Screen%20Shot%202012-09-17%20at%202.40.06%20PM.png)

## Installation

    $ component install component/pager

## Events

  - `show` (n) emitted when a page is selected (0-based)

## API

### Pager#total(n)

  Set the total number of items to `n`.

### Pager#perpage(n)

  Set the number of items per page to `n`. [5]

### Pager#pages()

  Return the total number of pages.

### Pager#show(n)

  Select the `n`th page and `.render()`.

### Pager#render()

  Re-render the pager.

# License

  MIT
