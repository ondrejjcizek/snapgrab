# Snapgrab

**Snapgrab** is a customizable and lightweight JavaScript slider component that provides an easy way to create dynamic and interactive content sliders on your website.

## Table of Contents

-   [Demo](#demo)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuring Autoplay](#configuring-autoplay)
-   [CSS Setup](#css-setup)
-   [Documentation](#documentation)
-   [Contributing](#contributing)
-   [License](#license)

## Demo

Check out the live demo of Snapgrab in action:  
[Snapgrab Demo](https://snapgrab-docs.vercel.app/)

## Features

-   Autoplay functionality with configurable intervals
-   Responsive design for various screen sizes
-   Easy-to-customize navigation and pagination
-   Supports touch and mouse interactions
-   Dynamic height adjustment based on visible slides

## Installation

To install Snapgrab, use npm:

```bash
npm install snapgrab
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

const slider = new Snapgrab(document.querySelector('.your-slider-element'), {
    autoplay: 6000,
    autoplayStopOnInteraction: true,
    autoheight: true,
    onSlideChange: (currentSlide) => console.log('Slide changed to:', currentSlide),
})
slider.init()
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

-   `autoplay (number)`: Interval in milliseconds for autoplay. If not provided, autoplay is disabled.
-   `autoplayStopOnInteraction (boolean)`: Whether to stop autoplay on any user interaction.
-   `autoheight (boolean)`: Dynamically adjusts the slider height based on visible slides.
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
