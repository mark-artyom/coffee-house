/*------------------BURGER-MENU-----------------*/
document.addEventListener("DOMContentLoaded", function(){
    let buttons = document.querySelectorAll('.button-burger-content');
    buttons.forEach(function(button){
        button.addEventListener('click', function(event){
            buttons.forEach(function(btn){
                btn.classList.toggle('active');
            });
            document.querySelector('.burger-menu-menu').classList.toggle('active');
            document.body.classList.toggle('lock');
        });
    });
});

/*------SWIPER-&-SLIDER----FAVORITE-COFFEE------*/
// Manual button switching and pagination-progress-bar
let items = document.querySelectorAll('.favorite-cofee-container .item');
let progressBars = document.querySelectorAll('.favorite-cofee-container .progress-bar');
let currentItem = 0;
let isEnabled = true;

function changeCurrentItem(n) {
	currentItem = (n + items.length) % items.length;
}

function hideItem(direction) {
	isEnabled = false;
	items[currentItem].classList.add(direction);
	items[currentItem].addEventListener('animationend', function() {
		this.classList.remove('active', direction);
	});
}

function showItem(direction) {
    items[currentItem].classList.add('next', direction);
    items[currentItem].addEventListener('animationend', function() {
        this.classList.remove('next', direction);
        this.classList.add('active');
        isEnabled = true;

        progressBars.forEach(function(progressBar) {
            progressBar.style.width = '0';
            progressBar.style.animation = '';
            progressBar.classList.toggle('progress-active', false);
        });

        progressBars[currentItem].style.width = '100%';
        progressBars[currentItem].style.animation = 'fill 5s linear';
        progressBars[currentItem].classList.toggle('progress-active', true);
    });
}

function nextItem(n) {
	hideItem('to-left');
	changeCurrentItem(n + 1);
	showItem('from-right');
}

function previousItem(n) {
	hideItem('to-right');
	changeCurrentItem(n - 1);
	showItem('from-left');
}

document.querySelector('.control.left').addEventListener('click', function() {
	if (isEnabled) {
		previousItem(currentItem);
		progressBars[currentItem].style.width = '0';
	}
});

document.querySelector('.control.right').addEventListener('click', function() {
	if (isEnabled) {
		nextItem(currentItem);
		progressBars[currentItem].style.width = '0';
	}
});

items.forEach((item, index) => {
    const toggleAnimation = (state) => {
        if (index === currentItem) {
            progressBars[currentItem].style.animationPlayState = state;
        }
    };

    item.addEventListener('mouseenter', () => toggleAnimation('paused'));
    item.addEventListener('mouseleave', () => toggleAnimation('running'));
    item.addEventListener('touchstart', () => toggleAnimation('paused'));
    item.addEventListener('touchend', () => toggleAnimation('running'));
});

//Manual switching to the touchscreen
const swipedetect = (el) => {
	
	let surface = el;
	let startX = 0;
	let startY = 0;
	let distX = 0;
	let distY = 0;
	let startTime = 0;
	let elapsedTime = 0;

	let threshold = 150;
	let restraint = 100;
	let allowedTime = 300;

	surface.addEventListener('mousedown', function(e){
		startX = e.pageX;
		startY = e.pageY;
		startTime = new Date().getTime();
		e.preventDefault();
	}, false);

	surface.addEventListener('mouseup', function(e){
		distX = e.pageX - startX;
		distY = e.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				if ((distX > 0)) {
					if (isEnabled) {
						previousItem(currentItem);
					}
				} else {
					if (isEnabled) {
						nextItem(currentItem);
					}
				}
			}
		}
		e.preventDefault();
	}, false);

	surface.addEventListener('touchstart', function(e){
		if (e.target.classList.contains('arrow') || e.target.classList.contains('control')) {
			if (e.target.classList.contains('left')) {
				if (isEnabled) {
					previousItem(currentItem);
				}
			} else {
				if (isEnabled) {
					nextItem(currentItem);
				}
			}
		}
			var touchobj = e.changedTouches[0];
			startX = touchobj.pageX;
			startY = touchobj.pageY;
			startTime = new Date().getTime();
			e.preventDefault();
	}, false);

	surface.addEventListener('touchmove', function(e){
			e.preventDefault();
	}, false);

	surface.addEventListener('touchend', function(e){
			var touchobj = e.changedTouches[0];
			distX = touchobj.pageX - startX;
			distY = touchobj.pageY - startY;
			elapsedTime = new Date().getTime() - startTime;
			if (elapsedTime <= allowedTime){
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
							if ((distX > 0)) {
								if (isEnabled) {
									previousItem(currentItem);
								}
							} else {
								if (isEnabled) {
									nextItem(currentItem);
								}
							}
					}
			}
			e.preventDefault();
	}, false);
}

const el = document.querySelector('.favorite-cofee-container');
swipedetect(el);

//Auto-play slider
let timerId = null;
let delay = 5000;
let start = null;

const startAutoScroll = () => {
    if (timerId) return;
    start = Date.now();
    timerId = setTimeout(() => {
        nextItem(currentItem);
        timerId = null;
        delay = 5000;
        startAutoScroll();
    }, delay);
};

const stopAutoScroll = () => {
    if (!timerId) return;
    delay -= Date.now() - start;
    clearTimeout(timerId);
    timerId = null;
};

el.addEventListener('mouseenter', stopAutoScroll);
el.addEventListener('mouseleave', startAutoScroll);
el.addEventListener('touchstart', stopAutoScroll);
el.addEventListener('touchend', startAutoScroll);

startAutoScroll();