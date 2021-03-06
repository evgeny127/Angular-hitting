declare let getComputedStyle:any;

export class DomHandler {
    static zindex: number = 1000;
    addClass(element: any, className: string): void {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }
    addMultipleClasses(element: any, className: string): void {
        if (element.classList) {
            let styles = className.split(' ');
            for (let i = 0; i < styles.length; i++) {
                element.classList.add(styles[i]);
            }
        }
        else {
            let styles = className.split(' ');
            for (let i = 0; i < styles.length; i++) {
                element.className += ' ' + styles[i];
            }
        }
    }
    removeClass(element: any, className: string): void {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    hasClass(element: any, className: string): boolean {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }
    siblings(element: any): any {
        return Array.prototype.filter.call(element.parentNode.children, function (child) {
            return child !== element;
        });
    }
    find(element: any, selector: string): any[] {
        return element.querySelectorAll(selector);
    }
    findSingle(element: any, selector: string): any {
        return element.querySelector(selector);
    }
    index(element: any): number {
        let children = element.parentNode.childNodes;
        let num = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i] == element) {
                return num;
            }
            if (children[i].nodeType == 1) {
                num++;
            }
        }
        return -1;
    }
    relativePosition(element: any, target: any): void {
        let elementDimensions = element.offsetParent ? { width: element.outerWidth, height: element.outerHeight } : this.getHiddenElementDimensions(element);
        let targetHeight = target.offsetHeight;
        let targetWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let top, left;
        if ((targetOffset.top + targetHeight + elementDimensions.height) > window.innerHeight) {
            top = -1 * (elementDimensions.height);
        } else {
            top = targetHeight;
        }
        if ((targetOffset.left + elementDimensions.width) > window.innerWidth) {
            left = targetWidth - elementDimensions.width;
        } else {
            left = 0;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }
    absolutePosition(element: any, target: any): void {
        let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        let elementOuterHeight = elementDimensions.height;
        let elementOuterWidth = elementDimensions.width;
        let targetOuterHeight = target.offsetHeight;
        let targetOuterWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let windowScrollTop = this.getWindowScrollTop();
        let windowScrollLeft = this.getWindowScrollLeft();
        let top, left;
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > window.innerHeight) {
            top = targetOffset.top + windowScrollTop - elementOuterHeight;
        } else {
            top = targetOuterHeight + targetOffset.top + windowScrollTop;
        }
        if (targetOffset.left + targetOuterWidth + elementOuterWidth > window.innerWidth) {
            left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
        } else {
            left = targetOffset.left + windowScrollLeft;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }
    getHiddenElementOuterHeight(element: any): number {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementHeight = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementHeight;
    }
    getHiddenElementOuterWidth(element: any): number {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementWidth = element.offsetWidth;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementWidth;
    }
    getHiddenElementDimensions(element: any): any {
        let dimensions: any = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return dimensions;
    }
    scrollInView(container: any, item: any): void {
        let borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
        let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
        let paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
        let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        let containerRect = container.getBoundingClientRect();
        let itemRect = item.getBoundingClientRect();
        let offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
        let scroll = container.scrollTop;
        let elementHeight = container.clientHeight;
        let itemHeight = this.getOuterHeight(item);
        if (offset < 0) {
            container.scrollTop = scroll + offset;
        }
        else if ((offset + itemHeight) > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }
    fadeIn(element: any, duration: number): void {
        element.style.opacity = 0;
        let last = +new Date();
        let tick = function () {
            element.style.opacity = +element.style.opacity + (new Date().getTime() - last) / duration;
            last = +new Date();
            if (+element.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };
        tick();
    }
    fadeOut(element: any, ms: any): void {
        let opacity = 1, interval = 50, duration = ms, gap = interval / duration;
        let fading = setInterval(function () {
            opacity = opacity - gap;
            element.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fading);
            }
        }, interval);
    }
    getWindowScrollTop(): number {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
    getWindowScrollLeft(): number {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }
    matches(element: any, selector: string): boolean {
        let p = Element.prototype;
        let f = p['matches'] || p.webkitMatchesSelector || p['mozMatchesSelector'] || p.msMatchesSelector || function (s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(element, selector);
    }
    getOuterWidth(el: any, margin?: any): any {
        let width = el.offsetWidth;
        if (margin) {
            let style = getComputedStyle(el);
            width += parseInt(style.paddingLeft) + parseInt(style.paddingRight);
        }
        return width;
    }
    getHorizontalMargin(el: any): number {
        let style = getComputedStyle(el);
        return parseInt(style.marginLeft) + parseInt(style.marginRight);
    }
    innerWidth(el: any): any {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width += parseInt(style.paddingLeft) + parseInt(style.paddingRight);
        return width;
    }
    width(el: any): any {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseInt(style.paddingLeft) + parseInt(style.paddingRight);
        return width;
    }
    getOuterHeight(el: any, margin?: any): any {
        let height = el.offsetHeight;
        if (margin) {
            let style = getComputedStyle(el);
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        }
        return height;
    }
    getHeight(el: any): number {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height -= parseInt(style.paddingTop) + parseInt(style.paddingBottom) + parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
        return height;
    }
    getViewport(): any {
        let win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h = win.innerHeight || e.clientHeight || g.clientHeight;
        return { width: w, height: h };
    }
    equals(obj1: any, obj2: any): boolean {
        if (obj1 == null && obj2 == null) {
            return true;
        }
        if (obj1 == null || obj2 == null) {
            return false;
        }
        if (obj1 == obj2) {
            return true;
        }
        if (typeof obj1 == 'object' && typeof obj2 == 'object') {
            for (let p in obj1) {
                if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
                    return false;
                }
                switch (typeof (obj1[p])) {
                    case 'object':
                        if (!this.equals(obj1[p], obj2[p])) {
                            return false;
                        }
                        break;
                    case 'function':
                        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) {
                            return false;
                        }
                        break;
                    default:
                        if (obj1[p] != obj2[p]) {
                            return false;
                        }
                        break;
                }
            }
            for (let p in obj2) {
                if (typeof (obj1[p]) == 'undefined') {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
