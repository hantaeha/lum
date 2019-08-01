//Grab Slider Elements
var slider = document.querySelector('.pfslider');
var sliderControls = document.querySelector('.pfslider-dots');
var beforeArrow = document.querySelector('.before-arrow-hotspot');
var afterArrow = document.querySelector('.after-arrow-hotspot');

//Will Hold DOM Elements After Creation;
var imageList;
var dotList;

//Initial Index Set to Zero
var currIndex = 0;

//Height of Unit
var unitHeight = '70vh';

//Pre-Defined List of Images for Slider
var images = [
	'./result/TimesSquare_Mountain.png',
	'./result/TimesSquareTwilightNatures400.png',
	'https://s3-us-west-2.amazonaws.com/forconcepting/guy.jpg',
	'https://s3-us-west-2.amazonaws.com/forconcepting/city.jpg',
	'https://s3-us-west-2.amazonaws.com/forconcepting/flowers.jpg',
	'https://s3-us-west-2.amazonaws.com/forconcepting/food.jpg',
	'https://s3-us-west-2.amazonaws.com/forconcepting/landscape.jpg'
];

function preloadImages(srcs, callback) {
	var img;
	var remaining = srcs.length;

	for (var i = 0; i < srcs.length; i++) {
		//Create Image Object
		img = new Image();

		//Function Executed on Image Load
		img.onload = function() {
			//Decrement Counter
			--remaining;

			// When No Images Remain Unloaded, Run Callback: init in Our Case
			if (remaining <= 0) callback();
		};

		// Sets Source of Image Object to the URL Source
		img.src = srcs[i];
	}
}

//Preload Images and Initialize Slider
/* While technically not using the image objects,
 * I use the onload method to determine when to display the slider
 * since background images offer no similar utility, and
 * because of caching, there isn't a huge hit to performance,
 * but it, in my opinion, improves the UX.
 * Unless someone can inform me otherwise on the image loading
 * in browsers :(
 *
 * In theory, you could probably get away with only preloading
 * the first image since the others won't be navigated to until later
 * but I've opted to preload all of them,
 * One added benefit is that if any of the image source links are broken,
 * the slider won't initialize.
 * alternatively, you can can filter out non loaded images in the preload method
 * see that version here:
 * https://codepen.io/phileflanagan/pen/jwyPjR
 */
preloadImages(images, init);

//Function That Will Launch Slider
function init() {
	for(var i = 0; i < images.length; i++) {
		//Create Image Holder
		var imgEl = document.createElement('figure');

		//Set Background Image
		imgEl.style.backgroundImage = 'url(' + images[i] + ')';

		//Set Index
		/* never actually utilized,
		 * used a variable to hold the index
		 * and referred to the index of NodeList  of elements,
		 * rather than iterating the datasets of the elements
		 */
		imgEl.dataset.idx = i;

		//Hide non-active Images
		if (i !== currIndex) imgEl.classList.add('hidden');

		//Append Image to DOM
		slider.appendChild(imgEl);

		//Create Pagination Indicator
		var dotEl = document.createElement('span');

		//Set Index
		dotEl.dataset.idx = i;

		//Set Active Indicator
		if (i === currIndex) dotEl.classList.add('active');

		//Append Dots to DOM
		sliderControls.appendChild(dotEl);

		//Add Click Handler to Indicators
		addEventListener(dotEl, 'click', goToIndex);
	}

	//Display Unit
	slider.style.height = unitHeight;

	//Store Created Figures in a NodeList
	imageList = document.querySelectorAll('.pfslider figure');
	dotList = document.querySelectorAll('.pfslider-dots span');

	//Add Click Handlers to Arrows;
	addEventListener(beforeArrow, 'click', goToPrev);
	addEventListener(afterArrow, 'click', goToNext);
}

function displaySlide(newIndex) {
	//Hide Previous
	imageList[currIndex].classList.add('hidden');
	dotList[currIndex].classList.remove('active');

	//Set New Index
	currIndex = newIndex;

	//Show New
	imageList[currIndex].classList.remove('hidden');
	dotList[currIndex].classList.add('active');
}

function goToIndex(e) {
	//Go to Index Specified by Indicator
	displaySlide(+e.target.dataset.idx);
	/* data-idx is parsed into a number
	 * It operates fine without this, but added
	 * for consistency:
	 * function displaySlide takes in a number
	 */
}

function goToPrev(e) {
	//Go to Previous: Ternary Round-Robins the Index
	displaySlide((currIndex === 0) ? imageList.length - 1 : currIndex - 1);
}

function goToNext(e) {
	//Go to Next: Ternary Round-Robins the Index
	displaySlide((currIndex === images.length - 1) ? 0 : currIndex + 1);
}

function addEventListener(el, e, fn) {
	//Handle Array of Elements
	if (el.length) {
		for (var i = 0; i < el.length; i++) {
			el[i].addEventListener(e,fn);
		}
	}

	//Handle Single Element
	else {
		el.addEventListener(e, fn);
	}
}
