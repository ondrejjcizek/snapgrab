# Snapgrab

Lightweight scroll snap slider with smooth navigation for touch devices, mouse dragging, and trackpad swiping. It includes accessible controls, dynamic height adjustment, and customizable autoplay.

## Table of Contents

-   [Features](#features)
-   [Demo](#demo)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuring Autoplay](#configuring-autoplay)
-   [CSS Setup](#css-setup)
-   [Documentation](#documentation)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   **Native Scroll Snap:** Provides a smooth, natural scrolling experience on all touch devices.
-   **Intuitive Controls:** Built-in dots and arrows for easy navigation.
-   **Dynamic Height Adjustment:** Automatically adapts to the height of visible slides, ensuring seamless transitions.
-   **Customizable Autoplay:** Set your preferred interval for automatic sliding.
-   **Have a Unique Requirement?** Open an issue, and we'll explore adding it!

## Demo

Check out the live demo of Snapgrab in action:  
[Snapgrab Demo](https://snapgrab-docs.vercel.app/)

## Installation

To install Snapgrab, use npm:

```bash
npm install snapgrab
```

## Usage

### HTML

Add the following HTML structure to your project:

```html
<div class="slider" role="region" id="sliderControls">
    <ul class="slider__wrapper" aria-live="polite" data-ref="wrapper">
        <li class="slider__slide" aria-hidden="false" aria-current="true">Slide 1</li>
        <li class="slider__slide" aria-hidden="true">Slide 2</li>
        <li class="slider__slide" aria-hidden="true">Slide 3</li>
        <li class="slider__slide" aria-hidden="true">Slide 4</li>
    </ul>
    <div class="slider__buttons">
        <button data-ref="prev" aria-label="Previous slide" aria-controls="sliderControls"></button>
        <button data-ref="next" aria-label="Next slide" aria-controls="sliderControls"></button>
    </div>
    <div class="slider__dots" data-ref="dots" aria-label="Dots"></div>
</div>
```

### JavaScript

Import and initialize Snapgrab in your JavaScript file:

```javascript
import { Snapgrab } from 'snapgrab'

const slider = new Snapgrab(document.querySelector('.slider'), {
    autoplay: 6000,
    autoplayStopOnInteraction: true,
    autoheight: true,
})
slider.init()
```

### CSS

Add some basic CSS to style the component:

```css
.slider {
    position: relative;

    &__wrapper {
        display: flex;
        margin-bottom: 24px;
        scroll-behavior: smooth;
        scroll-snap-stop: always;
        scroll-snap-type: x mandatory;
        touch-action: pan-x pan-y;
        overflow: scroll hidden;
        transition: height 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    &__slide {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        scroll-snap-align: start;
        scroll-snap-stop: normal;
        padding: 24px;
        margin-right: 24px;
        height: max-content;
        min-height: 200px;
        min-width: 100%;
        font-size: 24px;
        font-weight: 500;
        text-align: center;
        user-select: none;
        background: #bdc3c7;
        border-radius: 10px;

        // Layout shift fix
        &:not(&:first-of-type) {
            &:not(.is-loaded &) {
                min-height: 0;
            }
        }

        &:nth-child(even) {
            min-height: 250px;
            background-color: #95a5a6;
        }
    }

    &__buttons {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 32px;
        position: absolute;
        right: 0;
        bottom: -48px;

        button {
            display: block;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background-color: white;
            cursor: pointer;
            border: 1px solid #eaecf0;
            transition: background 0.6s cubic-bezier(0.19, 1, 0.22, 1);
            color: rgba(0, 0, 0, 60%);

            &:after {
                content: '';
                transition: color 0.6s cubic-bezier(0.19, 1, 0.22, 1);
                font-size: 2rem;
            }

            &[data-ref='prev'] {
                &:after {
                    content: '←';
                }
            }

            &[data-ref='next'] {
                &:after {
                    content: '→';
                }
            }

            @media (pointer: fine) {
                &:hover {
                    &:not([disabled]) {
                        background: #eaecf0;
                    }
                }
            }

            &[disabled] {
                cursor: default;

                &:after,
                &:before {
                    color: rgba(0, 0, 0, 10%);
                }
            }
        }
    }

    &__dots {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        display: flex;
        justify-content: center;
        gap: 8px;

        button {
            display: block;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            cursor: pointer;
            background: rgba(0, 0, 0, 42%);
            transition: background 0.6s cubic-bezier(0.19, 1, 0.22, 1);

            &:hover {
                background: rgba(0, 0, 0, 54%);
            }

            &.is-active {
                background: rgba(0, 0, 0, 80%);
            }
        }
    }

    .no-more-right {
        animation: shake 0.5s ease;
    }

    .no-more-left {
        animation: shake-left 0.5s ease;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }

        25% {
            transform: translateX(-5px);
        }

        75% {
            transform: translateX(5px);
        }
    }

    @keyframes shake-left {
        0%,
        100% {
            transform: translateX(0);
        }

        25% {
            transform: translateX(5px);
        }

        75% {
            transform: translateX(-5px);
        }
    }
}
```

## Options

Snapgrab accepts an optional configuration object. Below are the available options:

-   `autoplay (number)`: Interval in milliseconds for autoplay. If not provided, autoplay is disabled.
-   `autoplayStopOnInteraction (boolean)`: Whether to stop autoplay on any user interaction.
-   `autoheight (boolean)`: Dynamically adjusts the slider height based on visible slides.

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
