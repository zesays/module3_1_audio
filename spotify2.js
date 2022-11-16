function createTrackItem(index, name, duration) {
    var trackItem = document.createElement('div');
    trackItem.setAttribute("class", "playlist-track-ctn");
    trackItem.setAttribute("id", "ptc-" + index);
    trackItem.setAttribute("data-index", index);
    document.querySelector(".playlist-ctn").appendChild(trackItem);

    var playBtnItem = document.createElement('div');
    playBtnItem.setAttribute("class", "playlist-btn-play");
    playBtnItem.setAttribute("id", "pbp-" + index);
    document.querySelector("#ptc-" + index).appendChild(playBtnItem);

    var btnImg = document.createElement('i');
    btnImg.setAttribute("class", "fas fa-play");
    btnImg.setAttribute("height", "40");
    btnImg.setAttribute("width", "40");
    btnImg.setAttribute("id", "p-img-" + index);
    document.querySelector("#pbp-" + index).appendChild(btnImg);

    var trackInfoItem = document.createElement('div');
    trackInfoItem.setAttribute("class", "playlist-info-track");
    trackInfoItem.innerHTML = name
    document.querySelector("#ptc-" + index).appendChild(trackInfoItem);

    var trackDurationItem = document.createElement('div');
    trackDurationItem.setAttribute("class", "playlist-duration");
    trackDurationItem.innerHTML = duration
    document.querySelector("#ptc-" + index).appendChild(trackDurationItem);
}

var listAudio = [
    {
        name: "Aphex Twin - Windowlicker",
        file: "assets/audio/aphex.mp3",
        duration: "06:08"
    },
    {
        name: "Ichiko Aoba - Dawn in the Adan",
        file: "assets/audio/ichiko.mp3",
        duration: "04:45"
    },
    {
        name: "Death grips - Hacker",
        file: "assets/audio/death-grips.mp3",
        duration: "04:35"
    }
    ,
    {
        name: "Erykah Badu - On & On",
        file: "assets/audio/badu.mp3",
        duration: "03:46"
    }
    ,
    {
      name:"The Roots - You got me",
      file:"assets/audio/the-roots.mp3",
      duration:"04:19"
    }
]

for (var i = 0; i < listAudio.length; i++) {
    createTrackItem(i, listAudio[i].name, listAudio[i].duration);
}
var indexAudio = 0;

function loadNewTrack(index) {
    var player = document.querySelector('#source-audio')
    player.src = listAudio[index].file
    document.querySelector('.title').innerHTML = listAudio[index].name
    this.currentAudio = document.getElementById("myAudio");
    this.currentAudio.load()
    this.toggleAudio()
    this.updateStylePlaylist(this.indexAudio, index)
    this.indexAudio = index;
}

var playListItems = document.querySelectorAll(".playlist-track-ctn");

for (let i = 0; i < playListItems.length; i++) {
    playListItems[i].addEventListener("click", getClickedElement.bind(this));
}

function getClickedElement(event) {
    for (let i = 0; i < playListItems.length; i++) {
        if (playListItems[i] == event.target) {
            var clickedIndex = event.target.getAttribute("data-index")
            if (clickedIndex == this.indexAudio) { // alert('Same audio');
                this.toggleAudio()
            } else {
                loadNewTrack(clickedIndex);
            }
        }
    }
}

document.querySelector('#source-audio').src = listAudio[indexAudio].file
document.querySelector('.title').innerHTML = listAudio[indexAudio].name


var currentAudio = document.getElementById("myAudio");

currentAudio.load()

currentAudio.onloadedmetadata = function () {
    document.getElementsByClassName('duration')[0].innerHTML = this.getMinutes(this.currentAudio.duration)
}.bind(this);

var interval1;

function toggleAudio() {

    if (this.currentAudio.paused) {
        document.querySelector('#icon-play').style.display = 'none';
        document.querySelector('#icon-pause').style.display = 'block';
        document.querySelector('#ptc-' + this.indexAudio).classList.add("active-track");
        this.playToPause(this.indexAudio)
        this.currentAudio.play();
    } else {
        document.querySelector('#icon-play').style.display = 'block';
        document.querySelector('#icon-pause').style.display = 'none';
        this.pauseToPlay(this.indexAudio)
        this.currentAudio.pause();
    }
}

function pauseAudio() {
    this.currentAudio.pause();
    clearInterval(interval1);
}

var timer = document.getElementsByClassName('timer')[0]

var barProgress = document.getElementById("myBar");


var width = 0;

