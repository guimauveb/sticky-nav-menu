/* A navigation menu used to display the current item navigated / chapter selected when user scrolls. Allows
 * to directly jump to selected chapter / item */
var stickyMenu = {};
(function() { 
    const colHighlight = "rgba(221, 221, 221, 1)";
    const bgHighlight = "#424857";
    const html = document.getElementById("html");

    /* */
    this.getScrollOffsets = function() {
        var arr = [];

        /* Navigation items are simply listed and their offsetTop stored in an array, allowing to dynamically 
         * display the current item navigated / chapter read. Here my chapters have class "article-chapter". */
        var ch = document.getElementsByClassName("article-chapter");
        for (var i = 0; i < ch.length; ++i) {
            var el = ch[i]; 
            var kv = {};
            kv["id"] = "link-" + el.id;
            kv["offset"] = window.offsetTop || el.offsetTop;
            arr.push(kv);
        }
        return arr;
    }

    /* i == index of the currently active link from the sticky menu. Highlight currently
     * selected "chapter" and reset every link above and below it */
    this.updateSticky = function(i = null) {
        var el = document.getElementById(i);
        el.style.color = colHighlight;
        el.style.backgroundColor = bgHighlight;
        el.style.borderRadius = "6px";

        var p = el.previousElementSibling;
        var n = el.nextElementSibling;
        while (p != null) {
            p.removeAttribute("style");
            p = p.previousElementSibling;
        }
        while (n != null) {
            n.removeAttribute("style");
            n = n.nextElementSibling;
        }
    }

    /* Clear the first element if scroll offset if before the first chapter */
    this.clearSticky = function() {
        var el = document.getElementById("link-title-0");
        el.removeAttribute("style");
    }

    /* Change sticky menu style if width < 1024 px */
    this.switchStickyClass = function() {
        var menu = document.getElementById("sticky-menu");
        var toggler = document.getElementById("sticky-toggler");
        var closeBtn = document.getElementById("close-sticky-btn");

        if (window.innerWidth < 1024) {
            menu.className = "sticky-menu-mobile";
            toggler.style.display = "block";
            closeBtn.style.display = "block";
        }
        else {
            /* Reset "sticky-menu-mobile" width to default instead of 0 */
            menu.style.width = "";
            menu.className = "sticky-table";
            toggler.style.display = "none";
            closeBtn.style.display = "none";
        }
    }

    /* Open / close menu when sticky-menu is in "mobile" mode */
    this.openNav = function() {
        document.getElementById("sticky-menu").style.width = "250px";
    }
    this.closeNav = function() {
        document.getElementById("sticky-menu").style.width = "0";
    }

    /* Update hightlighted item according to scroll offset position */
    this.triggerUpdate = function(arr) {
        var os = html.scrollTop + 1;
        /* Clear the first element if scroll offset if before the first chapter */
        console.log(arr);
        if (os < arr[0].offset) {
            this.clearSticky();
        }
        /* If scroll offset is at the last chapter */ 
        else if (os >= arr[arr.length - 1].offset) {
            this.updateSticky(arr[arr.length - 1].id);
        }
        /* If any offset between the second and the second-last */ 
        else if ((os >= arr[1].offset) && (os < arr[arr.length - 1].offset)) {
            for (var i = 1; i < arr.length - 1; ++i) {
                if (os >= arr[i].offset && os < arr[i + 1].offset) {
                    this.updateSticky(arr[i].id);
                    break;
                }
            }
        }
        else {
            this.updateSticky(arr[0].id);
        }
    }

    /* Called when DOM has loaded */ 
    this.main = function() {
        const arr = this.getScrollOffsets();
        this.switchStickyClass();

        /* Dynamically update menu onscroll */
        window.onscroll = function() {
            stickyMenu.triggerUpdate(arr);
        }
        /* Call switchStickyClass on resize to check if menu style needs to be changed */
        window.onresize = function() {
            stickyMenu.switchStickyClass();
        }
    }
}).apply(stickyMenu);

