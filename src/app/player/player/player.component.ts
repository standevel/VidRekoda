import { Component, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  playing = true;
  timer: any;
  @Input() streamSub!: Observable<MediaStream>;
  stream!: MediaStream;
  @Input() videoUrlSub!: Observable<string>;
  constructor() { }

  ngOnInit() {
    // if (this.stream) {
    const video = document.querySelector('video');

    this.streamSub?.subscribe(stream => {
      console.log('stream at player: ', stream);
      video!.srcObject = stream;
      video!.autoplay = true;
      video!.muted = true

      // this.videoUrlSub.next('');
    })


    console.log('video stream: ', this.stream);
    // }
    this.videoUrlSub?.subscribe(value => {
      console.log('vid url:', value);
      video!.src = value;
      video!.autoplay = true;
    })
    this.hideControls();
    this.getVideoEl()?.addEventListener("timeupdate", (e: any) => {
      // console.log('timeupdate event: ', e)

      let currentTime = this.getVideoEl()?.currentTime as number;
      const duration = this.getVideoEl()!.duration;
      let percent = (currentTime / duration) * 100;
      document.getElementById('progressBar')!.style.width = `${percent}%`;
      document.getElementById('currentVidTime')!.innerText = this.formatTime(currentTime);
    });

    this.getVideoEl()?.addEventListener("loadeddata", () => {
      document.getElementById('videoDuration')!.innerText = this.formatTime(this.getVideoEl()!.duration);
    });



    document.getElementById('volumeSlider')?.addEventListener("input", () => {
      this.getVideoEl()!.volume = +(document.getElementById('range') as HTMLInputElement)!.value;
      if (+(document.getElementById('range') as HTMLInputElement)!.value == 0) {
        return document.getElementById('volumeBtn')?.classList.replace("fa-volume-high", "fa-volume-xmark");
      }
      document.getElementById('volumeBtn')?.classList.replace("fa-volume-xmark", "fa-volume-high"); return;
    });

    const speedOptions = document.getElementById('speedOptions');
    console.log('vidOps: ', speedOptions)
    speedOptions?.querySelectorAll("li")?.forEach((option: any) => {
      option?.addEventListener("click", () => {
        console.log('speedoption clicked: ', option);

        if (option!.dataset['speed']) {
          document.querySelector('video')!.playbackRate = +option!.dataset['speed'];
        }
        speedOptions?.querySelector(".active")?.classList.remove("active");
        option?.classList?.add("active");
      });
    });



    document?.addEventListener("mouseup", () => document.getElementById('videoTimeline')?.removeEventListener("mousemove", this.draggableProgressBar));
  }
  setSpeedOption(butt: any, option: any) {
    console.log('speed: ', option, 'butt: ', butt)
    if (option) {
      document.querySelector('video')!.playbackRate = +option;
    }
    const speedOptions = document.getElementById('speedOptions');
    speedOptions?.querySelector(".active")?.classList.remove("active");
    butt?.classList?.add("active");
  }
  openSpeedMenu(speed: MatMenuTrigger, event: Event) {
    if (!speed.menuOpen) {
      // setTimeout(() => {
      speed.openMenu();
      // }, 1000);
    }
    event.stopImmediatePropagation();
  }
  closeSpeedMenu(speed: MatMenuTrigger, event: Event) {
    if (speed.menuOpen) {
      // setTimeout(() => {
      speed.closeMenu();
      // }, 1000);

    }
    event.stopImmediatePropagation();
  }
  volumeBtn() {
    const volBtn = document.getElementById('volumnBtn');
    if (!volBtn?.classList.contains("fa-volume-high")) {
      document.querySelector('video')!.volume = 0.5;
      volBtn?.classList?.replace("fa-volume-xmark", "fa-volume-high");
    } else {
      document.querySelector('video')!.volume = 0.0;
      volBtn.classList?.replace("fa-volume-high", "fa-volume-xmark");
    }
    (document.querySelector('range') as HTMLInputElement).value = '' + document.querySelector('video')?.volume;
  }
  fullScreenBtn() {
    document.getElementById('container')?.classList?.toggle("fullscreen");
    if (document.fullscreenElement) {
      document.getElementById('fullScreenBtn')?.classList?.replace("fa-compress", "fa-expand");
      return document.exitFullscreen();
    }
    document.getElementById('fullScreenBtn')?.classList?.replace("fa-expand", "fa-compress");
    document.getElementById('container')?.requestFullscreen();
    return;
  }
  videoTimelineHover(e: any) {
    // console.log('container: ', this.container);

    let timelineWidth = document.getElementById('videoTimeline')!.clientWidth;
    // console.log(this.videoTimeline);
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * this.getVideoEl()!.duration);
    const progressTime = document.getElementById('videoTimeline')?.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    console.log(progressTime);

    if (progressTime) {
      progressTime!.style.left = `${offsetX}px`;
      progressTime!.innerText = this.formatTime(percent);
    }
  }
  videoTimelineClick(e: any) {
    let timelineWidth = document.getElementById('videoTimeline')?.clientWidth;
    const video = document.querySelector('video');
    if (timelineWidth && video) video!.currentTime = (e.offsetX / timelineWidth) * video?.duration;

  }
  playPauseBtn() {
    document.querySelector('video')?.paused ?
      this.play() :
      this.pause();
  }
  skipForward() { document.querySelector('video')!.currentTime += 5; }
  skipBackward() {
    document.querySelector('video')!.currentTime -= 5;
  }
  pause() {
    document.querySelector('video')?.pause();
    document.querySelector('video')?.classList?.replace("fa-pause", "fa-play");
    this.playing = false;
  }
  play() {
    document.querySelector('video')?.play();
    document.querySelector('video')?.classList?.replace("fa-play", "fa-pause");
    this.playing = true;
  }
  speedBtn() {
    document.getElementById('speedBtn')?.classList?.toggle("show");
  }
  pipBtn() {
    document.querySelector('video')?.requestPictureInPicture();
  }
  getVideoEl() {
    return document.querySelector('video');
  }
  draggableProgressBar(e: any) {
    let timelineWidth = document.getElementById('videoTimeline')?.clientWidth as number;
    document.getElementById('progressBar')!.style!.width = `${e.offsetX}px`;
    this.getVideoEl()!.currentTime = (e.offsetX / timelineWidth) * this.getVideoEl()!.duration;
    document.getElementById('currentVidTime')!.innerText = this.formatTime(this.getVideoEl()!.currentTime);
  }
  hideControls() {
    if (this.getVideoEl()?.paused) return;
    this.timer = setTimeout(() => {
      document.getElementById('container')?.classList?.remove("show-controls");
    }, 3000);
  }
  hoverContainer() {
    document.getElementById('container')?.classList?.add("show-controls");
    clearTimeout(this.timer);
    this.hideControls();
  }

  formatTime(time: number) {
    let seconds: string | number = Math.floor(time % 60),
      minutes: string | number = Math.floor(time / 60) % 60,
      hours: string | number = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
      return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
  }

}
