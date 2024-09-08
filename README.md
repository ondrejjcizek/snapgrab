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
<div class="slider" role="region">
    <div class="slider__wrapper" aria-live="polite" data-ref="wrapper">
        <div class="slider__slide" aria-hidden="false">Slide 1</div>
        <div class="slider__slide" aria-hidden="true">Slide 2</div>
        <div class="slider__slide" aria-hidden="true">Slide 3</div>
    </div>
    <div class="slider__buttons">
        <button data-ref="prev"></button>
        <button data-ref="next"></button>
    </div>
    <div class="slider__dots" data-ref="dots"></div>
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
        justify-content: normal;
        margin-bottom: 24px;
        scroll-behavior: smooth;
        scroll-snap-stop: always;
        scroll-snap-type: x mandatory;
        touch-action: pan-x pan-y;
        overflow: scroll hidden;
        transition: height 0.6s $easeOutExpo;
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
        padding: 24px;
        scroll-snap-align: start;
        scroll-snap-stop: normal;
        max-width: none;
        background: wheat;
        min-height: 400px;
        min-width: 100%;
        font-size: 2rem;
        text-align: center;
        margin-right: 24px;
        user-select: none;
        transition: transform 0.6s $easeOutExpo;
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
            background-color: var(--color-white);
            cursor: pointer;
            border: 1px solid var(--color-border);
            transition: background 0.6s $easeOutExpo;
            color: rgba(0, 0, 0, 60%);

            &:after {
                transition: color 0.6s $easeOutExpo;
            }

            &[data-ref='prev'] {
                @include icon-after {
                    content: var(--icon-arrow-left);
                    font-size: 2.2rem;
                }
            }

            &[data-ref='next'] {
                @include icon-after {
                    content: var(--icon-arrow-right);
                    font-size: 2.2rem;
                }
            }

            @include hover {
                &:not([disabled]) {
                    background: var(--color-border);
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
            transition: background 0.6s $easeOutExpo;

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
