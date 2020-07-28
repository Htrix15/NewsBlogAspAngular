import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Article } from 'src/app/models/article';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-input-head-picture',
  templateUrl: './input-head-picture.component.html',
  styleUrls: ['./input-head-picture.component.scss']
})
export class InputHeadPictureComponent implements OnInit {
  
  @Input() srcHeadPicture: string;
  
  @Output() closeEditHeadPicture: EventEmitter<void>;
  @Output() fileNewHeadPicture: EventEmitter<File>;
  @Output() srcNewHeadPicture: EventEmitter<string>;
  
  @ViewChild('myImg') vc_myImg: ElementRef;
  @ViewChild('newImg') vc_newImg: ElementRef;
  @ViewChild('borderNewImg') vc_borderNewImg: ElementRef;
  @ViewChild('workArea') vc_workArea: ElementRef;

  @ViewChild('sizers') vc_sizers: ElementRef;
  @ViewChild('sizerLeftTop') vc_sizerLeftTop: ElementRef;
  @ViewChild('sizerRightTop') vc_sizerRightTop: ElementRef;
  @ViewChild('sizerLeftBottom') vc_sizerLeftBottom: ElementRef;
  @ViewChild('sizerRightBottom') vc_sizerRightBottom: ElementRef;

  public article:Article;

  mouseOffsetX:number; 
  mouseOffsetY:number; 
  mouseStartClickX:number;

  goChangeOfLeftTopSise:boolean;
  goChangeOfRightTopSise:boolean;
  goChangeOfLeftBottomSise:boolean;
  goChangeOfRightBottomSise:boolean;
  goChangeOfPosition:boolean;
  goСhangeOfSize:boolean;

  styleSizerSise: string;
  styleWidthNewImg: string;
  styleHeightNewImg: string;
  styleMaxWidth: string;
  styleMaxHeight: string;
  styleWorkAreaBorderSize: string;
  styleNewImgBorderSize: string;
  styleBorderNewImgLeft: string;
  styleBorderNewImgTop: string;

  sizerSise: number;
  widthNewImg: number; 
  heightNewImg: number; 
  maxWidth: number;
  maxHeight: number;
  workAreaBorderSize: number;
  newImgBorderSize: number;
  workAreaTopPosition: number;
  workAreaLeftPosition: number;

  startWidth: number; 
  startHeight: number; 
  aspectRatioImg: number;

  sizers: HTMLDivElement;
  sizerLeftTop: HTMLDivElement; 
  sizerRightTop: HTMLDivElement; 
  sizerLeftBottom: HTMLDivElement; 
  sizerRightBottom: HTMLDivElement;

  img: HTMLImageElement;
  myImgCanvas: HTMLCanvasElement;
  newImgCanvas: HTMLCanvasElement;
  newImgFileName: string;
  ctxMyImg: CanvasRenderingContext2D; 
  ctxNewImg: CanvasRenderingContext2D;
  borderNewImg: HTMLDivElement;

  emptyNewImg:boolean;

  constructor() { 

    this.closeEditHeadPicture = new EventEmitter<void>();
    this.fileNewHeadPicture = new EventEmitter<File>();
    this.srcNewHeadPicture = new EventEmitter<string>();

    this.goChangeOfLeftTopSise = false;
    this.goChangeOfRightTopSise = false;
    this.goChangeOfLeftBottomSise = false;
    this.goChangeOfRightBottomSise = false;
    this.goChangeOfPosition = false;
    this.goСhangeOfSize = false;
    this.img = new Image();

    this.sizerSise = environment.sizerSise;
    this.widthNewImg = environment.widthNewImg;
    this.heightNewImg = environment.heightNewImg;
    this.maxWidth = environment.maxWidth;
    this.maxHeight = environment.maxHeight;
    this.workAreaBorderSize = environment.workAreaBorderSize;
    this.newImgBorderSize = environment.newImgBorderSize;

    this.styleSizerSise = `${this.sizerSise}px`;
    this.styleWidthNewImg = `${this.widthNewImg}px`;
    this.styleHeightNewImg = `${this.heightNewImg}px`;
    this.styleMaxWidth = `${this.maxWidth}px`;
    this.styleMaxHeight = `${this.maxHeight}px`;
    this.styleWorkAreaBorderSize = `${this.workAreaBorderSize}px`;
    this.styleNewImgBorderSize = `${this.newImgBorderSize}px`;

    this.styleBorderNewImgLeft = `${this.widthNewImg - this.widthNewImg/2}px`;
    this.styleBorderNewImgTop = `${this.heightNewImg - this.heightNewImg/2}px`;

    this.emptyNewImg = true;
  
  }
  
