/**
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */

import React from 'react';

/**
 * Distance between two points P1 (x1,y1) and P2 (x2,y2).
 */
const distancePoints = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

// from http://www.quirksmode.org/js/events_properties.html#position
const getMousePos = (e = window.event) => {
    let posx = 0, posy = 0;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy }
};

/**
 * Equation of a line.
 */
const lineEq = (y2, y1, x2, x1, currentVal) => {
    const m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
    return m * currentVal + b;
};

const distanceThreshold = { min: 0, max: 40 };
const opacityInterval = { from: 0, to: 1 };


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submit: null,
            requiredElems: []
        }

        this.mousemoveFn =  this.mousemoveFn.bind(this);
    }

    async componentDidMount() {
        window.addEventListener('mousemove', this.mousemoveFn);
        const form = document.querySelector('.form');
        if (form) {
            this.setState({ 
                submit: document.querySelector('.form__button'),
                requiredElems: Array.from(form.querySelectorAll('input[required]'))
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const form = document.querySelector('.form');
        if (form) {
            const requiredElems = Array.from(form.querySelectorAll('input[required]'));
            if (prevState.requiredElems.length !== requiredElems.length) {
                this.setState({ requiredElems });
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.mousemoveFn); // remove the event handler for normal unmounting
    }

    mousemoveFn(event) {
        requestAnimationFrame(() => {
            const mousepos = getMousePos(event);
            const docScrolls = {
                left : document.body.scrollLeft + document.documentElement.scrollLeft, 
                top : document.body.scrollTop + document.documentElement.scrollTop
            };
            const elRect = this.state.submit.getBoundingClientRect();
            const elCoords = {
                x1: elRect.left + docScrolls.left, 
                x2: elRect.width + elRect.left + docScrolls.left,
                y1: elRect.top + docScrolls.top, 
                y2: elRect.height + elRect.top + docScrolls.top
            };
            const closestPoint = {
                x: mousepos.x, 
                y: mousepos.y 
            };
            
            if (mousepos.x < elCoords.x1) {
                closestPoint.x = elCoords.x1;
            } else if (mousepos.x > elCoords.x2) {
                closestPoint.x = elCoords.x2;
            }

            if (mousepos.y < elCoords.y1) {
                closestPoint.y = elCoords.y1;
            } else if (mousepos.y > elCoords.y2) {
                closestPoint.y = elCoords.y2;
            }

            const distance = distancePoints(mousepos.x, mousepos.y, closestPoint.x, closestPoint.y);
            const opacity = lineEq(opacityInterval.from, opacityInterval.to, distanceThreshold.max, distanceThreshold.min, distance);

            this.state.requiredElems.forEach(el => {
                if (!el.value) {
                    el.nextElementSibling.style.opacity = Math.max(opacity, opacityInterval.from);
                }
            });
        });
    }

    render() {
        return null;
    }
}