function onTimeUpdate() {
    var t = this.currentAudio.currentTime
    timer.innerHTML = this.getMinutes(t);
    this.setBarProgress();
    if (this.currentAudio.ended) {
        document.querySelector('#icon-play').style.display = 'block';
        document.querySelector('#icon-pause').style.display = 'none';
        this.pauseToPlay(this.indexAudio)
        if (this.indexAudio < listAudio.length - 1) {
            var index = parseInt(this.indexAudio) + 1
            this.loadNewTrack(index)
        }
    }
}


function setBarProgress() {
    var progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
    document.getElementById("myBar").style.width = progress + "%";
}


function getMinutes(t) {
    var min = parseInt(parseInt(t) / 60);
    var sec = parseInt(t % 60);
    if (sec < 10) {
        sec = "0" + sec
    }
    if (min < 10) {
        min = "0" + min
    }
    return min + ":" + sec
}

var progressbar = document.querySelector('#myProgress')
progressbar.addEventListener("click", seek.bind(this));


function seek(event) {
    var percent = event.offsetX / progressbar.offsetWidth;
    this.currentAudio.currentTime = percent * this.currentAudio.duration;
    barProgress.style.width = percent * 100 + "%";
}

function forward() {
    this.currentAudio.currentTime = this.currentAudio.currentTime + 5
    this.setBarProgress();
}

function rewind() {
    this.currentAudio.currentTime = this.currentAudio.currentTime - 5
    this.setBarProgress();
}


function next() {
    if (this.indexAudio < listAudio.length - 1) {
        var oldIndex = this.indexAudio
        this.indexAudio++;
        updateStylePlaylist(oldIndex, this.indexAudio)
        this.loadNewTrack(this.indexAudio);
    }
}

function previous() {
    if (this.indexAudio > 0) {
        var oldIndex = this.indexAudio
        this.indexAudio--;
        updateStylePlaylist(oldIndex, this.indexAudio)
        this.loadNewTrack(this.indexAudio);
    }
}

function updateStylePlaylist(oldIndex, newIndex) {
    document.querySelector('#ptc-' + oldIndex).classList.remove("active-track");
    this.pauseToPlay(oldIndex);
    document.querySelector('#ptc-' + newIndex).classList.add("active-track");
    this.playToPause(newIndex)
}

function playToPause(index) {
    var ele = document.querySelector('#p-img-' + index)
    ele.classList.remove("fa-play");
    ele.classList.add("fa-pause");
}

function pauseToPlay(index) {
    var ele = document.querySelector('#p-img-' + index)
    ele.classList.remove("fa-pause");
    ele.classList.add("fa-play");
}


function toggleMute() {
    var btnMute = document.querySelector('#toggleMute');
    var volUp = document.querySelector('#icon-vol-up');
    var volMute = document.querySelector('#icon-vol-mute');
    if (this.currentAudio.muted == false) {
        this.currentAudio.muted = true
        volUp.style.display = "none"
        volMute.style.display = "block"
    } else {
        this.currentAudio.muted = false
        volMute.style.display = "none"
        volUp.style.display = "block"
    }
}