  ngAfterViewInit(){
    this.myImgCanvas = this.vc_myImg.nativeElement;
    this.newImgCanvas = this.vc_newImg.nativeElement;
    this.borderNewImg = this.vc_borderNewImg.nativeElement;
    this.sizers = this.vc_sizers.nativeElement;

    this.sizerLeftTop = this.vc_sizerLeftTop.nativeElement;
    this.sizerRightTop = this.vc_sizerRightTop.nativeElement;
    this.sizerLeftBottom = this.vc_sizerLeftBottom.nativeElement;
    this.sizerRightBottom = this.vc_sizerRightBottom.nativeElement;
    
    this.workAreaTopPosition = this.vc_workArea.nativeElement.getBoundingClientRect().y;
    this.workAreaLeftPosition = this.vc_workArea.nativeElement.getBoundingClientRect().x;

    if(this.newImgCanvas.getContext){
      this.newImgCanvas.width = this.widthNewImg;
      this.newImgCanvas.height = this.heightNewImg;
      this.ctxNewImg = this.newImgCanvas.getContext('2d');
    }
  }

  ngOnInit() {
  }

  mouseDownOnCanvas(mouse: MouseEvent){
    this.goСhangeOfSize = false;
    this.goChangeOfPosition = true;
    this.mouseOffsetX = mouse.offsetX;
    this.mouseOffsetY = mouse.offsetY;

    this.workAreaTopPosition = this.vc_workArea.nativeElement.getBoundingClientRect().y;
    this.workAreaLeftPosition = this.vc_workArea.nativeElement.getBoundingClientRect().x;
  }

  mouseUpOnCanvas(){
    this.goChangeOfPosition = false;
    this.goСhangeOfSize = false;
  }

  mouseDownOnSizer(sizer: MouseEvent){
    this.goChangeOfPosition = false;
    this.goСhangeOfSize = true;

    this.mouseStartClickX = sizer.pageX;
    
    this.mouseOffsetX = sizer.offsetX;
    this.mouseOffsetY = sizer.offsetY;

    switch(sizer.target){
        case (this.sizerLeftTop):{ this.goChangeOfLeftTopSise = true; break;}
        case (this.sizerRightBottom):{ this.goChangeOfRightBottomSise = true; break;}
        case (this.sizerLeftBottom):{ this.goChangeOfLeftBottomSise = true; break;}
        case (this.sizerRightTop):{ this.goChangeOfRightTopSise = true; break;}
    }
  }

  mouseUpInsudeWorkArea(){
    this.goСhangeOfSize = false;
    this.goChangeOfPosition = false;
    this.goChangeOfLeftTopSise = false;
    this.goChangeOfRightBottomSise = false;
    this.goChangeOfRightTopSise = false;
    this.goChangeOfLeftBottomSise = false;
  }

  private stickSizerLeftTop(){
    this.sizerLeftTop.style.left = this.myImgCanvas.offsetLeft +'px'; 
    this.sizerLeftTop.style.top = this.myImgCanvas.offsetTop  +'px';
  }

