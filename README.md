# Snapgrab

**Snapgrab** is a customizable scroll snapping component for web applications. It allows users to navigate through slides smoothly with mouse and touch interactions, offering an enhanced scrolling experience.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Options](#options)
-   [API](#api)
-   [Events](#events)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

To install Snapgrab, use npm:

```bash
npm install snapgrab
```

Or add it to your `package.json`:

```json
"dependencies": {
  "snapgrab": "^0.9.0"
}
```

## Usage

### HTML

Add the following HTML structure to your project:

```html
<div id="snapgrab">
    <div data-ref="wrapper">
        <div class="slide">Slide 1</div>
        <div class="slide">Slide 2</div>
        <div class="slide">Slide 3</div>
    </div>
    <button data-ref="prev">Previous</button>
    <button data-ref="next">Next</button>
    <div data-ref="dots"></div>
</div>
```

### JavaScript

Import and initialize Snapgrab in your JavaScript file:

```javascript
import { Snapgrab } from 'snapgrab'

const snapgrab = new Snapgrab(document.getElementById('snapgrab'), {
    onSlideChange: (index) => {
        console.log('Slide changed to:', index)
    },
})

snapgrab.init()
```

### CSS

Add some basic CSS to style the component:

```css
#snapgrab {
    overflow: hidden;
    position: relative;
}

[data-ref='wrapper'] {
    display: flex;
    scroll-snap-type: x mandatory;
    overflow-x: scroll;
}

.slide {
    min-width: 100%;
    scroll-snap-align: start;
}

[data-ref='dots'] {
    display: flex;
    justify-content: center;
}

[data-ref='dots'] button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: gray;
}

button.is-active {
    background-color: black;
}
```

## Options

Snapgrab accepts an optional configuration object. Below are the available options:

-   `onSlideChange (function)`: Callback function triggered when the slide changes. Receives the current slide index as an argument.

## API

-   `init()`: Initializes the Snapgrab component and binds all necessary event listeners.
-   `destroy()`: Unbinds event listeners and cleans up the component.
-   `goToSlide(index)`: Scrolls to a specific slide by its index.
-   `updateButtonState()`: Updates the state of the navigation buttons based on the current scroll position.

## Events

Snapgrab emits custom events during its lifecycle:

-   **`slideChange`**: Dispatched when the current slide changes. It includes a detail object with the current slide index.

### Example:

```javascript
snapgrab.wrapper.addEventListener('slideChange', (e) => {
    console.log('Current slide index:', e.detail.slideIndex)
})
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