window.onload = function () {
    const helpers = (function () {
      function getDOMElements(DOMSelectors) {
        let DOMElements = {};
        for (let selector in DOMSelectors) {
          if (DOMSelectors.hasOwnProperty(selector)) {
            DOMElements[selector] = document.querySelector(
              DOMSelectors[selector]
            );
          }
        }
        return DOMElements;
      }
      return {
        getDOMElements
      };
    })();
  
    const modal = (function () {
      const state = {
        counter: 0,
        intervalID: 0
      };
      let CONSTANTS = {
        ACTIVE_CLASS_NAME: "active",
        TIMER: 1500,
        TRANSITION: "all .3s ease-out"
      };
      function addConstant(key, value) {
        CONSTANTS[key] = value;
      }
  
      return {
        state,
        CONSTANTS,
        addConstant
      };
    })();
  
    const view = (function (helpers) {
      const DOMSelectors = {
        carouselInnerSlider: ".content_inner_slider",
        dots: ".dots",
        slide: "#slide",
        prevButton: ".prev_button",
        nextButton: ".next_button",
        carouselImages: ".content_inner_slider > img",
        dot: ".dot"
      };
      const DOMElements = helpers.getDOMElements(DOMSelectors);
      const CAROUSEL_IMAGES = [
        ...document.querySelectorAll(DOMSelectors.carouselImages)
      ];
      const DOTS = [...document.querySelectorAll(DOMSelectors.dot)];
      function moveSliderToIndex(IMAGE_SIZE, index) {
        DOMElements.carouselInnerSlider.style.transform = `translateX(-${
          IMAGE_SIZE * index
        }px)`;
      }
      function addClassToIndex(className, index) {
        CAROUSEL_IMAGES[index].classList.add(className);
      }
      function removeClassToIndex(className, index) {
        CAROUSEL_IMAGES[index].classList.remove(className);
      }
      function addBackGroundToCurrentIndex(index) {
        DOTS[index].style.background = "#000";
      }
      function removeBackGroundToCurrentIndex(index) {
        DOTS[index].style.background = "transparent";
      }
      function setTransition(element, transition) {
        element.style.transition = `${transition}`;
      }
      return {
        DOMSelectors,
        moveSliderToIndex,
        addClassToIndex,
        removeClassToIndex,
        addBackGroundToCurrentIndex,
        removeBackGroundToCurrentIndex,
        setTransition
      };
    })(helpers);
  
    const controller = (function (modal, view, helpers) {
      const DOMSelectors = view.DOMSelectors;
      const DOMElements = helpers.getDOMElements(DOMSelectors);
      function initApp() {
        const imageSize = DOMElements.carouselInnerSlider.clientWidth;
        const imagesCount =
          [...document.querySelectorAll(DOMSelectors.carouselImages)].length - 1;
        modal.addConstant("IMAGE_SIZE", imageSize);
        modal.addConstant("TOTAL_IMAGES", imagesCount);
        view.moveSliderToIndex(modal.CONSTANTS.IMAGE_SIZE, modal.state.counter);
        handleAdding();
        DOMElements.nextButton.addEventListener("click", handleNextImage);
        DOMElements.prevButton.addEventListener("click", handlePrevImage);
        DOMElements.dots.addEventListener("click", handleDotClick);
        DOMElements.slide.addEventListener("change", handleSlide);
      }
      function removeEventListeners() {
        DOMElements.nextButton.removeEventListener("click", handleNextImage);
        DOMElements.prevButton.removeEventListener("click", handlePrevImage);
        DOMElements.dots.removeEventListener("click", handleDotClick);
        DOMElements.slide.removeEventListener("change", handleSlide);
      }
      function handleNextImage() {
        handleRemove();
        if (modal.state.counter === modal.CONSTANTS.TOTAL_IMAGES) {
          modal.state.counter = -1;
        }
        modal.state.counter += 1;
        handleAdding();
        view.moveSliderToIndex(modal.CONSTANTS.IMAGE_SIZE, modal.state.counter);
      }
      function handlePrevImage() {
        handleRemove();
        if (modal.state.counter === 0) {
          modal.state.counter = modal.CONSTANTS.TOTAL_IMAGES + 1;
        }
        modal.state.counter -= 1;
        handleAdding();
        view.moveSliderToIndex(modal.CONSTANTS.IMAGE_SIZE, modal.state.counter);
      }
      function handleDotClick(event) {
        const value = Number(event.target.value);
        if (!isNaN(value)) {
          handleRemove();
          modal.state.counter = value;
          view.moveSliderToIndex(modal.CONSTANTS.IMAGE_SIZE, modal.state.counter);
          handleAdding();
        }
      }
      function handleSlide(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
          modal.state.intervalID = setInterval(() => {
            handleNextImage();
          }, modal.CONSTANTS.TIMER);
        } else {
          clearInterval(modal.state.intervalID);
          modal.state.intervalID = null;
        }
      }
      function handleRemove() {
        view.removeClassToIndex(
          modal.CONSTANTS.ACTIVE_CLASS_NAME,
          modal.state.counter
        );
        view.removeBackGroundToCurrentIndex(modal.state.counter);
      }
      function handleAdding() {
        view.addClassToIndex(
          modal.CONSTANTS.ACTIVE_CLASS_NAME,
          modal.state.counter
        );
        view.addBackGroundToCurrentIndex(modal.state.counter);
      }
      DOMElements.carouselInnerSlider.addEventListener(
        "transitionstart",
        removeEventListeners
      );
      DOMElements.carouselInnerSlider.addEventListener("transitionend", initApp);
      view.setTransition(
        DOMElements.carouselInnerSlider,
        modal.CONSTANTS.TRANSITION
      );
      return {
        initApp,
        removeEventListeners
      };
    })(modal, view, helpers);
  
    controller.initApp();
  
    window.addEventListener("resize", () => {
      controller.removeEventListeners();
      controller.initApp();
    });
  };
  