  private stickSizerLeftBottom(){
    this.sizerLeftBottom.style.left =this.myImgCanvas.offsetLeft +'px';
    this.sizerLeftBottom.style.top = this.myImgCanvas.offsetTop + this.myImgCanvas.height - this.sizerSise +'px';
  }

  private stickSizerRightBottom(){
    this.sizerRightBottom.style.left = this.myImgCanvas.offsetLeft + this.myImgCanvas.width - this.sizerSise + 'px';
    this.sizerRightBottom.style.top = this.myImgCanvas.offsetTop   + this.myImgCanvas.height - this.sizerSise +'px';
  }

  private stickSizerRightTop(){
    this.sizerRightTop.style.left =  this.myImgCanvas.offsetLeft + this.myImgCanvas.width - this.sizerSise +'px';
    this.sizerRightTop.style.top = this.myImgCanvas.offsetTop +'px'; 
  }

  private reSizeImage(){
    this.ctxMyImg.drawImage(this.img, 0, 0, this.myImgCanvas.width, this.myImgCanvas.height);
  }

  private reSizeCanvasHeight(){
    this.myImgCanvas.height = Math.round(this.myImgCanvas.width * this.aspectRatioImg);
  }

  private reSizeCanvasWidthLeftSizers(mousePX:number, movementX:number){
    if(movementX>0){
      this.myImgCanvas.width = this.myImgCanvas.width - ((mousePX - this.mouseStartClickX));
    } else {
      this.myImgCanvas.width = this.myImgCanvas.width + ((this.mouseStartClickX - mousePX));
    }
    this.mouseStartClickX = mousePX;
  }

  private reSizeCanvasWidthRightSizers(mousePX:number, movementX:number){
    if(movementX>0){
      this.myImgCanvas.width = this.myImgCanvas.width + ((mousePX - this.mouseStartClickX));
    } else {
      this.myImgCanvas.width = this.myImgCanvas.width - ((this.mouseStartClickX - mousePX));
    }
    this.mouseStartClickX = mousePX;
  }

  private canvasLeftMove(mousePX:number){
    this.myImgCanvas.style.left = mousePX - this.mouseOffsetX - this.workAreaBorderSize - this.workAreaLeftPosition + 'px';
  }

  private canvasTopMove(){
    this.myImgCanvas.style.top = this.sizerLeftBottom.offsetTop - this.myImgCanvas.height + this.sizerSise  + 'px';
  }

  mouseMoveOnCanvas(mouse: MouseEvent){
    
    if(this.goChangeOfPosition == true && this.goСhangeOfSize == false){
          
      this.canvasLeftMove(mouse.x);

      this.myImgCanvas.style.top =  mouse.y - this.workAreaBorderSize - this.workAreaTopPosition - this.mouseOffsetY + 'px'; 

      this.stickSizerLeftTop();
      this.stickSizerRightTop();
      this.stickSizerLeftBottom();
      this.stickSizerRightBottom();
      this.drawNewImage();
    } 
  }

  mouseMoveInsudeWorkArea(mouse: MouseEvent){
    if(this.goСhangeOfSize == true){

      if(this.goChangeOfLeftTopSise == true){
        this.reSizeCanvasWidthLeftSizers(mouse.pageX, mouse.movementX);
        this.reSizeCanvasHeight()
        this.reSizeImage();

        this.canvasLeftMove(mouse.pageX - this.workAreaBorderSize);
        this.canvasTopMove();
        this.sizerLeftBottom.style.left = this.myImgCanvas.offsetLeft + 'px';

        this.stickSizerLeftTop();
        this.stickSizerRightTop();
        this.stickSizerRightBottom();  
      }

      if(this.goChangeOfRightTopSise == true){
        this.reSizeCanvasWidthRightSizers(mouse.pageX, mouse.movementX);
        this.reSizeCanvasHeight()
        this.reSizeImage();
        this.canvasTopMove();
        this.stickSizerLeftTop();
        this.stickSizerRightTop();
        this.stickSizerRightBottom();  
      }

      if(this.goChangeOfLeftBottomSise == true){
        this.reSizeCanvasWidthLeftSizers(mouse.pageX, mouse.movementX);
        this.reSizeCanvasHeight()
        this.reSizeImage();

        this.canvasLeftMove(mouse.pageX - this.workAreaBorderSize);
        
        this.stickSizerLeftBottom();
        this.stickSizerLeftTop();
        this.stickSizerRightTop();
        this.stickSizerRightBottom();  
      }

      if(this.goChangeOfRightBottomSise == true){    
        this.reSizeCanvasWidthRightSizers(mouse.pageX, mouse.movementX);
        this.reSizeCanvasHeight()
        this.reSizeImage();
        this.stickSizerLeftBottom();   
        this.stickSizerLeftTop();
        this.stickSizerRightTop();
        this.stickSizerRightBottom();    
      }
      this.drawNewImage();
    }
  }

