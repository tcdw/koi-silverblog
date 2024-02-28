const navBar = document.getElementById("koi-nav-bar")!;
const mobileMenu = document.getElementById("koi-mobile-menu")!;
const mobileMenuControl = document.getElementById("koi-mobile-menu-control")!;
const mobileMenuBazel = mobileMenu.querySelector("hr")!;
const burgerBarTop = document.querySelector(".burger-bar-1")!;
const burgerBarMiddle = document.querySelector(".burger-bar-2")!;
const burgerBarBottom = document.querySelector(".burger-bar-3")!;

// 高度基准数值 (rem)
const mobileNavBaseHeight = 4.5;
const mobileMenuBaseHeight = 1.5;
const mobileMenuItemHeight = 3.5;
const mobileMenuItemCount = mobileMenu.querySelectorAll("li").length;

// 外部参考元素
let navBackground = document.getElementById("navBackground")!;
let navScrollNotice = document.getElementById("navScrollNotice");

// 移动端菜单按钮及动画
let menuTimer: any;
let menuItemTimer: any;

interface Data {
    menuStep: number
    menuStepMiddle: number
    menuItemHidden: boolean
    mobileMenuOpen: boolean
}

const data = new Proxy<Data>({
    menuStep: 1,
    menuStepMiddle: 1,
    menuItemHidden: true,
    mobileMenuOpen: false
}, {
    set(obj, prop: keyof Data, value) {
        switch (prop) {
            case "menuStep": {
                burgerBarTop.classList.remove(`burger-bar-1--s${obj.menuStep}`);
                burgerBarBottom.classList.remove(`burger-bar-3--s${obj.menuStep}`);
                burgerBarTop.classList.add(`burger-bar-1--s${value}`);
                burgerBarBottom.classList.add(`burger-bar-3--s${value}`);
                obj.menuStep = value;
                return true;
            }
            case "menuStepMiddle": {
                burgerBarMiddle.classList.remove(`burger-bar-2--s${obj.menuStepMiddle}`);
                burgerBarMiddle.classList.add(`burger-bar-2--s${value}`);
                obj.menuStepMiddle = value;
                return true;
            }
            case "menuItemHidden": {
                if (value) {
                    mobileMenu.classList.remove("flex");
                    mobileMenu.classList.add("hidden");
                } else {
                    mobileMenu.classList.remove("hidden");
                    mobileMenu.classList.add("flex");
                }
                obj.menuItemHidden = value;
                return true;
            }
            case "mobileMenuOpen": {
                let mobileNavHeight;
                if (value) {
                    mobileMenuBazel.classList.remove("opacity-0");
                    mobileNavHeight = mobileNavBaseHeight + mobileMenuBaseHeight + (mobileMenuItemHeight * mobileMenuItemCount);
                } else {
                    mobileMenuBazel.classList.add("opacity-0");
                    mobileNavHeight = mobileNavBaseHeight;
                }
                navBar.style.setProperty("--navBar-height", mobileNavHeight + "rem");
                navBar.ariaExpanded = String(value);
                obj.mobileMenuOpen = value;
                return true;
            }
            default: {
                return false;
            }
        }
    }
});

function handleMobileMenuToggle(to = !data.mobileMenuOpen) {
    data.mobileMenuOpen = to;
    clearTimeout(menuTimer);
    clearTimeout(menuItemTimer);
    data.menuStep = 2;

    // 如果菜单已经打开，执行开启动画，反之执行关闭动画
    if (data.mobileMenuOpen) {
        data.menuStepMiddle = 1;
        menuTimer = setTimeout(() => {
            data.menuStep = 3;
            data.menuStepMiddle = 2;
        }, 200);
        data.menuItemHidden = false;
    } else {
        data.menuStepMiddle = 2;
        menuTimer = setTimeout(() => {
            data.menuStep = 1;
            data.menuStepMiddle = 1;
        }, 200);
        menuItemTimer = setTimeout(() => {
            data.menuItemHidden = true;
        }, 400);
    }
}

function handleScroll() {
    if (navBackground && window.scrollY > navBackground.getBoundingClientRect().height * (1 / 1.618)) {
        navBar.className = navBar.dataset.classBase + " " + navBar.dataset.classNormal;
    } else {
        navBar.className = navBar.dataset.classBase + " " + navBar.dataset.classTop;
    }
    if (navScrollNotice) {
        if (window.scrollY > 64) {
            navScrollNotice.classList.add("opacity-0");
        } else {
            navScrollNotice.classList.remove("opacity-0");
        }
    }
}

mobileMenuControl.addEventListener("click", () => {
    handleMobileMenuToggle();
});

window.addEventListener("scroll", () => {
    handleScroll();
});
