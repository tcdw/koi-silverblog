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

// 状态机
let mobileMenuOpen = false;

// 移动端菜单按钮及动画
let menuTimer: any;
let menuItemTimer: any;

let menuStep = 1;
let menuStepMiddle = 1;
let menuItemHidden = true;

function updateCrossStep(to: number) {
    burgerBarTop.classList.remove(`burger-bar-1--s${menuStep}`);
    burgerBarBottom.classList.remove(`burger-bar-3--s${menuStep}`);
    burgerBarTop.classList.add(`burger-bar-1--s${to}`);
    burgerBarBottom.classList.add(`burger-bar-3--s${to}`);
    menuStep = to;
}

function updateMiddleStep(to: number) {
    burgerBarMiddle.classList.remove(`burger-bar-2--s${menuStepMiddle}`);
    burgerBarMiddle.classList.add(`burger-bar-2--s${to}`);
    menuStepMiddle = to;
}

function updateMobileMenuOpen(to: boolean) {
    let mobileNavHeight;
    if (to) {
        mobileMenuBazel.classList.remove("opacity-0");
        mobileNavHeight = mobileNavBaseHeight + mobileMenuBaseHeight + (mobileMenuItemHeight * mobileMenuItemCount);
    } else {
        mobileMenuBazel.classList.add("opacity-0");
        mobileNavHeight = mobileNavBaseHeight;
    }
    navBar.style.setProperty("--navBar-height", mobileNavHeight + "rem");
    navBar.ariaExpanded = String(to);
    mobileMenuOpen = to;
}

function updateMenuItemHidden(to: boolean) {
    if (to) {
        mobileMenu.classList.remove("flex");
        mobileMenu.classList.add("hidden");
    } else {
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("flex");
    }
    menuItemHidden = to;
}

function handleMobileMenuToggle(to = !mobileMenuOpen) {
    updateMobileMenuOpen(to);
    clearTimeout(menuTimer);
    clearTimeout(menuItemTimer);
    updateCrossStep(2);

    // 如果菜单已经打开，执行开启动画，反之执行关闭动画
    if (mobileMenuOpen) {
        updateMiddleStep(1);
        menuTimer = setTimeout(() => {
            updateCrossStep(3);
            updateMiddleStep(2);
        }, 200);
        updateMenuItemHidden(false);
    } else {
        updateMiddleStep(2);
        menuTimer = setTimeout(() => {
            updateCrossStep(1);
            updateMiddleStep(1);
        }, 200);
        menuItemTimer = setTimeout(() => {
            updateMenuItemHidden(true);
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