  private drawNewImage(){
    var cutImg = this.ctxMyImg.getImageData(
      this.borderNewImg.offsetLeft - this.myImgCanvas.offsetLeft, 
      this.borderNewImg.offsetTop - this.myImgCanvas.offsetTop, 
      this.widthNewImg,  this.heightNewImg);
    this.ctxNewImg.clearRect(
      0, 
      0, 
      this.widthNewImg,  this.heightNewImg);
    this.ctxNewImg.putImageData(cutImg, 0,0);
  }

  private showImage(src: string){
    if(src){
      if(this.myImgCanvas.getContext){
        this.ctxMyImg = this.myImgCanvas.getContext('2d');
        this.img.src = src;
        this.img.onload = () => {
          this.aspectRatioImg = this.img.naturalHeight/this.img.naturalWidth;

          if(this.img.naturalWidth > this.maxWidth){
            this.startWidth = this.maxWidth;
          } else{
            this.startWidth = this.img.naturalWidth;
          }

          if(Math.round(this.startWidth * this.aspectRatioImg) > this.maxHeight){
            this.startWidth = this.maxHeight / this.aspectRatioImg;
          }

          this.myImgCanvas.width = this.startWidth;
          this.myImgCanvas.height = Math.round(this.startWidth * this.aspectRatioImg); 
          
          this.ctxMyImg.drawImage(this.img, 0, 0, this.startWidth, Math.round(this.startWidth * this.aspectRatioImg));

          this.stickSizerLeftBottom();
          this.stickSizerLeftTop();
          this.stickSizerRightBottom();
          this.stickSizerRightTop();
          this.drawNewImage();
          this.emptyNewImg = false;
        }
      }
    }
  }

  onSelectFile(event: Event){
    if( (<HTMLInputElement>event.target).files[0]!==undefined){
      const reader = new FileReader();
      reader.onload = () => {
        this.showImage(<string>reader.result);
        this.newImgFileName = (<HTMLInputElement>event.target).files[0].name;
      }
      reader.readAsDataURL((<HTMLInputElement>event.target).files[0]);
    }
  }

  saveNewHeadPicture(){
  //  this.processing=true;
    this.newImgCanvas.toBlob((blob)=>{
      this.fileNewHeadPicture.emit(
        new File([blob], this.newImgFileName, { type: "image/png"})
        );

        this.srcNewHeadPicture.emit(this.newImgCanvas.toDataURL('image/png', 0.1));

        this.close();
      })
   
  }

  close(){
    this.closeEditHeadPicture.emit();
  }

  setCenter(){
    this.myImgCanvas.style.top = this.borderNewImg.offsetTop  + 'px';
    this.myImgCanvas.style.left = this.borderNewImg.offsetLeft + 'px';
    this.drawNewImage();
    this.stickSizerLeftTop();
    this.stickSizerRightTop();
    this.stickSizerLeftBottom();
    this.stickSizerRightBottom();
  }


}
